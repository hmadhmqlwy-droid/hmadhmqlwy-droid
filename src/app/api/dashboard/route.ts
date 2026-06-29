import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalAssociations,
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
      db.association.count(),
      db.association.count({ where: { status: 'active' } }),
      db.member.count({ where: { status: 'active' } }),
      db.event.count(),
      db.event.count({ where: { status: 'upcoming' } }),
      db.transaction.aggregate({ where: { type: 'income' }, _sum: { amount: true } }),
      db.transaction.aggregate({ where: { type: 'expense' }, _sum: { amount: true } }),
      db.association.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { _count: { select: { members: true } } } }),
      db.event.findMany({ take: 5, orderBy: { startDate: 'desc' }, include: { association: { select: { name: true } } } }),
      db.association.groupBy({ by: ['category'], _count: { category: true } }),
    ])

    const income = totalIncome._sum.amount || 0
    const expense = totalExpense._sum.amount || 0

    // Monthly transaction data for chart
    const transactions = await db.transaction.findMany({
      select: { type: true, amount: true, date: true },
      orderBy: { date: 'desc' },
      take: 100,
    })

    // Group by month
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
      recentAssociations: recentAssociations.map(a => ({
        ...a,
        memberCount: a._count.members,
      })),
      recentEvents,
      categoryStats: categoryStats.map(c => ({
        category: c.category,
        count: c._count.category,
      })),
      monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })).slice(0, 6).reverse(),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
