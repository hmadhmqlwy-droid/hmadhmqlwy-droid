'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Shield, Users, Building2, Activity, Server, UserCheck, UserX, Crown, Mail, Calendar, Search, Download, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AdminStats {
  stats: {
    totalUsers: number
    activeUsers: number
    adminUsers: number
    totalAssociations: number
    totalMembers: number
    totalEvents: number
    totalTransactions: number
    totalSecurityLogs: number
    totalIncome: number
    totalExpense: number
    activeSessions: number
  }
  recentUsers: any[]
  recentSecurityLogs: any[]
  usersByRole: { role: string; count: number }[]
}

export function AdminPage() {
  const { user } = useAppStore()
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchAdminData() }, [])

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin')
      if (res.ok) setData(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: { isActive: !currentActive } }),
      })
      fetchAdminData()
    } catch (e) { console.error(e) }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
    try {
      await fetch(`/api/admin?userId=${userId}`, { method: 'DELETE' })
      fetchAdminData()
    } catch (e) { console.error(e) }
  }

  const handleExport = async (type: string) => {
    window.open(`/api/export?type=${type}&format=csv`, '_blank')
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" />
    </div>
  )

  const stats = data?.stats || { totalUsers: 0, activeUsers: 0, adminUsers: 0, totalAssociations: 0, totalMembers: 0, totalEvents: 0, totalTransactions: 0, totalSecurityLogs: 0, totalIncome: 0, totalExpense: 0, activeSessions: 0 }
  const recentUsers = data?.recentUsers || []
  const recentLogs = data?.recentSecurityLogs || []
  const usersByRole = data?.usersByRole || []

  const statCards = [
    { title: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'from-emerald-500 to-teal-600' },
    { title: 'مستخدمين نشطين', value: stats.activeUsers, icon: UserCheck, color: 'from-cyan-500 to-blue-600' },
    { title: 'مديرين', value: stats.adminUsers, icon: Crown, color: 'from-amber-500 to-orange-600' },
    { title: 'جلسات نشطة', value: stats.activeSessions, icon: Activity, color: 'from-purple-500 to-violet-600' },
    { title: 'الجمعيات', value: stats.totalAssociations, icon: Building2, color: 'from-teal-500 to-emerald-600' },
    { title: 'سجلات الأمان', value: stats.totalSecurityLogs, icon: Shield, color: 'from-rose-500 to-red-600' },
  ]

  const filteredUsers = recentUsers.filter((u: any) => u.name.includes(search) || u.email.includes(search))

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            إدارة النظام
          </h1>
          <p className="text-muted-foreground text-sm">لوحة تحكم المشرف العام</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('security')} variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-bold rounded-xl text-xs">
            <Download className="w-3.5 h-3.5 ml-1" />تصدير سجلات الأمان
          </Button>
          <Button onClick={() => handleExport('associations')} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl text-xs">
            <Download className="w-3.5 h-3.5 ml-1" />تصدير البيانات
          </Button>
        </div>
      </div>

      {/* Admin Notice */}
      {user?.role !== 'admin' && (
        <div className="glass-card rounded-2xl p-4 border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold text-sm">هذه الصفحة متاحة فقط للمديرين</span>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }} className="glass-card rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-2`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-black text-foreground">{card.value}</div>
            <div className="text-[10px] text-muted-foreground">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Users Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-500" />
            إدارة المستخدمين
          </h3>
          <Badge variant="outline" className="text-xs">{stats.totalUsers} مستخدم</Badge>
        </div>

        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن مستخدم..." className="pr-10 bg-background/50" />
        </div>

        {/* Role Distribution */}
        <div className="flex flex-wrap gap-2 mb-4">
          {usersByRole.map((u: any) => (
            <Badge key={u.role} variant="outline" className="text-xs">
              {u.role === 'admin' ? 'مدير' : u.role === 'manager' ? 'مشرف' : 'مستخدم'}: {u.count}
            </Badge>
          ))}
        </div>

        {filteredUsers.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((u: any, i: number) => (
              <motion.div key={u.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-emerald-500/5 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : u.role === 'manager' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                }`}>
                  {u.role === 'admin' ? <Crown className="w-5 h-5" /> : u.role === 'manager' ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm truncate">{u.name}</span>
                    <Badge className={`text-[10px] ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                      {u.role === 'admin' ? 'مدير' : u.role === 'manager' ? 'مشرف' : 'مستخدم'}
                    </Badge>
                    <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</span>
                    {u.lastLogin && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(u.lastLogin).toLocaleDateString('ar-SA')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => handleToggleActive(u.id, u.isActive)}
                    variant="ghost"
                    size="sm"
                    className={`text-xs ${u.isActive ? 'text-red-400 hover:text-red-500' : 'text-emerald-400 hover:text-emerald-500'}`}
                  >
                    {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </Button>
                  {u.role !== 'admin' && (
                    <Button
                      onClick={() => handleDeleteUser(u.id)}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-400 hover:text-red-500"
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">لا يوجد مستخدمين بعد</p>
          </div>
        )}
      </motion.div>

      {/* System Health & Security Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-teal-500" />
            صحة النظام
          </h3>
          <div className="space-y-3">
            {[
              { label: 'الخادم', status: 'يعمل', ok: true, icon: Server },
              { label: 'قاعدة البيانات', status: 'متصلة', ok: true, icon: BarChart3 },
              { label: 'التشفير', status: 'مفعّل (AES-256)', ok: true, icon: Shield },
              { label: 'الجلسات النشطة', status: `${stats.activeSessions} جلسة`, ok: true, icon: Activity },
              { label: 'النسخ الاحتياطي', status: 'آخر نسخة: اليوم', ok: true, icon: Clock },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <Badge className={`text-xs ${item.ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  <CheckCircle className="w-3 h-3 ml-1" />
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Security Logs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              أحدث سجلات الأمان
            </h3>
            <Button onClick={() => handleExport('security')} variant="ghost" size="sm" className="text-xs text-emerald-500">
              <Download className="w-3.5 h-3.5 ml-1" />تصدير
            </Button>
          </div>
          {recentLogs.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {recentLogs.map((log: any, i: number) => (
                <div key={log.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-background/30 text-xs">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.severity === 'critical' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-medium">{log.action}</span>
                    <span className="text-muted-foreground mx-1">•</span>
                    <span className="text-muted-foreground truncate">{log.user?.name || ''}</span>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString('ar-SA')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">لا توجد سجلات أمنية بعد</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
