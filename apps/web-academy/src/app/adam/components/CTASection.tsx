"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// CTA SECTION
// Final conversion section with gold accent
// ═══════════════════════════════════════════════════════════

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B1021] px-6 py-24 md:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 font-serif text-4xl font-light text-[#F5F5F0] md:text-6xl lg:text-7xl"
        >
          Ready to Train with
          <br />
          <span className="text-[#C9A962]">The Architect?</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 text-lg text-[#F5F5F0]/60 md:text-xl"
        >
          The same methodology used by Kevin Durant, Steve Nash,
          <br className="hidden md:block" />
          and NBA champions—now accessible to your young athlete.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* Primary CTA - Gold */}
          <Link
            href="/programs/founders-club"
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#C9A962] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0B1021] transition-all hover:bg-[#D4B872] hover:shadow-[0_0_30px_rgba(201,169,98,0.4)]"
          >
            Join the Founders Club
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/playbook"
            className="inline-flex items-center gap-2 rounded-full border border-[#F5F5F0]/20 px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#F5F5F0]/70 transition-all hover:border-[#F5F5F0]/40 hover:text-[#F5F5F0]"
          >
            Access the Knowledge Base
          </Link>
        </motion.div>

        {/* Price Anchor */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-sm text-[#F5F5F0]/40"
        >
          Founders Edition • $168/year • NBA-level methodology
        </motion.p>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#C9A962]/5 blur-3xl" />
        <div className="absolute -right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#1a4a6e]/10 blur-3xl" />
      </div>
    </section>
  );
}
