"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// ORIGIN STORY SECTION
// James's personal story - why he built YouthPerformance
// ═══════════════════════════════════════════════════════════

const STORY_PARAGRAPHS = [
  "I've spent nearly two decades training NBA stars and world-class athletes.",
  "But when it came to my own sons, I saw the truth—youth sports prioritizes short-term wins over long-term development.",
  "More games, more pressure, more injuries. Nobody's building the foundation kids actually need.",
  "So I adapted the same methods I used with the pros. Not watered down, just smarter, safer, and designed for how kids actually develop. Built for lasting progress, not quick fixes.",
  "The same elite training I give professionals, now accessible for your family. Kids, parents, and coaches—all empowered with the tools that actually work.",
];

const MISSION_STATEMENT =
  "We believe every youth athlete deserves world-class training, and every family should be able to afford it.";

export function OriginStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#050505] py-32"
    >
      {/* Full-width image strip */}
      <div className="relative mb-20 h-[50vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, opacity: imageOpacity }}
        >
          <Image
            src="/images/james/jamesfamily.webp"
            alt="James Scott with his family"
            fill
            className="object-cover object-center"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60" />
        </motion.div>

        {/* Floating badge on image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <span className="rounded-full border border-cyan-400/40 bg-[#050505]/80 px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-sm">
            Why I Built This
          </span>
        </motion.div>
      </div>

      {/* Story Content */}
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
            <span className="h-px w-8 bg-cyan-400/50" />
            The Origin
          </span>
        </motion.div>

        {/* Story Paragraphs */}
        <div className="space-y-8">
          {STORY_PARAGRAPHS.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 * i + 0.3,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={`text-xl leading-relaxed md:text-2xl ${
                i === 0 || i === 3
                  ? "text-white"
                  : "text-white/70"
              }`}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Mission Statement - Highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative mt-16 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-8 md:p-12"
        >
          {/* Quote marks */}
          <div className="absolute -left-2 -top-4 font-serif text-6xl text-cyan-400/30">
            "
          </div>
          <p className="font-playfair text-xl font-medium leading-relaxed text-white md:text-2xl">
            {MISSION_STATEMENT}
          </p>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 flex items-center gap-4"
        >
          <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10">
            <Image
              src="/images/james/jamesmug.webp"
              alt="Coach James"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-white">Coach James</p>
            <p className="text-sm text-white/50">Co-Founder, YouthPerformance</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
