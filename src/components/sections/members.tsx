'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Users, Plus, Search, Crown, Shield, UserCheck, Star, Mail, Phone, Calendar, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

// Demo members
const demoMembers = [
  { id: '1', name: 'أحمد محمد العلي', email: 'ahmed@example.com', role: 'president', association: 'جمعية الأمل الخيرية', status: 'active', joinedAt: '2024-01-15' },
  { id: '2', name: 'فاطمة أحمد السعيد', email: 'fatima@example.com', role: 'vice_president', association: 'جمعية الأمل الخيرية', status: 'active', joinedAt: '2024-02-20' },
  { id: '3', name: 'خالد عبدالله القحطاني', email: 'khaled@example.com', role: 'secretary', association: 'جمعية النور التعليمية', status: 'active', joinedAt: '2024-03-10' },
  { id: '4', name: 'نورة سعد الدوسري', email: 'noura@example.com', role: 'treasurer', association: 'جمعية النور التعليمية', status: 'active', joinedAt: '2024-03-15' },
  { id: '5', name: 'محمد علي الشمري', email: 'moh@example.com', role: 'member', association: 'جمعية الأمل الخيرية', status: 'active', joinedAt: '2024-04-01' },
  { id: '6', name: 'سارة عبدالرحمن المطيري', email: 'sara@example.com', role: 'member', association: 'جمعية النور التعليمية', status: 'active', joinedAt: '2024-04-10' },
  { id: '7', name: 'عبدالملك حسن العتيبي', email: 'abd@example.com', role: 'member', association: 'جمعية الأمل الخيرية', status: 'inactive', joinedAt: '2024-05-01' },
  { id: '8', name: 'ريم فهد الغامدي', email: 'reem@example.com', role: 'member', association: 'جمعية الثقافة والإبداع', status: 'active', joinedAt: '2024-05-15' },
]

export function MembersPage() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const filtered = demoMembers.filter(m => {
    const matchSearch = m.name.includes(search) || m.email.includes(search) || m.association.includes(search)
    const matchRole = filterRole === 'all' || m.role === filterRole
    return matchSearch && matchRole
  })

  const totalMembers = demoMembers.length
  const activeMembers = demoMembers.filter(m => m.status === 'active').length

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-foreground">إدارة الأعضاء</h1>
        <p className="text-muted-foreground text-sm">{totalMembers} عضو ({activeMembers} نشط)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(roleLabels).map(([key, label]) => {
          const count = demoMembers.filter(m => m.role === key).length
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
                  <h3 className="font-bold text-foreground truncate">{member.name}</h3>
                  <Badge className={`${roleColors[member.role]} text-[10px] mt-1`}>{roleLabels[member.role]}</Badge>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{member.email}</div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{member.association}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />انضم في {new Date(member.joinedAt).toLocaleDateString('ar-SA')}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
