/**
 * MascotReveal - "Meet YP: Your Pack Leader"
 *
 * The Breathing Wolf - Code-driven animations on static image
 * 1. THE HEARTBEAT: Pulsing cyan glow behind wolf
 * 2. THE HOVER: Subtle floating motion (sine wave)
 * 3. THE SLAM: Heavy spring entrance animation
 */

import { motion } from 'framer-motion'

export default function MascotReveal() {
  return (
    <section className="relative py-20 md:py-32 bg-[#030303] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 90,
            duration: 0.8
          }}
          viewport={{ once: true }}
        >
          {/* The Card */}
          <div className="relative bg-[#050505] rounded-3xl p-8 md:p-12 border border-cyan-500/20 shadow-[0_0_60px_rgba(0,255,255,0.15)] max-w-md w-full">

            {/* THE GLOW - Pulsing Power Aura */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-40 flex items-center justify-center">
              <motion.div
                className="absolute w-full h-full rounded-full bg-cyan-500/40 blur-xl"
                animate={{
                  opacity: [0.4, 0.1, 0.4],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute w-3/4 h-3/4 rounded-full bg-cyan-400/30 blur-lg"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1.2, 1, 1.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
            </div>

            {/* THE MASCOT - Floating Animation */}
            <motion.div
              className="relative z-10 flex justify-center mb-6"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Using YP logo until wolf mascot is ready */}
              <img
                src="/logo/wolffront.png"
                alt="YP - Your Pack Leader"
                className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              />
            </motion.div>

            {/* THE TEXT */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-bebas text-3xl md:text-4xl tracking-wide text-white uppercase mb-2">
                Meet YP: <span className="text-cyan-400">Your Pack Leader</span>
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
                YP is here to guide your athlete through the protocol.
                Real-time coaching, adaptive training, and 24/7 support —
                all powered by AI that understands youth performance.
              </p>

              {/* THE BUTTON */}
              <motion.a
                href="#join"
                className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-bebas tracking-wider">LET'S HUNT</span>
              </motion.a>
            </motion.div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-lg" />
          </div>

          {/* Bottom Tagline */}
          <motion.p
            className="mt-8 text-neutral-600 text-xs uppercase tracking-[0.3em] text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            Powered by AI. Built for Athletes.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
