import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireAssociationRole } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const associations = await db.association.findMany({
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
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
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { name, nameEn, description, category, phone, email, website, address, city, country, licenseNumber, taxId, foundedDate } = body

    if (!name || !description || !category) {
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
        createdBy: authResult.user.id,
      }
    })

    // Add creator as president
    await db.member.create({
      data: {
        userId: authResult.user.id,
        associationId: association.id,
        role: 'president',
        status: 'active',
      }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
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

// DELETE /api/associations - Delete association (admin or president only)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const associationId = searchParams.get('associationId')

    if (!associationId) {
      return NextResponse.json({ error: 'معرف الجمعية مطلوب' }, { status: 400 })
    }

    // Admin can delete any association
    if (authResult.user.role === 'admin') {
      const association = await db.association.findUnique({ where: { id: associationId } })
      if (!association) {
        return NextResponse.json({ error: 'الجمعية غير موجودة' }, { status: 404 })
      }

      await db.association.delete({ where: { id: associationId } })

      await db.auditLog.create({
        data: {
          userId: authResult.user.id,
          action: 'delete_association',
          resource: 'Association',
          resourceId: associationId,
          details: `حذف جمعية: ${association.name}`,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        }
      })

      return NextResponse.json({ message: 'تم حذف الجمعية بنجاح' })
    }

    // Non-admin: check if user is president of this association
    const hasPermission = await requireAssociationRole(authResult.user.id, associationId, 'president')
    if (!hasPermission) {
      return NextResponse.json({ error: 'فقط رئيس الجمعية أو المدير يمكنه حذفها' }, { status: 403 })
    }

    const association = await db.association.findUnique({ where: { id: associationId } })
    if (!association) {
      return NextResponse.json({ error: 'الجمعية غير موجودة' }, { status: 404 })
    }

    await db.association.delete({ where: { id: associationId } })

    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'delete_association',
        resource: 'Association',
        resourceId: associationId,
        details: `حذف جمعية: ${association.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({ message: 'تم حذف الجمعية بنجاح' })
  } catch (error) {
    console.error('Delete association error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// PATCH /api/associations - Update association
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { associationId, ...updateData } = body

    if (!associationId) {
      return NextResponse.json({ error: 'معرف الجمعية مطلوب' }, { status: 400 })
    }

    // Check permission: admin or secretary+ in the association
    const hasPermission = authResult.user.role === 'admin' 
      || await requireAssociationRole(authResult.user.id, associationId, 'secretary')

    if (!hasPermission) {
      return NextResponse.json({ error: 'ليس لديك صلاحية تعديل هذه الجمعية' }, { status: 403 })
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.createdBy
    delete updateData.createdAt
    delete updateData.updatedAt

    if (updateData.foundedDate) {
      updateData.foundedDate = new Date(updateData.foundedDate)
    }

    const association = await db.association.update({
      where: { id: associationId },
      data: updateData,
    })

    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'update_association',
        resource: 'Association',
        resourceId: associationId,
        details: `تحديث جمعية: ${association.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(association)
  } catch (error) {
    console.error('Update association error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
