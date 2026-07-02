import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { signToken, type JWTPayload } from '@/lib/jwt'
import { OAuth2Client } from 'google-auth-library'

// Google OAuth - Verify Google ID token and sign in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential } = body // Google ID token from GIS

    if (!credential) {
      return NextResponse.json({ error: 'رمز Google غير متوفر' }, { status: 400 })
    }

    // Verify the Google ID token
    const clientId = process.env.GOOGLE_CLIENT_ID
    
    let googleEmail = ''
    let googleName = ''
    let googlePicture = ''
    let googleSub = ''

    if (clientId) {
      // Full verification with Google
      try {
        const client = new OAuth2Client(clientId)
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: clientId,
        })
        const payload = ticket.getPayload()
        if (!payload || !payload.email) {
          return NextResponse.json({ error: 'فشل في التحقق من حساب Google' }, { status: 401 })
        }
        googleEmail = payload.email
        googleName = payload.name || payload.email.split('@')[0]
        googlePicture = payload.picture || ''
        googleSub = payload.sub || ''
      } catch (verifyError) {
        console.error('Google token verification failed:', verifyError)
        return NextResponse.json({ error: 'فشل في التحقق من رمز Google' }, { status: 401 })
      }
    } else {
      // No Client ID configured - decode token locally (basic verification)
      try {
        const base64Payload = credential.split('.')[1]
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
        
        if (!payload.email) {
          return NextResponse.json({ error: 'فشل في قراءة بيانات Google' }, { status: 401 })
        }
        
        googleEmail = payload.email
        googleName = payload.name || payload.email.split('@')[0]
        googlePicture = payload.picture || ''
        googleSub = payload.sub || ''
      } catch (decodeError) {
        console.error('Google token decode failed:', decodeError)
        return NextResponse.json({ error: 'رمز Google غير صالح' }, { status: 401 })
      }
    }

    let userId = ''
    let userRole = 'user'
    let userAvatar = googlePicture || null
    let userName = googleName
    let twoFactorEnabled = false

    try {
      await ensureDbInitialized()

      // Check if user exists
      const existingUser = await db.user.findUnique({ 
        where: { email: googleEmail.toLowerCase() },
        include: { accounts: true }
      })

      if (existingUser) {
        // User exists - link Google account if not linked
        const googleAccount = existingUser.accounts.find(a => a.provider === 'google')
        
        if (!googleAccount) {
          try {
            await db.account.create({
              data: {
                userId: existingUser.id,
                provider: 'google',
                providerAccountId: googleSub || googleEmail,
                accessToken: credential,
              }
            })
          } catch (e) {
            console.log('Account link error (non-critical):', e)
          }
        }

        try {
          await db.user.update({
            where: { id: existingUser.id },
            data: { 
              lastLogin: new Date(),
              avatar: googlePicture || existingUser.avatar,
            }
          })
        } catch (e) {
          console.log('User update error (non-critical):', e)
        }

        if (!existingUser.isActive) {
          return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
        }

        userId = existingUser.id
        userRole = existingUser.role
        userAvatar = existingUser.avatar || googlePicture
        userName = existingUser.name
        twoFactorEnabled = existingUser.twoFactorEnabled
      } else {
        // Create new user with Google account
        try {
          const newUser = await db.user.create({
            data: {
              name: googleName,
              email: googleEmail.toLowerCase(),
              avatar: googlePicture || null,
              role: 'user',
              isActive: true,
              accounts: {
                create: {
                  provider: 'google',
                  providerAccountId: googleSub || googleEmail,
                  accessToken: credential,
                }
              }
            },
            include: { accounts: true }
          })

          userId = newUser.id
          userRole = newUser.role
          userAvatar = newUser.avatar || googlePicture
          userName = newUser.name
          twoFactorEnabled = newUser.twoFactorEnabled
        } catch (createError) {
          console.error('User creation failed:', createError)
          // Fallback: create JWT with Google info even without DB
          userId = 'google-' + (googleSub || googleEmail.replace(/[@.]/g, '-'))
          userRole = 'user'
        }
      }
    } catch (dbError) {
      console.log('Database unavailable for Google auth, using fallback')
      userId = 'google-' + (googleSub || googleEmail.replace(/[@.]/g, '-'))
      userRole = 'user'
    }

    // Create JWT token
    const jwtPayload: JWTPayload = {
      userId,
      email: googleEmail.toLowerCase(),
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
        email: googleEmail.toLowerCase(),
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
