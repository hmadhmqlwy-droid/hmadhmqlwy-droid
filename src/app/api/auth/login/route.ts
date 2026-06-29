import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      // Log failed attempt
      if (user) {
        await db.securityLog.create({
          data: {
            userId: user.id,
            action: 'login_failed',
            details: 'محاولة تسجيل دخول فاشلة',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            severity: 'warning',
          }
        })
      }
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'الحساب معطل. تواصل مع الإدارة' }, { status: 403 })
    }

    // Create session
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

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
    })

    return NextResponse.json({
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
