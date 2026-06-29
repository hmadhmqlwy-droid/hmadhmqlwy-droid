import { create } from 'zustand'

type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'associations' | 'members' | 'events' | 'finance' | 'documents' | 'security' | 'settings' | 'admin'

type Lang = 'ar' | 'en'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  twoFactorEnabled: boolean
}

interface Association {
  id: string
  name: string
  description: string
  category: string
  status: string
  memberCount: number
  logo?: string
  city?: string
  foundedDate?: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

// Bilingual translations
export const translations = {
  ar: {
    // Nav
    dashboard: 'لوحة التحكم',
    associations: 'الجمعيات',
    members: 'الأعضاء',
    events: 'الفعاليات',
    finance: 'المالية',
    security: 'الأمان',
    admin: 'إدارة النظام',
    settings: 'الإعدادات',
    logout: 'خروج',
    // Landing
    heroTitle1: 'منصة تنظيم',
    heroTitle2: 'الجمعيات الذكية',
    heroDesc: 'أدِر جمعيتك بكفاءة واحترافية مع نظام متكامل يشمل إدارة الأعضاء والفعاليات والماليات مع حماية متقدمة من الدرجة الأولى',
    startFree: 'ابدأ مجاناً',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    demoLogin: 'دخول تجريبي',
    // Auth
    welcomeBack: 'مرحباً بعودتك',
    loginDesc: 'سجّل دخولك للوصول إلى لوحة التحكم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    secureLogin: 'تسجيل دخول آمن',
    noAccount: 'ليس لديك حساب؟',
    createAccount: 'إنشاء حساب جديد',
    createAccountDesc: 'أنشئ حسابك وابدأ بإدارة جمعيتك',
    fullName: 'الاسم الكامل',
    confirmPassword: 'تأكيد كلمة المرور',
    haveAccount: 'لديك حساب؟',
    // Dashboard
    welcome: 'مرحباً',
    dashboardSummary: 'إليك ملخص أداء جمعياتك اليوم',
    totalAssociations: 'إجمالي الجمعيات',
    totalMembers: 'إجمالي الأعضاء',
    eventsLabel: 'الفعاليات',
    netBalance: 'الرصيد الصافي',
    active: 'نشط',
    secure: 'آمن',
    monthlyAnalysis: 'التحليل المالي الشهري',
    distribution: 'توزيع الجمعيات',
    recentAssociations: 'أحدث الجمعيات',
    recentEvents: 'أحدث الفعاليات',
    noData: 'لا توجد بيانات بعد',
    noAssociations: 'لا توجد جمعيات بعد',
    noEvents: 'لا توجد فعاليات بعد',
    // Common
    search: 'ابحث...',
    create: 'إنشاء',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    filter: 'التصنيف',
    export: 'تصدير',
    exportCSV: 'تصدير CSV',
    exportJSON: 'تصدير JSON',
    all: 'الكل',
    activeLabel: 'نشط',
    inactive: 'غير نشط',
    pending: 'قيد المراجعة',
    // Security
    securityCenter: 'مركز الأمان',
    securityDesc: 'إدارة حماية حسابك ومراقبة الأنشطة',
    securityScore: 'درجة الأمان',
    twoFactor: 'التحقق الثنائي',
    strongPassword: 'كلمة مرور قوية',
    secureSession: 'جلسة آمنة',
    securityAlerts: 'تنبيهات الأمان',
    enabled: 'مفعّل',
    disabled: 'معطّل',
    activityLog: 'سجل الأنشطة الأمنية',
    encryption: 'تشفير البيانات',
    smartMonitoring: 'مراقبة ذكية',
    multiLayer: 'حماية متعددة الطبقات',
    // Admin
    systemAdmin: 'إدارة النظام',
    totalUsers: 'إجمالي المستخدمين',
    activeUsers: 'مستخدمين نشطين',
    adminUsers: 'مديرين',
    activeSessions: 'جلسات نشطة',
    manageUsers: 'إدارة المستخدمين',
    systemHealth: 'صحة النظام',
    // Footer
    copyright: '© 2026 جمعياتبرو - جميع الحقوق محفوظة',
  },
  en: {
    dashboard: 'Dashboard',
    associations: 'Associations',
    members: 'Members',
    events: 'Events',
    finance: 'Finance',
    security: 'Security',
    admin: 'System Admin',
    settings: 'Settings',
    logout: 'Logout',
    heroTitle1: 'Smart Association',
    heroTitle2: 'Management Platform',
    heroDesc: 'Manage your association efficiently and professionally with a comprehensive system including member management, events, and finances with advanced security',
    startFree: 'Start Free',
    login: 'Login',
    register: 'Register',
    demoLogin: 'Demo Login',
    welcomeBack: 'Welcome Back',
    loginDesc: 'Sign in to access your dashboard',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    secureLogin: 'Secure Login',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    createAccountDesc: 'Create your account and start managing',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    haveAccount: 'Already have an account?',
    welcome: 'Welcome',
    dashboardSummary: "Here's a summary of your associations today",
    totalAssociations: 'Total Associations',
    totalMembers: 'Total Members',
    eventsLabel: 'Events',
    netBalance: 'Net Balance',
    active: 'Active',
    secure: 'Secure',
    monthlyAnalysis: 'Monthly Financial Analysis',
    distribution: 'Association Distribution',
    recentAssociations: 'Recent Associations',
    recentEvents: 'Recent Events',
    noData: 'No data yet',
    noAssociations: 'No associations yet',
    noEvents: 'No events yet',
    search: 'Search...',
    create: 'Create',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    filter: 'Filter',
    export: 'Export',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    all: 'All',
    activeLabel: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    securityCenter: 'Security Center',
    securityDesc: 'Manage your account protection and monitor activities',
    securityScore: 'Security Score',
    twoFactor: 'Two-Factor Auth',
    strongPassword: 'Strong Password',
    secureSession: 'Secure Session',
    securityAlerts: 'Security Alerts',
    enabled: 'Enabled',
    disabled: 'Disabled',
    activityLog: 'Security Activity Log',
    encryption: 'Data Encryption',
    smartMonitoring: 'Smart Monitoring',
    multiLayer: 'Multi-Layer Protection',
    systemAdmin: 'System Admin',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    adminUsers: 'Admin Users',
    activeSessions: 'Active Sessions',
    manageUsers: 'Manage Users',
    systemHealth: 'System Health',
    copyright: '© 2026 JamaatPro - All Rights Reserved',
  }
}

interface AppState {
  // Auth
  currentPage: Page
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Association
  selectedAssociation: Association | null
  associations: Association[]

