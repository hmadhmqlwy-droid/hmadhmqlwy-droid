import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (user) {
      // Try to delete sessions from database
      try {
        await db.session.deleteMany({ where: { userId: user.id } })
      } catch (dbError) {
        console.error('Session deletion error (non-critical):', dbError)
      }
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
