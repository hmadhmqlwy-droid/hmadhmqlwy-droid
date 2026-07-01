'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Building2, Mail, Lock, User, Eye, EyeOff, Shield, ArrowLeft, Fingerprint, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function AuthPage() {
  const { setCurrentPage, login } = useAppStore()
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

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }
      login(data.user)
    } catch {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setError('')
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }
      // Auto login after register
      login(data.user)
    } catch {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  // Password strength calculation
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh-dark" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Animated background orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
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
            <span className="text-2xl font-black text-foreground">جمعيات<span className="text-emerald-500">برو</span></span>
          </div>
        </motion.div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
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
                    <button className="text-xs text-emerald-500 hover:underline">نسيت كلمة المرور؟</button>
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

                  {/* Security notice */}
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <span className="text-emerald-500 font-bold">اتصال آمن ومشفر</span>
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
                        placeholder="8 أحرف على الأقل (أحرف كبيرة وصغيرة وأرقام ورموز)"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pr-10 pl-10 bg-background/50 border-border/50 focus:border-emerald-500"
                        dir="ltr"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength indicator */}
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

                  <p className="text-center text-sm text-muted-foreground">
                    لديك حساب؟{' '}
                    <button onClick={() => { setMode('login'); setError('') }} className="text-emerald-500 font-bold hover:underline">
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
  )
}
