'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Calendar, Plus, Search, MapPin, Clock, Users, DollarSign, Building2, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const eventCategories = ['مؤتمر', 'ندوة', 'ورشة عمل', 'معرض', 'حملة', 'أخرى']
const statusLabels: Record<string, string> = { upcoming: 'قادمة', ongoing: 'جارية', completed: 'منتهية', cancelled: 'ملغاة' }
const statusColors: Record<string, string> = { upcoming: 'bg-cyan-500/10 text-cyan-500', ongoing: 'bg-emerald-500/10 text-emerald-500', completed: 'bg-muted text-muted-foreground', cancelled: 'bg-red-500/10 text-red-500' }

export function EventsPage() {
  const { user, showToast } = useAppStore()
  const [events, setEvents] = useState<any[]>([])
  const [associations, setAssociations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [form, setForm] = useState({ associationId: '', title: '', description: '', location: '', startDate: '', endDate: '', maxAttendees: '', budget: '', category: 'ندوة' })

  useEffect(() => { fetchEvents(); fetchAssociations() }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) setEvents(await res.json())
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
    if (!form.title.trim()) {
      showToast('عنوان الفعالية مطلوب', 'error')
      return
    }
    if (!form.startDate) {
      showToast('تاريخ البدء مطلوب', 'error')
      return
    }

    setCreateLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowCreate(false)
        setForm({ associationId: '', title: '', description: '', location: '', startDate: '', endDate: '', maxAttendees: '', budget: '', category: 'ندوة' })
        fetchEvents()
        showToast('تم إنشاء الفعالية بنجاح', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في إنشاء الفعالية', 'error')
      }
    } catch (e) { 
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${eventTitle}"؟`)) return
    try {
      const res = await fetch(`/api/events?eventId=${eventId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('تم حذف الفعالية بنجاح', 'success')
        fetchEvents()
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في حذف الفعالية', 'error')
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  const filtered = events.filter(e => e.title.includes(search))

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
          <h1 className="text-2xl font-black text-foreground">إدارة الفعاليات</h1>
          <p className="text-muted-foreground text-sm">{events.length} فعالية</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25">
              <Plus className="w-4 h-4 ml-2" />إنشاء فعالية
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader><DialogTitle className="text-xl font-black">إنشاء فعالية جديدة</DialogTitle></DialogHeader>
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
              <div><Label>عنوان الفعالية *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مؤتمر التقنية 2026" className="mt-1" /></div>
              <div><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الفعالية..." className="mt-1" rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>التصنيف</Label><Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{eventCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>الموقع</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="الرياض" className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>تاريخ البدء *</Label><Input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="mt-1" dir="ltr" /></div>
                <div><Label>تاريخ الانتهاء</Label><Input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="mt-1" dir="ltr" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>الحد الأقصى للحضور</Label><Input type="number" value={form.maxAttendees} onChange={e => setForm({ ...form, maxAttendees: e.target.value })} placeholder="100" className="mt-1" dir="ltr" /></div>
                <div><Label>الميزانية (ر.س)</Label><Input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="50000" className="mt-1" dir="ltr" /></div>
              </div>
              <Button onClick={handleCreate} disabled={createLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl">
                {createLoading ? 'جارٍ الإنشاء...' : 'إنشاء الفعالية'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن فعالية..." className="pr-10 bg-background/50" />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="h-24 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20 relative flex items-center justify-center">
                <Calendar className="w-10 h-10 text-amber-500/50" />
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status] || 'bg-muted'}`}>
                  {statusLabels[event.status] || event.status}
                </span>
                {(user?.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-red-500 hover:bg-red-500/20 transition-colors"
                    title="حذف الفعالية"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1 truncate">{event.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{event.association?.name}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(event.startDate).toLocaleDateString('ar-SA')}</div>
                  {event.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.location}</div>}
                  {event.budget && <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{event.budget.toLocaleString('ar-SA')} ر.س</div>}
                  {event.category && <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />{event.category}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد فعاليات</h3>
          <p className="text-muted-foreground mb-6">ابدأ بإنشاء فعاليتك الأولى</p>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl">
            <Plus className="w-4 h-4 ml-2" />إنشاء فعالية
          </Button>
        </div>
      )}
    </div>
  )
}
