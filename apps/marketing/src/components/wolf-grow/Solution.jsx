// Solution - The Exploded Phone
// E14-4: Apple-style exploded view with scroll-linked parallax

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE } from './motion'

const FEATURES = [
  {
    title: 'Scientific Structure',
    desc: 'No random workouts. A progressive curriculum.',
    icon: '📊',
  },
  {
    title: 'Gamified Growth',
    desc: 'Earn badges. Climb the leaderboard. Stay locked in.',
    icon: '🎮',
  },
  {
    title: 'Visual Proof',
    desc: 'Track their progress in real-time.',
    icon: '📈',
  },
]

const LAYERS = [
  { label: 'Video Layer', color: 'from-cyan-500/20 to-cyan-500/5' },
  { label: 'Data Layer', color: 'from-purple-500/20 to-purple-500/5' },
  { label: 'Community Layer', color: 'from-green-500/20 to-green-500/5' },
]

export function Solution() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Layer transforms - expand outward on scroll
  const layer1Y = useTransform(scrollYProgress, [0.2, 0.6], [0, -80])
  const layer2Y = useTransform(scrollYProgress, [0.2, 0.6], [0, -160])
  const layer3Y = useTransform(scrollYProgress, [0.2, 0.6], [0, -240])

  const layer1Scale = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.95])
  const layer2Scale = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.9])
  const layer3Scale = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.85])

  const phoneRotate = useTransform(scrollYProgress, [0.2, 0.6], [0, -5])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] md:min-h-[200vh] bg-[#050505] py-16 md:py-32"
    >
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden py-8 md:py-0">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE.reveal }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-6xl font-bebas tracking-[-0.02em] text-white mb-4 md:mb-6"
            >
              15 MINUTES.
              <br />
              ZERO COMMUTE.
              <br />
              <span className="text-cyan-400">PRO RESULTS.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE.reveal }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg leading-relaxed mb-8"
            >
              We replaced the drive to the gym with consistency.
              <br /><br />
              YP isn't just "drills." It is a complete athletic operating system.
              Our AI-native platform delivers the exact warm-ups, plyometrics, and
              barefoot durability work used by NBA and Premier League athletes.
            </motion.p>

            {/* Features */}
            <div className="space-y-4">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE.reveal }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating quote */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 text-cyan-400 text-lg italic"
            >
              "It's like having a Pro Trainer in their pocket 24/7."
            </motion.p>
          </div>

          {/* Right: Exploded Phone */}
          <div className="order-1 lg:order-2 relative h-[350px] md:h-[500px] flex items-center justify-center perspective-1000">
            {/* Layer 3 - Back (hidden on mobile for performance) */}
            <motion.div
              style={{ y: layer3Y, scale: layer3Scale }}
              className={`hidden md:flex absolute w-[260px] h-[520px] rounded-[40px] bg-gradient-to-b ${LAYERS[2].color} border border-white/10 backdrop-blur-sm`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">{LAYERS[2].label}</span>
              </div>
            </motion.div>

            {/* Layer 2 - Middle (hidden on mobile for performance) */}
            <motion.div
              style={{ y: layer2Y, scale: layer2Scale }}
              className={`hidden md:flex absolute w-[260px] h-[520px] rounded-[40px] bg-gradient-to-b ${LAYERS[1].color} border border-white/10 backdrop-blur-sm`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">{LAYERS[1].label}</span>
              </div>
            </motion.div>

            {/* Layer 1 - Front (simplified on mobile) */}
            <motion.div
              style={{ y: layer1Y, scale: layer1Scale }}
              className={`hidden md:flex absolute w-[260px] h-[520px] rounded-[40px] bg-gradient-to-b ${LAYERS[0].color} border border-white/10 backdrop-blur-sm`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/40 uppercase tracking-wider">{LAYERS[0].label}</span>
              </div>
            </motion.div>

            {/* Phone Frame - Top */}
            <motion.div
              style={{ rotateX: phoneRotate }}
              className="relative w-[220px] md:w-[280px] h-[440px] md:h-[560px] rounded-[40px] md:rounded-[50px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-4 border-[#2a2a2a] shadow-2xl overflow-hidden"
            >
              {/* Screen */}
              <div className="absolute inset-2 rounded-[32px] md:rounded-[42px] bg-[#050505] overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-5 md:h-6 bg-black rounded-b-2xl" />

                {/* App UI Mockup */}
                <div className="absolute inset-0 pt-10 px-4">
                  {/* Status bar */}
                  <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-cyan-400 rounded-sm" />
                    </div>
                  </div>

                  {/* App content mockup */}
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 bg-cyan-400/30 rounded" />
                    <div className="h-24 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-4xl">🐺</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded" />
                    <div className="h-2 w-4/5 bg-gray-800 rounded" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-16 bg-cyan-500/10 rounded-lg" />
                      <div className="h-16 bg-cyan-500/10 rounded-lg" />
                      <div className="h-16 bg-cyan-500/10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution
