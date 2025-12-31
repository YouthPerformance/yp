// WolfBentoGrid - The Wolf Protocol Solutions Grid
// "James Scott" Manifesto Voice - Hard Truths & Biological Reality
// Features: Scanner Effect, Glow Borders, 3D Tilt

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EASE, COLORS } from './motion'

// Spring config for tilt effect
const springConfig = {
  damping: 30,
  stiffness: 150,
  mass: 1.5
}

// Tiltable Card wrapper with glow border
function TiltCard({ children, className = '', glowColor = 'cyan', hasScanner = false }) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)
  const scale = useSpring(1, springConfig)

  // Scanner position for the scanning effect
  const scannerY = useSpring(useMotionValue(0), { damping: 50, stiffness: 80 })

  function handleMouse(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    const rotationX = (offsetY / (rect.height / 2)) * -8
    const rotationY = (offsetX / (rect.width / 2)) * 8
    rotateX.set(rotationX)
    rotateY.set(rotationY)
  }

  function handleMouseEnter() {
    setIsHovered(true)
    scale.set(1.02)
    // Start scanner animation
    if (hasScanner) {
      scannerY.set(100)
    }
  }

  function handleMouseLeave() {
    setIsHovered(false)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    if (hasScanner) {
      scannerY.set(0)
    }
  }

  const glowStyles = {
    cyan: 'shadow-[0_0_30px_rgba(0,255,255,0.15)] hover:shadow-[0_0_50px_rgba(0,255,255,0.25)]',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.25)]',
  }

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`
          relative h-full w-full rounded-2xl overflow-hidden
          border border-cyan-500/30
          transition-shadow duration-500
          ${glowStyles[glowColor]}
        `}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow border overlay */}
        <div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none z-10
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, transparent 50%, rgba(0,255,255,0.05) 100%)',
          }}
        />

        {/* Scanner effect - vertical scanning line */}
        {hasScanner && (
          <motion.div
            className="absolute left-0 right-0 h-1 z-20 pointer-events-none"
            style={{
              top: useTransform(scannerY, [0, 100], ['0%', '100%']),
              background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)',
              boxShadow: '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.3)',
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {children}
      </motion.div>
    </motion.div>
  )
}

// Slot 1: THE ENGINE - Large Vertical
function EngineSlot() {
  return (
    <TiltCard className="lg:col-span-2 lg:row-span-2" glowColor="cyan">
      <div className="relative h-full bg-[#0a0a0a] p-6 md:p-10">
        {/* Gradient background */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />

        {/* Icon */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl ring-1 flex items-center justify-center bg-cyan-500/10 ring-cyan-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4" />
              <path d="m6.8 14-3.5 2" />
              <path d="m20.7 16-3.5-2" />
              <path d="M6.8 10 3.3 8" />
              <path d="m20.7 8-3.5 2" />
              <path d="m9 22 3-8 3 8" />
              <path d="M8 22h8" />
              <circle cx="12" cy="10" r="4" />
            </svg>
          </div>
        </div>

        {/* Headline - Bebas Neue style */}
        <h3 className="font-bebas text-3xl md:text-4xl lg:text-5xl tracking-wide text-white uppercase mb-2">
          THE 24/7 BIOMETRIC COACH
        </h3>

        {/* Subhead - Cyan accent */}
        <p className="text-cyan-400 font-semibold text-lg md:text-xl mb-6">
          "Stop guessing. Start evolving."
        </p>

        {/* Body - Manifesto voice */}
        <p className="text-neutral-300 leading-relaxed max-w-2xl">
          Traditional training is dumb. It treats your athlete like a static machine.
          The Wolf is a living algorithm that adapts to their biology in real-time.
          If they are stiff, we release. If they are weak, we reload.
          It's not just a workout app; it's a sniper rifle against mediocrity.
          We don't just train the body; we re-code the operating system.
        </p>

        {/* App UI Visualization */}
        <div className="mt-8 relative">
          <div className="grid grid-cols-3 gap-3">
            {/* Wolf Card evolving */}
            <div className="col-span-2 h-40 rounded-xl bg-gradient-to-br from-cyan-900/30 to-cyan-950/50 border border-cyan-500/20 p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐺</span>
                <span className="text-xs text-cyan-400 font-medium">WOLF CARD</span>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">ADAPTATION SCORE</div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '78%' }}
                    transition={{ duration: 1.5, ease: EASE.reveal }}
                    viewport={{ once: true }}
                  />
                </div>
                <div className="text-right text-xs text-cyan-400 mt-1">78%</div>
              </div>
            </div>

            {/* Ticker */}
            <div className="h-40 rounded-xl bg-neutral-900/80 border border-neutral-800 p-3 overflow-hidden">
              <div className="text-[10px] text-neutral-500 mb-2">LIVE FEED</div>
              <div className="space-y-2 text-[11px]">
                <div className="text-green-400">+12 Mobility</div>
                <div className="text-cyan-400">+8 Power</div>
                <div className="text-purple-400">+15 Durability</div>
                <div className="text-emerald-400">+5 Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// Slot 2: THE SCIENCE - Small Square with Scanner
function ScienceSlot() {
  return (
    <TiltCard className="lg:col-span-1" glowColor="cyan" hasScanner={true}>
      <div className="relative h-full bg-[#0a0a0a] p-6">
        {/* Anatomical foot diagram background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Simplified foot fascia diagram */}
            <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1" />
            <path d="M60 60 Q100 40 140 60" fill="none" stroke="rgba(0,255,255,0.4)" strokeWidth="0.5" />
            <path d="M50 100 Q100 80 150 100" fill="none" stroke="rgba(0,255,255,0.4)" strokeWidth="0.5" />
            <path d="M55 140 Q100 120 145 140" fill="none" stroke="rgba(0,255,255,0.4)" strokeWidth="0.5" />
            {/* Glowing fascia points */}
            <circle cx="70" cy="70" r="3" fill="rgba(0,255,255,0.6)" />
            <circle cx="130" cy="70" r="3" fill="rgba(0,255,255,0.6)" />
            <circle cx="100" cy="100" r="4" fill="rgba(0,255,255,0.8)" />
            <circle cx="80" cy="140" r="3" fill="rgba(0,255,255,0.6)" />
            <circle cx="120" cy="140" r="3" fill="rgba(0,255,255,0.6)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="h-10 w-10 rounded-xl ring-1 flex items-center justify-center bg-cyan-500/10 ring-cyan-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          {/* Headline */}
          <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-white uppercase mb-2">
            THE ANTI-FRAGILE BLUEPRINT
          </h3>

          {/* Subhead */}
          <p className="text-cyan-400 font-semibold text-sm md:text-base mb-4">
            "Shoes are coffins. We wake the dead."
          </p>

          {/* Body */}
          <p className="text-neutral-400 text-sm leading-relaxed">
            The industry sold you cushioning. They sold you weakness.
            They turned your athlete's feet into numb, fragile blocks of bone.
            We delete the 'Piston' mechanics that cause ACL tears and install the 'Spring.'
            Pure, elastic power.
          </p>

          {/* Tag */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] bg-cyan-500/10 rounded-full px-3 py-1 ring-1 text-cyan-300 ring-cyan-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              BIOMETRIC ANALYSIS
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// Slot 3: THE COMMUNITY - Small Square with Globe
function CommunitySlot() {
  return (
    <TiltCard className="lg:col-span-1" glowColor="cyan">
      <div className="relative h-full bg-[#0a0a0a] p-6 overflow-hidden">
        {/* Mini Globe visualization */}
        <div className="absolute -right-10 -top-10 w-40 h-40 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5" />
            <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="0.5" />
            <ellipse cx="50" cy="50" rx="15" ry="40" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="0.5" />
            {/* Connection arcs */}
            <path d="M20 30 Q50 20 80 35" fill="none" stroke="rgba(0,255,255,0.5)" strokeWidth="1">
              <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M25 70 Q50 80 75 65" fill="none" stroke="rgba(0,255,255,0.5)" strokeWidth="1">
              <animate attributeName="stroke-opacity" values="0.5;0.3;0.5" dur="2.5s" repeatCount="indefinite" />
            </path>
            {/* City points */}
            <circle cx="30" cy="35" r="2" fill="rgba(0,255,255,0.8)">
              <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="40" r="2" fill="rgba(0,255,255,0.8)">
              <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="65" r="2" fill="rgba(0,255,255,0.8)">
              <animate attributeName="r" values="2;3;2" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="h-10 w-10 rounded-xl ring-1 flex items-center justify-center bg-cyan-500/10 ring-cyan-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>

          {/* Headline */}
          <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-white uppercase mb-2">
            THE GLOBAL HUNTER NETWORK
          </h3>

          {/* Subhead */}
          <p className="text-cyan-400 font-semibold text-sm md:text-base mb-4">
            "Your local competition is irrelevant."
          </p>

          {/* Body */}
          <p className="text-neutral-400 text-sm leading-relaxed">
            Being the best in your zip code is a trap. It breeds complacency.
            We drop your athlete into a live ecosystem of killers from Shanghai to Los Angeles.
            The Wolf Pack doesn't care about your feelings; it cares about your rank.
          </p>

          {/* Live indicator */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs text-neutral-500">2,847 wolves active now</span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// Slot 4: THE ROI - Wide Rectangle
function ROISlot() {
  return (
    <TiltCard className="lg:col-span-2" glowColor="cyan">
      <div className="relative h-full bg-[#0a0a0a] p-6 md:p-8">
        {/* Gradient trend graph background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(0,255,255,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 80 Q50 70 100 60 T200 40 T300 25 T400 10 L400 100 L0 100 Z"
              fill="url(#graphGradient)"
            />
            <path
              d="M0 80 Q50 70 100 60 T200 40 T300 25 T400 10"
              fill="none"
              stroke="rgba(0,255,255,0.6)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            {/* Icon */}
            <div className="h-10 w-10 rounded-xl ring-1 flex items-center justify-center bg-emerald-500/10 ring-emerald-500/30 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>

            {/* Headline */}
            <h3 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-wide text-white uppercase mb-2">
              THE ASSET PROTECTION REPORT
            </h3>

            {/* Subhead */}
            <p className="text-cyan-400 font-semibold text-sm md:text-base mb-4">
              "Don't fund a broken machine."
            </p>

            {/* Body */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
              You are investing thousands in travel teams and gear, but ignoring the engine.
              This dashboard is your weekly truth serum. We track Durability, Consistency, and Biological ROI.
              You will know—down to the rep—if your investment is compounding or crashing.
              Trust is good. Data is better.
            </p>
          </div>

          {/* Mini Dashboard */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4">
              <div className="text-[10px] text-neutral-500 mb-3 uppercase tracking-wider">Parent Dashboard</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Durability</span>
                    <span className="text-emerald-400">+23%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '87%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Consistency</span>
                    <span className="text-cyan-400">+18%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-500"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '72%' }}
                      transition={{ duration: 1, delay: 0.4 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Bio ROI</span>
                    <span className="text-purple-400">+31%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '94%' }}
                      transition={{ duration: 1, delay: 0.6 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Weekly Report</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                    Compounding
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// Main Bento Grid Component
export function WolfBentoGrid() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      {/* Section Header */}
      <motion.div
        className="mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE.reveal }}
        viewport={{ once: true }}
      >
        <p className="text-sm font-medium text-cyan-400/70 uppercase tracking-widest mb-2">
          The Wolf Protocol
        </p>
        <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white uppercase">
          Hard Truths. Biological Reality.
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mt-4 text-neutral-400">
          We don't sell features. We diagnose the disease and offer the cure.
          This is the anti-fragile system that turns potential into power.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Row 1: Engine (2/3) + Science (1/3) */}
        <div className="lg:col-span-2 lg:row-span-2">
          <EngineSlot />
        </div>
        <div className="lg:col-span-1 min-h-[300px] lg:min-h-0">
          <ScienceSlot />
        </div>

        {/* Row 2: Community (1/3) - fills next to Engine */}
        <div className="lg:col-span-1 min-h-[300px] lg:min-h-0">
          <CommunitySlot />
        </div>

        {/* Row 3: ROI (full width on mobile, 2/3 on desktop) */}
        <div className="lg:col-span-3">
          <ROISlot />
        </div>
      </motion.div>

      {/* Bottom CTA hint */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <p className="text-neutral-500 text-sm italic">
          "We sharpen the blade. You point it."
        </p>
      </motion.div>
    </section>
  )
}

export default WolfBentoGrid
