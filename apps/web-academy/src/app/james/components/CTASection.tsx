"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// CTA SECTION
// Final conversion section with magnetic button
// ═══════════════════════════════════════════════════════════

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 font-bebas text-5xl uppercase tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Ready to Fix
          <br />
          Your Foundation?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 text-lg text-white/60 md:text-xl"
        >
          The same methodology used by Jimmy Butler, Josh Oliver,
          <br className="hidden md:block" />
          and hundreds of pro athletes—now available to you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* Primary CTA */}
          <Link
            href="/programs/barefoot-reset"
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#FF4500] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#FF5500] hover:shadow-[0_0_30px_rgba(255,69,0,0.4)]"
          >
            Start the Barefoot Reset
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/playbook"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white/70 transition-all hover:border-white/40 hover:text-white"
          >
            Explore the Playbook
          </Link>
        </motion.div>

        {/* Price Anchor */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-sm text-white/40"
        >
          42-day program • $88 one-time • Money-back guarantee
        </motion.p>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#FF4500]/5 blur-3xl" />
        <div className="absolute -right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#FF4500]/5 blur-3xl" />
      </div>
    </section>
  );
}
