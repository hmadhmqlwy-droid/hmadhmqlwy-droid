'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Users, Plus, Search, Crown, Shield, UserCheck, Star, Mail, Calendar, Building2, UserPlus } from 'lucide-react'
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
  const { user } = useAppStore()
  const [members, setMembers] = useState<any[]>([])
  const [associations, setAssociations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ userId: '', associationId: '', role: 'member' })

  useEffect(() => {
    fetchMembers()
    fetchAssociations()
  }, [])

  const fetchMembers = async () => {
    try {
      // Get members from associations API which includes members
      const res = await fetch('/api/associations')
      if (res.ok) {
        const assocs = await res.json()
        setAssociations(assocs)
        // Flatten all members from all associations
        const allMembers = assocs.flatMap((a: any) =>
          (a.members || []).map((m: any) => ({
            ...m,
            associationName: a.name,
          }))
        )
        setMembers(allMembers)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchAssociations = async () => {
    // Already fetched in fetchMembers
  }

  const filtered = members.filter(m => {
    const matchSearch = m.user?.name?.includes(search) || m.user?.email?.includes(search) || m.associationName?.includes(search)
    const matchRole = filterRole === 'all' || m.role === filterRole
    return matchSearch && matchRole
  })

  const totalMembers = members.length
  const activeMembers = members.filter(m => m.status === 'active').length

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
        <Button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25">
          <UserPlus className="w-4 h-4 ml-2" />إضافة عضو
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(roleLabels).map(([key, label]) => {
          const count = members.filter(m => m.role === key).length
          const Icon = roleIcons[key] || UserCheck
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }} className="glass-card rounded-xl p-3 text-center cursor-pointer"
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
          {filtered.map((member, i) => {
            const Icon = roleIcons[member.role] || UserCheck
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <Badge className={`${roleColors[member.role]} text-[10px] mt-1`}>{roleLabels[member.role]}</Badge>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {member.user?.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{member.user.email}</div>}
                  <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{member.associationName}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />انضم في {new Date(member.joinedAt).toLocaleDateString('ar-SA')}</div>
                </div>
              </motion.div>
            )
          })}
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
