import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { signToken, type JWTPayload } from '@/lib/jwt'
import crypto from 'crypto'

// Admin fallback - allows login even when database is unavailable
function verifyAdminFallback(email: string, password: string): JWTPayload | null {
  const adminEmail = process.env.ADMIN_EMAIL || 'Hamadah@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Hamadah77910'
  const adminName = process.env.ADMIN_NAME || 'مدير النظام'
  
  if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    return {
      userId: 'admin-fallback-001',
      email: adminEmail,
      name: adminName,
      role: 'admin',
      twoFactorEnabled: false,
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 })
    }

    // Try database authentication first
    let user: { id: string; name: string; email: string; role: string; avatar: string | null; twoFactorEnabled: boolean; isActive: boolean; password: string | null } | null = null
    let dbAvailable = false
    
    try {
      await ensureDbInitialized()
      const dbUser = await db.user.findUnique({ where: { email: email.toLowerCase() } })
      
      if (dbUser) {
        // If user has no password (Google OAuth user)
        if (!dbUser.password) {
          return NextResponse.json({ 
            error: 'هذا الحساب مسجل عبر Google. يرجى استخدام زر تسجيل الدخول بـ Google' 
          }, { status: 401 })
        }

        const isValid = await verifyPassword(password, dbUser.password)
        if (!isValid) {
          return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
        }

        if (!dbUser.isActive) {
          return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
        }

        user = dbUser
        dbAvailable = true
        
        // Create session in database
        try {
          const token = crypto.randomUUID()
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          
          await db.session.create({
            data: {
              userId: user.id,
              token,
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              expiresAt,
            }
          })
          
          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })
          
          // Log successful login
          await db.securityLog.create({
            data: {
              userId: user.id,
              action: 'login',
              details: 'تسجيل دخول ناجح',
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              severity: 'info',
            }
          }).catch(() => {})
        } catch (dbError) {
          console.error('Session creation error (non-critical):', dbError)
        }
      }
    } catch (dbError) {
      console.error('Database auth error, trying fallback:', dbError)
    }

    // If database auth didn't find user, try admin fallback
    if (!user) {
      const adminPayload = verifyAdminFallback(email, password)
      if (adminPayload) {
        user = {
          id: adminPayload.userId,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role,
          avatar: null,
          twoFactorEnabled: false,
          isActive: true,
          password: null,
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
    }

    // Create JWT token
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || undefined,
      twoFactorEnabled: user.twoFactorEnabled,
    }
    
    const token = await signToken(jwtPayload)

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      token,
    })

    // Set JWT cookie
    response.cookies.set('session_token', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
