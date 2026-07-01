import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-middleware'

// GET /api/admin - Get system overview for admin (admin only)
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const authResult = await requireAdmin(request)
    if ('error' in authResult) return authResult.error

    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalAssociations,
      totalMembers,
      totalEvents,
      totalTransactions,
      totalSecurityLogs,
      recentUsers,
      recentSecurityLogs,
      usersByRole,
      systemHealth,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.user.count({ where: { role: 'admin' } }),
      db.association.count(),
      db.member.count(),
      db.event.count(),
      db.transaction.count(),
      db.securityLog.count(),
      db.user.findMany({ take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true } }),
      db.securityLog.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } } } }),
      db.user.groupBy({ by: ['role'], _count: { role: true } }),
      db.session.count({ where: { expiresAt: { gt: new Date() } } }),
    ])

    const totalIncome = await db.transaction.aggregate({ where: { type: 'income' }, _sum: { amount: true } })
    const totalExpense = await db.transaction.aggregate({ where: { type: 'expense' }, _sum: { amount: true } })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        totalAssociations,
        totalMembers,
        totalEvents,
        totalTransactions,
        totalSecurityLogs,
        totalIncome: totalIncome._sum.amount || 0,
        totalExpense: totalExpense._sum.amount || 0,
        activeSessions: systemHealth,
      },
      recentUsers,
      recentSecurityLogs,
      usersByRole: usersByRole.map(u => ({ role: u.role, count: u._count.role })),
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

// PATCH /api/admin - Update user role/status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if ('error' in authResult) return authResult.error

    const body = await request.json()
    const { userId, action } = body // action: { role, isActive, twoFactorEnabled }

    if (!userId || !action) {
      return NextResponse.json({ error: 'معرف المستخدم والإجراء مطلوبان' }, { status: 400 })
    }

    // Prevent admin from demoting themselves
    if (userId === authResult.user.id && action.role && action.role !== 'admin') {
      return NextResponse.json({ error: 'لا يمكنك إزالة صلاحيات المدير من نفسك' }, { status: 400 })
    }

    const updateData: any = {}
    if (action.role) updateData.role = action.role
    if (typeof action.isActive === 'boolean') updateData.isActive = action.isActive
    if (typeof action.twoFactorEnabled === 'boolean') updateData.twoFactorEnabled = action.twoFactorEnabled

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Audit log
    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'admin_user_update',
        resource: 'User',
        resourceId: userId,
        details: `تحديث بيانات المستخدم: ${JSON.stringify(action)}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled,
      }
    })
  } catch (error) {
    console.error('Admin update error:', error)
    return NextResponse.json({ error: 'خطأ في تحديث بيانات المستخدم' }, { status: 500 })
  }
}

// DELETE /api/admin - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if ('error' in authResult) return authResult.error

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    // Prevent deleting yourself
    if (userId === authResult.user.id) {
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })
    }

    // Prevent deleting last admin
    const adminCount = await db.user.count({ where: { role: 'admin' } })
    const targetUser = await db.user.findUnique({ where: { id: userId } })

    if (targetUser?.role === 'admin' && adminCount <= 1) {
      return NextResponse.json({ error: 'لا يمكن حذف آخر مدير في النظام' }, { status: 400 })
    }

    await db.user.delete({ where: { id: userId } })

    await db.auditLog.create({
      data: {
        userId: authResult.user.id,
        action: 'admin_user_delete',
        resource: 'User',
        resourceId: userId,
        details: `حذف المستخدم: ${targetUser?.name}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({ message: 'تم حذف المستخدم بنجاح' })
  } catch (error) {
    console.error('Admin delete error:', error)
    return NextResponse.json({ error: 'خطأ في حذف المستخدم' }, { status: 500 })
  }
}
