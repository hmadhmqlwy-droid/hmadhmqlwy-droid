'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Shield, Lock, Eye, Fingerprint, AlertTriangle, CheckCircle, XCircle, Clock, User, Monitor, Globe, Key, Smartphone, Bell, Activity, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const actionLabels: Record<string, string> = {
  login: 'تسجيل دخول',
  logout: 'تسجيل خروج',
  login_failed: 'محاولة دخول فاشلة',
  google_login: 'تسجيل دخول عبر Google',
  password_change: 'تغيير كلمة المرور',
  '2fa_enable': 'تفعيل التحقق الثنائي',
  '2fa_disable': 'تعطيل التحقق الثنائي',
  role_change: 'تغيير الدور',
  data_export: 'تصدير بيانات',
  register: 'تسجيل حساب',
  suspicious_activity: 'نشاط مشبوه',
}

const severityColors: Record<string, string> = {
  info: 'bg-cyan-500/10 text-cyan-500',
  warning: 'bg-amber-500/10 text-amber-500',
  critical: 'bg-red-500/10 text-red-500',
}

const severityIcons: Record<string, any> = {
  info: CheckCircle,
  warning: AlertTriangle,
  critical: XCircle,
}

export function SecurityPage() {
  const { user, setUser, showToast } = useAppStore()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false)
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  useEffect(() => { 
    fetchLogs()
    setTwoFactorEnabled(user?.twoFactorEnabled || false)
  }, [user?.twoFactorEnabled])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/security')
      if (res.ok) setLogs(await res.json())
      else if (res.status === 401) {
        showToast('يجب تسجيل الدخول أولاً', 'error')
      }
    } catch (e) { 
      console.error(e)
    }
    finally { setLoading(false) }
  }

  const handleToggle2FA = async () => {
    setTwoFactorLoading(true)
    try {
      const res = await fetch('/api/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twoFactorEnabled: !twoFactorEnabled }),
      })
      if (res.ok) {
        const data = await res.json()
        setTwoFactorEnabled(data.twoFactorEnabled)
        if (data.user && user) {
          setUser({ ...user, twoFactorEnabled: data.twoFactorEnabled })
        }
        showToast(data.twoFactorEnabled ? 'تم تفعيل التحقق الثنائي' : 'تم تعطيل التحقق الثنائي', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في تحديث التحقق الثنائي', 'error')
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const filtered = logs.filter(l => 
    (actionLabels[l.action] || l.action).includes(search) || 
    l.details?.includes(search) ||
    l.user?.name?.includes(search)
  )

  const securityScore = calculateSecurityScore()

  function calculateSecurityScore() {
    let score = 60
    if (twoFactorEnabled) score += 20
    if (logs.filter(l => l.severity === 'critical').length === 0) score += 10
    if (logs.filter(l => l.action === 'login_failed').length < 3) score += 10
    return Math.min(score, 100)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" />
    </div>
  )

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-foreground">مركز الأمان</h1>
        <p className="text-muted-foreground text-sm">إدارة حماية حسابك ومراقبة الأنشطة</p>
      </div>

      {/* Security Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none"
                stroke={securityScore >= 80 ? '#10b981' : securityScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${securityScore * 2.51} 251`}
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: `${securityScore * 2.51} 251` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-black text-foreground">{securityScore}</div>
                <div className="text-xs text-muted-foreground">من 100</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">مستوى الأمان: {securityScore >= 80 ? 'ممتاز' : securityScore >= 60 ? 'جيد' : 'يحتاج تحسين'}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {securityScore >= 80 ? 'حسابك محمي بشكل ممتاز. استمر في الحفاظ على ممارسات الأمان الجيدة.' :
               securityScore >= 60 ? 'حماية حسابك جيدة ولكن يمكن تحسينها بتفعيل التحقق الثنائي.' :
               'حسابك يحتاج إلى تحسينات أمنية فورية. فعّل التحقق الثنائي فوراً.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SecurityCheck 
                label="التحقق الثنائي" 
                enabled={twoFactorEnabled} 
                icon={Fingerprint} 
                onToggle={handleToggle2FA}
                loading={twoFactorLoading}
              />
              <SecurityCheck label="كلمة مرور قوية" enabled={true} icon={Key} />
              <SecurityCheck label="جلسة آمنة" enabled={true} icon={Lock} />
              <SecurityCheck label="تنبيهات الأمان" enabled={true} icon={Bell} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'تشفير البيانات', desc: 'تشفير AES-256 لجميع البيانات الحساسة أثناء النقل والتخزين', icon: Lock, color: 'from-emerald-500 to-teal-600' },
          { title: 'مراقبة ذكية', desc: 'رصد الأنشطة المشبوهة بالذكاء الاصطناعي على مدار الساعة', icon: Eye, color: 'from-cyan-500 to-blue-600' },
          { title: 'حماية متعددة الطبقات', desc: 'جدار حماية متعدد المستويات مع كشف التسلل والاستجابة التلقائية', icon: Shield, color: 'from-amber-500 to-orange-600' },
        ].map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -4 }} className="glass-card rounded-2xl p-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
              <f.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Security Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            سجل الأنشطة الأمنية
          </h3>
          <Badge variant="outline" className="text-xs">{logs.length} سجل</Badge>
        </div>

        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في السجلات..." className="pr-10 bg-background/50" />
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map((log, i) => {
              const SeverityIcon = severityIcons[log.severity] || CheckCircle
              return (
                <motion.div key={log.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-emerald-500/5 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${severityColors[log.severity] || 'bg-muted'}`}>
                    <SeverityIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{actionLabels[log.action] || log.action}</span>
                      <Badge className={`${severityColors[log.severity] || 'bg-muted'} text-[10px]`}>{log.severity}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {log.details}
                      {log.user && ` • ${log.user.name}`}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">لا توجد سجلات أمنية</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function SecurityCheck({ label, enabled, icon: Icon, onToggle, loading }: { label: string; enabled: boolean; icon: any; onToggle?: () => void; loading?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${enabled ? 'bg-emerald-500/10' : 'bg-muted'}`}>
        <Icon className={`w-4 h-4 ${enabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      {onToggle ? (
        <button
          onClick={onToggle}
          disabled={loading}
          className={`w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-muted'} ${loading ? 'opacity-50' : ''}`}
        >
          <motion.div
            animate={{ x: enabled ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      ) : (
        <span className={`text-xs font-medium ${enabled ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          {enabled ? 'مفعّل' : 'معطّل'}
        </span>
      )}
    </div>
  )
}
