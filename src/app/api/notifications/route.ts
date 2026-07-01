import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    // Generate smart notifications based on real data
    const notifications: any[] = []
    const userId = authResult.user.id

    // Check for upcoming events
    const upcomingEvents = await db.event.findMany({
      where: { 
        status: 'upcoming',
        startDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      },
      include: { association: { select: { name: true } } },
      take: 5,
    })

    for (const event of upcomingEvents) {
      notifications.push({
        id: `event-${event.id}`,
        type: 'info',
        title: 'فعالية قادمة',
        message: `${event.title} في ${new Date(event.startDate).toLocaleDateString('ar-SA')} - ${event.association.name}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }

    // Check for pending transactions (for admin/manager)
    if (authResult.user.role === 'admin' || authResult.user.role === 'manager') {
      const pendingTransactions = await db.transaction.count({
        where: { status: 'pending' }
      })

      if (pendingTransactions > 0) {
        notifications.push({
          id: 'pending-transactions',
          type: 'warning',
          title: 'معاملات معلقة',
          message: `لديك ${pendingTransactions} معاملة مالية بانتظار الموافقة`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      }
    }

    // Check for recent security events
    const recentSecurityEvents = await db.securityLog.findMany({
      where: { 
        userId,
        severity: { in: ['warning', 'critical'] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      take: 3,
    })

    for (const log of recentSecurityEvents) {
      notifications.push({
        id: `security-${log.id}`,
        type: log.severity === 'critical' ? 'error' : 'warning',
        title: 'تنبيه أمني',
        message: log.details || log.action,
        read: false,
        createdAt: log.createdAt.toISOString(),
      })
    }

    // Welcome notification for recent users
    const user = await db.user.findUnique({ where: { id: userId } })
    if (user && user.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      notifications.push({
        id: 'welcome',
        type: 'success',
        title: 'مرحباً بك!',
        message: `أهلاً ${user.name}، نرحب بك في منصة جمعياتبرو`,
        read: false,
        createdAt: user.createdAt.toISOString(),
      })
    }

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    // Notifications are now generated dynamically, no manual creation needed
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    // Mark notifications as read (client-side state handles this)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
