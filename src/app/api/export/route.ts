import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'associations' // associations, members, events, transactions, security
    const format = searchParams.get('format') || 'csv' // csv, json

    let data: any[] = []
    let headers: string[] = []
    let filename = ''

    switch (type) {
      case 'associations':
        data = await db.association.findMany({
          include: { _count: { select: { members: true, events: true, transactions: true } } },
          orderBy: { createdAt: 'desc' }
        })
        headers = ['الاسم', 'الاسم بالإنجليزية', 'الوصف', 'التصنيف', 'الحالة', 'المدينة', 'الهاتف', 'البريد', 'عدد الأعضاء', 'تاريخ التأسيس']
        filename = `associations_report_${new Date().toISOString().slice(0, 10)}`
        break

      case 'members':
        data = await db.member.findMany({
          include: { user: true, association: { select: { name: true } } },
          orderBy: { joinedAt: 'desc' }
        })
        headers = ['اسم العضو', 'البريد', 'الدور', 'الحالة', 'الجمعية', 'تاريخ الانضمام']
        filename = `members_report_${new Date().toISOString().slice(0, 10)}`
        break

      case 'events':
        data = await db.event.findMany({
          include: { association: { select: { name: true } } },
          orderBy: { startDate: 'desc' }
        })
        headers = ['العنوان', 'الوصف', 'الموقع', 'تاريخ البدء', 'الحالة', 'التصنيف', 'الميزانية', 'الجمعية']
        filename = `events_report_${new Date().toISOString().slice(0, 10)}`
        break

      case 'transactions':
        data = await db.transaction.findMany({
          include: { association: { select: { name: true } } },
          orderBy: { date: 'desc' }
        })
        headers = ['النوع', 'التصنيف', 'المبلغ', 'الوصف', 'التاريخ', 'الحالة', 'الجمعية']
        filename = `transactions_report_${new Date().toISOString().slice(0, 10)}`
        break

      case 'security':
        data = await db.securityLog.findMany({
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 500,
        })
        headers = ['النشاط', 'التفاصيل', 'المستخدم', 'عنوان IP', 'المستوى', 'التاريخ']
        filename = `security_report_${new Date().toISOString().slice(0, 10)}`
        break

      default:
        return NextResponse.json({ error: 'نوع التقرير غير معروف' }, { status: 400 })
    }

    // Export as JSON
    if (format === 'json') {
      return NextResponse.json(data)
    }

    // Export as CSV
    const BOM = '\uFEFF' // UTF-8 BOM for Arabic support in Excel
    let rows: string[][] = []

    switch (type) {
      case 'associations':
        rows = data.map(d => [d.name, d.nameEn || '', d.description, d.category, d.status, d.city || '', d.phone || '', d.email || '', String(d._count.members), d.foundedDate ? new Date(d.foundedDate).toLocaleDateString('ar-SA') : ''])
        break
      case 'members':
        rows = data.map(d => [d.user.name, d.user.email, d.role, d.status, d.association.name, new Date(d.joinedAt).toLocaleDateString('ar-SA')])
        break
      case 'events':
        rows = data.map(d => [d.title, d.description || '', d.location || '', new Date(d.startDate).toLocaleDateString('ar-SA'), d.status, d.category || '', d.budget ? String(d.budget) : '', d.association.name])
        break
      case 'transactions':
        rows = data.map(d => [d.type === 'income' ? 'دخل' : 'مصروف', d.category, String(d.amount), d.description || '', new Date(d.date).toLocaleDateString('ar-SA'), d.status, d.association.name])
        break
      case 'security':
        rows = data.map(d => [d.action, d.details || '', d.user?.name || '', d.ipAddress || '', d.severity, new Date(d.createdAt).toLocaleString('ar-SA')])
        break
    }

    const csvContent = BOM + [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'خطأ في تصدير التقرير' }, { status: 500 })
  }
}
