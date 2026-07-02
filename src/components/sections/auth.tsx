'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/app-store'
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight,
  AlertCircle, Loader2, Check, Building2, Shield, Sparkles, X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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

// Step types for the auth flow
type AuthStep = 'email' | 'password' | 'register-name' | 'register-email' | 'register-password'

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

// ============================================
// Google Sign-In Modal Component
// ============================================
function GoogleSignInModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any, token: string) => void 
}) {
  const [googleEmail, setGoogleEmail] = useState('')
  const [googlePassword, setGooglePassword] = useState('')
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleEmailNext = () => {
    if (!googleEmail.trim()) {
      setError('أدخل بريدك الإلكتروني')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(googleEmail)) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    setError('')
    setStep('password')
  }

  const handleGoogleSignIn = async () => {
    if (!googlePassword) {
      setError('أدخل كلمة المرور')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Send to our Google auth endpoint with email/password
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: googleEmail,
          name: googleEmail.split('@')[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول')
        return
      }

      onSuccess(data.user, data.token)
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setGoogleEmail('')
      setGooglePassword('')
      setStep('email')
      setError('')
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Google Header */}
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 75 24" width="75" height="24" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path fill="#4285F4" d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"/>
                <path fill="#EA4335" d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                <path fill="#FBBC05" d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.02-1.37 3.5-3.1 3.5z"/>
                <path fill="#4285F4" d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
                <path fill="#34A853" d="M58 .24h2.51v17.57H58z"/>
                <path fill="#EA4335" d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"/>
              </g>
            </svg>
          </div>
          <h2 className="text-xl font-normal text-gray-800 mb-1">
            {step === 'email' ? 'تسجيل الدخول' : 'مرحباً!'}
          </h2>
          <p className="text-sm text-gray-500">
            {step === 'email' ? 'استخدم حساب Google الخاص بك' : googleEmail}
          </p>
          {step === 'password' && (
            <button 
              onClick={() => { setStep('email'); setError('') }}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              تغيير الحساب
            </button>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-8 mb-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="px-8 pb-6">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div key="g-email" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
                <div className="relative mb-4">
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={googleEmail}
                    onChange={(e) => { setGoogleEmail(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-base text-left"
                    dir="ltr"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    هل نسيت البريد الإلكتروني؟
                  </button>
                  <button
                    onClick={handleEmailNext}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    التالي
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="g-password" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="relative mb-4">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={googlePassword}
                    onChange={(e) => { setGooglePassword(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleGoogleSignIn()}
                    className="w-full h-12 px-4 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-base text-left"
                    dir="ltr"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    هل نسيت كلمة المرور؟
                  </button>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loading ? 'جاري الدخول...' : 'التالي'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>للمساعدة في استرداد الحساب، جرّب النصائح</span>
            <div className="flex items-center gap-3">
              <select className="text-xs border-0 bg-transparent text-gray-400 outline-none cursor-pointer" defaultValue="ar">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
              <button onClick={onClose} className="hover:text-gray-600">إغلاق</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function AuthPage() {
  const { setCurrentPage, login, showToast } = useAppStore()
  const [step, setStep] = useState<AuthStep>('email')
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [password])

  const goToStep = (newStep: AuthStep) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
    setError('')
  }

  const handleGoogleLogin = useCallback(() => {
    setGoogleModalOpen(true)
  }, [])

  const handleGoogleSuccess = useCallback((user: any, token: string) => {
    setGoogleModalOpen(false)
    login(user, token)
    showToast('تم تسجيل الدخول عبر Google بنجاح', 'success')
  }, [login, showToast])

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      setError('أدخل البريد الإلكتروني')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    goToStep('password')
  }

  const handleLogin = async () => {
    if (!password) {
      setError('أدخل كلمة المرور')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'بيانات الدخول غير صحيحة')
        return
      }
      
      login(data.user, data.token)
      showToast('تم تسجيل الدخول بنجاح', 'success')
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('أدخل اسمك الكامل')
      return
    }
    if (name.trim().length < 2) {
      setError('الاسم يجب أن يكون حرفين على الأقل')
      return
    }
    if (!email.trim()) {
      setError('أدخل البريد الإلكتروني')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    if (!password) {
      setError('أدخل كلمة المرور')
      return
    }
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }
    if (passwordStrength < 2) {
      setError('كلمة المرور ضعيفة. أضف أحرف كبيرة وأرقام ورموز')
      return
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'فشل في إنشاء الحساب')
        return
      }
      
      login(data.user, data.token)
      showToast('تم إنشاء الحساب بنجاح', 'success')
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') action()
  }

  const getStepInfo = () => {
    switch (step) {
      case 'email':
        return { title: 'تسجيل الدخول', subtitle: 'استخدم حسابك في جمعياتبرو' }
      case 'password':
        return { title: 'مرحباً!', subtitle: email }
      case 'register-name':
        return { title: 'إنشاء حساب', subtitle: 'أدخل اسمك للبدء' }
      case 'register-email':
        return { title: 'إنشاء حساب', subtitle: 'أدخل بريدك الإلكتروني' }
      case 'register-password':
        return { title: 'إنشاء حساب', subtitle: 'اختر كلمة مرور قوية' }
    }
  }

  const stepInfo = getStepInfo()

  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500']
  const strengthLabels = ['', 'ضعيفة جداً', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4" dir="rtl">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Google Sign-In Modal */}
      <GoogleSignInModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 shadow-lg shadow-blue-200 mb-3">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">جمعياتبرو</h2>
        </motion.div>

        {/* Auth Card */}
        <motion.div layout className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{stepInfo.title}</h1>
                <p className="text-sm text-gray-500 mb-1">{stepInfo.subtitle}</p>
                
                {step === 'password' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{email}</p>
                      <button onClick={() => goToStep('email')} className="text-xs text-blue-600 hover:text-blue-700 hover:underline">
                        تغيير الحساب
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Body */}
          <div className="px-8 py-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step: Email Input */}
                {step === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, handleEmailSubmit)}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          dir="ltr"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                    >
                      <GoogleIcon />
                      تسجيل الدخول بحساب Google
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-gray-400">أو</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleEmailSubmit}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      ليس لديك حساب؟{' '}
                      <button onClick={() => goToStep('register-name')} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                        إنشاء حساب
                      </button>
                    </p>
                  </div>
                )}

                {/* Step: Password Input */}
                {step === 'password' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="أدخل كلمة المرور"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                          className="pr-10 pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          autoFocus
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-600">تذكرني</span>
                      </label>
                      <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline">نسيت كلمة المرور؟</button>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>تسجيل الدخول <ArrowLeft className="w-4 h-4 mr-2" /></>}
                    </Button>
                  </div>
                )}

                {/* Step: Register - Name */}
                {step === 'register-name' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, () => { if (name.trim().length >= 2) goToStep('register-email') })}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                    >
                      <GoogleIcon />
                      التسجيل بحساب Google
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                      <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">أو</span></div>
                    </div>

                    <Button
                      onClick={() => { if (name.trim().length >= 2) goToStep('register-email'); else setError('الاسم يجب أن يكون حرفين على الأقل') }}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                      size="lg"
                    >
                      التالي <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      لديك حساب؟{' '}
                      <button onClick={() => goToStep('email')} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">تسجيل الدخول</button>
                    </p>
                  </div>
                )}

                {/* Step: Register - Email */}
                {step === 'register-email' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email" placeholder="example@email.com" value={email}
                          onChange={(e) => { setEmail(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, () => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) goToStep('register-password') })}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          dir="ltr" autoFocus
                        />
                      </div>
                    </div>
                    <Button onClick={() => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) goToStep('register-password'); else setError('صيغة البريد الإلكتروني غير صحيحة') }} className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700" size="lg">
                      التالي <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                    <button onClick={() => goToStep('register-name')} className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">
                      <ArrowRight className="w-4 h-4 inline ml-1" /> رجوع
                    </button>
                  </div>
                )}

                {/* Step: Register - Password */}
                {step === 'register-password' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'} placeholder="8 أحرف على الأقل" value={password}
                          onChange={(e) => { setPassword(e.target.value); setError('') }}
                          className="pr-10 pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          autoFocus
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div key={level} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'}`} />
                            ))}
                          </div>
                          <p className={`text-xs ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength <= 2 ? 'text-orange-500' : passwordStrength <= 3 ? 'text-yellow-600' : passwordStrength <= 4 ? 'text-lime-600' : 'text-green-600'}`}>
                            {strengthLabels[passwordStrength]}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">تأكيد كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'} placeholder="أعد إدخال كلمة المرور" value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, handleRegister)}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                        />
                        {confirmPassword && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            {password === confirmPassword ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button onClick={handleRegister} disabled={loading} className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700" size="lg">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
                    </Button>
                    <button onClick={() => goToStep('register-email')} className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">
                      <ArrowRight className="w-4 h-4 inline ml-1" /> رجوع
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Footer */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              <span>اتصال آمن ومشفّر</span>
              <span>•</span>
              <Sparkles className="w-3.5 h-3.5" />
              <span>جمعياتبرو</span>
            </div>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-6">
          <button onClick={() => setCurrentPage('landing')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowRight className="w-4 h-4 inline ml-1" /> العودة إلى الصفحة الرئيسية
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
