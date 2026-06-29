'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Building2, Users, Calendar, TrendingUp, TrendingDown, DollarSign, Activity, Shield, ArrowUpLeft, ArrowDownLeft, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface DashboardStats {
  stats: {
    totalAssociations: number
    activeAssociations: number
    totalMembers: number
    totalEvents: number
    upcomingEvents: number
    totalIncome: number
    totalExpense: number
    netBalance: number
  }
  recentAssociations: any[]
  recentEvents: any[]
  categoryStats: { category: string; count: number }[]
  monthlyData: { month: string; income: number; expense: number }[]
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6']

const categoryLabels: Record<string, string> = {
  'خيري': 'خيري',
  'تعليمي': 'تعليمي',
  'اجتماعي': 'اجتماعي',
  'ثقافي': 'ثقافي',
  'رياضي': 'رياضي',
  'ديني': 'ديني',
  'مهني': 'مهني',
  'أخرى': 'أخرى',
}

export function DashboardPage() {
  const { user } = useAppStore()
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"
        />
      </div>
    )
  }

  const stats = data?.stats || { totalAssociations: 0, activeAssociations: 0, totalMembers: 0, totalEvents: 0, upcomingEvents: 0, totalIncome: 0, totalExpense: 0, netBalance: 0 }
  const categoryData = data?.categoryStats || []
  const monthlyData = data?.monthlyData || []
  const recentAssociations = data?.recentAssociations || []
  const recentEvents = data?.recentEvents || []

  const statCards = [
    { title: 'إجمالي الجمعيات', value: stats.totalAssociations, sub: `${stats.activeAssociations} نشطة`, icon: Building2, color: 'from-emerald-500 to-teal-600', trend: '+12%', up: true },
    { title: 'إجمالي الأعضاء', value: stats.totalMembers, sub: 'عضو فعّال', icon: Users, color: 'from-cyan-500 to-blue-600', trend: '+8%', up: true },
    { title: 'الفعاليات', value: stats.totalEvents, sub: `${stats.upcomingEvents} قادمة`, icon: Calendar, color: 'from-amber-500 to-orange-600', trend: '+24%', up: true },
    { title: 'الرصيد الصافي', value: `${stats.netBalance.toLocaleString('ar-SA')} ر.س`, sub: `دخل: ${stats.totalIncome.toLocaleString('ar-SA')}`, icon: DollarSign, color: 'from-teal-500 to-emerald-600', trend: '+5%', up: true },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              مرحباً، <span className="text-emerald-500">{user?.name || 'المستخدم'}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">إليك ملخص أداء جمعياتك اليوم</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium">
              <Activity className="w-4 h-4" />
              نشط
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium">
              <Shield className="w-4 h-4" />
              آمن
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, rotateY: 2, transition: { duration: 0.2 } }}
            className="perspective-container"
          >
            <div className="preserve-3d card-3d glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.up ? <ArrowUpLeft className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                  {card.trend}
                </span>
              </div>
              <div className="text-2xl font-black text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Income/Expense Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">التحليل المالي الشهري</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} name="الدخل" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} name="المصروفات" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد بيانات مالية بعد</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">توزيع الجمعيات</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد جمعيات بعد</p>
              </div>
            </div>
          )}
          {categoryData.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categoryData.map((c, i) => (
                <span key={c.category} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {categoryLabels[c.category] || c.category} ({c.count})
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Associations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">أحدث الجمعيات</h3>
          {recentAssociations.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentAssociations.map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-emerald-500/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                    <Building2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-sm truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.category} • {a.memberCount || 0} عضو</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {a.status === 'active' ? 'نشطة' : 'معلقة'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
              لا توجد جمعيات بعد - أنشئ جمعيتك الأولى!
            </div>
          )}
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">أحدث الفعاليات</h3>
          {recentEvents.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentEvents.map((e: any) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-emerald-500/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                    <Calendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-sm truncate">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.association?.name || ''}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    e.status === 'upcoming' ? 'bg-cyan-500/10 text-cyan-500' :
                    e.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {e.status === 'upcoming' ? 'قادمة' : e.status === 'ongoing' ? 'جارية' : 'منتهية'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
              لا توجد فعاليات بعد
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
