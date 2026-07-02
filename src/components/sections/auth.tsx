'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/app-store'
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight,
  AlertCircle, Loader2, Check, Building2, Shield, Sparkles
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

export function AuthPage() {
  const { setCurrentPage, login, showToast } = useAppStore()
  const [step, setStep] = useState<AuthStep>('email')
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const googleScriptLoaded = useRef(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Load Google Identity Services script
  useEffect(() => {
    if (googleScriptLoaded.current) return
    googleScriptLoaded.current = true

    // Check if GIS script already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => initializeGoogle()
    document.head.appendChild(script)
  }, [])

  const initializeGoogle = useCallback(() => {
    // We'll initialize when user clicks the button instead
    // This avoids errors when no client ID is configured
  }, [])

  const handleGoogleLogin = useCallback(async () => {
    setGoogleLoading(true)
    setError('')

    try {
      // Check if Google GIS is available
      if (window.google?.accounts?.id) {
        // Use Google Identity Services
        window.google.accounts.id.initialize({
          client_id: '', // Will be set from env
          callback: async (response: { credential: string }) => {
            try {
              const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
              })
              
              const data = await res.json()
              
              if (!res.ok) {
                setError(data.error || 'فشل تسجيل الدخول عبر Google')
                setGoogleLoading(false)
                return
              }
              
              login(data.user, data.token)
              showToast('تم تسجيل الدخول عبر Google بنجاح', 'success')
            } catch (err) {
              setError('حدث خطأ في الاتصال بالخادم')
            } finally {
              setGoogleLoading(false)
            }
          },
        })
        window.google.accounts.id.prompt()
      } else {
        // Fallback: Open Google OAuth popup manually
        await handleGooglePopupFallback()
      }
    } catch (err) {
      setError('فشل في فتح نافذة Google')
      setGoogleLoading(false)
    }
  }, [login, showToast])

  // Fallback Google OAuth using popup
  const handleGooglePopupFallback = useCallback(async () => {
    try {
      // Use Google's OAuth2 endpoint for implicit flow
      const clientId = '' // Client ID would go here
      
      if (!clientId) {
        // No Google Client ID configured - show helpful message
        setError('تسجيل الدخول عبر Google يحتاج إلى إعداد Google Client ID من لوحة تحكم Google Cloud Console. يمكنك استخدام تسجيل الدخول بالبريد الإلكتروني وكلمة المرور حالياً.')
        setGoogleLoading(false)
        return
      }

      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const scope = 'openid email profile'
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`
      
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600')
      
      if (!popup) {
        setError('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.')
        setGoogleLoading(false)
        return
      }

      // Listen for the popup to send back the token
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'google-auth-success') {
          window.removeEventListener('message', messageHandler)
          popup.close()
          
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              token: event.data.token,
              email: event.data.email,
              name: event.data.name,
              picture: event.data.picture,
              sub: event.data.sub,
            }),
          })
          
          const data = await res.json()
          
          if (!res.ok) {
            setError(data.error || 'فشل تسجيل الدخول عبر Google')
            return
          }
          
          login(data.user, data.token)
          showToast('تم تسجيل الدخول عبر Google بنجاح', 'success')
        } else if (event.data.type === 'google-auth-error') {
          window.removeEventListener('message', messageHandler)
          popup.close()
          setError('فشل تسجيل الدخول عبر Google')
        }
        
        setGoogleLoading(false)
      }
      
      window.addEventListener('message', messageHandler)
    } catch (err) {
      setError('حدث خطأ في الاتصال بـ Google')
      setGoogleLoading(false)
    }
  }, [login, showToast])

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

  // Get the current step title and subtitle
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

  // Password strength colors
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
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {stepInfo.title}
                </h1>
                <p className="text-sm text-gray-500 mb-1">
                  {stepInfo.subtitle}
                </p>
                
                {/* Show user avatar on password step (like Google) */}
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
                      <button 
                        onClick={() => goToStep('email')}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
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

                    {/* Google Sign In */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      ) : (
                        <GoogleIcon />
                      )}
                      {googleLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بحساب Google'}
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
                      <button 
                        onClick={() => goToStep('register-name')}
                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                      >
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
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-600">تذكرني</span>
                      </label>
                      <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                        نسيت كلمة المرور؟
                      </button>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          تسجيل الدخول
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </>
                      )}
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
                          onKeyDown={(e) => handleKeyDown(e, () => {
                            if (name.trim().length >= 2) goToStep('register-email')
                            else setError('الاسم يجب أن يكون حرفين على الأقل')
                          })}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Google Sign Up */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      ) : (
                        <GoogleIcon />
                      )}
                      {googleLoading ? 'جاري الاتصال بـ Google...' : 'التسجيل بحساب Google'}
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
                      onClick={() => {
                        if (name.trim().length >= 2) goToStep('register-email')
                        else setError('الاسم يجب أن يكون حرفين على الأقل')
                      }}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      لديك حساب؟{' '}
                      <button 
                        onClick={() => goToStep('email')}
                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                      >
                        تسجيل الدخول
                      </button>
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
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, () => {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            if (emailRegex.test(email)) goToStep('register-password')
                            else setError('صيغة البريد الإلكتروني غير صحيحة')
                          })}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          dir="ltr"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (emailRegex.test(email)) goToStep('register-password')
                        else setError('صيغة البريد الإلكتروني غير صحيحة')
                      }}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>

                    <button
                      onClick={() => goToStep('register-name')}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                    >
                      <ArrowRight className="w-4 h-4 inline ml-1" />
                      رجوع
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
                          type={showPassword ? 'text' : 'password'}
                          placeholder="8 أحرف على الأقل"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError('') }}
                          className="pr-10 pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs ${
                            passwordStrength <= 1 ? 'text-red-500' :
                            passwordStrength <= 2 ? 'text-orange-500' :
                            passwordStrength <= 3 ? 'text-yellow-600' :
                            passwordStrength <= 4 ? 'text-lime-600' :
                            'text-green-600'
                          }`}>
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
                          type={showPassword ? 'text' : 'password'}
                          placeholder="أعد إدخال كلمة المرور"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                          onKeyDown={(e) => handleKeyDown(e, handleRegister)}
                          className="pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 hover:bg-white transition-colors"
                        />
                        {confirmPassword && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            {password === confirmPassword ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={loading}
                      className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                      size="lg"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'إنشاء الحساب'
                      )}
                    </Button>

                    <button
                      onClick={() => goToStep('register-email')}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                    >
                      <ArrowRight className="w-4 h-4 inline ml-1" />
                      رجوع
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Footer - Security badge */}
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

        {/* Back to home link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => setCurrentPage('landing')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4 inline ml-1" />
            العودة إلى الصفحة الرئيسية
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
