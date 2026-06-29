import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const associations = await db.association.findMany({
      include: {
        members: true,
        _count: { select: { members: true, events: true, transactions: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const enriched = associations.map(a => ({
      ...a,
      memberCount: a._count.members,
      eventCount: a._count.events,
      transactionCount: a._count.transactions,
    }))

    return NextResponse.json(enriched)
  } catch (error) {
    console.error('Get associations error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameEn, description, category, phone, email, website, address, city, country, licenseNumber, taxId, foundedDate, createdBy } = body

    if (!name || !description || !category || !createdBy) {
      return NextResponse.json({ error: 'الاسم والوصف والتصنيف مطلوبان' }, { status: 400 })
    }

    const association = await db.association.create({
      data: {
        name,
        nameEn,
        description,
        category,
        phone,
        email,
        website,
        address,
        city,
        country: country || 'السعودية',
        licenseNumber,
        taxId,
        foundedDate: foundedDate ? new Date(foundedDate) : null,
        createdBy,
      }
    })

    // Add creator as president
    await db.member.create({
      data: {
        userId: createdBy,
        associationId: association.id,
        role: 'president',
        status: 'active',
      }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: createdBy,
        action: 'create_association',
        resource: 'Association',
        resourceId: association.id,
        details: `إنشاء جمعية: ${name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(association, { status: 201 })
  } catch (error) {
    console.error('Create association error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
