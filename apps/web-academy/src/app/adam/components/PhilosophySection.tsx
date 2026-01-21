"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// PHILOSOPHY SECTION
// Adam's cerebral, strategic philosophy
// ═══════════════════════════════════════════════════════════

const PHILOSOPHY_LINES = [
  "Basketball isn't just movement. It's math. It's physics. It's Intentionality.",
  "",
  "I don't replace your local trainer;",
  "I give them the blueprint to build you better.",
  "",
  "We are supplementing your grind with NBA-level precision.",
  "",
  "You pay for reps. We provide the vision.",
];

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0B1021] px-6 py-24 md:px-12 lg:px-24"
    >
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,169,98,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,98,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A962]">
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
                line.includes("vision")
                  ? "font-medium text-[#C9A962]"
                  : "text-[#F5F5F0]/80"
              }`}
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
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
          <div className="h-px flex-1 bg-[#C9A962]/20" />
          <span className="font-serif text-sm italic text-[#F5F5F0]/40">
            — Adam Harrington
          </span>
        </motion.div>
      </div>
    </section>
  );
}
