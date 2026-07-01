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
      console.error('Database unavailable, returning demo notifications:', dbInitError)
      return NextResponse.json({
        notifications: [{
          id: 'demo-1',
          type: 'info',
          title: 'مرحباً بك!',
          message: 'أهلاً بك في منصة جمعياتبرو - وضع العرض',
          read: false,
          createdAt: new Date().toISOString(),
        }],
        unreadCount: 1,
      })
    }

    // Generate smart notifications based on real data
    const notifications: any[] = []
    const userId = authResult.user.id

    // Check for upcoming events
    try {
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
    } catch (dbError) {
      console.error('Failed to fetch upcoming events for notifications:', dbError)
    }

    // Check for pending transactions (for admin/manager)
    if (authResult.user.role === 'admin' || authResult.user.role === 'manager') {
      try {
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
      } catch (dbError) {
        console.error('Failed to fetch pending transactions for notifications:', dbError)
      }
    }

    // Check for recent security events
    try {
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
    } catch (dbError) {
      console.error('Failed to fetch security events for notifications:', dbError)
    }

    // Welcome notification for recent users
    try {
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
    } catch (dbError) {
      console.error('Failed to fetch user for welcome notification:', dbError)
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
