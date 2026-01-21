"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════
// HERO SECTION - "Clear Vision" (Simplified v1)
// Full-screen hero with elegant typography
// v2 will add Unicorn Studio WebGL glass distortion
// ═══════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0B1021]">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <Image
          src="/images/adam/adamprofile.png"
          alt="Adam Harrington coaching"
          fill
          priority
          className="object-cover object-top"
          style={{ filter: "brightness(0.7) contrast(1.05)" }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/70 via-[#0B1021]/50 to-[#0B1021]" />

        {/* Vignette Effect */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(11,16,33,0.7) 100%)",
          }}
        />

        {/* Blueprint Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,169,98,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,98,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
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
          <span className="rounded-full border border-[#C9A962]/40 bg-[#C9A962]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A962]">
            NBA Skills Strategist
          </span>
        </motion.div>

        {/* Main Headline - Elegant Serif Style */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 font-serif text-[14vw] font-light uppercase leading-[0.9] tracking-tight text-white md:text-[10vw]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          The
          <br />
          Architect
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-2 text-xl font-light text-[#C9A962] md:text-2xl"
        >
          Building people, not just players.
        </motion.p>

        {/* Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-white/50"
        >
          Adam Harrington
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
            Explore the Resume
          </span>
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
