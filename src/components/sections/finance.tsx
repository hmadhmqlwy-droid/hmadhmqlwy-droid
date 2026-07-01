'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, Building2, ArrowUpLeft, ArrowDownLeft, Wallet, Receipt, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'

const incomeCategories = ['اشتراكات', 'تبرعات', 'منح', 'إيرادات أخرى']
const expenseCategories = ['رواتب', 'إيجار', 'صيانة', 'أنشطة', 'مصروفات أخرى']

export function FinancePage() {
  const { user, showToast } = useAppStore()
  const [transactions, setTransactions] = useState<any[]>([])
  const [associations, setAssociations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [form, setForm] = useState({ associationId: '', type: 'income', category: 'اشتراكات', amount: '', description: '', date: '', reference: '' })

  useEffect(() => { fetchTransactions(); fetchAssociations() }, [])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      if (res.ok) setTransactions(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchAssociations = async () => {
    try {
      const res = await fetch('/api/associations')
      if (res.ok) setAssociations(await res.json())
    } catch (e) { console.error(e) }
  }

  const handleCreate = async () => {
    if (!form.associationId) {
      showToast('يرجى اختيار الجمعية', 'error')
      return
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      showToast('يرجى إدخال مبلغ صحيح', 'error')
      return
    }
    if (!form.date) {
      showToast('يرجى إدخال التاريخ', 'error')
      return
    }

    setCreateLoading(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, approvedBy: user?.id }),
      })
      if (res.ok) {
        setShowCreate(false)
        setForm({ associationId: '', type: 'income', category: 'اشتراكات', amount: '', description: '', date: '', reference: '' })
        fetchTransactions()
        showToast('تم إضافة المعاملة بنجاح', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في إضافة المعاملة', 'error')
      }
    } catch (e) { 
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleApproveTransaction = async (transactionId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status }),
      })
      if (res.ok) {
        showToast(status === 'approved' ? 'تمت الموافقة على المعاملة' : 'تم رفض المعاملة', 'success')
        fetchTransactions()
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في تحديث المعاملة', 'error')
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const incomeByCategory = transactions.filter(t => t.type === 'income').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const expenseByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.keys({ ...incomeByCategory, ...expenseByCategory }).map(cat => ({
    category: cat,
    income: incomeByCategory[cat] || 0,
    expense: expenseByCategory[cat] || 0,
  }))

  const filtered = transactions.filter(t => 
    t.description?.includes(search) || t.category.includes(search) || t.association?.name?.includes(search)
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" />
    </div>
  )

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">الإدارة المالية</h1>
          <p className="text-muted-foreground text-sm">{transactions.length} معاملة مالية</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25">
              <Plus className="w-4 h-4 ml-2" />إضافة معاملة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle className="text-xl font-black">إضافة معاملة مالية</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>الجمعية *</Label>
                <Select value={form.associationId} onValueChange={v => setForm({ ...form, associationId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الجمعية" /></SelectTrigger>
                  <SelectContent>{associations.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>النوع *</Label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v, category: v === 'income' ? 'اشتراكات' : 'رواتب' })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">دخل</SelectItem>
                      <SelectItem value="expense">مصروف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>التصنيف *</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(form.type === 'income' ? incomeCategories : expenseCategories).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>المبلغ (ر.س) *</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="5000" className="mt-1" dir="ltr" /></div>
              <div><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="تفاصيل المعاملة..." className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>التاريخ *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mt-1" dir="ltr" /></div>
                <div><Label>المرجع</Label><Input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="INV-001" className="mt-1" dir="ltr" /></div>
              </div>
              <Button onClick={handleCreate} disabled={createLoading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl">
                {createLoading ? 'جارٍ الإضافة...' : 'إضافة المعاملة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'إجمالي الدخل', value: totalIncome, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
          { title: 'إجمالي المصروفات', value: totalExpense, icon: TrendingDown, color: 'from-red-500 to-rose-600' },
          { title: 'الرصيد الصافي', value: balance, icon: Wallet, color: 'from-cyan-500 to-blue-600' },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground">{card.value.toLocaleString('ar-SA')} <span className="text-sm font-normal text-muted-foreground">ر.س</span></div>
            <div className="text-xs text-muted-foreground mt-1">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5">
          <h3 className="text-lg font-bold text-foreground mb-4">التوزيع حسب التصنيف</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="دخل" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="مصروف" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Transactions List */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في المعاملات..." className="pr-10 bg-background/50" />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl glass-card hover:bg-emerald-500/5 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                {t.type === 'income' ? <ArrowUpLeft className="w-5 h-5 text-emerald-500" /> : <ArrowDownLeft className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm truncate">{t.description || t.category}</span>
                  {t.status === 'pending' && (
                    <Badge className="bg-amber-500/10 text-amber-500 text-[10px]">معلقة</Badge>
                  )}
                  {t.status === 'approved' && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">معتمدة</Badge>
                  )}
                  {t.status === 'rejected' && (
                    <Badge className="bg-red-500/10 text-red-500 text-[10px]">مرفوضة</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{t.association?.name} • {t.category} • {new Date(t.date).toLocaleDateString('ar-SA')}</div>
              </div>
              <div className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('ar-SA')} ر.س
              </div>
              {/* Approve/Reject buttons for pending transactions (admin/manager only) */}
              {t.status === 'pending' && (user?.role === 'admin' || user?.role === 'manager') && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApproveTransaction(t.id, 'approved')}
                    className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                    title="موافقة"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApproveTransaction(t.id, 'rejected')}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    title="رفض"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد معاملات</h3>
          <p className="text-muted-foreground">ابدأ بتسجيل معاملاتك المالية</p>
        </div>
      )}
    </div>
  )
}
