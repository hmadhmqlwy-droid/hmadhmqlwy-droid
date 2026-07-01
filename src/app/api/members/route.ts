import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requireAssociationRole } from '@/lib/auth-middleware'

// GET /api/members - Get members for an association
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const associationId = searchParams.get('associationId')

    if (associationId) {
      // Get members for specific association
      const members = await db.member.findMany({
        where: { associationId, status: 'active' },
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        orderBy: { joinedAt: 'desc' }
      })
      return NextResponse.json(members)
    }

    // Get all associations the user is a member of (with their members)
    const userAssociations = await db.member.findMany({
      where: { userId: authResult.user.id, status: 'active' },
      select: { associationId: true }
    })

    const associationIds = userAssociations.map(m => m.associationId)

    // Admin can see all
    const where = authResult.user.role === 'admin' ? {} : { associationId: { in: associationIds } }

    const members = await db.member.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        association: { select: { id: true, name: true } }
      },
      orderBy: { joinedAt: 'desc' }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// POST /api/members - Add member to association (president/secretary/admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { email, associationId, role } = body

    if (!email || !associationId || !role) {
      return NextResponse.json({ error: 'البريد الإلكتروني والجمعية والدور مطلوبون' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['president', 'vice_president', 'secretary', 'treasurer', 'member']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 })
    }

    // Check if association exists
    const association = await db.association.findUnique({ where: { id: associationId } })
    if (!association) {
      return NextResponse.json({ error: 'الجمعية غير موجودة' }, { status: 404 })
    }

    // Check permission: admin or secretary+ in the association
    const hasPermission = authResult.user.role === 'admin'
      || await requireAssociationRole(authResult.user.id, associationId, 'secretary')

    if (!hasPermission) {
      return NextResponse.json({ error: 'ليس لديك صلاحية إضافة أعضاء لهذه الجمعية' }, { status: 403 })
    }

    // Find user by email
    const targetUser = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!targetUser) {
      return NextResponse.json({ error: 'لم يتم العثور على مستخدم بهذا البريد الإلكتروني. يجب تسجيل حساب أولاً' }, { status: 404 })
    }

    // Check if already a member
    const existingMember = await db.member.findUnique({
      where: { userId_associiationId: { userId: targetUser.id, associationId } }
    })

    if (existingMember) {
      // Update role if already member but inactive
      if (existingMember.status === 'inactive' || existingMember.status === 'suspended') {
        const updated = await db.member.update({
          where: { id: existingMember.id },
          data: { role, status: 'active', leftAt: null },
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
        })
        return NextResponse.json(updated)
      }
      return NextResponse.json({ error: 'هذا المستخدم عضو بالفعل في هذه الجمعية' }, { status: 409 })
    }

    // Add member
    const member = await db.member.create({
      data: {
        userId: targetUser.id,
        associationId,
        role,
        status: 'active',
      },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'add_member',
        resource: 'Member',
        resourceId: member.id,
        details: `إضافة عضو ${targetUser.name} إلى ${association.name} بدور ${role}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Add member error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// PATCH /api/members - Update member role/status
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { memberId, role, status } = body

    if (!memberId) {
      return NextResponse.json({ error: 'معرف العضو مطلوب' }, { status: 400 })
    }

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { association: { select: { name: true } } }
    })

    if (!member) {
      return NextResponse.json({ error: 'العضو غير موجود' }, { status: 404 })
    }

    // Check permission: admin or president in the association
    const hasPermission = authResult.user.role === 'admin'
      || await requireAssociationRole(authResult.user.id, member.associationId, 'president')

    if (!hasPermission) {
      return NextResponse.json({ error: 'ليس لديك صلاحية تعديل هذا العضو' }, { status: 403 })
    }

    const updateData: any = {}
    if (role) {
      const validRoles = ['president', 'vice_president', 'secretary', 'treasurer', 'member']
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 })
      }
      updateData.role = role
    }
    if (status) {
      const validStatuses = ['active', 'inactive', 'suspended']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 })
      }
      updateData.status = status
      if (status === 'inactive') updateData.leftAt = new Date()
      if (status === 'active') updateData.leftAt = null
    }

    const updated = await db.member.update({
      where: { id: memberId },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'update_member',
        resource: 'Member',
        resourceId: memberId,
        details: `تحديث عضو في ${member.association.name}: ${JSON.stringify({ role, status })}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// DELETE /api/members - Remove member from association
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json({ error: 'معرف العضو مطلوب' }, { status: 400 })
    }

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { association: { select: { name: true } } }
    })

    if (!member) {
      return NextResponse.json({ error: 'العضو غير موجود' }, { status: 404 })
    }

    // Check permission: admin or president in the association
    const hasPermission = authResult.user.role === 'admin'
      || await requireAssociationRole(authResult.user.id, member.associationId, 'president')

    if (!hasPermission) {
      return NextResponse.json({ error: 'ليس لديك صلاحية إزالة هذا العضو' }, { status: 403 })
    }

    // Can't remove the last president
    if (member.role === 'president') {
      const presidentCount = await db.member.count({
        where: { associationId: member.associationId, role: 'president', status: 'active' }
      })
      if (presidentCount <= 1) {
        return NextResponse.json({ error: 'لا يمكن إزالة آخر رئيس للجمعية. عيّن رئيساً آخر أولاً' }, { status: 400 })
      }
    }

    await db.member.delete({ where: { id: memberId } })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'remove_member',
        resource: 'Member',
        resourceId: memberId,
        details: `إزالة عضو من ${member.association.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({ message: 'تم إزالة العضو بنجاح' })
  } catch (error) {
    console.error('Delete member error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
