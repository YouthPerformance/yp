"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════
// HERO SECTION - "The Performance Scientist"
// Full-screen cinematic hero with script tagline
// ═══════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0">
        {/* Background Image (placeholder for video) */}
        <Image
          src="/images/james/jamesjimmyside.webp"
          alt="James Scott training"
          fill
          priority
          className="object-cover object-center"
          style={{ filter: "grayscale(100%) contrast(1.1)" }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/40 to-[#050505]" />

        {/* Vignette Effect */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.6) 100%)",
          }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
            Human Performance Specialist
          </span>
        </motion.div>

        {/* Main Headline - Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 font-bebas text-[15vw] font-bold uppercase leading-[0.85] tracking-tight text-white mix-blend-difference md:text-[12vw]"
        >
          The Performance
          <br />
          Scientist
        </motion.h1>

        {/* Tagline - Script/Philosophy Font */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-4 font-playfair text-2xl italic text-cyan-400 md:text-3xl lg:text-4xl"
        >
          "Weak feet don&apos;t eat."
        </motion.p>

        {/* Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-white/50"
        >
          Coach James Scott
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
