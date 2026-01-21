"use client";

import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════
// LOGO MARQUEE - "The Infinite Roster"
// Velocity-linked infinite scroll (simplified for v1)
// ═══════════════════════════════════════════════════════════

// Using text logos for now - can be replaced with SVG logos
const LOGOS = [
  "MIAMI HEAT",
  "MINNESOTA VIKINGS",
  "IMG ACADEMY",
  "ROC NATION",
  "CHINA BASKETBALL",
  "JUVENTUS FC",
  "J BALVIN",
  "NBA",
  "NFL",
  "MLS",
];

export function LogoMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-12">
      {/* Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent" />

      {/* Marquee Track */}
      <div className="flex">
        <motion.div
          className="flex shrink-0 gap-12"
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Double the logos for seamless loop */}
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex shrink-0 items-center"
            >
              <span className="whitespace-nowrap font-bebas text-2xl uppercase tracking-wider text-white/20 transition-colors hover:text-white/40 md:text-3xl">
                {logo}
              </span>
              <span className="mx-6 text-white/10">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
