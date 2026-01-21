"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroSection } from "./components/HeroSection";
import { PhilosophySection } from "./components/PhilosophySection";
import { RosterMarquee } from "./components/RosterMarquee";
import { TestimonialDeck } from "./components/TestimonialDeck";
import { Timeline } from "./components/Timeline";
import { CTASection } from "./components/CTASection";
import { GrainOverlay } from "./components/GrainOverlay";

// ═══════════════════════════════════════════════════════════
// ADAM HARRINGTON - PROJECT BLUEPRINT
// "The Architect" - Strategic, Cerebral, The War Room
// ═══════════════════════════════════════════════════════════

export default function AdamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax values for subtle depth
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <main
      ref={containerRef}
      className="relative bg-[#0B1021] text-white overflow-x-hidden"
    >
      {/* Film Grain Overlay - lighter than James */}
      <GrainOverlay opacity={0.02} />

      {/* Section A: Hero - "Clear Vision" */}
      <motion.div style={{ opacity: heroOpacity }}>
        <HeroSection />
      </motion.div>

      {/* Section B: Philosophy */}
      <PhilosophySection />

      {/* Section C: Wall of Giants - Roster Marquee */}
      <RosterMarquee />

      {/* Section D: Testimonial Cards */}
      <TestimonialDeck />

      {/* Section E: Timeline */}
      <Timeline />

      {/* Section G: CTA */}
      <CTASection />
    </main>
  );
}
