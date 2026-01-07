/**
 * Mission Page - THE GROUND WAR MANIFESTO
 *
 * Inspired by superpower.com/manifesto
 * White text on black. Bebas Neue headers. Scroll-driven animations.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

// Animated text that fades in word by word
function AnimatedParagraph({ children, className = '' }) {
  const words = children.split(' ')

  return (
    <motion.p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.17, 0, 0, 1]
          }}
          viewport={{ once: true, margin: '-10%' }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

// Section component with fade-in
function ManifestoSection({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.17, 0, 0, 1] }}
      viewport={{ once: true, margin: '-5%' }}
      className={`py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  )
}

// Big statement text
function Statement({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.17, 0, 0, 1] }}
      viewport={{ once: true }}
      className="font-bebas text-4xl md:text-6xl lg:text-7xl tracking-wide text-white uppercase leading-[1.1] mb-8"
    >
      {children}
    </motion.h2>
  )
}

// Accent statement (cyan highlight)
function AccentStatement({ children }) {
  return (
    <motion.h3
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.17, 0, 0, 1] }}
      viewport={{ once: true }}
      className="font-bebas text-3xl md:text-5xl lg:text-6xl tracking-wide text-cyan-400 uppercase leading-[1.1] mb-12"
    >
      {children}
    </motion.h3>
  )
}

// Full-width image with parallax reveal
function ManifestoImage({ src, alt }) {
  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.17, 0, 0, 1] }}
        viewport={{ once: true }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.17, 0, 0, 1] }}
          viewport={{ once: true }}
        />
        {/* Gradient overlays for seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      </motion.div>
    </div>
  )
}

export default function Mission() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Progress bar at top
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.17, 0, 0, 1] }}
          >
            <h1 className="font-bebas text-6xl md:text-8xl lg:text-[10rem] tracking-wider text-white uppercase leading-none mb-6">
              THE GROUND WAR
            </h1>
            <p className="font-bebas text-2xl md:text-4xl tracking-[0.3em] text-cyan-400 uppercase">
              MANIFESTO
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: THE WAKE UP CALL */}
      <ManifestoSection>
        <div className="max-w-4xl mx-auto px-6">
          <Statement>WE ARE WATCHING A GENERATION BREAK.</Statement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            Look at the sidelines. Look at the injury reports. ACL tears. Achilles ruptures. Stress fractures. Athletes are bigger, faster, and stronger than ever before. And yet, they have never been more fragile.
          </AnimatedParagraph>

          <AccentStatement>WHY?</AccentStatement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            Because for twenty years, the industry sold you a lie. They told you power comes from muscles. They told you protection comes from foam. They told you the foot is a dumb block of bone meant to be taped, braced, and silenced.
          </AnimatedParagraph>

          <Statement>THEY WERE WRONG.</Statement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-12">
            While they were building bigger engines, they forgot the tires. While they were obsessing over the output, they severed the input. They treated the human body like a collection of parts. They treated you like a Piston.
          </AnimatedParagraph>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-bebas text-4xl md:text-6xl text-cyan-400 uppercase tracking-wide"
          >
            It is time to become a Spring.
          </motion.p>
        </div>
      </ManifestoSection>

      {/* Image 1 */}
      <ManifestoImage src="/images/academy/1.webp" alt="Athletes training" />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      {/* SECTION 2: THE ENEMY */}
      <ManifestoSection className="bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-600 text-sm uppercase tracking-[0.3em] mb-4"
          >
            Section 02
          </motion.p>

          <Statement>THE LIE OF THE CUSHION.</Statement>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span
              className="inline-block font-bebas text-sm tracking-[0.2em] uppercase px-3 py-1 mb-4"
              style={{
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid #FF0000',
                color: '#FF0000'
              }}
            >
              SENSORY DEPRIVATION
            </span>
          </motion.div>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            Modern shoes are sensory deprivation chambers. Thick foam. Rigid plastic. Narrow toe boxes. They blindfold your feet.
          </AnimatedParagraph>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-12">
            When your brain cannot feel the ground, it panics. It throttles your speed. It destabilizes your ankles. It puts a governor on your engine to protect you from what it cannot see.
          </AnimatedParagraph>

          <AccentStatement>YOU CANNOT DOMINATE WHAT YOU CANNOT FEEL.</AccentStatement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-300 leading-loose">
            We built stronger engines and bolted them onto flat tires. The result? Glass Cannons standing on wet cardboard.
          </AnimatedParagraph>
        </div>
      </ManifestoSection>

      {/* Image 2 */}
      <ManifestoImage src="/images/academy/2.webp" alt="Ground connection" />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      {/* SECTION 3: THE PHILOSOPHY */}
      <ManifestoSection>
        <div className="max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-600 text-sm uppercase tracking-[0.3em] mb-4"
          >
            Section 03
          </motion.p>

          <Statement>WEAK FEET DON'T EAT.</Statement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            Strength does not fall from the sky. It rises from the ground. Every sprint, every cut, every dunk starts with a single micro-second of truth: The contact point.
          </AnimatedParagraph>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-12">
            If the foot collapses, the knee twists. If the arch leaks, the power dies. If the foundation lies, the roof pays the bill.
          </AnimatedParagraph>

          <AccentStatement>WE ARE FLIPPING THE PYRAMID.</AccentStatement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-300 leading-loose">
            No more heavy lifts on weak arches. No more "vertical jump programs" on unstable ankles. We do not train the athlete until we train the sensor.
          </AnimatedParagraph>
        </div>
      </ManifestoSection>

      {/* Image 3 */}
      <ManifestoImage src="/images/academy/3.webp" alt="Foundation training" />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      {/* SECTION 4: THE SCIENCE */}
      <ManifestoSection className="bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-600 text-sm uppercase tracking-[0.3em] mb-4"
          >
            Section 04
          </motion.p>

          <Statement>BIOLOGY OVER TECHNOLOGY.</Statement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            Your foot is an architectural marvel. 26 Bones. 33 Joints. 200,000 Nerve Endings. It is designed to be a Spring, not a strut.
          </AnimatedParagraph>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-12">
            A Piston burns fuel to move. It grinds. It overheats. It breaks. A Spring recycles energy. It absorbs. It recoils. It flows.
          </AnimatedParagraph>

          <AccentStatement>PISTONS PUSH. SPRINGS FLY.</AccentStatement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-300 leading-loose">
            We are deleting the old operating system. We are restoring the Tripod. We are tensioning the Arch. We are turning the Big Toe into a crowbar.
          </AnimatedParagraph>
        </div>
      </ManifestoSection>

      {/* Image 4 */}
      <ManifestoImage src="/images/academy/4.webp" alt="Spring power" />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      {/* SECTION 5: THE CALL TO ACTION */}
      <ManifestoSection>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-600 text-sm uppercase tracking-[0.3em] mb-4"
          >
            Section 05
          </motion.p>

          <Statement>THIS IS THE GROUND WAR.</Statement>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-8">
            We are not here to sell you a cushion. We are here to wake you up.
          </AnimatedParagraph>

          <AnimatedParagraph className="text-xl md:text-2xl text-gray-200 leading-loose mb-12">
            We are shifting the battlefield from the weight room to the floor. We are rejecting the brace. We are re-sensitizing the human machine.
          </AnimatedParagraph>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-bebas text-5xl md:text-7xl lg:text-8xl tracking-wide text-cyan-400 uppercase leading-none mb-4">
              WELCOME TO THE RESISTANCE.
            </h2>
          </motion.div>
        </div>
      </ManifestoSection>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-black to-neutral-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-bebas text-6xl md:text-8xl lg:text-9xl tracking-wider text-white uppercase leading-none mb-12"
          >
            LOCK IN.<br />
            <span className="text-cyan-400">LEVEL UP.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/start"
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-10 py-5 rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:shadow-[0_0_60px_rgba(0,255,255,0.6)]"
            >
              <span className="font-bebas text-xl tracking-wider">JOIN THE PACK</span>
            </Link>
            <Link
              to="/"
              className="inline-block border border-white/20 hover:border-white/40 text-white font-medium px-10 py-5 rounded-xl transition-all duration-300"
            >
              <span className="font-bebas text-xl tracking-wider">BACK TO HOME</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Kill Switch CTA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/shop"
              className="inline-block w-full md:w-auto px-12 py-6 bg-[#00F0FF] hover:bg-white text-black font-bebas text-3xl tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
              style={{
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}
            >
              JOIN THE RESISTANCE
              <span className="block text-sm font-sans font-bold tracking-normal opacity-70 mt-1">
                Shop Batch 001
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-neutral-700 text-xs uppercase tracking-[0.2em]">
            ELITE TRAINING FOR EVERY KID, EVERYWHERE.
          </p>
        </div>
      </footer>
    </div>
  )
}
