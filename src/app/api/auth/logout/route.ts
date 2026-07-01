import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (user) {
      // Delete all sessions for this user
      await db.session.deleteMany({ where: { userId: user.id } })

      // Log logout
      await db.securityLog.create({
        data: {
          userId: user.id,
          action: 'logout',
          details: 'تسجيل خروج',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          severity: 'info',
        }
      })
    }

    const response = NextResponse.json({ message: 'تم تسجيل الخروج بنجاح' })
    response.cookies.set('session_token', '', { path: '/', maxAge: 0 })
    return response
  } catch (error) {
    console.error('Logout error:', error)
    const response = NextResponse.json({ message: 'تم تسجيل الخروج' })
    response.cookies.set('session_token', '', { path: '/', maxAge: 0 })
    return response
  }
}
