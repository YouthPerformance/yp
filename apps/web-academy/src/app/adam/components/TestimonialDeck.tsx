"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// TESTIMONIAL DECK - "The Sticky Stack"
// Parallax card stack with testimonials
// ═══════════════════════════════════════════════════════════

const TESTIMONIALS = [
  {
    id: "kd",
    name: "Kevin Durant",
    title: "2x NBA Champion, 4x Scoring Champion",
    quote:
      "Adam's extensive knowledge has been essential to my development. He understands the game at a level most people never reach.",
  },
  {
    id: "nash",
    name: "Steve Nash",
    title: "2x NBA MVP, Hall of Famer",
    quote:
      "His influence over different generations of players is remarkable. Adam sees things others miss.",
  },
  {
    id: "splitter",
    name: "Tiago Splitter",
    title: "NBA Champion",
    quote:
      "One of the most amazing people I've ever worked with. His dedication to the craft is unmatched.",
  },
];

export function TestimonialDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-[#0B1021]">
      {/* Section Header */}
      <div className="px-6 py-16 md:px-12">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9A962]">
          The Testimonials
        </span>
        <h2 className="mt-4 font-serif text-4xl font-light text-[#F5F5F0] md:text-5xl">
          In Their Own Words
        </h2>
      </div>

      {/* Sticky Card Container */}
      <div ref={containerRef} className="relative h-[200vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              total={TESTIMONIALS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIAL CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: (typeof TESTIMONIALS)[0];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function TestimonialCard({
  testimonial,
  index,
  total,
  scrollYProgress,
}: TestimonialCardProps) {
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;

  const scale = useTransform(scrollYProgress, [cardStart, cardEnd], [1, 0.9]);
  const rotate = useTransform(scrollYProgress, [cardStart, cardEnd], [0, -2]);
  const y = useTransform(scrollYProgress, [cardStart, cardEnd], [0, -30]);

  return (
    <motion.div
      style={{
        scale,
        rotate,
        y,
        zIndex: total - index,
      }}
      className="absolute w-[90%] max-w-2xl overflow-hidden rounded-2xl border border-[#2A3245] bg-[#161B2E] p-8 md:p-12"
    >
      {/* Quote Mark */}
      <div className="mb-6 font-serif text-6xl text-[#C9A962]/20">"</div>

      {/* Quote Text */}
      <blockquote className="mb-8 font-serif text-xl font-light leading-relaxed text-[#F5F5F0]/90 md:text-2xl">
        {testimonial.quote}
      </blockquote>

      {/* Attribution */}
      <div className="border-t border-[#2A3245] pt-6">
        <p className="font-medium text-[#C9A962]">{testimonial.name}</p>
        <p className="text-sm text-[#F5F5F0]/50">{testimonial.title}</p>
      </div>

      {/* Subtle Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
