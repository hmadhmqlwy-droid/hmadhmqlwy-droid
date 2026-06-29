'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { LandingPage } from '@/components/sections/landing'
import { AuthPage } from '@/components/sections/auth'
import { DashboardPage } from '@/components/sections/dashboard'
import { AssociationsPage } from '@/components/sections/associations'
import { MembersPage } from '@/components/sections/members'
import { EventsPage } from '@/components/sections/events'
import { FinancePage } from '@/components/sections/finance'
import { SecurityPage } from '@/components/sections/security'
import {
  Building2, LayoutDashboard, Users, Calendar, DollarSign, Shield, LogOut, Menu, X,
  Moon, Sun, ChevronLeft, Settings, HelpCircle, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

const navItems = [
  { id: 'dashboard' as const, label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'associations' as const, label: 'الجمعيات', icon: Building2 },
  { id: 'members' as const, label: 'الأعضاء', icon: Users },
  { id: 'events' as const, label: 'الفعاليات', icon: Calendar },
  { id: 'finance' as const, label: 'المالية', icon: DollarSign },
  { id: 'security' as const, label: 'الأمان', icon: Shield },
]

function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, user, logout, theme, toggleTheme } = useAppStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed right-0 top-0 bottom-0 z-40 glass-dark border-l border-border/30 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/20">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-foreground">جمعيات<span className="text-emerald-500">برو</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        {!sidebarOpen && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto">
            <Building2 className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
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
                  <motion.div
                    layoutId="activeNav"
                    className="absolute right-0 w-1 h-8 bg-emerald-500 rounded-l-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border/20 space-y-2">
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-2 rounded-xl bg-background/30"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">{user?.name || 'المستخدم'}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</div>
            </div>
          </motion.div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-xs"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'فاتح' : 'داكن'}</span>}
          </button>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-colors text-xs"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

function TopBar() {
  const { currentPage, sidebarOpen, setSidebarOpen } = useAppStore()
  
  const pageLabels: Record<string, string> = {
    dashboard: 'لوحة التحكم',
    associations: 'إدارة الجمعيات',
    members: 'إدارة الأعضاء',
    events: 'إدارة الفعاليات',
    finance: 'الإدارة المالية',
    security: 'مركز الأمان',
  }

  return (
    <header className="sticky top-0 z-30 h-16 glass-dark border-b border-border/20 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-foreground">{pageLabels[currentPage] || ''}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}

export default function Home() {
  const { currentPage, isAuthenticated, theme } = useAppStore()

  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Auth pages
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
      default: return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <div className="transition-all duration-300" style={{ marginRight: isAuthenticated ? (useAppStore.getState().sidebarOpen ? 260 : 72) : 0 }}>
        <TopBar />
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
