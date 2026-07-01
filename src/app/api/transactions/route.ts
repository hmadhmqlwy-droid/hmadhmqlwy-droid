import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireAssociationRole } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

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
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { associationId, type, category, amount, description, date, reference, approvedBy } = body

    if (!associationId || !type || !category || !amount || !date) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة يجب ملؤها' }, { status: 400 })
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'المبلغ يجب أن يكون رقماً موجباً' }, { status: 400 })
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'نوع المعاملة غير صحيح' }, { status: 400 })
    }

    // Check permission: user must be a member of the association (treasurer+ for expense)
    if (authResult.user.role !== 'admin') {
      const isMember = await db.member.findFirst({
        where: { userId: authResult.user.id, associationId, status: 'active' }
      })
      if (!isMember) {
        return NextResponse.json({ error: 'يجب أن تكون عضواً في الجمعية لإضافة معاملة' }, { status: 403 })
      }
    }

    const transaction = await db.transaction.create({
      data: {
        associationId,
        type,
        category,
        amount: numAmount,
        description,
        date: new Date(date),
        reference,
        approvedBy: authResult.user.id,
        status: authResult.user.role === 'admin' ? 'approved' : 'pending',
      }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'create_transaction',
        resource: 'Transaction',
        resourceId: transaction.id,
        details: `إنشاء معاملة ${type}: ${numAmount} ر.س`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// PATCH /api/transactions - Approve/reject transaction
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { transactionId, status } = body // status: 'approved' | 'rejected'

    if (!transactionId || !status) {
      return NextResponse.json({ error: 'معرف المعاملة والحالة مطلوبان' }, { status: 400 })
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 })
    }

    const transaction = await db.transaction.findUnique({ where: { id: transactionId } })
    if (!transaction) {
      return NextResponse.json({ error: 'المعاملة غير موجودة' }, { status: 404 })
    }

    // Only admin or treasurer+ can approve
    if (authResult.user.role !== 'admin') {
      const hasPermission = await requireAssociationRole(authResult.user.id, transaction.associationId, 'treasurer')
      if (!hasPermission) {
        return NextResponse.json({ error: 'ليس لديك صلاحية الموافقة على المعاملات' }, { status: 403 })
      }
    }

    const updated = await db.transaction.update({
      where: { id: transactionId },
      data: { status, approvedBy: authResult.user.id },
    })

    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: `${status}_transaction`,
        resource: 'Transaction',
        resourceId: transactionId,
        details: `${status === 'approved' ? 'موافقة' : 'رفض'} معاملة: ${transaction.amount} ر.س`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
