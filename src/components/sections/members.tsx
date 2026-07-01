'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Users, Plus, Search, Crown, Shield, UserCheck, Star, Mail, Calendar, Building2, UserPlus, Trash2, Edit3, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const roleLabels: Record<string, string> = {
  president: 'رئيس',
  vice_president: 'نائب رئيس',
  secretary: 'أمين سر',
  treasurer: 'أمين صندوق',
  member: 'عضو',
}

const roleColors: Record<string, string> = {
  president: 'bg-amber-500/10 text-amber-500',
  vice_president: 'bg-purple-500/10 text-purple-500',
  secretary: 'bg-cyan-500/10 text-cyan-500',
  treasurer: 'bg-emerald-500/10 text-emerald-500',
  member: 'bg-muted text-muted-foreground',
}

const roleIcons: Record<string, any> = {
  president: Crown,
  vice_president: Shield,
  secretary: Star,
  treasurer: Star,
  member: UserCheck,
}

export function MembersPage() {
  const { user, showToast } = useAppStore()
  const [members, setMembers] = useState<any[]>([])
  const [associations, setAssociations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [form, setForm] = useState({ email: '', associationId: '', role: 'member' })

  useEffect(() => {
    fetchMembers()
    fetchAssociations()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      } else if (res.status === 401) {
        showToast('يجب تسجيل الدخول أولاً', 'error')
      }
    } catch (e) {
      console.error(e)
      showToast('خطأ في تحميل الأعضاء', 'error')
    }
    finally { setLoading(false) }
  }

  const fetchAssociations = async () => {
    try {
      const res = await fetch('/api/associations')
      if (res.ok) setAssociations(await res.json())
    } catch (e) { console.error(e) }
  }

  const handleAddMember = async () => {
    if (!form.email.trim()) {
      showToast('البريد الإلكتروني مطلوب', 'error')
      return
    }
    if (!form.associationId) {
      showToast('يرجى اختيار الجمعية', 'error')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      showToast('صيغة البريد الإلكتروني غير صحيحة', 'error')
      return
    }

    setAddLoading(true)
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setShowAdd(false)
        setForm({ email: '', associationId: '', role: 'member' })
        fetchMembers()
        showToast('تم إضافة العضو بنجاح', 'success')
      } else {
        showToast(data.error || 'خطأ في إضافة العضو', 'error')
      }
    } catch (e) {
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setAddLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`هل أنت متأكد من إزالة "${memberName}" من الجمعية؟`)) return
    try {
      const res = await fetch(`/api/members?memberId=${memberId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('تم إزالة العضو بنجاح', 'success')
        fetchMembers()
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في إزالة العضو', 'error')
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const res = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role: newRole }),
      })
      if (res.ok) {
        showToast('تم تحديث الدور بنجاح', 'success')
        fetchMembers()
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في تحديث الدور', 'error')
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  const filtered = members.filter(m => {
    const matchSearch = m.user?.name?.includes(search) || m.user?.email?.includes(search) || m.association?.name?.includes(search)
    const matchRole = filterRole === 'all' || m.role === filterRole
    return matchSearch && matchRole
  })

  const totalMembers = members.length
  const activeMembers = members.filter(m => m.status === 'active').length

  // Check if user can manage members (admin or president/secretary of any association)
  const canManage = user?.role === 'admin' || members.some(m => m.userId === user?.id && ['president', 'vice_president', 'secretary'].includes(m.role))

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
          <h1 className="text-2xl font-black text-foreground">إدارة الأعضاء</h1>
          <p className="text-muted-foreground text-sm">{totalMembers} عضو ({activeMembers} نشط)</p>
        </div>
        {canManage && (
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25">
                <UserPlus className="w-4 h-4 ml-2" />إضافة عضو
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black">إضافة عضو جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>الجمعية *</Label>
                  <Select value={form.associationId} onValueChange={v => setForm({ ...form, associationId: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر الجمعية" /></SelectTrigger>
                    <SelectContent>
                      {associations.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>البريد الإلكتروني للعضو *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">يجب أن يكون المستخدم مسجلاً في النظام</p>
                </div>
                <div>
                  <Label>الدور في الجمعية *</Label>
                  <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddMember}
                  disabled={addLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl"
                >
                  {addLoading ? 'جارٍ الإضافة...' : 'إضافة العضو'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(roleLabels).map(([key, label]) => {
          const count = members.filter(m => m.role === key).length
          const Icon = roleIcons[key] || UserCheck
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className={`glass-card rounded-xl p-3 text-center cursor-pointer transition-all ${filterRole === key ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => setFilterRole(filterRole === key ? 'all' : key)}>
              <Icon className={`w-5 h-5 mx-auto mb-1 ${roleColors[key].split(' ')[1]}`} />
              <div className="text-lg font-bold text-foreground">{count}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن عضو..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
      </div>

      {/* Members Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((member, i) => {
              const Icon = roleIcons[member.role] || UserCheck
              const canModify = user?.role === 'admin' || (member.association && 
                members.some(m => m.userId === user?.id && m.associationId === member.associationId && ['president', 'vice_president'].includes(m.role)))

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleColors[member.role]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{member.user?.name || 'بدون اسم'}</h3>
                      {member.user?.email && (
                        <p className="text-xs text-muted-foreground truncate" dir="ltr">{member.user.email}</p>
                      )}
                      <Badge className={`${roleColors[member.role]} text-[10px] mt-1`}>{roleLabels[member.role]}</Badge>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{member.association?.name || member.associationName || 'غير محدد'}</div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />انضم في {new Date(member.joinedAt).toLocaleDateString('ar-SA')}</div>
                  </div>
                  {/* Actions */}
                  {canModify && member.userId !== user?.id && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
                      <Select value={member.role} onValueChange={v => handleUpdateRole(member.id, v)}>
                        <SelectTrigger className="h-7 text-[10px] flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id, member.user?.name || '')}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10 h-7 text-[10px]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-bold text-foreground mb-2">لا يوجد أعضاء بعد</h3>
          <p className="text-muted-foreground mb-6">أضف أعضاء عند إنشاء جمعية جديدة</p>
        </motion.div>
      )}
    </div>
  )
}
