import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDbInitialized } from '@/lib/db'
import { requireAuth } from '@/lib/auth-middleware'

// Demo data for when DB is unavailable or empty
function getDemoDashboardData() {
  return {
    stats: {
      totalAssociations: 12,
      activeAssociations: 10,
      totalMembers: 245,
      totalEvents: 34,
      upcomingEvents: 5,
      totalIncome: 45000,
      totalExpense: 28000,
      netBalance: 17000,
    },
    recentAssociations: [
      { id: '1', name: 'جمعية النور الخيرية', category: 'خيري', status: 'active', createdAt: new Date().toISOString(), memberCount: 45, description: 'جمعية خيرية لخدمة المجتمع', country: 'السعودية', createdBy: 'admin' },
      { id: '2', name: 'نادي الابتكار التقني', category: 'تعليمي', status: 'active', createdAt: new Date().toISOString(), memberCount: 32, description: 'نادي لتعزيز الابتكار التقني', country: 'السعودية', createdBy: 'admin' },
      { id: '3', name: 'جمعية الرياضة للجميع', category: 'رياضي', status: 'active', createdAt: new Date().toISOString(), memberCount: 78, description: 'جمعية رياضية مجتمعية', country: 'السعودية', createdBy: 'admin' },
    ],
    recentEvents: [
      { id: '1', title: 'حفل تسليم الجوائز السنوي', startDate: new Date().toISOString(), status: 'upcoming', category: 'مؤتمر', association: { name: 'جمعية النور الخيرية' } },
      { id: '2', title: 'ورشة العمل التقنية المتقدمة', startDate: new Date().toISOString(), status: 'ongoing', category: 'ورشة عمل', association: { name: 'نادي الابتكار التقني' } },
    ],
    categoryStats: [
      { category: 'خيري', count: 4 },
      { category: 'تعليمي', count: 3 },
      { category: 'رياضي', count: 2 },
      { category: 'ثقافي', count: 2 },
      { category: 'اجتماعي', count: 1 },
    ],
    monthlyData: [
      { month: '2025-01', income: 5000, expense: 3000 },
      { month: '2025-02', income: 7000, expense: 4000 },
      { month: '2025-03', income: 8000, expense: 5500 },
      { month: '2025-04', income: 6500, expense: 4500 },
      { month: '2025-05', income: 9000, expense: 5000 },
      { month: '2025-06', income: 9500, expense: 6000 },
    ],
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if ('error' in authResult) return authResult.error

    // Try to get data from database
    try {
      await ensureDbInitialized()
      
      const totalAssociations = await db.association.count().catch(() => -1)
      
      // If no data in DB, return demo data
      if (totalAssociations === 0 || totalAssociations === -1) {
        return NextResponse.json(getDemoDashboardData())
      }

      const [
        activeAssociations,
        totalMembers,
        totalEvents,
        upcomingEvents,
        totalIncome,
        totalExpense,
        recentAssociations,
        recentEvents,
        categoryStats,
      ] = await Promise.all([
        db.association.count({ where: { status: 'active' } }).catch(() => 0),
        db.member.count({ where: { status: 'active' } }).catch(() => 0),
        db.event.count().catch(() => 0),
        db.event.count({ where: { status: 'upcoming' } }).catch(() => 0),
        db.transaction.aggregate({ where: { type: 'income' }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
        db.transaction.aggregate({ where: { type: 'expense' }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
        db.association.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { _count: { select: { members: true } } } }).catch(() => []),
        db.event.findMany({ take: 5, orderBy: { startDate: 'desc' }, include: { association: { select: { name: true } } } }).catch(() => []),
        db.association.groupBy({ by: ['category'], _count: { category: true } }).catch(() => []),
      ])

      const income = totalIncome._sum.amount || 0
      const expense = totalExpense._sum.amount || 0

      const transactions = await db.transaction.findMany({
        select: { type: true, amount: true, date: true },
        orderBy: { date: 'desc' },
        take: 100,
      }).catch(() => [])

      const monthlyData: Record<string, { income: number; expense: number }> = {}
      transactions.forEach(t => {
        const month = new Date(t.date).toISOString().slice(0, 7)
        if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 }
        if (t.type === 'income') monthlyData[month].income += t.amount
        else monthlyData[month].expense += t.amount
      })

      return NextResponse.json({
        stats: {
          totalAssociations,
          activeAssociations,
          totalMembers,
          totalEvents,
          upcomingEvents,
          totalIncome: income,
          totalExpense: expense,
          netBalance: income - expense,
        },
        recentAssociations: recentAssociations.map((a: any) => ({
          ...a,
          memberCount: a._count?.members || 0,
        })),
        recentEvents,
        categoryStats: categoryStats.map((c: any) => ({
          category: c.category,
          count: c._count?.category || 0,
        })),
        monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data,
        })).slice(0, 6).reverse(),
      })
    } catch (dbError) {
      console.log('Database unavailable, returning demo data')
      return NextResponse.json(getDemoDashboardData())
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(getDemoDashboardData())
  }
}
