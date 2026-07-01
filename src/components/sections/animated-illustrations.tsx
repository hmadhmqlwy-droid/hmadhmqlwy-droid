'use client'

import { motion } from 'framer-motion'

// ============================================
// ANIMATED ILLUSTRATIONS FOR JAMIAT-PRO
// ============================================

// 1. Hero Main Illustration - 3D City with Buildings
export function AnimatedHeroIllustration() {
  const windows1 = [0,1,2,3,4,5].flatMap(row => [0,1,2].map(col => ({ row, col, key: `w1-${row}-${col}` })))
  const windows2 = [0,1,2,3,4].flatMap(row => [0,1,2].map(col => ({ row, col, key: `w2-${row}-${col}` })))
  const windows3 = [0,1,2,3].flatMap(row => [0,1].map(col => ({ row, col, key: `w3-${row}-${col}` })))

  return (
    <div className="perspective-container w-full h-full flex items-center justify-center" style={{ minHeight: 320 }}>
      <motion.div
        animate={{ rotateY: [0, 5, -5, 0], rotateX: [0, -3, 3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="preserve-3d relative"
      >
        <svg width="340" height="300" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="buildingGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="buildingGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="buildingGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <circle cx="170" cy="150" r="140" fill="url(#heroGlow)" />
          <ellipse cx="170" cy="260" rx="160" ry="20" fill="url(#groundGrad)" />
          
          {/* Building 1 */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x="70" y="100" width="55" height="160" rx="4" fill="url(#buildingGrad1)" />
            {windows1.map(w => (
              <rect key={w.key} x={80 + w.col * 15} y={110 + w.row * 24} width="8" height="10" rx="1" fill="#10b981" opacity={0.3 + (w.row + w.col) % 3 * 0.2} />
            ))}
            <polygon points="70,100 97,75 125,100" fill="#10b981" opacity="0.9" />
            <line x1="97" y1="75" x2="97" y2="55" stroke="#10b981" strokeWidth="2" />
            <polygon points="97,55 115,62 97,69" fill="#f59e0b" opacity="0.8" />
          </motion.g>

          {/* Building 2 */}
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
            <rect x="140" y="130" width="50" height="130" rx="4" fill="url(#buildingGrad2)" />
            {windows2.map(w => (
              <rect key={w.key} x={148 + w.col * 14} y={138 + w.row * 23} width="7" height="9" rx="1" fill="#06b6d4" opacity={0.2 + (w.row + w.col) % 3 * 0.15} />
            ))}
            <rect x="155" y="220" width="20" height="40" rx="2" fill="#0891b2" opacity="0.4" />
          </motion.g>

          {/* Building 3 */}
          <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <rect x="205" y="160" width="45" height="100" rx="4" fill="url(#buildingGrad3)" />
            {windows3.map(w => (
              <rect key={w.key} x={213 + w.col * 16} y={168 + w.row * 22} width="7" height="8" rx="1" fill="#14b8a6" opacity={0.3 + (w.row + w.col) % 3 * 0.2} />
            ))}
            <circle cx="227" cy="155" r="8" fill="#14b8a6" opacity="0.3" />
          </motion.g>

          {/* Trees */}
          <rect x="47" y="230" width="4" height="30" rx="2" fill="#059669" opacity="0.5" />
          <ellipse cx="49" cy="225" rx="12" ry="15" fill="#10b981" opacity="0.4" />
          <rect x="260" y="235" width="4" height="25" rx="2" fill="#059669" opacity="0.5" />
          <ellipse cx="262" cy="230" rx="10" ry="13" fill="#10b981" opacity="0.4" />

          {/* Clouds */}
          <motion.g animate={{ x: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <ellipse cx="50" cy="50" rx="25" ry="10" fill="white" opacity="0.06" />
          </motion.g>
          <motion.g animate={{ x: [0, -20, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
            <ellipse cx="280" cy="60" rx="20" ry="8" fill="white" opacity="0.05" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}

// 2. Dashboard Illustration - Charts & Analytics
export function AnimatedDashboardIllustration() {
  return (
    <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.02, 1], rotateY: [0, 3, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="20" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
          {[0,1,2,3,4,5].map((i) => (
            <rect
              key={`bar-${i}`}
              x={30 + i * 24}
              y={140 - (30 + Math.sin(i) * 40 + 40)}
              width="16"
              height={30 + Math.sin(i) * 40 + 40}
              rx="4"
              fill="url(#chartGrad1)"
            />
          ))}
          <path
            d="M30 120 Q60 80 90 100 Q120 120 150 70 Q165 50 170 60"
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {[
            { x: 30, y: 120 }, { x: 90, y: 100 }, { x: 150, y: 70 }, { x: 170, y: 60 }
          ].map((dot, i) => (
            <circle key={`dot-${i}`} cx={dot.x} cy={dot.y} r="4" fill="#10b981" />
          ))}
          <motion.circle
            cx="150" cy="70" r="4"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            animate={{ r: [4, 12], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

// 3. Security Illustration - Animated Shield
export function AnimatedSecurityIllustration() {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      <motion.div
        animate={{ rotateY: [0, 10, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="preserve-3d"
      >
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <circle cx="110" cy="110" r="100" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.2" />
          <motion.circle
            cx="110" cy="110" r="90"
            stroke="#10b981" strokeWidth="2"
            strokeDasharray="10 20"
            fill="none" opacity="0.3"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '110px 110px' }}
          />
          
          <motion.path
            d="M110 30 L170 60 L170 120 Q170 170 110 195 Q50 170 50 120 L50 60 Z"
            fill="url(#shieldGrad)"
            stroke="#10b981"
            strokeWidth="2"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '110px 120px' }}
          />
          
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x="95" y="105" width="30" height="25" rx="4" fill="#10b981" opacity="0.8" />
            <path d="M100 105 V95 Q100 80 110 80 Q120 80 120 95 V105" stroke="#10b981" strokeWidth="3" fill="none" opacity="0.8" />
            <circle cx="110" cy="117" r="3" fill="white" opacity="0.8" />
          </motion.g>
          
          <path d="M95 85 L105 95 L125 75" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  )
}

// 4. Members Illustration - People Network
export function AnimatedMembersIllustration() {
  const positions = [
    { x: 40, y: 50 }, { x: 140, y: 50 },
    { x: 40, y: 110 }, { x: 140, y: 110 },
    { x: 90, y: 130 },
  ]
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <motion.circle cx="90" cy="70" r="15" fill="#10b981" opacity="0.3" animate={{ r: [15, 17, 15] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="90" cy="70" r="10" fill="#10b981" opacity="0.6" />
          {positions.map((pos, i) => (
            <g key={`person-${i}`}>
              <line x1="90" y1="70" x2={pos.x} y2={pos.y} stroke="#10b981" strokeWidth="1" opacity="0.15" strokeDasharray="4 4" />
              <motion.circle
                cx={pos.x} cy={pos.y}
                r="8" fill="#06b6d4" opacity="0.4"
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              />
            </g>
          ))}
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <rect x="20" y="20" width="20" height="12" rx="4" fill="#f59e0b" opacity="0.4" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}

// 5. Events Illustration - Calendar
export function AnimatedEventsIllustration() {
  const days = [0,1,2,3,4].flatMap(row => [0,1,2,3,4,5,6].map(col => ({ row, col, num: row * 7 + col + 1 }))).filter(d => d.num <= 31)
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.div animate={{ rotateY: [0, 5, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <rect x="30" y="35" width="120" height="120" rx="12" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
          <rect x="30" y="35" width="120" height="30" rx="12" fill="#f59e0b" opacity="0.2" />
          <rect x="60" y="28" width="4" height="15" rx="2" fill="#f59e0b" opacity="0.5" />
          <rect x="116" y="28" width="4" height="15" rx="2" fill="#f59e0b" opacity="0.5" />
          <text x="90" y="56" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" opacity="0.6">2026</text>
          {days.map(d => {
            const isHighlight = d.num === 15
            return (
              <circle
                key={`day-${d.num}`}
                cx={44 + d.col * 15}
                cy={80 + d.row * 18}
                r={isHighlight ? 5 : 3}
                fill="#f59e0b"
                opacity={isHighlight ? 0.8 : 0.2}
              />
            )
          })}
          <motion.circle
            cx={44 + 6 * 15}
            cy={80 + 2 * 18}
            r="5" fill="#f59e0b" opacity="0.8"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

// 6. Finance Illustration - Money Growth
export function AnimatedFinanceIllustration() {
  const coins = [
    { y: 140, opacity: 0.3 }, { y: 128, opacity: 0.4 },
    { y: 116, opacity: 0.5 }, { y: 104, opacity: 0.6 },
    { y: 92, opacity: 0.7 },
  ]
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {coins.map((coin, i) => (
            <ellipse key={`coin-${i}`} cx="55" cy={coin.y} rx="22" ry="6" fill="#f59e0b" opacity={coin.opacity} />
          ))}
          <ellipse cx="55" cy="92" rx="22" ry="6" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.8" />
          <text x="55" y="96" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold" opacity="0.8">$</text>
          <path d="M90 150 Q110 100 130 70 L150 50" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <polygon points="150,50 140,55 145,65" fill="#10b981" opacity="0.8" />
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x="120" y="100" width="45" height="22" rx="8" fill="#10b981" opacity="0.15" />
            <text x="142" y="115" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold" opacity="0.8">+24%</text>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}

// 7. Admin Illustration - Server & Settings
export function AnimatedAdminIllustration() {
  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <motion.div animate={{ rotateY: [0, 5, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {[0, 1, 2].map(i => (
            <g key={`server-${i}`}>
              <rect x="40" y={40 + i * 35} width="100" height="28" rx="6" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
              <motion.circle
                cx="55" cy={54 + i * 35} r="3" fill="#10b981"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
              <circle cx="68" cy={54 + i * 35} r="3" fill="#f59e0b" opacity="0.3" />
              <circle cx="81" cy={54 + i * 35} r="3" fill="#06b6d4" opacity="0.3" />
              {[0,1,2,3,4].map(j => (
                <rect key={`slot-${i}-${j}`} x={95 + j * 8} y={48 + i * 35} width="5" height="12" rx="1" fill="#8b5cf6" opacity="0.15" />
              ))}
            </g>
          ))}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 50px' }}
          >
            <circle cx="150" cy="50" r="14" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.3" />
            <circle cx="150" cy="50" r="5" fill="#8b5cf6" opacity="0.2" />
            {[0,1,2,3,4,5].map(i => (
              <rect key={`gear-${i}`} x="147" y="33" width="6" height="8" rx="2" fill="#8b5cf6" opacity="0.25" transform={`rotate(${i * 60} 150 50)`} />
            ))}
          </motion.g>
          <ellipse cx="145" cy="165" rx="15" ry="5" fill="#8b5cf6" opacity="0.2" />
          <rect x="130" y="165" width="30" height="10" fill="#8b5cf6" opacity="0.1" />
          <ellipse cx="145" cy="175" rx="15" ry="5" fill="#8b5cf6" opacity="0.15" />
        </svg>
      </motion.div>
    </div>
  )
}

// 8. Auth Page Animated Illustration
export function AnimatedAuthIllustration() {
  return (
    <div className="w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
      <motion.div
        animate={{ rotateY: [0, 8, -8, 0], rotateX: [0, -3, 3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="preserve-3d"
      >
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
          <defs>
            <linearGradient id="authGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="120" cy="120" r="110"
            stroke="#10b981" strokeWidth="0.5" fill="none" opacity="0.15"
            animate={{ r: [110, 112, 110] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx="120" cy="120" r="90" fill="url(#authGrad)" />
          <motion.g
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '120px 110px' }}
          >
            <circle cx="120" cy="95" r="25" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M110 115 L105 145 L120 135 L135 145 L130 115 Z" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="1" />
          </motion.g>
          {[0, 1, 2].map(i => (
            <motion.g
              key={`key-${i}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '120px 120px' }}
            >
              <g transform={`rotate(${i * 120} 120 120)`}>
                <circle cx="120" cy="25" r="4" fill="#f59e0b" opacity="0.5" />
                <rect x="118" y="29" width="4" height="10" rx="1" fill="#f59e0b" opacity="0.4" />
              </g>
            </motion.g>
          ))}
          {[
            { x: 40, y: 60, d: 0 }, { x: 200, y: 80, d: 0.5 },
            { x: 50, y: 170, d: 1 }, { x: 190, y: 180, d: 1.5 },
          ].map((p, i) => (
            <motion.circle
              key={`fp-${i}`}
              cx={p.x} cy={p.y} r="2" fill="#10b981" opacity="0.3"
              animate={{ y: [p.y, p.y - 10, p.y], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: p.d }}
            />
          ))}
          <rect x="85" y="80" width="70" height="60" rx="8" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.15" />
        </svg>
      </motion.div>
    </div>
  )
}

// 9. Loading Animation - Full page
export function AnimatedLoader({ text = 'جارٍ التحميل...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]" dir="rtl">
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 mb-4"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <motion.circle
            cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="2" strokeDasharray="8 16" fill="none"
            animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '32px 32px' }}
          />
          <motion.circle
            cx="32" cy="32" r="18" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 12" fill="none"
            animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '32px 32px' }}
          />
          <circle cx="32" cy="32" r="6" fill="#10b981" opacity="0.3" />
        </svg>
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-muted-foreground text-sm"
      >
        {text}
      </motion.p>
    </div>
  )
}

// 10. Empty State Illustration
export function AnimatedEmptyState({ type = 'default' }: { type?: 'default' | 'association' | 'member' | 'event' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          {type === 'association' && (
            <>
              <rect x="30" y="20" width="60" height="60" rx="6" fill="rgba(16,185,129,0.05)" stroke="#10b981" strokeWidth="1" opacity="0.3" />
              <polygon points="30,20 60,5 90,20" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1" opacity="0.3" />
              {[0,1,2].map(i => [0,1].map(j => (
                <rect key={`ew-${i}-${j}`} x={38+j*22} y={32+i*18} width="14" height="10" rx="2" fill="#10b981" opacity="0.15" />
              )))}
            </>
          )}
          {type === 'member' && (
            <>
              <circle cx="60" cy="30" r="15" fill="rgba(6,182,212,0.05)" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
              <path d="M35 80 Q60 55 85 80" fill="rgba(6,182,212,0.05)" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
            </>
          )}
          {type === 'event' && (
            <>
              <rect x="30" y="15" width="60" height="65" rx="6" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
              <rect x="30" y="15" width="60" height="18" rx="6" fill="rgba(245,158,11,0.08)" />
              <circle cx="60" cy="55" r="8" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
            </>
          )}
          {type === 'default' && (
            <>
              <circle cx="60" cy="40" r="25" fill="rgba(16,185,129,0.05)" stroke="#10b981" strokeWidth="1" opacity="0.3" />
              <path d="M48 40 L60 52 L72 32" stroke="#10b981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  )
}
