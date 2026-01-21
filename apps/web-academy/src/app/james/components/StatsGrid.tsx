"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// STATS GRID - Credentials Section
// Large numbers with count-up effect
// ═══════════════════════════════════════════════════════════

const STATS = [
  {
    value: "20+",
    label: "YEARS",
    description: "Training elite athletes",
  },
  {
    value: "1000+",
    label: "ATHLETES",
    description: "Assessed and trained",
  },
  {
    value: "5+",
    label: "SPORTS",
    description: "NFL • NBA • MLS • Music • Youth",
  },
];

export function StatsGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#FF4500]">
            The Credentials
          </span>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="text-center"
            >
              {/* Value */}
              <div className="mb-2 font-mono text-6xl font-bold text-white md:text-7xl">
                {stat.value}
              </div>

              {/* Label */}
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#FF4500]">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm text-white/40">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