  // Notifications
  notifications: Notification[]
  unreadCount: number

  // UI
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  lang: Lang

  // Actions
  setCurrentPage: (page: Page) => void
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  setSelectedAssociation: (assoc: Association | null) => void
  setAssociations: (assocs: Association[]) => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setLoading: (loading: boolean) => void
  setLang: (lang: Lang) => void
  t: (key: string) => string
  setNotifications: (notifs: Notification[]) => void
  setUnreadCount: (count: number) => void
  addNotification: (notif: Notification) => void
  markAllRead: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'landing',
  user: null,
  isAuthenticated: false,
  isLoading: false,
  selectedAssociation: null,
  associations: [],
  notifications: [],
  unreadCount: 0,
  sidebarOpen: true,
  theme: 'dark',
  lang: 'ar',

  setCurrentPage: (page) => set({ currentPage: page }),
  setUser: (user) => set({ user }),
  login: (user) => set({ user, isAuthenticated: true, currentPage: 'dashboard' }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: 'landing', selectedAssociation: null, notifications: [], unreadCount: 0 }),
  setSelectedAssociation: (assoc) => set({ selectedAssociation: assoc }),
  setAssociations: (assocs) => set({ associations: assocs }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    return { theme: newTheme }
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLang: (lang) => set((state) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
    return { lang }
  }),
  t: (key: string) => {
    const state = get()
    const t = translations[state.lang] || translations.ar
    return (t as any)[key] || key
  },
  setNotifications: (notifs) => set({ notifications: notifs, unreadCount: notifs.filter(n => !n.read).length }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  addNotification: (notif) => set((state) => ({
    notifications: [notif, ...state.notifications],
    unreadCount: state.unreadCount + (notif.read ? 0 : 1),
  })),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}))
