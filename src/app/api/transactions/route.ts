import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const associationId = searchParams.get('associationId')

    const where = associationId ? { associationId } : {}
    const transactions = await db.transaction.findMany({
      where,
      include: { association: { select: { name: true, id: true } } },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { associationId, type, category, amount, description, date, reference, approvedBy } = body

    if (!associationId || !type || !category || !amount || !date) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 })
    }

    const transaction = await db.transaction.create({
      data: {
        associationId,
        type,
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        reference,
        approvedBy,
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
