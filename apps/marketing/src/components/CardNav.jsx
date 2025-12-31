/**
 * CardNav - Premium Room Cards Navigation
 *
 * Styled after drake2/index5 bottom sheet
 * 3 rooms: Performance Center, Courts, Library
 * With thumbnails, icons, badges, and external link chips
 */

import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Room configuration matching drake2 design
const ROOMS = [
  {
    key: 'performance',
    title: 'Performance Center',
    subtitle: 'Academy + Barefoot Reset',
    href: '/programs',
    thumb: '/images/thumb-gym.webp',
    icon: '/images/performanceicon.webp',
    state: 'trial',
    accent: 'emerald'
  },
  {
    key: 'courts',
    title: 'Courts',
    subtitle: 'NeoBall + Spotify Unlocked',
    href: '/courts',
    thumb: '/images/thumb-court.webp',
    icon: '/images/courticon.webp',
    state: 'redeem',
    accent: 'cyan'
  },
  {
    key: 'library',
    title: 'Library',
    subtitle: 'Playbook + Personalized Content',
    href: '/library',
    thumb: '/images/thumb-library.webp',
    icon: '/images/libraryicon.webp',
    state: 'open',
    accent: 'amber'
  }
]

// Badge labels by state
const badgeLabel = (state) => {
  if (state === 'trial') return 'Start trial'
  if (state === 'redeem') return 'Redeem'
  return 'Open'
}

// Accent colors
const accentStyles = {
  emerald: {
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    glow: 'hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  cyan: {
    badge: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    glow: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,246,224,0.2)]'
  },
  amber: {
    badge: 'border-cyan-500/20 bg-cyan-500/8 text-white/90',
    glow: 'hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]'
  }
}

// Single Room Card
function RoomCard({ room, index, onClose }) {
  const styles = accentStyles[room.accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Link
        to={room.href}
        onClick={onClose}
        className={`
          group block relative overflow-hidden rounded-2xl
          bg-gradient-to-b from-[#141414]/95 to-[#0a0a0a]/90
          border border-white/8
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:-translate-y-0.5 active:scale-[0.99]
          ${styles.glow}
        `}
        style={{ padding: '12px' }}
      >
        {/* Thumbnail */}
        <div
          className="relative w-full rounded-xl overflow-hidden mb-3"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={room.thumb}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          {/* Icon chip - bottom left */}
          <div className="absolute left-2 bottom-2 w-[38px] h-[38px] rounded-[14px] grid place-items-center bg-gradient-to-b from-[#141414]/95 to-[#0a0a0a]/90 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-[10px]">
            <img
              src={room.icon}
              alt=""
              className="w-[34px] h-[34px] object-cover rounded-[10px]"
            />
          </div>

          {/* External chip - top right */}
          <div className="absolute right-2 top-2 w-8 h-8 rounded-xl grid place-items-center bg-black/35 border border-white/10 backdrop-blur-[10px] opacity-90">
            <svg
              className="w-4 h-4 stroke-white/85"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M10 7h7v7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-bebas text-lg tracking-wide uppercase text-white leading-tight">
            {room.title}
          </h3>
          <p className="mt-1.5 text-xs text-white/65">
            {room.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between gap-3 mt-3">
            <span className={`
              inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
              text-[11px] tracking-wide uppercase
              border ${styles.badge}
            `}>
              {badgeLabel(room.state)}
            </span>
            <span className="text-xs text-white/55 flex items-center gap-1.5">
              Opens <span className="text-sm">↗</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CardNav({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card Nav Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed top-20 left-4 right-4 z-50 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-64px)] md:max-w-4xl"
          >
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className="text-xs tracking-[0.08em] uppercase text-neutral-500">
                    Explore Campus
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-neutral-500 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Room Cards Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ROOMS.map((room, index) => (
                    <RoomCard
                      key={room.key}
                      room={room}
                      index={index}
                      onClose={onClose}
                    />
                  ))}
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(0,246,224,0.5)] animate-pulse" />
                  <span className="text-xs font-medium text-neutral-500 tracking-wide">
                    ELITE TRAINING FOR EVERY KID, EVERYWHERE.
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
