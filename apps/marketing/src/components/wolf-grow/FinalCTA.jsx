/**
 * FinalCTA - "THE TICKET TO ENTRY"
 *
 * Digital Gate / Terminal aesthetic
 * Pack ID claim with username input
 * Premium animations and grid background
 */

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function FinalCTA() {
  const [handle, setHandle] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (handle.trim()) {
      // Navigate to signup with handle
      window.location.href = `/join?handle=${encodeURIComponent(handle.trim())}`
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#030303] overflow-hidden"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial fade from center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#030303_70%)]" />
      </div>

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none"
        animate={{
          top: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-cyan-500/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-cyan-500/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            Registration Open
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-center text-white uppercase mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          The Piston Era{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
            Ends Today
          </span>
        </motion.h2>

        {/* Subhead */}
        <motion.p
          className="text-neutral-400 text-center text-lg md:text-xl max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your spot in the Global Node is waiting.{' '}
          <span className="text-white">Secure your Pack ID.</span>
        </motion.p>

        {/* The Terminal Input Group */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Input container with glow */}
          <div
            className={`
              relative flex flex-col sm:flex-row gap-3 sm:gap-0
              p-2 sm:p-1.5 rounded-xl sm:rounded-full
              bg-neutral-900/80 backdrop-blur-sm
              border transition-all duration-500
              ${isFocused
                ? 'border-cyan-500/60 shadow-[0_0_40px_rgba(0,255,255,0.2)]'
                : 'border-neutral-800 shadow-[0_0_20px_rgba(0,255,255,0.05)]'
              }
            `}
          >
            {/* @ Symbol */}
            <div className="hidden sm:flex items-center pl-5 pr-2">
              <span className="text-cyan-500 font-mono text-lg">@</span>
            </div>

            {/* Input Field */}
            <div className="relative flex-1">
              <span className="sm:hidden absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-lg">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="CreateYourHandle"
                maxLength={20}
                className="
                  w-full bg-transparent
                  pl-10 sm:pl-0 pr-4 py-4 sm:py-3
                  text-white font-mono text-base md:text-lg
                  placeholder:text-neutral-600
                  focus:outline-none
                  rounded-lg sm:rounded-none
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!handle.trim()}
              className={`
                group relative px-8 py-4 sm:py-3 rounded-lg sm:rounded-full
                font-bold text-base uppercase tracking-wider
                transition-all duration-300
                ${handle.trim()
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="font-bebas tracking-wider">Claim Pack ID</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={handle.trim() ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </span>
            </button>
          </div>

          {/* Character count */}
          {handle && (
            <motion.p
              className="absolute -bottom-6 right-4 text-xs font-mono text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {handle.length}/20
            </motion.p>
          )}
        </motion.form>

        {/* Footer note */}
        <motion.p
          className="text-center text-neutral-600 text-sm mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Includes <span className="text-neutral-400">7-Day Free Access</span> to the Academy.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-10 pt-8 border-t border-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center">
            <p className="font-mono text-cyan-400 text-sm">2,847+</p>
            <p className="text-neutral-600 text-xs uppercase tracking-wider">Active Wolves</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-cyan-400 text-sm">12</p>
            <p className="text-neutral-600 text-xs uppercase tracking-wider">Countries</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-cyan-400 text-sm">94%</p>
            <p className="text-neutral-600 text-xs uppercase tracking-wider">See Results</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
