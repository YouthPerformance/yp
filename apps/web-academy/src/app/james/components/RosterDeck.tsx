"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// ROSTER DECK - "The Sticky Stack"
// Parallax card stack that reveals on scroll
// ═══════════════════════════════════════════════════════════

const ROSTER_CARDS = [
  {
    id: "jimmy",
    name: "Jimmy Butler",
    sport: "NBA",
    team: "Miami Heat",
    image: "/images/james/jamesjimmy2.webp",
  },
  {
    id: "training",
    name: "Pro Training",
    sport: "Multi-Sport",
    team: "NFL • NBA • MLS",
    image: "/images/james/bpa1.webp",
  },
  {
    id: "global",
    name: "Global Reach",
    sport: "International",
    team: "China • USA • Europe",
    image: "/images/james/jameschina.webp",
  },
];

export function RosterDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-[#050505]">
      {/* Section Header */}
      <div className="px-6 py-16 md:px-12">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#FF4500]">
          The Roster
        </span>
        <h2 className="mt-4 font-bebas text-5xl uppercase tracking-tight text-white md:text-7xl">
          Trusted by the Best
        </h2>
      </div>

      {/* Sticky Card Container */}
      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
          {ROSTER_CARDS.map((card, index) => (
            <RosterCard
              key={card.id}
              card={card}
              index={index}
              total={ROSTER_CARDS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ROSTER CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface RosterCardProps {
  card: (typeof ROSTER_CARDS)[0];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function RosterCard({ card, index, total, scrollYProgress }: RosterCardProps) {
  // Calculate animation ranges for each card
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;

  // Scale down as next card comes in
  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [1, 0.85]
  );

  // Rotate slightly
  const rotate = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [0, -3]
  );

  // Y position (stack effect)
  const y = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [0, -50]
  );

  return (
    <motion.div
      style={{
        scale,
        rotate,
        y,
        zIndex: total - index,
      }}
      className="absolute aspect-[3/4] w-[85%] max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]"
    >
      {/* Card Image */}
      <div className="relative h-[70%] w-full">
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-[#FF4500]/20 px-2 py-0.5 text-xs font-medium text-[#FF4500]">
            {card.sport}
          </span>
        </div>
        <h3 className="font-bebas text-3xl uppercase tracking-tight text-white">
          {card.name}
        </h3>
        <p className="text-sm text-white/50">{card.team}</p>
      </div>

      {/* Grain Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
