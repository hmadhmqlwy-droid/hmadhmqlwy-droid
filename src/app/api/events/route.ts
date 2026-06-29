import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
        maxAttendees,
        budget,
        category,
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
