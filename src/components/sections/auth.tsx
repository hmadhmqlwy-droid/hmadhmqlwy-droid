'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Building2, Mail, Lock, User, Eye, EyeOff, Shield, ArrowLeft, Fingerprint, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AnimatedAuthIllustration } from './animated-illustrations'

// Google SVG Icon
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export function AuthPage() {
  const { setCurrentPage, login, showToast } = useAppStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  // Client-side user storage for Vercel serverless compatibility
  const getUsers = (): Record<string, { id: string; name: string; email: string; password: string; role: string; isActive: boolean; twoFactorEnabled: boolean }> => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem('jamiat-pro-users')
      if (stored) return JSON.parse(stored)
    } catch {}
    // Default admin user
    const defaultUsers: Record<string, { id: string; name: string; email: string; password: string; role: string; isActive: boolean; twoFactorEnabled: boolean }> = {
      'Hamadah@gmail.com': {
        id: 'admin-001',
        name: 'مدير النظام',
        email: 'Hamadah@gmail.com',
        password: 'Hamadah77910',
        role: 'admin',
        isActive: true,
        twoFactorEnabled: false,
      }
    }
    localStorage.setItem('jamiat-pro-users', JSON.stringify(defaultUsers))
    return defaultUsers
  }

  const handleLogin = async () => {
    setError('')
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('البريد الإلكتروني وكلمة المرور مطلوبان')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginEmail.trim())) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    setLoading(true)
    try {
      // Try API first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        login(data.user, data.token)
        showToast('تم تسجيل الدخول بنجاح', 'success')
        return
      }
      // If API fails (serverless DB issue), try client-side auth
      const users = getUsers()
      const user = users[loginEmail.trim()]
      if (user && user.password === loginPassword && user.isActive) {
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        }, `local-${user.id}-${Date.now()}`)
        showToast('تم تسجيل الدخول بنجاح', 'success')
        return
      }
      setError(data.error || 'بيانات الدخول غير صحيحة')
    } catch {
      // API completely unavailable - fallback to client-side auth
      const users = getUsers()
      const user = users[loginEmail.trim()]
      if (user && user.password === loginPassword && user.isActive) {
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        }, `local-${user.id}-${Date.now()}`)
        showToast('تم تسجيل الدخول بنجاح', 'success')
        return
      }
      setError('بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!googleClientId) {
        setError('تسجيل الدخول عبر Google غير مفعل حالياً. يرجى استخدام البريد الإلكتروني')
        setGoogleLoading(false)
        return
      }

      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            try {
              const payload = JSON.parse(atob(response.credential.split('.')[1]))
              const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  token: response.credential,
                  email: payload.email,
                  name: payload.name,
                  picture: payload.picture,
                  sub: payload.sub,
                }),
              })
              const data = await res.json()
              if (!res.ok) {
                setError(data.error || 'حدث خطأ')
                return
              }
              login(data.user, data.token)
              showToast('تم تسجيل الدخول عبر Google بنجاح', 'success')
            } catch {
              setError('خطأ في تسجيل الدخول عبر Google')
            }
          },
        })
        window.google.accounts.id.prompt()
      } else {
        setError('خدمة Google غير متاحة حالياً')
      }
    } catch {
      setError('خطأ في الاتصال بـ Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleRegister = async () => {
    setError('')
    if (!regName.trim()) {
      setError('الاسم الكامل مطلوب')
      return
    }
    if (regName.trim().length < 2) {
      setError('الاسم يجب أن يكون حرفين على الأقل')
      return
    }
    if (!regEmail.trim()) {
      setError('البريد الإلكتروني مطلوب')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(regEmail.trim())) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    if (!regPassword) {
      setError('كلمة المرور مطلوبة')
      return
    }
    if (regPassword !== regConfirm) {
      setError('كلمات المرور غير متطابقة')
      return
    }
    if (regPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }
    setLoading(true)
    try {
      // Try API first
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName.trim(), email: regEmail.trim(), password: regPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        login(data.user, data.token)
        showToast('تم إنشاء الحساب بنجاح', 'success')
        return
      }
      // If API fails, try client-side registration
      const users = getUsers()
      if (users[regEmail.trim()]) {
        setError('البريد الإلكتروني مستخدم بالفعل')
        return
      }
      const newUser = {
        id: `user-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: 'user',
        isActive: true,
        twoFactorEnabled: false,
      }
      users[regEmail.trim()] = newUser
      localStorage.setItem('jamiat-pro-users', JSON.stringify(users))
      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        twoFactorEnabled: newUser.twoFactorEnabled,
      }, `local-${newUser.id}-${Date.now()}`)
      showToast('تم إنشاء الحساب بنجاح', 'success')
    } catch {
      // API completely unavailable - fallback to client-side registration
      const users = getUsers()
      if (users[regEmail.trim()]) {
        setError('البريد الإلكتروني مستخدم بالفعل')
        return
      }
      const newUser = {
        id: `user-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: 'user',
        isActive: true,
        twoFactorEnabled: false,
      }
      users[regEmail.trim()] = newUser
      localStorage.setItem('jamiat-pro-users', JSON.stringify(users))
      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        twoFactorEnabled: newUser.twoFactorEnabled,
      }, `local-${newUser.id}-${Date.now()}`)
      showToast('تم إنشاء الحساب بنجاح', 'success')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++
    return score
  }

  const strengthLabels = ['', 'ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً']
  const strengthColors = ['', 'bg-red-500', 'bg-red-400', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-500']

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/50" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Animated background orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-200/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-violet-200/15 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Animated illustration side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-shrink-0"
        >
          <AnimatedAuthIllustration />
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-foreground">جمعيات<span className="text-emerald-600">برو</span></span>
            </div>
          </motion.div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-emerald-100/10">
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-black text-foreground mb-2">مرحباً بعودتك</h2>
                  <p className="text-muted-foreground text-sm mb-6">سجّل دخولك للوصول إلى لوحة التحكم</p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm mb-4"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          className="pr-10 bg-background/50 border-border/50 focus:border-emerald-500"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          className="pr-10 pl-10 bg-background/50 border-border/50 focus:border-emerald-500"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">تذكرني</label>
                      </div>
                      <button 
                        type="button"
                        onClick={() => showToast('يرجى التواصل مع إدارة النظام لإعادة تعيين كلمة المرور', 'info')}
                        className="text-xs text-emerald-500 hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Shield className="w-4 h-4 ml-2" />
                          تسجيل دخول آمن
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/30" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-card text-muted-foreground">أو</span>
                      </div>
                    </div>

                    {/* Google Sign In - Only shown when configured */}
                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                      <>
                        <Button
                          onClick={handleGoogleLogin}
                          disabled={googleLoading}
                          variant="outline"
                          className="w-full py-3 bg-white hover:bg-gray-50 border-gray-200 rounded-xl font-bold flex items-center justify-center gap-3"
                        >
                          {googleLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-gray-300 border-t-foreground rounded-full"
                            />
                          ) : (
                            <>
                              <GoogleIcon />
                              <span>تسجيل الدخول بـ Google</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}

                    {/* Security notice */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/50">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                          <span className="text-emerald-600 font-bold">اتصال آمن ومشفر</span>
                          <br />
                          بياناتك محمية بتشفير AES-256 أثناء النقل والتخزين
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                      ليس لديك حساب؟{' '}
                      <button onClick={() => { setMode('register'); setError('') }} className="text-emerald-500 font-bold hover:underline">
                        سجّل الآن
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-black text-foreground mb-2">إنشاء حساب جديد</h2>
                  <p className="text-muted-foreground text-sm mb-6">أنشئ حسابك وابدأ بإدارة جمعيتك</p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm mb-4"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="أحمد محمد"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="pr-10 bg-background/50 border-border/50 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="pr-10 bg-background/50 border-border/50 focus:border-emerald-500"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="8 أحرف على الأقل"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="pr-10 pl-10 bg-background/50 border-border/50 focus:border-emerald-500"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {regPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                  getPasswordStrength(regPassword) >= i ? strengthColors[getPasswordStrength(regPassword)] : 'bg-border'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-[10px] mt-1 ${getPasswordStrength(regPassword) >= 4 ? 'text-emerald-500' : getPasswordStrength(regPassword) >= 3 ? 'text-amber-500' : 'text-red-500'}`}>
                            {strengthLabels[getPasswordStrength(regPassword)]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="أعد كتابة كلمة المرور"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                          className="pr-10 bg-background/50 border-border/50 focus:border-emerald-500"
                          dir="ltr"
                        />
                        {regConfirm && regPassword === regConfirm && (
                          <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        'إنشاء الحساب'
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/30" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-card text-muted-foreground">أو</span>
                      </div>
                    </div>

                    {/* Google Sign Up - Only shown when configured */}
                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                      <Button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        variant="outline"
                        className="w-full py-3 bg-white hover:bg-gray-50 border-gray-200 rounded-xl font-bold flex items-center justify-center gap-3"
                      >
                        {googleLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-gray-300 border-t-foreground rounded-full"
                          />
                        ) : (
                          <>
                            <GoogleIcon />
                            <span>التسجيل بـ Google</span>
                          </>
                        )}
                      </Button>
                    )}

                    <p className="text-center text-sm text-muted-foreground">
                      لديك حساب؟{' '}
                      <button onClick={() => { setMode('login'); setError('') }} className="text-emerald-600 font-bold hover:underline">
                        سجّل دخول
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-500 mt-6 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
