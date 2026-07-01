import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const associationId = searchParams.get('associationId')

    const where = associationId ? { associationId } : {}
    const events = await db.event.findMany({
      where,
      include: { association: { select: { name: true, id: true } } },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { associationId, title, description, location, startDate, endDate, maxAttendees, budget, category } = body

    if (!associationId || !title || !startDate) {
      return NextResponse.json({ error: 'الجمعية والعنوان وتاريخ البدء مطلوبان' }, { status: 400 })
    }

    const event = await db.event.create({
      data: {
        associationId,
        title,
        description,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        budget: budget ? parseFloat(budget) : null,
        category,
      }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'create_event',
        resource: 'Event',
        resourceId: event.id,
        details: `إنشاء فعالية: ${title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// DELETE /api/events - Delete event
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ error: 'معرف الفعالية مطلوب' }, { status: 400 })
    }

    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'الفعالية غير موجودة' }, { status: 404 })
    }

    // Only admin or association president/manager can delete
    if (authResult.user.role !== 'admin') {
      const member = await db.member.findFirst({
        where: { 
          userId: authResult.user.id, 
          associationId: event.associationId,
          status: 'active',
          role: { in: ['president', 'vice_president', 'secretary'] }
        }
      })
      if (!member) {
        return NextResponse.json({ error: 'ليس لديك صلاحية حذف هذه الفعالية' }, { status: 403 })
      }
    }

    await db.event.delete({ where: { id: eventId } })

    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'delete_event',
        resource: 'Event',
        resourceId: eventId,
        details: `حذف فعالية: ${event.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({ message: 'تم حذف الفعالية بنجاح' })
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
