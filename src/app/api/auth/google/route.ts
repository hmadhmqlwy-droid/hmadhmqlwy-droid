import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// Google OAuth - Sign in with Google
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, email, name, picture, sub } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'بيانات Google غير مكتملة' }, { status: 400 })
    }

    // Check if user exists
    let user = await db.user.findUnique({ 
      where: { email },
      include: { accounts: true }
    })

    if (user) {
      // User exists - check if they have a Google account linked
      const googleAccount = user.accounts.find(a => a.provider === 'google')
      
      if (!googleAccount) {
        // Link Google account to existing user
        await db.account.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: sub || email,
            accessToken: token || null,
          }
        })
      } else if (token) {
        // Update the access token
        await db.account.update({
          where: { id: googleAccount.id },
          data: { accessToken: token }
        })
      }

      // Update last login and avatar
      await db.user.update({
        where: { id: user.id },
        data: { 
          lastLogin: new Date(),
          avatar: picture || user.avatar,
        }
      })

      if (!user.isActive) {
        return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
      }
    } else {
      // Create new user with Google account
      user = await db.user.create({
        data: {
          name,
          email,
          avatar: picture || null,
          role: 'user',
          isActive: true,
          accounts: {
            create: {
              provider: 'google',
              providerAccountId: sub || email,
              accessToken: token || null,
            }
          }
        },
        include: { accounts: true }
      })
    }

    // Create session
    const sessionToken = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        expiresAt,
      }
    })

    // Log successful login
    await db.securityLog.create({
      data: {
        userId: user.id,
        action: 'google_login',
        details: 'تسجيل دخول عبر Google',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        severity: 'info',
      }
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || picture,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      token: sessionToken,
    })

    // Set session cookie
    response.cookies.set('session_token', sessionToken, {
      path: '/',
      maxAge: 86400,
      httpOnly: false,
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'خطأ في تسجيل الدخول عبر Google' }, { status: 500 })
  }
}
