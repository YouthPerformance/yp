// Community - The Pack
// E14-7: UGC collage with global connection visualization

import { motion } from 'framer-motion'
import { EASE, staggerContainer } from './motion'

const UGC_GRID = [
  { id: 1, aspect: 'square', delay: 0 },
  { id: 2, aspect: 'portrait', delay: 0.1 },
  { id: 3, aspect: 'square', delay: 0.2 },
  { id: 4, aspect: 'landscape', delay: 0.15 },
  { id: 5, aspect: 'square', delay: 0.25 },
  { id: 6, aspect: 'portrait', delay: 0.3 },
]

const GLOBAL_DOTS = [
  { x: '20%', y: '30%', label: 'USA' },
  { x: '48%', y: '25%', label: 'UK' },
  { x: '75%', y: '35%', label: 'China' },
  { x: '55%', y: '45%', label: 'UAE' },
  { x: '85%', y: '60%', label: 'AUS' },
]

export function Community() {
  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden">
      {/* World map overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          {/* Simplified world outline */}
          <ellipse cx="50" cy="25" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-cyan-400" />
        </svg>
      </div>

      {/* Animated dots - show fewer on mobile */}
      {GLOBAL_DOTS.map((dot, i) => (
        <motion.div
          key={dot.label}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className={`absolute ${i > 2 ? 'hidden md:block' : ''}`}
          style={{ left: dot.x, top: dot.y }}
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="w-2 md:w-3 h-2 md:h-3 bg-cyan-400 rounded-full"
          />
          {/* Connection lines - hidden on mobile for performance */}
          <svg className="hidden md:block absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.line
              x1="50%"
              y1="50%"
              x2={`${50 + (Math.random() - 0.5) * 80}%`}
              y2={`${50 + (Math.random() - 0.5) * 80}%`}
              stroke="rgba(0, 255, 255, 0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
              viewport={{ once: true }}
            />
          </svg>
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bebas tracking-[-0.02em] text-white mb-4">
            JOIN THE <span className="text-cyan-400">PACK.</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-xl mx-auto">
            Talent is common. Consistency is rare.
          </p>
        </motion.div>

        {/* UGC Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
        >
          {UGC_GRID.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay, duration: 0.6, ease: EASE.reveal }}
              viewport={{ once: true }}
              className={`relative rounded-xl overflow-hidden bg-gray-900 ${
                item.aspect === 'portrait' ? 'row-span-2' :
                item.aspect === 'landscape' ? 'col-span-2' : ''
              }`}
              style={{
                aspectRatio: item.aspect === 'portrait' ? '3/4' :
                             item.aspect === 'landscape' ? '16/9' : '1/1',
              }}
            >
              {/* Placeholder for UGC */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-4xl opacity-30">📸</span>
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Fake caption */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="h-2 w-16 bg-white/20 rounded mb-1" />
                <div className="h-2 w-24 bg-white/10 rounded" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-center text-gray-300 text-lg max-w-2xl mx-auto"
        >
          YP is more than an app. It is a global tribe of young athletes who have
          decided to stop waiting for a miracle and start doing the work.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-lg md:text-xl font-semibold text-white mt-4 md:mt-6 px-4"
        >
          We don't sell shortcuts. We sell the unfair advantage of
          <span className="text-cyan-400"> discipline.</span>
        </motion.p>
      </div>
    </section>
  )
}

export default Community
