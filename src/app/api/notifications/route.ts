import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// In-memory notifications store (resets on server restart, suitable for demo)
const notifications: any[] = []
let notifId = 0

function addNotification(type: string, title: string, message: string, userId?: string) {
  notifications.unshift({
    id: `notif-${++notifId}`,
    type,
    title,
    message,
    userId: userId || 'all',
    read: false,
    createdAt: new Date().toISOString(),
  })
  // Keep max 100 notifications
  if (notifications.length > 100) notifications.pop()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'all'
    
    const userNotifs = notifications.filter(n => n.userId === 'all' || n.userId === userId)
    
    return NextResponse.json({
      notifications: userNotifs,
      unreadCount: userNotifs.filter(n => !n.read).length,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, userId } = body

    addNotification(type || 'info', title, message, userId)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, markAllRead, userId } = body

    if (markAllRead) {
      notifications.forEach(n => {
        if (n.userId === 'all' || n.userId === userId) {
          n.read = true
        }
      })
    } else if (notificationId) {
      const notif = notifications.find(n => n.id === notificationId)
      if (notif) notif.read = true
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
