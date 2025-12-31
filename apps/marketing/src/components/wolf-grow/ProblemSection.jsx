/**
 * ProblemSection - Bento Grid: "The Hard Truth"
 *
 * Insert immediately after Hero with gradient fade
 * 4-slot bento grid with provocative anti-industry messaging
 */

import { useRef, useState, Suspense, lazy } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EASE, COLORS } from './motion'

// Lazy load the lightweight cobe globe
const TrainingGlobe = lazy(() => import('../../tests/TrainingGlobe'))

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
    red: 'shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:shadow-[0_0_50px_rgba(239,68,68,0.25)]',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_50px_rgba(16,185,129,0.25)]',
    amber: 'shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.25)]',
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

        {/* Scanner effect */}
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

// SLOT 1: THE ENGINE - "THE $200 LIE" - Large Vertical Left
function EngineSlot() {
  return (
    <TiltCard className="h-full" glowColor="red">
      <div className="relative h-full bg-[#0a0a0a] p-6 md:p-10 flex flex-col">
        {/* Gradient background */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl" />

        {/* Icon - Dollar/Warning */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl ring-1 flex items-center justify-center bg-red-500/10 ring-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-xs font-medium text-red-400/70 uppercase tracking-widest">The Industry Lie</span>
        </div>

        {/* Headline */}
        <h3 className="font-bebas text-4xl md:text-5xl lg:text-6xl tracking-wide text-white uppercase mb-2">
          THE $200 LIE
        </h3>

        {/* Subhead */}
        <p className="text-red-400 font-semibold text-lg md:text-xl mb-6">
          "You are paying a premium to weaken their feet."
        </p>

        {/* Body - Manifesto voice */}
        <p className="text-neutral-300 leading-relaxed text-base md:text-lg flex-grow">
          For 20 years, the industry told you that "More Support" meant "More Safety." They lied.
          By locking your athlete's foot in a rigid, cushioned coffin, you are shutting down their body's
          natural shock absorbers. The result? A generation of fragile "Pistons" and an epidemic of ACL tears.
          We are here to delete the programming that is breaking your child.
        </p>

        {/* Visual: Shoefoot image */}
        <div className="mt-8 relative flex-shrink-0">
          <div className="rounded-xl overflow-hidden border border-red-500/20">
            <img
              src="/images/shoefoot.webp"
              alt="Modern shoes weakening feet - the industry lie"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-xs text-red-400 font-medium uppercase tracking-wider text-center">
              The "Support" Trap
            </p>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// SLOT 2: THE SCIENCE - "THE SILENT KILLER" - Small Square Top Right
function ScienceSlot() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <TiltCard className="h-full" glowColor="cyan" hasScanner={true}>
      <div
        className="relative h-full bg-[#0a0a0a] p-6 transition-shadow duration-500"
        style={{
          boxShadow: isHovered ? '0 0 30px rgba(0, 255, 255, 0.4)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Spring image background - reveals on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/spring.webp"
            alt="The Spring - natural foot mechanics"
            className="w-full h-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: isHovered ? 1 : 0.2 }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.3) 100%)',
              opacity: isHovered ? 0.4 : 0.9
            }}
          />
        </div>

        <div
          className="relative z-10 h-full flex flex-col transition-opacity duration-500"
          style={{ opacity: isHovered ? 0.85 : 1 }}
        >
          {/* Icon */}
          <div className="h-10 w-10 rounded-xl ring-1 flex items-center justify-center bg-cyan-500/10 ring-cyan-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>

          {/* Headline */}
          <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-white uppercase mb-2">
            THE SILENT KILLER
          </h3>

          {/* Subhead */}
          <p className="text-cyan-400 font-semibold text-sm md:text-base mb-4">
            "Why the strongest kids break first."
          </p>

          {/* Body */}
          <p className="text-neutral-400 text-sm leading-relaxed flex-grow">
            Force has to go somewhere. When the foot is asleep (due to modern shoes), the shock bypasses the
            "Spring" and slams directly into the knee and lower back. We don't build muscle; we wake up the nerves.
            We turn the foot back into a sensory weapon that absorbs force before it touches the ACL.
          </p>

          {/* Tag */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] bg-cyan-500/10 rounded-full px-3 py-1 ring-1 text-cyan-300 ring-cyan-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              NERVE ACTIVATION
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// SLOT 3: THE GLOBAL NETWORK - "JOIN THE GLOBAL 1%" - Small Square Mid Right
function GlobalNetworkSlot() {
  return (
    <TiltCard className="h-full" glowColor="cyan">
      <div className="relative h-full bg-[#0a0a0a] overflow-hidden min-h-[320px]">
        {/* Cobe Globe Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Suspense fallback={
            <div className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          }>
            <div className="w-[280px] h-[280px] opacity-70">
              <TrainingGlobe />
            </div>
          </Suspense>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="relative z-10 h-full flex flex-col p-6 justify-end">
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
            JOIN THE GLOBAL 1%
          </h3>

          {/* Subhead */}
          <p className="text-cyan-400 font-semibold text-sm md:text-base mb-3">
            "Active Nodes: Tokyo, London, New York."
          </p>

          {/* Body */}
          <p className="text-neutral-400 text-xs leading-relaxed">
            Talent dies in isolation. We connect your athlete to a live ecosystem of killers worldwide.
            The Protocol is active in 12 languages. When you join the Pack, you tap into military-grade
            training infrastructure used by the world's future elite.
          </p>

          {/* Live indicator */}
          <div className="mt-3 flex items-center gap-2">
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

// SLOT 4: THE ROI - "THE DURABILITY INDEX" - Wide Rectangle Bottom
function ROISlot() {
  return (
    <TiltCard className="h-full" glowColor="amber">
      <div className="relative h-full bg-[#0a0a0a] p-6 md:p-8">
        {/* Gradient trend graph background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="durabilityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(245,158,11,0.4)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 80 Q50 70 100 60 T200 40 T300 25 T400 10 L400 100 L0 100 Z"
              fill="url(#durabilityGradient)"
            />
            <path
              d="M0 80 Q50 70 100 60 T200 40 T300 25 T400 10"
              fill="none"
              stroke="rgba(245,158,11,0.6)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            {/* Icon */}
            <div className="h-10 w-10 rounded-xl ring-1 flex items-center justify-center bg-amber-500/10 ring-amber-500/30 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>

            {/* Headline */}
            <h3 className="font-bebas text-2xl md:text-3xl lg:text-4xl tracking-wide text-white uppercase mb-2">
              THE DURABILITY INDEX
            </h3>

            {/* Subhead */}
            <p className="text-amber-400 font-semibold text-sm md:text-base mb-4">
              "See the risk drop in real-time."
            </p>

            {/* Body */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
              You can't manage what you don't measure. While other parents hope for the best,
              you will track your athlete's "Spring Stiffness" and "Durability Rating" weekly.
              This isn't just training; it is risk management for your athlete's future.
              Stop guessing. Start verifying.
            </p>
          </div>

          {/* Mini Dashboard */}
          <div className="flex-shrink-0 w-full md:w-64">
            <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 p-4">
              <div className="text-[10px] text-neutral-500 mb-3 uppercase tracking-wider">Durability Dashboard</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Spring Stiffness</span>
                    <span className="text-amber-400">78%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '78%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Durability Rating</span>
                    <span className="text-emerald-400">85%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 1, delay: 0.4 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Injury Risk</span>
                    <span className="text-cyan-400">-47%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-500"
                      initial={{ width: '100%' }}
                      whileInView={{ width: '53%' }}
                      transition={{ duration: 1.2, delay: 0.6 }}
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
                    Risk Dropping
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

// Main Problem Bento Grid Component
export default function ProblemSection() {
  return (
    <section className="relative z-10">
      {/* Gradient fade from Hero */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #050505 0%, transparent 100%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Section Header */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-red-400/70 uppercase tracking-widest mb-2">
            The Hard Truth
          </p>
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white uppercase">
            The Industry vs. Reality
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mt-4 text-neutral-400">
            They sold you "protection" while programming fragility into your athlete's body.
            It's time to see what's really happening.
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
          {/* Row 1-2: Engine (2 cols, 2 rows) + Science + Community (stacked on right) */}
          <div className="lg:col-span-2 lg:row-span-2 min-h-[500px] lg:min-h-[600px]">
            <EngineSlot />
          </div>
          <div className="lg:col-span-1 min-h-[280px]">
            <ScienceSlot />
          </div>
          <div className="lg:col-span-1 min-h-[280px]">
            <GlobalNetworkSlot />
          </div>

          {/* Row 3: ROI (full width) */}
          <div className="lg:col-span-3 min-h-[280px]">
            <ROISlot />
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-500 text-sm italic">
            "The truth doesn't care about your comfort zone."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
