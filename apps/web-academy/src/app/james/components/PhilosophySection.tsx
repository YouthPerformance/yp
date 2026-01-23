"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// PHILOSOPHY SECTION
// Textured, cinematic text reveal with depth
// ═══════════════════════════════════════════════════════════

const PHILOSOPHY_LINES = [
  { text: "Your feet have 26 bones, 33 joints, and over 100 muscles.", highlight: false },
  { text: "They've been locked in coffins called shoes for years.", highlight: false },
  { text: "", highlight: false },
  { text: "I don't fix symptoms.", highlight: false },
  { text: "I rebuild foundations.", highlight: true },
  { text: "", highlight: false },
  { text: "Fix the feet, fix everything upstream.", highlight: true },
];

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-32 md:px-12 lg:px-24"
    >
      {/* Textured Background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-[100px]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/50" />
            The Philosophy
          </span>
        </motion.div>

        {/* Philosophy Text */}
        <div className="space-y-6">
          {PHILOSOPHY_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.8,
                delay: 0.12 * i,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              className={`text-2xl font-light leading-relaxed md:text-3xl lg:text-5xl ${
                line.text === "" ? "h-6" : ""
              } ${
                line.highlight
                  ? "font-medium text-cyan-400"
                  : "text-white/70"
              }`}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        {/* Signature with line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 flex items-center gap-6 origin-left"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/50 to-transparent" />
          <span className="font-playfair text-lg italic text-white/50">
            — Coach James
          </span>
        </motion.div>
      </div>
    </section>
  );
}
