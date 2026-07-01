'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Shield, Users, Building2, Calendar, BarChart3, ChevronDown, Sparkles, Lock, Eye, Fingerprint } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { AnimatedHeroIllustration, AnimatedSecurityIllustration, AnimatedDashboardIllustration, AnimatedMembersIllustration, AnimatedEventsIllustration, AnimatedFinanceIllustration } from './animated-illustrations'

// Seeded random for deterministic SSR
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Particle component for 3D background
function Particles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const particles = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.round(seededRandom(i * 7 + 1) * 100 * 10000) / 10000,
      y: Math.round(seededRandom(i * 13 + 2) * 100 * 10000) / 10000,
      size: Math.round((seededRandom(i * 17 + 3) * 4 + 1) * 10000) / 10000,
      duration: seededRandom(i * 23 + 4) * 20 + 10,
      delay: seededRandom(i * 31 + 5) * 5,
      animX1: Math.round((seededRandom(i * 37 + 6) * 50 - 25) * 10000) / 10000,
      animX2: Math.round((seededRandom(i * 41 + 7) * 100 - 50) * 10000) / 10000,
    }))
  )[0]

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -200, -400],
            x: [0, p.animX1, p.animX2],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Floating 3D Card with animated illustration
function FloatingCard({ icon: Icon, title, desc, delay, color, illustration }: { icon: any; title: string; desc: string; delay: number; color: string; illustration?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ 
        y: -12, 
        rotateY: 5, 
        rotateX: -5,
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      className="perspective-container"
    >
      <div className={`glass-card rounded-2xl p-6 cursor-pointer preserve-3d card-3d group`}>
        {/* Animated illustration area */}
        {illustration && (
          <div className="mb-3 flex justify-center overflow-hidden rounded-xl bg-background/20 py-2">
            {illustration}
          </div>
        )}
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

// Stats counter
function StatsCounter() {
  const [counts, setCounts] = useState({ associations: 0, members: 0, events: 0, security: 0 })
  const targets = { associations: 1250, members: 45800, events: 3200, security: 99.9 }

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        associations: Math.round(targets.associations * eased),
        members: Math.round(targets.members * eased),
        events: Math.round(targets.events * eased),
        security: Math.round(targets.security * eased * 10) / 10,
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    { label: 'جمعية مسجلة', value: counts.associations.toLocaleString('ar-SA'), icon: Building2, color: 'text-emerald-500' },
    { label: 'عضو فعّال', value: counts.members.toLocaleString('ar-SA'), icon: Users, color: 'text-cyan-500' },
    { label: 'فعالية منفذة', value: counts.events.toLocaleString('ar-SA'), icon: Calendar, color: 'text-amber-500' },
    { label: 'نسبة الأمان', value: `${counts.security}%`, icon: Shield, color: 'text-teal-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="glass-card rounded-xl p-4 md:p-5 text-center"
        >
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
          <div className={`text-2xl md:text-3xl font-bold ${stat.color} animate-count-up`}>{stat.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

export function LandingPage() {
  const { setCurrentPage } = useAppStore()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const features = [
    { icon: Building2, title: 'إدارة الجمعيات', desc: 'إنشاء وإدارة جمعياتك بكفاءة عالية مع تتبع شامل لجميع الأنشطة والعمليات', color: 'bg-emerald-500', delay: 0.2, illustration: <AnimatedHeroIllustration /> },
    { icon: Users, title: 'إدارة الأعضاء', desc: 'نظام متكامل لإدارة الأعضاء مع تحديد الأدوار والصلاحيات ومتابعة الحضور', color: 'bg-cyan-500', delay: 0.3, illustration: <AnimatedMembersIllustration /> },
    { icon: Calendar, title: 'الفعاليات والأنشطة', desc: 'تنظيم ومتابعة الفعاليات والأنشطة مع إدارة الحجوزات والميزانيات', color: 'bg-amber-500', delay: 0.4, illustration: <AnimatedEventsIllustration /> },
    { icon: BarChart3, title: 'التقارير المالية', desc: 'تقارير مالية شاملة مع رسوم بيانية تفاعلية وتحليلات متقدمة', color: 'bg-teal-500', delay: 0.5, illustration: <AnimatedFinanceIllustration /> },
    { icon: Shield, title: 'حماية متقدمة', desc: 'نظام أمان متعدد الطبقات مع تشفير البيانات والتحقق الثنائي', color: 'bg-violet-500', delay: 0.6, illustration: <AnimatedSecurityIllustration /> },
    { icon: Sparkles, title: 'ذكاء اصطناعي', desc: 'تحليلات ذكية وتوصيات آلية لتحسين أداء جمعيتك', color: 'bg-rose-500', delay: 0.7, illustration: <AnimatedDashboardIllustration /> },
  ]

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh-dark" />
      <Particles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Hero Section */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-16 md:pb-24">
          {/* Nav */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-16 md:mb-24"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">جمعيات<span className="text-emerald-500">برو</span></span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-emerald-500 transition-colors"
              >
                تسجيل الدخول
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('register')}
                className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
              >
                ابدأ مجاناً
              </motion.button>
            </div>
          </motion.nav>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-emerald-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  منصة ذكية لإدارة الجمعيات
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              >
                <span className="text-foreground">منصة تنظيم</span>
                <br />
                <span className="bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  الجمعيات الذكية
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                أدِر جمعيتك بكفاءة واحترافية مع نظام متكامل يشمل إدارة الأعضاء والفعاليات والماليات مع حماية متقدمة من الدرجة الأولى
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(16,185,129,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('register')}
                  className="px-8 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 transition-all"
                >
                  ابدأ رحلتك الآن
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('login')}
                  className="px-8 py-4 text-base font-bold rounded-2xl glass-card text-foreground hover:text-emerald-500 transition-colors"
                >
                  لديك حساب؟ سجّل دخول
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Animated Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex-shrink-0"
            >
              <AnimatedHeroIllustration />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 md:mt-24"
          >
            <StatsCounter />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              كل ما تحتاجه <span className="text-emerald-500">في مكان واحد</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              منصة شاملة توفر لك جميع الأدوات اللازمة لإدارة جمعيتك باحترافية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FloatingCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Security Section with animated illustration */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-4">
                    <Lock className="w-4 h-4" />
                    أمان من الدرجة الأولى
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
                    حماية <span className="text-emerald-500">شاملة</span> لبياناتك
                  </h2>
                  <div className="space-y-4">
                    {[
                      { title: 'تشفير AES-256', desc: 'تشفير متقدم لجميع البيانات الحساسة' },
                      { title: 'تحقق ثنائي', desc: 'طبقة حماية إضافية مع 2FA' },
                      { title: 'مراقبة 24/7', desc: 'رصد الأنشطة المشبوهة بالذكاء الاصطناعي' },
                      { title: 'نسخ احتياطي تلقائي', desc: 'حفظ بياناتك بشكل دوري وآمن' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                          <p className="text-muted-foreground text-xs">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="flex-shrink-0">
                <AnimatedSecurityIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
              جاهز لتنظيم <span className="text-emerald-500">جمعيتك؟</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              انضم إلى آلاف الجمعيات التي تثق بمنصتنا لإدارة أعمالها
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('register')}
              className="px-10 py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25"
            >
              ابدأ مجاناً الآن
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 جمعياتبرو - جميع الحقوق محفوظة | تطوير: <span className="text-cyan-400 font-bold">زعيم الدمار</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
