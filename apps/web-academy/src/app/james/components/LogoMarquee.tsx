"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════
// LOGO MARQUEE - "Trusted By"
// Actual league/organization logos
// ═══════════════════════════════════════════════════════════

const LOGOS = [
  { name: "NBA", src: "/logos/nba.webp", height: 48 },
  { name: "NFL", src: "/logos/nfl.webp", height: 48 },
  { name: "Premier League", src: "/logos/premier.webp", height: 44 },
  { name: "MLB", src: "/logos/mlb.webp", height: 44 },
  { name: "NCAA", src: "/logos/ncaa.webp", height: 40 },
  { name: "FIFA", src: "/logos/fifa.webp", height: 40 },
  { name: "Olympics", src: "/logos/olympics.webp", height: 44 },
];

export function LogoMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-16">
      {/* Section Label */}
      <div className="mb-8 px-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/30">
          Trusted By Athletes From
        </span>
      </div>

      {/* Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent" />

      {/* Marquee Track */}
      <div className="flex">
        <motion.div
          className="flex shrink-0 items-center gap-16 px-8"
          animate={{ x: "-50%" }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Double the logos for seamless loop */}
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex shrink-0 items-center"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.height * 1.5}
                height={logo.height}
                className="h-auto w-auto opacity-40 grayscale transition-all hover:opacity-70 hover:grayscale-0"
                style={{ height: logo.height, width: "auto" }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
