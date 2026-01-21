"use client";

import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// ROSTER MARQUEE - "The Wall of Giants"
// Infinite scroll of player names Adam has worked with
// ═══════════════════════════════════════════════════════════

const NBA_ROSTER = [
  "KEVIN DURANT",
  "PAOLO BANCHERO",
  "CHET HOLMGREN",
  "SHAI GILGEOUS-ALEXANDER",
  "JIMMY BUTLER",
  "STEVE NASH",
  "JAMAL CRAWFORD",
];

const WNBA_ROSTER = [
  "SABRINA IONESCU",
  "BRITTNEY GRINER",
  "OKC THUNDER",
  "BROOKLYN NETS",
  "PHANTOM BC",
  "UNRIVALED",
];

export function RosterMarquee() {
  return (
    <section className="relative bg-[#161B2E] py-16">
      {/* Section Header */}
      <div className="mb-12 px-6 md:px-12">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A962]">
          The Roster
        </span>
        <h2 className="mt-4 font-serif text-4xl font-light text-[#F5F5F0] md:text-5xl">
          The Wall of Giants
        </h2>
      </div>

      {/* Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-10 h-32 w-24 -translate-y-1/2 bg-gradient-to-r from-[#161B2E] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-1/2 z-10 h-32 w-24 -translate-y-1/2 bg-gradient-to-l from-[#161B2E] to-transparent" />

      {/* Row 1: NBA Players - Scroll Left */}
      <div className="mb-6 flex overflow-hidden">
        <motion.div
          className="flex shrink-0 gap-8"
          animate={{ x: "-50%" }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...NBA_ROSTER, ...NBA_ROSTER].map((name, index) => (
            <div key={`${name}-${index}`} className="flex shrink-0 items-center">
              <span className="whitespace-nowrap font-serif text-3xl font-light text-[#F5F5F0]/30 transition-colors hover:text-[#C9A962] md:text-4xl">
                {name}
              </span>
              <span className="mx-4 text-[#C9A962]/30">◆</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: WNBA/Teams - Scroll Right */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex shrink-0 gap-8"
          animate={{ x: "0%" }}
          initial={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...WNBA_ROSTER, ...WNBA_ROSTER].map((name, index) => (
            <div key={`${name}-${index}`} className="flex shrink-0 items-center">
              <span className="whitespace-nowrap font-serif text-2xl font-light text-[#F5F5F0]/20 transition-colors hover:text-[#C9A962] md:text-3xl">
                {name}
              </span>
              <span className="mx-4 text-[#C9A962]/20">◆</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
