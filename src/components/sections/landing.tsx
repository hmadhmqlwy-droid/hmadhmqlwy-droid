'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Shield, Users, Building2, Calendar, BarChart3, ChevronDown, Sparkles, Lock, Eye, Fingerprint, 
  Phone, Mail, MapPin, Send, ArrowLeft, ChevronRight, Globe, Star, CheckCircle2, 
  Monitor, Smartphone, Database, Cloud, Cpu, Headphones, Clock, Award, Zap,
  Facebook, Twitter, Instagram, Youtube, MessageCircle, Play, ArrowUp
} from 'lucide-react'
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
      <div className={`glass-card rounded-2xl p-6 cursor-pointer preserve-3d card-3d group h-full`}>
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

// ============================================
// HERO SLIDER (Like Gama Systems)
// ============================================
function HeroSlider() {
  const [current, setCurrent] = useState(0)
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

  const { setCurrentPage } = useAppStore()

  return (
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-emerald-400 text-sm font-medium mb-6">
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
            <span className="bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {slides[current].title2}
            </span>
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
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('register')}
              className="px-8 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {slides[current].cta}
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 text-base font-bold rounded-2xl glass-card text-foreground hover:text-emerald-500 transition-colors"
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
              className={`h-2 rounded-full transition-all duration-500 ${
                i === current ? 'w-8 bg-emerald-500' : 'w-2 bg-emerald-500/30 hover:bg-emerald-500/50'
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
  )
}

// ============================================
// PRODUCTS/SERVICES SECTION (Like Gama Systems)
// ============================================
function ProductsSection() {
  const [activeTab, setActiveTab] = useState('management')
  
  const tabs = [
    { id: 'management', label: 'إدارة الموارد', icon: Database },
    { id: 'web', label: 'تطبيقات الويب', icon: Globe },
    { id: 'mobile', label: 'تطبيقات الجوال', icon: Smartphone },
    { id: 'ecommerce', label: 'المتاجر الإلكترونية', icon: Monitor },
  ]

  const products: Record<string, Array<{title: string; desc: string; icon: any; color: string; features: string[]}>> = {
    management: [
      { title: 'نظام إدارة الجمعيات', desc: 'نظام شامل لإدارة الجمعيات والمؤسسات مع تقارير مالية متقدمة', icon: Building2, color: 'from-emerald-500 to-teal-600', features: ['إدارة الأعضاء', 'التقارير المالية', 'نظام الصلاحيات'] },
      { title: 'نظام نقاط البيع', desc: 'حل متكامل لنقاط البيع مع إدارة المخزون والمحاسبة', icon: Monitor, color: 'from-cyan-500 to-blue-600', features: ['إدارة المبيعات', 'تتبع المخزون', 'فواتير إلكترونية'] },
      { title: 'نظام المحاسبة المالية', desc: 'برنامج محاسبي معتمد من هيئة الزكاة والضريبة والجمارك', icon: BarChart3, color: 'from-amber-500 to-orange-600', features: ['دفتر الأستاذ', 'ضريبة القيمة المضافة', 'التقارير الضريبية'] },
    ],
    web: [
      { title: 'منصات الويب المتقدمة', desc: 'تطوير منصات ويب احترافية بتقنيات حديثة وأداء عالي', icon: Globe, color: 'from-violet-500 to-purple-600', features: ['React/Next.js', 'API متقدمة', 'أداء فائق'] },
      { title: 'لوحات التحكم', desc: 'لوحات تحكم تفاعلية مع رسوم بيانية وتحليلات متقدمة', icon: Cpu, color: 'from-emerald-500 to-green-600', features: ['بيانات حية', 'تقارير مخصصة', 'تصدير البيانات'] },
      { title: 'أنظمة إدارة المحتوى', desc: 'أنظمة CMS مرنة لإدارة المحتوى بسهولة وفعالية', icon: Database, color: 'from-cyan-500 to-teal-600', features: ['محرر متقدم', 'إدارة الوسائط', 'SEO مدمج'] },
    ],
    mobile: [
      { title: 'تطبيقات الأندرويد', desc: 'تطبيقات أندرويد أصلية بأداء ممتاز وتجربة مستخدم متميزة', icon: Smartphone, color: 'from-green-500 to-emerald-600', features: ['أداء عالي', 'إشعارات ذكية', 'عمل بدون إنترنت'] },
      { title: 'تطبيقات iOS', desc: 'تطبيقات آيفون بتصميم أنيق متوافق مع إرشادات آبل', icon: Smartphone, color: 'from-blue-500 to-indigo-600', features: ['Swift/Kotlin', 'تصميم أصلي', 'تكامل النظام'] },
      { title: 'تطبيقات مهنية متخصصة', desc: 'تطبيقات لإدارة المهندسين والمندوبين عبر الجوال', icon: Users, color: 'from-amber-500 to-yellow-600', features: ['تتبع الموقع', 'إدارة المهام', 'تقارير ميدانية'] },
    ],
    ecommerce: [
      { title: 'المتاجر الإلكترونية', desc: 'متاجر احترافية مع بوابات دفع متعددة ونظام شحن متكامل', icon: Monitor, color: 'from-rose-500 to-pink-600', features: ['بوابات دفع', 'إدارة الشحن', 'تتبع الطلبات'] },
      { title: 'منصات المزادات', desc: 'نظام مزادات وحراجات إلكتروني مع إدارة كاملة للمنتجات', icon: Star, color: 'from-amber-500 to-orange-600', features: ['مزادات حية', 'تقييم البائعين', 'نظام وساطة'] },
      { title: 'إدارة الضيافة', desc: 'نظام حجز الوجبات والحفلات مع إدارة كاملة للفعاليات', icon: Calendar, color: 'from-teal-500 to-cyan-600', features: ['حجز ذكي', 'إدارة القوائم', 'تقارير الفعاليات'] },
    ],
  }

  return (
    <section className="relative z-10 py-16 md:py-24" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-cyan-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            حلولنا المتكاملة
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            منتجات وخدمات <span className="text-emerald-500">احترافية</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الحلول التقنية المتكاملة لتلبية احتياجات مؤسستك
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {products[activeTab]?.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="perspective-container"
              >
                <div className="glass-card rounded-2xl overflow-hidden card-3d group h-full">
                  {/* Product Image/Animation Header */}
                  <div className={`h-48 bg-gradient-to-br ${product.color} relative overflow-hidden`}>
                    {/* Animated mesh background */}
                    <div className="absolute inset-0 opacity-20">
                      <motion.div
                        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-32 h-32 rounded-full bg-white/20 -top-10 -right-10"
                      />
                      <motion.div
                        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-24 h-24 rounded-full bg-white/15 bottom-5 left-5"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute w-16 h-16 rounded-full bg-white/10 top-1/2 left-1/2"
                      />
                    </div>
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20"
                      >
                        <product.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                      جديد
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.desc}</p>
                    <div className="space-y-2 mb-4">
                      {product.features.map(feat => (
                        <div key={feat} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                      اطلب نسخة تجريبية
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ============================================
// WHY US / ADVANTAGES SECTION (Like Gama)
// ============================================
function WhyUsSection() {
  const advantages = [
    { icon: Shield, title: 'أمان متقدم', desc: 'تشفير AES-256 مع حماية متعددة الطبقات ومراقبة 24/7', color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: Headphones, title: 'دعم فني متواصل', desc: 'فريق دعم فني متخصص جاهز لمساعدتك على مدار الساعة', color: 'text-cyan-500 bg-cyan-500/10' },
    { icon: Award, title: 'جودة معتمدة', desc: 'برامج معتمدة من هيئة الزكاة والضريبة والجمارك السعودية', color: 'text-amber-500 bg-amber-500/10' },
    { icon: Zap, title: 'أداء فائق', desc: 'تقنيات حديثة تضمن سرعة وأداء ممتاز في جميع الأوقات', color: 'text-violet-500 bg-violet-500/10' },
    { icon: Cloud, title: 'سحابي 100%', desc: 'اعمل من أي مكان وأي جهاز مع مزامنة تلقائية للبيانات', color: 'text-rose-500 bg-rose-500/10' },
    { icon: Clock, title: 'تحديثات مستمرة', desc: 'تحديثات دورية مجانية مع ميزات جديدة باستمرار', color: 'text-teal-500 bg-teal-500/10' },
  ]

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Animated illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Rotating circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="absolute bottom-0 left-0 w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-cyan-500" />
                </div>
                <div className="absolute bottom-0 right-0 w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
              </motion.div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                >
                  <Building2 className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              {/* Decorative ring */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" fill="none">
                <circle cx="160" cy="160" r="140" stroke="rgba(16,185,129,0.1)" strokeWidth="1" strokeDasharray="8 12" />
                <circle cx="160" cy="160" r="110" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="4 8" />
              </svg>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                لماذا نحن؟
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
                مميزات تجعلنا <span className="text-emerald-500">الخيار الأول</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advantages.map((adv, i) => (
                  <motion.div
                    key={adv.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-500/5 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${adv.color} flex items-center justify-center flex-shrink-0`}>
                      <adv.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm mb-1">{adv.title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{adv.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// PARTNERS/CLIENTS CAROUSEL
// ============================================
function PartnersCarousel() {
  const partners = [
    'وزارة الموارد البشرية', 'هيئة الزكاة والضريبة', 'الغرفة التجارية',
    'بنك التنمية', 'صندوق التنمية', 'مؤسسة التقنية',
    'جامعة الملك سعود', 'مدينة الملك عبدالعزيز', 'أرامكو',
    'سابك', 'الراجحي', 'الإنماء',
  ]

  return (
    <section className="relative z-10 py-12 border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm text-muted-foreground font-medium">يثق بنا أكثر من 1,250 مؤسسة وجمعية في المملكة</p>
        </motion.div>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-l from-transparent to-background z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-background z-10" />
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 items-center"
          >
            {[...partners, ...partners].map((partner, i) => (
              <div key={i} className="flex-shrink-0 glass-card rounded-xl px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">
                {partner}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CONTACT SECTION (Like Gama Systems)
// ============================================
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    }, 1500)
  }, [])

  const contactInfo = [
    { icon: MapPin, title: 'العنوان', value: 'جدة - حي الفيحاء - مركز العريفي التجاري', color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: Phone, title: 'الهاتف', value: '+966 56 746 1842', color: 'text-cyan-500 bg-cyan-500/10' },
    { icon: Mail, title: 'البريد الإلكتروني', value: 'info@jamiat-pro.com', color: 'text-amber-500 bg-amber-500/10' },
    { icon: Clock, title: 'ساعات العمل', value: 'الأحد - الخميس: 8 صباحاً - 5 مساءً', color: 'text-violet-500 bg-violet-500/10' },
  ]

  return (
    <section className="relative z-10 py-16 md:py-24" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-amber-400 text-sm font-medium mb-4">
            <Phone className="w-4 h-4" />
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            نحن هنا <span className="text-emerald-500">لمساعدتك</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            يرجى الاتصال بنا باستخدام أحد البيانات التالية أو أرسل رسالتك عبر النموذج
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">أرسل لنا رسالة</h3>
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">الاسم الكامل</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل اسمك"
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">الموضوع</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="موضوع الرسالة"
                      className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : sent ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تم الإرسال بنجاح!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الرسالة
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4 flex items-start gap-3"
              >
                <div className={`w-10 h-10 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}>
                  <info.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{info.title}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">{info.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <div className="glass-card rounded-xl overflow-hidden h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">جدة - المملكة العربية السعودية</p>
                </div>
              </div>
              {/* Animated map markers */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-emerald-500/30"
              />
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-bold text-foreground text-sm mb-3">تابعنا</h4>
              <div className="flex gap-2">
                {[
                  { icon: Twitter, color: 'hover:bg-sky-500/10 hover:text-sky-500' },
                  { icon: Instagram, color: 'hover:bg-pink-500/10 hover:text-pink-500' },
                  { icon: Facebook, color: 'hover:bg-blue-500/10 hover:text-blue-500' },
                  { icon: Youtube, color: 'hover:bg-red-500/10 hover:text-red-500' },
                  { icon: MessageCircle, color: 'hover:bg-green-500/10 hover:text-green-500' },
                ].map((social, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground transition-all ${social.color}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// NEWSLETTER SECTION
// ============================================
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }, [email])

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute w-40 h-40 rounded-full bg-emerald-500/10 -top-10 -left-10"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute w-32 h-32 rounded-full bg-cyan-500/10 -bottom-10 -right-10"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute w-20 h-20 rounded-full bg-amber-500/5 top-1/2 left-1/2"
            />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">
              اشترك في القائمة البريدية
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              احصل على آخر العروض والمقالات والتحديثات مباشرة في بريدك الإلكتروني
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" dir="rtl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                dir="ltr"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 justify-center"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    تم الاشتراك!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    اشتراك
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const testimonials = [
    { name: 'أحمد محمد', role: 'مدير جمعية النور', text: 'منصة رائعة سهّلت علينا إدارة الجمعية بشكل كبير. التقارير المالية دقيقة والنظام سريع جداً.', rating: 5 },
    { name: 'فاطمة العلي', role: 'مشرفة الأعضاء', text: 'أفضل نظام استخدمناه لإدارة الأعضاء والفعاليات. الدعم الفني ممتاز وسريع الاستجابة.', rating: 5 },
    { name: 'خالد السعيد', role: 'محاسب مالي', text: 'التقارير المالية المتقدمة وفّرت علينا ساعات من العمل. النظام معتمد ويلبي جميع المتطلبات.', rating: 5 },
  ]

  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-violet-400 text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            آراء العملاء
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            ماذا يقول <span className="text-emerald-500">عملاؤنا</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
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
// ENHANCED FOOTER (Like Gama Systems)
// ============================================
function EnhancedFooter() {
  const { setCurrentPage } = useAppStore()
  
  return (
    <footer className="relative z-10 border-t border-border/30" dir="rtl">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">جمعيات<span className="text-emerald-500">برو</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              منصة متكاملة لإدارة الجمعيات والمؤسسات بتقنيات حديثة وأمان متقدم. نقدم حلولاً تقنية وفق أعلى مستويات الجودة.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Twitter, color: 'hover:bg-sky-500/10 hover:text-sky-500' },
                { icon: Instagram, color: 'hover:bg-pink-500/10 hover:text-pink-500' },
                { icon: Facebook, color: 'hover:bg-blue-500/10 hover:text-blue-500' },
                { icon: Youtube, color: 'hover:bg-red-500/10 hover:text-red-500' },
              ].map((social, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground transition-all ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { label: 'الرئيسية', page: 'landing' },
                { label: 'تسجيل الدخول', page: 'login' },
                { label: 'إنشاء حساب', page: 'register' },
                { label: 'المنتجات', page: 'landing' },
                { label: 'تواصل معنا', page: 'landing' },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => setCurrentPage(link.page as any)}
                    className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              {[
                'إدارة موارد المؤسسات',
                'تطبيقات الويب',
                'تطبيقات الجوال',
                'المتاجر الإلكترونية',
                'الاستشارات البرمجية',
              ].map(service => (
                <li key={service}>
                  <span className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors cursor-default flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">جدة - حي الفيحاء - مركز العريفي التجاري</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground" dir="ltr">+966 56 746 1842</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">info@jamiat-pro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">أحد - خميس: 8ص - 5م</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-right">
            جميع الحقوق محفوظة © 2026 جمعياتبرو | تطوير: <span className="text-cyan-400 font-bold">زعيم الدمار</span>
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="hover:text-emerald-500 transition-colors">سياسة الخصوصية</button>
            <span>|</span>
            <button className="hover:text-emerald-500 transition-colors">الشروط والأحكام</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================
// MAIN LANDING PAGE
// ============================================
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

      {/* Hero Section with Slider */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-16 md:pb-24">
          {/* Nav */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-16 md:mb-24"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
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

          {/* Hero Slider */}
          <HeroSlider />

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

      {/* Products Section (Like Gama) */}
      <ProductsSection />

      {/* Why Us Section */}
      <WhyUsSection />

      {/* Partners Carousel */}
      <PartnersCarousel />

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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
              جاهز لتنظيم <span className="text-emerald-500">جمعيتك؟</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              انضم إلى آلاف الجمعيات التي تثق بمنصتنا لإدارة أعمالها
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('register')}
                className="px-10 py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                ابدأ مجاناً الآن
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 text-lg font-bold rounded-2xl glass-card text-foreground hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Play className="w-5 h-5" />
                اطلب نسخة تجريبية
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Enhanced Footer */}
      <EnhancedFooter />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}
