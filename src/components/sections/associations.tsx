'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Building2, Plus, Search, Filter, MapPin, Users, Calendar, Trash2, Eye, Phone, Mail, Globe, Award, AlertCircle, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const categories = ['خيري', 'تعليمي', 'اجتماعي', 'ثقافي', 'رياضي', 'ديني', 'مهني', 'أخرى']

const statusLabels: Record<string, string> = {
  active: 'نشطة',
  inactive: 'غير نشطة',
  suspended: 'معلقة',
  pending: 'قيد المراجعة',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-500',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-red-500/10 text-red-500',
  pending: 'bg-amber-500/10 text-amber-500',
}

const categoryIcons: Record<string, string> = {
  'خيري': '💚',
  'تعليمي': '📚',
  'اجتماعي': '🤝',
  'ثقافي': '🎭',
  'رياضي': '⚽',
  'ديني': '🕌',
  'مهني': '💼',
  'أخرى': '📌',
}

const emptyForm = {
  name: '', nameEn: '', description: '', category: 'خيري',
  phone: '', email: '', website: '', address: '', city: '',
  licenseNumber: '', taxId: '', foundedDate: '',
}

export function AssociationsPage() {
  const { user, showToast } = useAppStore()
  const [associations, setAssociations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editingAssoc, setEditingAssoc] = useState<any>(null)
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Create/Edit form
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchAssociations() }, [])

  const fetchAssociations = async () => {
    try {
      const res = await fetch('/api/associations')
      if (res.ok) {
        const data = await res.json()
        setAssociations(data)
      } else if (res.status === 401) {
        showToast('يجب تسجيل الدخول أولاً', 'error')
      }
    } catch (e) { 
      console.error(e)
      showToast('خطأ في تحميل الجمعيات', 'error')
    }
    finally { setLoading(false) }
  }

  const handleCreate = async () => {
    if (!form.name.trim()) {
      showToast('اسم الجمعية مطلوب', 'error')
      return
    }
    if (!form.description.trim()) {
      showToast('وصف الجمعية مطلوب', 'error')
      return
    }
    
    setCreateLoading(true)
    try {
      const res = await fetch('/api/associations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, createdBy: user?.id }),
      })
      if (res.ok) {
        setShowCreate(false)
        setForm(emptyForm)
        fetchAssociations()
        showToast('تم إنشاء الجمعية بنجاح', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في إنشاء الجمعية', 'error')
      }
    } catch (e) { 
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingAssoc) return
    if (!form.name.trim()) {
      showToast('اسم الجمعية مطلوب', 'error')
      return
    }
    if (!form.description.trim()) {
      showToast('وصف الجمعية مطلوب', 'error')
      return
    }
    
    setEditLoading(true)
    try {
      const res = await fetch('/api/associations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ associationId: editingAssoc.id, ...form }),
      })
      if (res.ok) {
        setShowEdit(false)
        setEditingAssoc(null)
        setForm(emptyForm)
        fetchAssociations()
        showToast('تم تحديث الجمعية بنجاح', 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في تحديث الجمعية', 'error')
      }
    } catch (e) {
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    } finally {
      setEditLoading(false)
    }
  }

  const openEditDialog = (assoc: any) => {
    setEditingAssoc(assoc)
    setForm({
      name: assoc.name || '',
      nameEn: assoc.nameEn || '',
      description: assoc.description || '',
      category: assoc.category || 'خيري',
      phone: assoc.phone || '',
      email: assoc.email || '',
      website: assoc.website || '',
      address: assoc.address || '',
      city: assoc.city || '',
      licenseNumber: assoc.licenseNumber || '',
      taxId: assoc.taxId || '',
      foundedDate: assoc.foundedDate ? new Date(assoc.foundedDate).toISOString().split('T')[0] : '',
    })
    setShowEdit(true)
  }

  const handleDelete = async (assocId: string, assocName: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${assocName}"؟ سيتم حذف جميع الأعضاء والفعاليات والمعاملات المرتبطة.`)) return
    try {
      const res = await fetch(`/api/associations?associationId=${assocId}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('تم حذف الجمعية بنجاح', 'success')
        setShowDetail(false)
        fetchAssociations()
      } else {
        const data = await res.json()
        showToast(data.error || 'خطأ في حذف الجمعية', 'error')
      }
    } catch (e) { 
      console.error(e)
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  const canDelete = (assoc: any) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'user' || user.role === 'manager') {
      const membership = assoc.members?.find((m: any) => m.userId === user.id)
      return membership?.role === 'president'
    }
    return false
  }

  const canEdit = (assoc: any) => {
    if (!user) return false
    if (user.role === 'admin') return true
    const membership = assoc.members?.find((m: any) => m.userId === user.id)
    return membership && ['president', 'vice_president', 'secretary'].includes(membership.role)
  }

  const filtered = associations.filter(a => {
    const matchSearch = a.name.includes(search) || a.description.includes(search) || (a.nameEn && a.nameEn.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = filterCategory === 'all' || a.category === filterCategory
    return matchSearch && matchCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">إدارة الجمعيات</h1>
          <p className="text-muted-foreground text-sm">{associations.length} جمعية مسجلة</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء جمعية
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">إنشاء جمعية جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>اسم الجمعية *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="جمعية الأمل الخيرية" className="mt-1" />
              </div>
              <div>
                <Label>الاسم بالإنجليزية</Label>
                <Input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} placeholder="Al Amal Charity" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label>الوصف *</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الجمعية..." className="mt-1" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التصنيف *</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>المدينة</Label>
                  <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="الرياض" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الهاتف</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966 5x xxx xxxx" className="mt-1" dir="ltr" />
                </div>
                <div>
                  <Label>البريد</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@example.com" className="mt-1" dir="ltr" />
                </div>
              </div>
              <div>
                <Label>الموقع الإلكتروني</Label>
                <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label>العنوان</Label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="شارع الملك فهد، الرياض" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الترخيص</Label>
                  <Input value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} placeholder="LIC-2024-001" className="mt-1" dir="ltr" />
                </div>
                <div>
                  <Label>الرقم الضريبي</Label>
                  <Input value={form.taxId} onChange={e => setForm({ ...form, taxId: e.target.value })} placeholder="TAX-001" className="mt-1" dir="ltr" />
                </div>
              </div>
              <div>
                <Label>تاريخ التأسيس</Label>
                <Input type="date" value={form.foundedDate} onChange={e => setForm({ ...form, foundedDate: e.target.value })} className="mt-1" dir="ltr" />
              </div>
              <Button 
                onClick={handleCreate} 
                disabled={createLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl"
              >
                {createLoading ? 'جارٍ الإنشاء...' : 'إنشاء الجمعية'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن جمعية..."
            className="pr-10 bg-background/50"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-44 bg-background/50">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Associations Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((assoc, i) => (
              <motion.div
                key={assoc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, rotateY: 2, transition: { duration: 0.2 } }}
                className="perspective-container"
              >
                <div className="preserve-3d card-3d glass-card rounded-2xl overflow-hidden cursor-pointer" onClick={() => { setSelectedAssoc(assoc); setShowDetail(true) }}>
                  {/* Card Header */}
                  <div className="h-32 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.3), transparent 70%)',
                    }} />
                    <div className="absolute bottom-3 right-4 flex items-center gap-2">
                      <span className="text-2xl">{categoryIcons[assoc.category] || '📌'}</span>
                      <Badge className={`${statusColors[assoc.status] || 'bg-muted'} text-xs`}>
                        {statusLabels[assoc.status] || assoc.status}
                      </Badge>
                    </div>
                    {/* Action buttons */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      {canEdit(assoc) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditDialog(assoc) }}
                          className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:text-blue-500 hover:bg-blue-500/20 transition-colors"
                          title="تعديل الجمعية"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete(assoc) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(assoc.id, assoc.name) }}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-red-500 hover:bg-red-500/20 transition-colors"
                          title="حذف الجمعية"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-lg mb-1 truncate">{assoc.name}</h3>
                    {assoc.nameEn && <p className="text-xs text-muted-foreground mb-2" dir="ltr">{assoc.nameEn}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{assoc.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {assoc.memberCount || assoc._count?.members || 0} عضو
                      </span>
                      {assoc.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {assoc.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد جمعيات</h3>
          <p className="text-muted-foreground mb-6">ابدأ بإنشاء جمعيتك الأولى</p>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl">
            <Plus className="w-4 h-4 ml-2" />
            إنشاء جمعية
          </Button>
        </motion.div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">تعديل الجمعية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>اسم الجمعية *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="جمعية الأمل الخيرية" className="mt-1" />
            </div>
            <div>
              <Label>الاسم بالإنجليزية</Label>
              <Input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} placeholder="Al Amal Charity" className="mt-1" dir="ltr" />
            </div>
            <div>
              <Label>الوصف *</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الجمعية..." className="mt-1" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>التصنيف *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المدينة</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="الرياض" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الهاتف</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966 5x xxx xxxx" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label>البريد</Label>
                <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@example.com" className="mt-1" dir="ltr" />
              </div>
            </div>
            <div>
              <Label>الموقع الإلكتروني</Label>
              <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" className="mt-1" dir="ltr" />
            </div>
            <div>
              <Label>العنوان</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="شارع الملك فهد، الرياض" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>رقم الترخيص</Label>
                <Input value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} placeholder="LIC-2024-001" className="mt-1" dir="ltr" />
              </div>
              <div>
                <Label>الرقم الضريبي</Label>
                <Input value={form.taxId} onChange={e => setForm({ ...form, taxId: e.target.value })} placeholder="TAX-001" className="mt-1" dir="ltr" />
              </div>
            </div>
            <div>
              <Label>تاريخ التأسيس</Label>
              <Input type="date" value={form.foundedDate} onChange={e => setForm({ ...form, foundedDate: e.target.value })} className="mt-1" dir="ltr" />
            </div>
            <div>
              <Label>الحالة</Label>
              <Select value={editingAssoc?.status || 'active'} onValueChange={v => setEditingAssoc({ ...editingAssoc, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="inactive">غير نشطة</SelectItem>
                  <SelectItem value="suspended">معلقة</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleEdit} 
              disabled={editLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl"
            >
              {editLoading ? 'جارٍ التحديث...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {selectedAssoc && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                  <span className="text-3xl">{categoryIcons[selectedAssoc.category] || '📌'}</span>
                  {selectedAssoc.name}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusColors[selectedAssoc.status] || 'bg-muted'}>
                    {statusLabels[selectedAssoc.status] || selectedAssoc.status}
                  </Badge>
                  <Badge variant="outline">{selectedAssoc.category}</Badge>
                  {selectedAssoc.city && <Badge variant="outline"><MapPin className="w-3 h-3 ml-1" />{selectedAssoc.city}</Badge>}
                </div>
                <p className="text-muted-foreground">{selectedAssoc.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {selectedAssoc.phone && (
                    <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-emerald-500" />{selectedAssoc.phone}</div>
                  )}
                  {selectedAssoc.email && (
                    <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-cyan-500" />{selectedAssoc.email}</div>
                  )}
                  {selectedAssoc.website && (
                    <div className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-teal-500" />{selectedAssoc.website}</div>
                  )}
                  {selectedAssoc.licenseNumber && (
                    <div className="flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-amber-500" />{selectedAssoc.licenseNumber}</div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card rounded-xl p-3 text-center">
                    <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{selectedAssoc.memberCount || selectedAssoc._count?.members || 0}</div>
                    <div className="text-xs text-muted-foreground">عضو</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{selectedAssoc._count?.events || 0}</div>
                    <div className="text-xs text-muted-foreground">فعالية</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <Building2 className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{selectedAssoc._count?.transactions || 0}</div>
                    <div className="text-xs text-muted-foreground">معاملة</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {canEdit(selectedAssoc) && (
                    <Button 
                      onClick={() => { setShowDetail(false); openEditDialog(selectedAssoc) }}
                      variant="outline"
                      className="flex-1 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 font-bold rounded-xl"
                    >
                      <Edit3 className="w-4 h-4 ml-2" />
                      تعديل الجمعية
                    </Button>
                  )}
                  {canDelete(selectedAssoc) && (
                    <Button 
                      onClick={() => handleDelete(selectedAssoc.id, selectedAssoc.name)}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف الجمعية
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
