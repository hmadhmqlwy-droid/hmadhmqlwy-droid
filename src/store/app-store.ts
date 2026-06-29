import { create } from 'zustand'

type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'associations' | 'members' | 'events' | 'finance' | 'documents' | 'security' | 'settings'

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

interface AppState {
  // Auth
  currentPage: Page
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Association
  selectedAssociation: Association | null
  associations: Association[]

  // UI
  sidebarOpen: boolean
  theme: 'light' | 'dark'

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
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'landing',
  user: null,
  isAuthenticated: false,
  isLoading: false,
  selectedAssociation: null,
  associations: [],
  sidebarOpen: true,
  theme: 'dark',

  setCurrentPage: (page) => set({ currentPage: page }),
  setUser: (user) => set({ user }),
  login: (user) => set({ user, isAuthenticated: true, currentPage: 'dashboard' }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: 'landing', selectedAssociation: null }),
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
}))
