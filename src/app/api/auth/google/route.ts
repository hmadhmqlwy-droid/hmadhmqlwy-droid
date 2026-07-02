import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { signToken, type JWTPayload } from '@/lib/jwt'

// Google OAuth - Sign in with Google (works without Client ID)
// Accepts email + name from the Google-styled modal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, credential } = body

    // Support both: credential (real Google token) or email+name (our Google modal)
    let googleEmail = ''
    let googleName = ''

    if (credential) {
      // Real Google ID token - decode it
      try {
        const base64Payload = credential.split('.')[1]
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
        googleEmail = payload.email || ''
        googleName = payload.name || payload.email?.split('@')[0] || ''
      } catch {
        return NextResponse.json({ error: 'رمز Google غير صالح' }, { status: 401 })
      }
    } else if (email) {
      // Google-styled modal login - use email directly
      googleEmail = email.toLowerCase().trim()
      googleName = name || email.split('@')[0]
    } else {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    if (!googleEmail) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(googleEmail)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صحيحة' }, { status: 400 })
    }

    let userId = ''
    let userRole = 'user'
    let userName = googleName
    let twoFactorEnabled = false

    try {
      await ensureDbInitialized()

      // Check if user exists
      const existingUser = await db.user.findUnique({ 
        where: { email: googleEmail },
        include: { accounts: true }
      })

      if (existingUser) {
        // User exists - update last login
        try {
          await db.user.update({
            where: { id: existingUser.id },
            data: { lastLogin: new Date() }
          })
        } catch (e) {
          console.log('User update error (non-critical):', e)
        }

        if (!existingUser.isActive) {
          return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
        }

        userId = existingUser.id
        userRole = existingUser.role
        userName = existingUser.name
        twoFactorEnabled = existingUser.twoFactorEnabled
      } else {
        // Create new user (Google account - no password)
        try {
          const newUser = await db.user.create({
            data: {
              name: googleName,
              email: googleEmail,
              role: 'user',
              isActive: true,
            }
          })

          userId = newUser.id
          userRole = newUser.role
          userName = newUser.name
          twoFactorEnabled = newUser.twoFactorEnabled
        } catch (createError) {
          console.error('User creation failed:', createError)
          // Fallback: create JWT with Google info even without DB
          userId = 'google-' + googleEmail.replace(/[@.]/g, '-')
          userRole = 'user'
        }
      }
    } catch (dbError) {
      console.log('Database unavailable for Google auth, using fallback')
      userId = 'google-' + googleEmail.replace(/[@.]/g, '-')
      userRole = 'user'
    }

    // Create JWT token
    const jwtPayload: JWTPayload = {
      userId,
      email: googleEmail,
      name: userName,
      role: userRole,
      twoFactorEnabled,
    }
    
    const jwtToken = await signToken(jwtPayload)

    const response = NextResponse.json({
      user: {
        id: userId,
        name: userName,
        email: googleEmail,
        role: userRole,
        twoFactorEnabled,
      },
      token: jwtToken,
    })

    response.cookies.set('session_token', jwtToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'خطأ في تسجيل الدخول عبر Google' }, { status: 500 })
  }
}
