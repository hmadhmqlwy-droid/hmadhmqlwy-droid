import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { signToken, type JWTPayload } from '@/lib/jwt'

// Google OAuth - Sign in with Google
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const body = await request.json()
    const { token, email, name, picture, sub } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'بيانات Google غير مكتملة' }, { status: 400 })
    }

    let userId = ''
    let userRole = 'user'
    let userAvatar = picture || null
    let userName = name
    let twoFactorEnabled = false

    try {
      // Check if user exists
      const existingUser = await db.user.findUnique({ 
        where: { email },
        include: { accounts: true }
      })

      if (existingUser) {
        // User exists - check if they have a Google account linked
        const googleAccount = existingUser.accounts.find(a => a.provider === 'google')
        
        if (!googleAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              provider: 'google',
              providerAccountId: sub || email,
              accessToken: token || null,
            }
          })
        } else if (token) {
          await db.account.update({
            where: { id: googleAccount.id },
            data: { accessToken: token }
          })
        }

        await db.user.update({
          where: { id: existingUser.id },
          data: { 
            lastLogin: new Date(),
            avatar: picture || existingUser.avatar,
          }
        })

        if (!existingUser.isActive) {
          return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
        }

        userId = existingUser.id
        userRole = existingUser.role
        userAvatar = existingUser.avatar || picture
        userName = existingUser.name
        twoFactorEnabled = existingUser.twoFactorEnabled
      } else {
        // Create new user with Google account
        const newUser = await db.user.create({
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

        userId = newUser.id
        userRole = newUser.role
        userAvatar = newUser.avatar || picture
        userName = newUser.name
        twoFactorEnabled = newUser.twoFactorEnabled
      }
    } catch (dbError) {
      console.error('Google auth DB error:', dbError)
      return NextResponse.json({ error: 'خطأ في قاعدة البيانات' }, { status: 500 })
    }

    // Create JWT token
    const jwtPayload: JWTPayload = {
      userId,
      email,
      name: userName,
      role: userRole,
      avatar: userAvatar || undefined,
      twoFactorEnabled,
    }
    
    const jwtToken = await signToken(jwtPayload)

    const response = NextResponse.json({
      user: {
        id: userId,
        name: userName,
        email,
        role: userRole,
        avatar: userAvatar,
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
