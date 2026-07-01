import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    try {
      await ensureDbInitialized()
    } catch (dbInitError) {
      console.error('Database unavailable, returning demo data:', dbInitError)
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Regular users can only see their own logs, admins can see all
    const where = authResult.user.role === 'admin' && userId ? { userId } : { userId: authResult.user.id }

    const logs = await db.securityLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Security logs error:', error)
    return NextResponse.json([])
  }
}

// PATCH /api/security - Toggle 2FA
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    try {
      await ensureDbInitialized()
    } catch (dbInitError) {
      console.error('Database unavailable:', dbInitError)
      return NextResponse.json({ error: 'قاعدة البيانات غير متاحة حالياً' }, { status: 503 })
    }

    const body = await request.json()
    const { twoFactorEnabled } = body

    if (typeof twoFactorEnabled !== 'boolean') {
      return NextResponse.json({ error: 'قيمة التحقق الثنائي غير صحيحة' }, { status: 400 })
    }

    await db.user.update({
      where: { id: authResult.user.id },
      data: { twoFactorEnabled }
    })

    try {
      await db.securityLog.create({
        data: {
          userId: authResult.user.id,
          action: twoFactorEnabled ? '2fa_enable' : '2fa_disable',
          details: twoFactorEnabled ? 'تفعيل التحقق الثنائي' : 'تعطيل التحقق الثنائي',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          severity: twoFactorEnabled ? 'info' : 'warning',
        }
      })
    } catch (logError) {
      console.error('Security log error (non-critical):', logError)
    }

    return NextResponse.json({ 
      twoFactorEnabled,
      user: {
        ...authResult.user,
        twoFactorEnabled
      }
    })
  } catch (error) {
    console.error('Security update error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
