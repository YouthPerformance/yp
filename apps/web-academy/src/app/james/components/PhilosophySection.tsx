"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// PHILOSOPHY SECTION
// Split screen with animated text reveal
// ═══════════════════════════════════════════════════════════

const PHILOSOPHY_LINES = [
  "Your feet have 26 bones, 33 joints, and over 100 muscles.",
  "They've been locked in coffins called shoes for years.",
  "",
  "I don't fix symptoms. I rebuild foundations.",
  "Every injury starts somewhere—usually, it's the feet.",
  "",
  "Fix the feet, fix everything upstream.",
];

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#050505] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#FF4500]">
            The Philosophy
          </span>
        </motion.div>

        {/* Philosophy Text */}
        <div className="space-y-4">
          {PHILOSOPHY_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className={`text-2xl font-light leading-relaxed md:text-3xl lg:text-4xl ${
                line === "" ? "h-4" : ""
              } ${
                line.includes("Fix the feet")
                  ? "font-medium text-[#FF4500]"
                  : "text-white/80"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-sm text-white/40">— James Scott</span>
        </motion.div>
      </div>
    </section>
  );
}
