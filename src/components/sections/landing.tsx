'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Shield, Users, Building2, Calendar, BarChart3, ChevronDown, Sparkles, Lock, Eye, Fingerprint,
  Phone, Mail, MapPin, Send, ArrowLeft, ChevronRight, Globe, Star, CheckCircle2,
  Monitor, Smartphone, Database, Cloud, Cpu, Headphones, Clock, Award, Zap,
  Facebook, Twitter, Instagram, Youtube, MessageCircle, Play, ArrowUp,
  Heart, Target, Lightbulb, Rocket, TrendingUp, Settings, BookOpen, Layers,
  ArrowRight, BadgeCheck, Palette, Code2, Server, Wifi, Layers3, PenTool, BarChart2,
  UserCheck, FileText, Bell, ShieldCheck, Activity, PieChart, Download
} from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { AnimatedHeroIllustration, AnimatedSecurityIllustration, AnimatedDashboardIllustration, AnimatedMembersIllustration, AnimatedEventsIllustration, AnimatedFinanceIllustration } from './animated-illustrations'

// ============================================
// ANIMATED SVG ILLUSTRATIONS
// ============================================

function AnimatedPhoneIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 280 }}>
      <motion.div
        animate={{ y: [0, -10, 0], rotateY: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="preserve-3d"
      >
        <svg width="260" height="280" viewBox="0 0 260 280" fill="none">
          <defs>
            <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
          {/* Phone body */}
          <rect x="60" y="10" width="140" height="260" rx="24" fill="url(#phoneGrad)" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
          <rect x="70" y="40" width="120" height="195" rx="4" fill="url(#screenGrad)" />
          {/* Status bar */}
          <rect x="70" y="40" width="120" height="20" rx="4" fill="#3b82f6" opacity="0.15" />
          <circle cx="82" cy="50" r="3" fill="#3b82f6" opacity="0.4" />
          <rect x="90" y="48" width="30" height="4" rx="2" fill="#3b82f6" opacity="0.3" />
          {/* App cards */}
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <rect x="78" y="68" width="104" height="35" rx="8" fill="#3b82f6" opacity="0.12" />
            <circle cx="95" cy="85" r="8" fill="#3b82f6" opacity="0.3" />
            <rect x="110" y="79" width="40" height="4" rx="2" fill="#3b82f6" opacity="0.25" />
            <rect x="110" y="87" width="30" height="3" rx="1.5" fill="#06b6d4" opacity="0.25" />
          </motion.g>
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>
            <rect x="78" y="110" width="50" height="45" rx="8" fill="#ec4899" opacity="0.1" />
            <BarChart2 x="85" y="118" width="36" height="30" fill="#ec4899" opacity="0.3" />
          </motion.g>
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>
            <rect x="132" y="110" width="50" height="45" rx="8" fill="#06b6d4" opacity="0.1" />
            <Users x="139" y="118" width="36" height="30" fill="#06b6d4" opacity="0.3" />
          </motion.g>
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}>
            <rect x="78" y="162" width="104" height="30" rx="6" fill="#10b981" opacity="0.1" />
            <CheckCircle2 x="88" y="169" width="14" height="14" fill="#10b981" opacity="0.4" />
            <rect x="110" y="172" width="50" height="4" rx="2" fill="#10b981" opacity="0.25" />
            <rect x="110" y="179" width="35" height="3" rx="1.5" fill="#10b981" opacity="0.2" />
          </motion.g>
          {/* Bottom nav */}
          <rect x="70" y="200" width="120" height="35" rx="0" fill="#3b82f6" opacity="0.06" />
          {[0,1,2,3,4].map(i => (
            <circle key={`nav-${i}`} cx={85 + i * 24} cy="218" r="4" fill="#3b82f6" opacity={i === 0 ? 0.5 : 0.15} />
          ))}
          {/* Notch */}
          <rect x="105" y="15" width="50" height="6" rx="3" fill="#3b82f6" opacity="0.2" />
          {/* Floating notification */}
          <motion.g animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }}>
            <rect x="180" y="60" width="70" height="28" rx="8" fill="white" stroke="#3b82f6" strokeWidth="1" opacity="0.9" />
            <circle cx="194" cy="74" r="5" fill="#ec4899" opacity="0.4" />
            <rect x="204" y="70" width="35" height="4" rx="2" fill="#1a1a2e" opacity="0.3" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}

function AnimatedTeamIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 260 }}>
      <motion.div
        animate={{ scale: [1, 1.02, 1], rotateY: [0, 3, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="preserve-3d"
      >
        <svg width="280" height="260" viewBox="0 0 280 260" fill="none">
          <defs>
            <linearGradient id="teamGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Central person */}
          <circle cx="140" cy="70" r="22" fill="#3b82f6" opacity="0.3" />
          <circle cx="140" cy="70" r="15" fill="#3b82f6" opacity="0.5" />
          <path d="M110 130 Q140 100 170 130 L170 160 Q140 170 110 160 Z" fill="#3b82f6" opacity="0.25" />
          {/* Connected people */}
          {[
            { x: 50, y: 90, c: '#06b6d4', delay: 0 },
            { x: 230, y: 90, c: '#ec4899', delay: 0.5 },
            { x: 50, y: 180, c: '#10b981', delay: 1 },
            { x: 230, y: 180, c: '#f59e0b', delay: 1.5 },
            { x: 140, y: 210, c: '#8b5cf6', delay: 2 },
          ].map((p, i) => (
            <g key={`team-${i}`}>
              <motion.line
                x1="140" y1="100" x2={p.x} y2={p.y}
                stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 6"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
              />
              <motion.circle
                cx={p.x} cy={p.y} r="18"
                fill={p.c} opacity="0.15"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <circle cx={p.x} cy={p.y} r="12" fill={p.c} opacity="0.3" />
              <circle cx={p.x} cy={p.y - 4} r="5" fill={p.c} opacity="0.4" />
              <path d={`M${p.x - 6} ${p.y + 4} Q${p.x} ${p.y - 2} ${p.x + 6} ${p.y + 4}`} fill={p.c} opacity="0.25" />
            </g>
          ))}
          {/* Decorative dots */}
          {[
            { x: 80, y: 40 }, { x: 200, y: 40 }, { x: 80, y: 230 }, { x: 200, y: 230 },
          ].map((d, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={d.x} cy={d.y} r="3"
              fill="#3b82f6" opacity="0.15"
              animate={{ y: [d.y, d.y - 10, d.y], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}

function AnimatedCloudIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 240 }}>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
          <defs>
            <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {/* Cloud shape */}
          <path d="M60 150 Q60 110 100 100 Q100 60 150 60 Q200 60 200 100 Q240 110 240 150 Z" fill="url(#cloudGrad)" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
          {/* Server inside cloud */}
          {[0, 1, 2].map(i => (
            <g key={`srv-${i}`}>
              <rect x="100" y={100 + i * 22} width="60" height="18" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1" opacity="0.7" />
              <motion.circle
                cx="112" cy={109 + i * 22} r="3"
                fill="#10b981"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
              <rect x="122" y={105 + i * 22} width="28" height="3" rx="1.5" fill="#3b82f6" opacity="0.15" />
            </g>
          ))}
          {/* Arrows up/down */}
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <path d="M130 85 L130 75 M125 80 L130 75 L135 80" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
          </motion.g>
          <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
            <path d="M130 175 L130 185 M125 180 L130 185 L135 180" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />
          </motion.g>
          {/* Shield badge */}
          <motion.g animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: '200px 90px' }}>
            <path d="M200 75 L215 82 L215 95 Q215 105 200 110 Q185 105 185 95 L185 82 Z" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1" />
            <CheckCircle2 x="191" y="83" width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}

// ============================================
// SEEDED RANDOM FOR DETERMINISTIC SSR
// ============================================
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ============================================
// PARTICLE COMPONENT
// ============================================
function Particles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const particles = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.round(seededRandom(i * 7 + 1) * 100 * 10000) / 10000,
      y: Math.round(seededRandom(i * 13 + 2) * 100 * 10000) / 10000,
      size: Math.round((seededRandom(i * 17 + 3) * 6 + 2) * 10000) / 10000,
      duration: seededRandom(i * 23 + 4) * 20 + 10,
      delay: seededRandom(i * 31 + 5) * 5,
      animX1: Math.round((seededRandom(i * 37 + 6) * 50 - 25) * 10000) / 10000,
      animX2: Math.round((seededRandom(i * 41 + 7) * 100 - 50) * 10000) / 10000,
      color: ['rgba(59,130,246,0.1)', 'rgba(14,165,233,0.08)', 'rgba(236,72,153,0.06)', 'rgba(245,158,11,0.06)'][i % 4],
    }))
  )[0]

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{
            y: [0, -200, -400],
            x: [0, p.animX1, p.animX2],
            opacity: [0, 0.8, 0],
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

// ============================================
// FLOATING CARD WITH ANIMATED ILLUSTRATION
// ============================================
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
      <div className="glass-card rounded-2xl p-6 cursor-pointer preserve-3d card-3d group h-full">
        {illustration && (
          <div className="mb-3 flex justify-center overflow-hidden rounded-xl bg-blue-50/50 py-2">
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

// ============================================
// STATS COUNTER
// ============================================
function StatsCounter() {
  const [counts, setCounts] = useState({ associations: 0, members: 0, events: 0, security: 0 })

  useEffect(() => {
    const targets = { associations: 1250, members: 45800, events: 3200, security: 99.9 }
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
    { label: 'جمعية مسجلة', value: counts.associations.toLocaleString('ar-SA'), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'عضو فعّال', value: counts.members.toLocaleString('ar-SA'), icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'فعالية منفذة', value: counts.events.toLocaleString('ar-SA'), icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'نسبة الأمان', value: `${counts.security}%`, icon: Shield, color: 'text-pink-600', bg: 'bg-pink-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className={`${stat.bg} rounded-2xl p-5 text-center border border-white/60 shadow-sm`}
        >
          <stat.icon className={`w-7 h-7 mx-auto mb-2 ${stat.color}`} />
          <div className={`text-2xl md:text-3xl font-bold ${stat.color} animate-count-up`}>{stat.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const [current, setCurrent] = useState(0)
  const { setCurrentPage } = useAppStore()

  const slides = [
    {
      badge: 'منصة ذكية لإدارة الجمعيات',
      title1: 'منصة تنظيم',
      title2: 'الجمعيات الذكية',
      desc: 'أدِر جمعيتك بكفاءة واحترافية مع نظام متكامل يشمل إدارة الأعضاء والفعاليات والماليات مع حماية متقدمة من الدرجة الأولى',
      cta: 'ابدأ رحلتك الآن',
      ctaSecondary: 'لديك حساب؟ سجّل دخول',
      illustration: <AnimatedHeroIllustration />,
    },
    {
      badge: 'حلول متكاملة للمؤسسات',
      title1: 'نظام إدارة',
      title2: 'الموارد الشامل',
      desc: 'نظام متقدم لإدارة موارد مؤسستك بشكل شامل مع تقارير مالية دقيقة وتحليلات ذكية تساعدك على اتخاذ القرارات الصحيحة',
      cta: 'اكتشف المزيد',
      ctaSecondary: 'طلب نسخة تجريبية',
      illustration: <AnimatedDashboardIllustration />,
    },
    {
      badge: 'أمان من الدرجة الأولى',
      title1: 'حماية متقدمة',
      title2: 'لبياناتك الحساسة',
      desc: 'تشفير AES-256 مع تحقق ثنائي ومراقبة ذكية على مدار الساعة لضمان أمان بياناتك والامتثال لأعلى المعايير الدولية',
      cta: 'تعرّف على الأمان',
      ctaSecondary: 'تواصل معنا',
      illustration: <AnimatedSecurityIllustration />,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-blob-1" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/10 rounded-full blur-3xl" />
      <Particles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  {slides[current].badge}
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              >
                <span className="text-foreground">{slides[current].title1}</span>
                <br />
                <span className="gradient-text">{slides[current].title2}</span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                {slides[current].desc}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(59,130,246,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('register')}
                  className="px-8 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {slides[current].cta}
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('login')}
                  className="px-8 py-4 text-base font-bold rounded-2xl bg-white border-2 border-blue-200 text-foreground hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {slides[current].ctaSecondary}
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Slider indicators */}
            <div className="flex items-center gap-2 mt-8 justify-center lg:justify-start">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === current ? 'w-10 bg-blue-500' : 'w-2.5 bg-blue-300 hover:bg-blue-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hero Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-shrink-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`ill-${current}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{ duration: 0.5 }}
              >
                {slides[current].illustration}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// ABOUT PLATFORM SECTION
// ============================================
function AboutSection() {
  const { setCurrentPage } = useAppStore()

  const highlights = [
    {
      icon: Rocket,
      title: 'بداية سهلة وسريعة',
      desc: 'ابدأ باستخدام المنصة في دقائق معدودة دون الحاجة لتدريب معقد. واجهة بسيطة وبديهية تناسب جميع المستويات التقنية.',
      color: 'from-blue-500 to-sky-500',
      bg: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: 'أمان بلا تنازلات',
      desc: 'نظام حماية متعدد الطبقات مع تشفير AES-256 وتحقق ثنائي ومراقبة ذكية على مدار الساعة لحماية بياناتك الحساسة.',
      color: 'from-cyan-500 to-blue-500',
      bg: 'bg-cyan-50',
    },
    {
      icon: TrendingUp,
      title: 'تقارير ذكية وتحليلات',
      desc: 'لوحات تحكم تفاعلية وتقارير مالية شاملة مع رسوم بيانية حية وتحليلات ذكية تدعم قراراتك الإدارية.',
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
    },
    {
      icon: Users,
      title: 'إدارة أعضاء متقدمة',
      desc: 'نظام شامل لإدارة الأعضاء يتضمن تحديد الأدوار والصلاحيات وتتبع الحضور والمشاركة وتواصل فعّال.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-blue-700 text-sm font-bold mb-6">
            <Lightbulb className="w-4 h-4" />
            عن منصة جمعياتبرو
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            منصة واحدة لـ<span className="gradient-text">كل احتياجاتك</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            جمعياتبرو هي منصة سحابية متكاملة صُممت خصيصاً لإدارة الجمعيات والمؤسسات غير الربحية في المملكة العربية السعودية. نوفر لك أدوات احترافية تبسّط العمليات اليومية وتعزز الإنتاجية مع ضمان أعلى معايير الأمان والجودة.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl p-8 border border-blue-100/50 shadow-lg shadow-blue-100/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-blob-1" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-200/30 rounded-full blur-2xl animate-blob-2" />
              <div className="relative z-10 flex items-center justify-center py-8">
                <div className="relative w-64 h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-200 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-200 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-2xl shadow-blue-300/50"
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256" fill="none">
                    <circle cx="128" cy="128" r="115" stroke="rgba(59,130,246,0.15)" strokeWidth="1.5" strokeDasharray="8 12" />
                    <circle cx="128" cy="128" r="90" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="4 8" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature List */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: -8, scale: 1.01 }}
                  className={`${item.bg} rounded-2xl p-5 border border-white/60 shadow-sm flex items-start gap-4 group cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('register')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                ابدأ مجاناً
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-white border-2 border-blue-200 text-blue-700 font-bold text-sm hover:border-blue-400 transition-colors shadow-sm"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                تواصل معنا
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FEATURES SECTION (6 Features with illustrations)
// ============================================
function FeaturesSection() {
  const features = [
    {
      icon: Building2,
      title: 'إدارة الجمعيات',
      desc: 'إنشاء وإدارة عدد غير محدود من الجمعيات مع ملفات تعريفية شاملة تشمل بيانات التواصل والتصنيفات والحالة القانونية والتراخيص المهنية اللازمة.',
      color: 'bg-gradient-to-br from-blue-500 to-sky-600',
      shadow: 'shadow-blue-200',
      illustration: <AnimatedHeroIllustration />,
    },
    {
      icon: Users,
      title: 'إدارة الأعضاء',
      desc: 'نظام متقدم لإدارة الأعضاء يشمل تحديد الأدوار والصلاحيات، تتبع الحضور والمشاركة، وإرسال الإشعارات والتواصل الجماعي بسهولة وفعالية.',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-200',
      illustration: <AnimatedMembersIllustration />,
    },
    {
      icon: Calendar,
      title: 'الفعاليات والأنشطة',
      desc: 'تنظيم وإدارة الفعاليات بكل سهولة مع تحديد المواقع والميزانيات وعدد المشاركين وتتبع الحضور والتقييمات بعد انتهاء الحدث تلقائياً.',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      shadow: 'shadow-amber-200',
      illustration: <AnimatedEventsIllustration />,
    },
    {
      icon: BarChart3,
      title: 'التقارير المالية',
      desc: 'لوحة تحكم مالية تفاعلية مع رسوم بيانية حية وتقارير شاملة للإيرادات والمصروفات والميزانيات ومتابعة المعاملات المعلقة والموافقة عليها.',
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      shadow: 'shadow-pink-200',
      illustration: <AnimatedFinanceIllustration />,
    },
    {
      icon: Shield,
      title: 'الأمان والحماية',
      desc: 'حماية متعددة الطبقات تشمل التشفير AES-256 والتحقق الثنائي ومراقبة الأنشطة المشبوهة وسجل أمني شامل مع تنبيهات فورية لأي تهديد.',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-200',
      illustration: <AnimatedSecurityIllustration />,
    },
    {
      icon: Smartphone,
      title: 'دعم متعدد الأجهزة',
      desc: 'تصميم متجاوب يعمل بسلاسة على جميع الأجهزة - الحاسوب واللوحي والهاتف المحمول - مع إمكانية الوصول الكامل في أي وقت ومن أي مكان.',
      color: 'bg-gradient-to-br from-sky-500 to-blue-600',
      shadow: 'shadow-sky-200',
      illustration: <AnimatedPhoneIllustration />,
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200/50 text-pink-700 text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            المميزات الرئيسية
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            كل ما تحتاجه <span className="gradient-text">في مكان واحد</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            مجموعة شاملة من الأدوات الاحترافية المصممة خصيصاً لتلبية احتياجات الجمعيات والمؤسسات غير الربحية بكل سهولة وكفاءة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FloatingCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              delay={i * 0.1}
              color={feature.color}
              illustration={feature.illustration}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'سجّل حسابك',
      desc: 'أنشئ حسابك المجاني في أقل من دقيقة واحدة. لا حاجة لبطاقة ائتمان أو معلومات دفع. مجرد بريدك الإلكتروني وكلمة مرور قوية.',
      color: 'from-blue-500 to-sky-500',
    },
    {
      num: '02',
      icon: Building2,
      title: 'أنشئ جمعيتك',
      desc: 'أضف بيانات جمعيتك واختار التصنيف المناسب. يمكنك إنشاء عدد غير محدود من الجمعيات وإدارتها جميعاً من لوحة تحكم واحدة.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      num: '03',
      icon: Users,
      title: 'أضف الأعضاء',
      desc: 'ادعُ أعضاءك للانضمام عبر البريد الإلكتروني أو الرابط المباشر. حدد الأدوار والصلاحيات لكل عضو وابدأ بإدارة فريقك فوراً.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      num: '04',
      icon: Rocket,
      title: 'ابدأ الإدارة',
      desc: 'استخدم جميع الأدوات المتاحة لإدارة الفعاليات والماليات والتقارير. تابع الأداء عبر لوحات التحكم التفاعلية واستفد من التحليلات الذكية.',
      color: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/50 text-cyan-700 text-sm font-bold mb-6">
            <Layers className="w-4 h-4" />
            كيف يعمل النظام
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            ابدأ في <span className="gradient-text">أربع خطوات بسيطة</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            عملية بسيطة وسريعة لبدء إدارة جمعيتك بكفاءة واحترافية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center group"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-cyan-200" />
              )}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-blue-300 flex items-center justify-center text-xs font-black text-blue-600">
                  {step.num}
                </div>
              </motion.div>
              <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// STATS SECTION
// ============================================
function StatsSection() {
  return (
    <section className="relative z-10 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-500 via-sky-500 to-blue-600 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl shadow-blue-200/50">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-40 h-40 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-10 -left-10 w-60 h-60 border border-white/10 rounded-full"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">أرقام تتحدث عنّا</h2>
              <p className="text-white/70 text-lg">نمت بفضل ثقة عملائنا ومشاركتهم المستمرة</p>
            </motion.div>

            <StatsCounter />
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// WHY US SECTION
// ============================================
function WhyUsSection() {
  const reasons = [
    {
      icon: BadgeCheck,
      title: 'موثوقية عالية',
      desc: 'نظام مستقر وموثوق يعمل على مدار الساعة مع ضمان وقت تشغيل يصل إلى 99.9%. بياناتك محفوظة ومؤمنة دائماً.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Palette,
      title: 'تصميم عصري',
      desc: 'واجهة مستخدم حديثة وبديهية مصممة بعناية فائقة لتوفير أفضل تجربة استخدام ممكنة على جميع الأجهزة والمتصفحات.',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      icon: Code2,
      title: 'تقنيات متطورة',
      desc: 'مبني باستخدام أحدث التقنيات العالمية لضمان الأداء العالي والسرعة الفائقة في التحميل والاستجابة لجميع العمليات.',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      icon: Headphones,
      title: 'دعم فني متواصل',
      desc: 'فريق دعم فني متخصص متاح على مدار الساعة للإجابة على استفساراتك وحل مشاكلك بسرعة واحترافية عالية.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: Server,
      title: 'بنية تحتية قوية',
      desc: 'خوادم سحابية موزعة عالمياً مع نسخ احتياطي تلقائي وحماية من الهجمات الإلكترونية لضمان استمرارية الخدمة.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Wifi,
      title: 'مزامنة فورية',
      desc: 'مزامنة البيانات بشكل فوري بين جميع الأجهزة والمستخدمين مع إمكانية العمل دون اتصال ومزامنة تلقائية عند العودة.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-white via-blue-50/20 to-white" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/50 text-amber-700 text-sm font-bold mb-6">
            <Award className="w-4 h-4" />
            لماذا جمعياتبرو
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            لماذا تختار <span className="gradient-text">جمعياتبرو؟</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            نجمع بين التقنية المتطورة والتصميم الأنيق والدعم المتميز لنقدم لك أفضل تجربة إدارة ممكنة لجمعيتك.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${reason.bg} rounded-2xl p-6 border border-white/60 shadow-sm group cursor-default`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{reason.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'أحمد محمد الشهري',
      role: 'رئيس جمعية الإحسان الخيرية',
      text: 'جمعياتبرو غيّر طريقة إدارتنا بالكامل. الآن نستطيع متابعة الأعضاء والفعاليات والتقارير المالية من مكان واحد. وفرنا أكثر من 60% من الوقت الإداري.',
      rating: 5,
    },
    {
      name: 'سارة عبدالله القحطاني',
      role: 'مديرة جمعية التعليم الأهلي',
      text: 'المنصة سهلة الاستخدام جداً وفريق الدعم ممتاز. نظام الحماية المتقدم يعطيني راحة نفسية كاملة بشأن بيانات أعضائنا ومعلوماتنا المالية الحساسة.',
      rating: 5,
    },
    {
      name: 'خالد ناصر العتيبي',
      role: 'أمين جمعية النماء الاجتماعية',
      text: 'التقارير المالية التفاعلية ساعدتنا في اتخاذ قرارات أفضل وأسرع. نظام إدارة الفعاليات وفّر لنا تنظيماً احترافياً لم نكن نملكه من قبل في جمعيتنا.',
      rating: 5,
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-200/50 text-blue-700 text-sm font-bold mb-6">
            <Star className="w-4 h-4" />
            آراء عملائنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            ماذا يقول <span className="gradient-text">عملاؤنا؟</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            ثقة عملائنا هي أكبر دليل على جودة خدماتنا
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  const { setCurrentPage } = useAppStore()
  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-blue-600 via-sky-600 to-blue-700 rounded-3xl p-8 md:p-16 overflow-hidden text-center"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"
            />
            <motion.div
              animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-10 left-10 w-56 h-56 bg-white/5 rounded-full blur-xl"
            />
            {[0,1,2,3,4,5].map(i => (
              <motion.div
                key={`cta-star-${i}`}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.5, 1.5, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mb-8"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              جاهز لبدء رحلتك؟
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              انضم إلى آلاف الجمعيات التي تثق بجمعياتبرو لإدارة عملياتها. ابدأ مجاناً اليوم واكتشف الفرق بنفسك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('register')}
                className="px-10 py-4 text-base font-bold rounded-2xl bg-white text-blue-700 shadow-xl transition-all flex items-center justify-center gap-2"
              >
                ابدأ مجاناً الآن
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('login')}
                className="px-10 py-4 text-base font-bold rounded-2xl bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 transition-colors"
              >
                تسجيل الدخول
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  const [sent, setSent] = useState(false)

  return (
    <section className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-white to-slate-50" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50 text-emerald-700 text-sm font-bold mb-6">
            <Mail className="w-4 h-4" />
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
            نحب أن <span className="gradient-text">نسمع منك</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في بدء رحلتك مع جمعياتبرو
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-muted-foreground">سنتواصل معك في أقرب وقت ممكن.</p>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">الاسم</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="اسمك الكامل" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">البريد</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="بريدك الإلكتروني" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">الموضوع</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="موضوع الرسالة" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">الرسالة</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-32 resize-none" placeholder="اكتب رسالتك هنا..." />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSent(true)}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white font-bold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    إرسال الرسالة
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-6"
          >
            <AnimatedCloudIllustration />
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'البريد الإلكتروني', value: 'info@jamiat-pro.com', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Phone, label: 'رقم الهاتف', value: '+966 50 123 4567', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { icon: MapPin, label: 'العنوان', value: 'الرياض، المملكة العربية السعودية', color: 'text-pink-600', bg: 'bg-pink-50' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                    <p className="text-foreground font-bold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  const { setCurrentPage } = useAppStore()

  return (
    <footer className="relative z-10 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black">جمعياتبرو</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              منصة سحابية متكاملة لإدارة وتنظيم الجمعيات والمؤسسات غير الربحية بأحدث التقنيات وأعلى معايير الأمان.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-4">روابط سريعة</h4>
            <div className="space-y-2.5">
              {[
                { label: 'الرئيسية', action: () => setCurrentPage('landing') },
                { label: 'الجمعيات', action: () => setCurrentPage('login') },
                { label: 'الأعضاء', action: () => setCurrentPage('login') },
                { label: 'الفعاليات', action: () => setCurrentPage('login') },
                { label: 'المالية', action: () => setCurrentPage('login') },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="block text-slate-400 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-base mb-4">المميزات</h4>
            <div className="space-y-2.5">
              {['لوحة التحكم', 'إدارة الأعضاء', 'التقارير المالية', 'الحماية المتقدمة', 'الدعم الفني'].map(feat => (
                <span key={feat} className="block text-slate-400 text-sm">{feat}</span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-base mb-4">النشرة البريدية</h4>
            <p className="text-slate-400 text-sm mb-4">اشترك ليصلك كل جديد عن المنصة والعروض الحصرية.</p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="بريدك الإلكتروني"
              />
              <button className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-bold">
                اشترك
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">&copy; 2026 جمعياتبرو - جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer transition-colors">سياسة الخصوصية</span>
            <span className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer transition-colors">شروط الاستخدام</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// SCROLL TO TOP
// ============================================
function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-xl shadow-blue-200 flex items-center justify-center"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  )
}

// ============================================
// MAIN LANDING PAGE EXPORT
// ============================================
export function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
