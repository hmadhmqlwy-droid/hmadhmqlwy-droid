'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, translations } from '@/store/app-store'
import { LandingPage } from '@/components/sections/landing'
import { AuthPage } from '@/components/sections/auth'
import { DashboardPage } from '@/components/sections/dashboard'
import { AssociationsPage } from '@/components/sections/associations'
import { MembersPage } from '@/components/sections/members'
import { EventsPage } from '@/components/sections/events'
import { FinancePage } from '@/components/sections/finance'
import { SecurityPage } from '@/components/sections/security'
import { AdminPage } from '@/components/sections/admin'
import {
  Building2, LayoutDashboard, Users, Calendar, DollarSign, Shield, LogOut, Menu, X,
  Moon, Sun, ChevronLeft, Settings, Bell, Crown, Globe, Download, Check, XCircle, Info, AlertTriangle,
  Mail, Phone, Facebook, Twitter, Instagram, Youtube, MessageCircle, Sparkles, Search, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState, useCallback } from 'react'

// ============================================
// TOP INFO BAR (Like Gama Systems)
// ============================================
function TopInfoBar() {
  const [isVisible, setIsVisible] = useState(true)
  
  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs relative z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
        {/* Right side - Social icons */}
        <div className="flex items-center gap-3">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-emerald-400 transition-colors">
            <Twitter className="w-3.5 h-3.5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-emerald-400 transition-colors">
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-emerald-400 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-emerald-400 transition-colors">
            <Youtube className="w-3.5 h-3.5" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-emerald-400 transition-colors">
            <Facebook className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Center - Promo text */}
        <div className="hidden md:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-400 font-bold">سجّل الآن واحصل على خصم 20% على جميع الخدمات</span>
        </div>

        {/* Left side - Contact info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <Phone className="w-3.5 h-3.5" />
            <span dir="ltr">+966 50 000 0000</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <Mail className="w-3.5 h-3.5" />
            <span>info@jamiat-pro.com</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/40 hover:text-white transition-colors p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN NAVBAR (Below top info bar)
// ============================================
function MainNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, setCurrentPage, logout } = useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-[#0f1d2e]/95 backdrop-blur-xl border-b border-border/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Right - Logo + Menu */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-foreground hidden sm:block">جمعيات<span className="text-emerald-500">برو</span></span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المنصة..."
              className="pr-10 pl-4 h-9 bg-white/5 border-border/30 rounded-xl text-sm focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Left - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <NotificationPanel />

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0) || 'م'}
              </div>
              <span className="hidden sm:block text-sm font-bold text-foreground max-w-[120px] truncate">{user?.name || 'المستخدم'}</span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-64 glass-dark rounded-xl border border-border/30 shadow-xl overflow-hidden z-50"
                  dir="rtl"
                >
                  {/* User info */}
                  <div className="p-4 border-b border-border/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'م'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{user?.name || 'المستخدم'}</div>
                        <div className="text-xs text-muted-foreground truncate">{user?.email || ''}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge className={`${user?.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : user?.role === 'manager' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'} text-[10px]`}>
                        {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'manager' ? 'مشرف' : 'مستخدم'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={() => { setCurrentPage('security'); setProfileOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      مركز الأمان
                    </button>
                    <button
                      onClick={() => { logout(); setProfileOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 pb-3 border-t border-border/10"
          >
            <div className="relative mt-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المنصة..."
                className="pr-10 pl-4 h-9 bg-white/5 border-border/30 rounded-xl text-sm focus:border-emerald-500/50"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ============================================
// TOAST COMPONENT
// ============================================
function Toast() {
  const { toast, clearToast } = useAppStore()
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, clearToast])

  if (!toast) return null

  const colors = {
    success: 'bg-emerald-500 border-emerald-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-cyan-500 border-cyan-600',
  }
  const icons = {
    success: Check,
    error: XCircle,
    info: Info,
  }
  const Icon = icons[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      className="fixed top-4 left-1/2 z-[100] max-w-md w-full"
    >
      <div className={`mx-4 px-4 py-3 rounded-xl border ${colors[toast.type]} text-white shadow-lg flex items-center gap-3`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={clearToast} className="text-white/70 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// ============================================
// NOTIFICATION PANEL
// ============================================
function NotificationPanel() {
  const { notifications, unreadCount, markAllRead } = useAppStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const notifIcons: Record<string, any> = {
    info: Info,
    warning: AlertTriangle,
    success: Check,
    error: XCircle,
  }

  const notifColors: Record<string, string> = {
    info: 'text-cyan-500 bg-cyan-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    success: 'text-emerald-500 bg-emerald-500/10',
    error: 'text-red-500 bg-red-500/10',
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead() }}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-80 glass-dark rounded-xl border border-border/30 shadow-xl overflow-hidden z-50"
            dir="rtl"
          >
            <div className="p-3 border-b border-border/20 flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">الإشعارات</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500/10 text-red-500 text-[10px]">{unreadCount} جديد</Badge>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? notifications.map((n) => {
                const Icon = notifIcons[n.type] || Info
                return (
                  <div key={n.id} className={`p-3 border-b border-border/10 hover:bg-white/5 transition-colors ${!n.read ? 'bg-emerald-500/5' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${notifColors[n.type] || notifColors.info}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground">{n.title}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-2">{n.message}</div>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">لا توجد إشعارات</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// SIDEBAR (Fixed on right, no hover weirdness)
// ============================================
function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, user, logout, theme, toggleTheme, lang, setLang, t } = useAppStore()

  const navItems = [
    { id: 'dashboard' as const, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'associations' as const, label: t('associations'), icon: Building2 },
    { id: 'members' as const, label: t('members'), icon: Users },
    { id: 'events' as const, label: t('events'), icon: Calendar },
    { id: 'finance' as const, label: t('finance'), icon: DollarSign },
    { id: 'security' as const, label: t('security'), icon: Shield },
    ...(user?.role === 'admin' ? [{ id: 'admin' as const, label: t('admin'), icon: Crown }] : []),
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 260 : 72,
          x: 0
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed right-0 top-0 bottom-0 z-50 bg-[#0a1628]/98 backdrop-blur-xl border-l border-border/20 flex flex-col ${
          !sidebarOpen ? 'lg:translate-x-0' : ''
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-border/20">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-foreground">جمعيات<span className="text-emerald-500">برو</span></span>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarOpen && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium relative ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-500 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-500' : ''}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && sidebarOpen && (
                    <div className="absolute right-0 w-1 h-8 bg-emerald-500 rounded-l-full" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom - User section */}
        <div className="p-3 border-t border-border/20 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {user?.name?.charAt(0) || 'م'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{user?.name || 'المستخدم'}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-xs"
              title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {sidebarOpen && <span>{theme === 'dark' ? 'فاتح' : 'داكن'}</span>}
            </button>
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-xs"
              title={lang === 'ar' ? 'English' : 'عربي'}
            >
              <Globe className="w-4 h-4" />
              {sidebarOpen && <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>}
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-colors text-xs"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span>خروج</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// ============================================
// MAIN HOME COMPONENT
// ============================================
export default function Home() {
  const { currentPage, isAuthenticated, theme, sidebarOpen, setSidebarOpen } = useAppStore()

  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  }, [])

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('session_token='))
      if (token && !isAuthenticated) {
        try {
          const res = await fetch('/api/auth/me')
          if (res.ok) {
            const data = await res.json()
            if (data.user) {
              useAppStore.getState().login(data.user, token.split('=')[1])
            }
          } else {
            document.cookie = 'session_token=; path=/; max-age=0'
          }
        } catch {
          // Ignore errors
        }
      }
    }
    validateSession()
  }, [isAuthenticated])

  // Fetch notifications periodically
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          useAppStore.getState().setNotifications(data.notifications)
        }
      } catch {}
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Auth pages - no dashboard layout
  if (!isAuthenticated) {
    if (currentPage === 'register' || currentPage === 'login') {
      return <AuthPage />
    }
    return <LandingPage />
  }

  // Dashboard pages
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'associations': return <AssociationsPage />
      case 'members': return <MembersPage />
      case 'events': return <EventsPage />
      case 'finance': return <FinancePage />
      case 'security': return <SecurityPage />
      case 'admin': return <AdminPage />
      default: return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Toast />
      
      {/* Top Info Bar (like Gama Systems) */}
      <TopInfoBar />
      
      {/* Main Navbar */}
      <MainNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="transition-all duration-300" style={{ marginRight: sidebarOpen ? 260 : 72 }}>
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
