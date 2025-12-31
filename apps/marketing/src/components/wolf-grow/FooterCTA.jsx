// FooterCTA - The Grand Slam Offer
// E14-8: Clean conversion section with glowing offer box

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { EASE } from './motion'

const OFFER_STACK = [
  { item: 'Bulletproof Ankles Protocol', value: '$97' },
  { item: 'Athlete Identity Quiz', value: 'Priceless' },
  { item: '6 Weeks Challenge Program', value: 'Included' },
]

export function FooterCTA() {
  const navigate = useNavigate()

  return (
    <section className="relative py-32 bg-[#050505]">
      {/* Background glow - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-cyan-500/10 blur-[100px] md:blur-[200px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bebas tracking-[-0.02em] text-white mb-4">
            READY TO <span className="text-cyan-400">LOCK IN?</span>
          </h2>
        </motion.div>

        {/* Offer Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Animated glow border */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 opacity-75 blur-sm animate-pulse" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400" />

          {/* Content */}
          <div className="relative bg-[#0a0a0a] rounded-2xl p-8 md:p-12">
            {/* Offer stack */}
            <div className="space-y-4 mb-8">
              {OFFER_STACK.map((offer, i) => (
                <motion.div
                  key={offer.item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: EASE.reveal }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <span className="text-cyan-400 text-xl">✓</span>
                  <span className="text-white text-lg flex-1">{offer.item}</span>
                  <span className="text-gray-400 text-sm">
                    (Value: <span className="text-cyan-400">{offer.value}</span>)
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-8" />

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Your Price Today</p>
              <p className="text-5xl font-bebas text-white">
                FREE <span className="text-cyan-400">TO START</span>
              </p>
            </motion.div>

            {/* CTA Button - YP Design Tokens */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/start')}
              className="w-full py-5 bg-[#00F6E0] hover:bg-[#00DCCE] active:bg-[#00BFB0] text-[#000000] font-semibold text-xl rounded-xl relative overflow-hidden group shadow-[0_0_24px_rgba(0,246,224,0.5)] hover:shadow-[0_0_40px_rgba(0,246,224,0.6)] transition-all duration-200"
            >
              <span className="relative z-10">START THE 6 WEEKS CHALLENGE</span>
              {/* Sheen */}
              <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </motion.button>

            {/* Subtext */}
            <p className="text-center text-gray-500 text-sm mt-4">
              No credit card required for the Lead Magnet.
            </p>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12"
        >
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>⚡</span>
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>🐺</span>
            <span>Wolf Approved</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FooterCTA
