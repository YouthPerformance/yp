"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// TIMELINE - "The Resume"
// Adam's career milestones
// ═══════════════════════════════════════════════════════════

const MILESTONES = [
  {
    year: "1998",
    title: "The Beginning",
    description: "USA Junior National Team — Gold Medal",
  },
  {
    year: "2002",
    title: "The NBA Grind",
    description: "6 years in the league: Mavs, Nuggets, China",
  },
  {
    year: "2014",
    title: "The MVP Season",
    description: "OKC Thunder Shooting Coach — KD wins MVP",
  },
  {
    year: "2016",
    title: "The Brooklyn Era",
    description: "Director of Player Development, Brooklyn Nets",
  },
  {
    year: "2022",
    title: "The WNBA",
    description: "Skills consultant for elite women's players",
  },
  {
    year: "2024",
    title: "The New Era",
    description: "Unrivaled Head Coach — Phantom BC",
  },
  {
    year: "NOW",
    title: "The Founder",
    description: "Youth Performance + Intentional360",
  },
];

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#161B2E] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A962]">
            The Resume
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light text-[#F5F5F0] md:text-5xl">
            25+ Years of Excellence
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-[#C9A962] via-[#C9A962]/50 to-transparent md:left-1/2"
          />

          {/* Milestones */}
          <div className="space-y-12">
            {MILESTONES.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                {/* Year Dot */}
                <div className="absolute left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#C9A962] bg-[#161B2E] md:left-1/2">
                  <div className="h-2 w-2 rounded-full bg-[#C9A962]" />
                </div>

                {/* Content */}
                <div className="ml-12 flex-1 md:ml-0 md:w-1/2 md:px-8">
                  <span className="font-mono text-sm text-[#C9A962]">
                    {milestone.year}
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-medium text-[#F5F5F0]">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#F5F5F0]/60">
                    {milestone.description}
                  </p>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
