"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroSection } from "./components/HeroSection";
import { PhilosophySection } from "./components/PhilosophySection";
import { RosterDeck } from "./components/RosterDeck";
import { MethodSteps } from "./components/MethodSteps";
import { StatsGrid } from "./components/StatsGrid";
import { LogoMarquee } from "./components/LogoMarquee";
import { CTASection } from "./components/CTASection";
import { GrainOverlay } from "./components/GrainOverlay";

// ═══════════════════════════════════════════════════════════
// JAMES SCOTT - PROJECT BLACKOUT
// "The Movement Scientist" - Industrial, Cinematic, The Lab
// ═══════════════════════════════════════════════════════════

export default function JamesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax values for subtle depth
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main
      ref={containerRef}
      className="relative bg-[#050505] text-white overflow-x-hidden"
    >
      {/* Film Grain Overlay */}
      <GrainOverlay opacity={0.04} />

      {/* Section A: Hero - "The Liquid Lab" (simplified for v1) */}
      <motion.div style={{ opacity: heroOpacity }}>
        <HeroSection />
      </motion.div>

      {/* Section B: Philosophy */}
      <PhilosophySection />

      {/* Section C: Roster Cards - "The Sticky Stack" */}
      <RosterDeck />

      {/* Section D: Method Steps */}
      <MethodSteps />

      {/* Section E: Stats/Credentials */}
      <StatsGrid />

      {/* Section F: Logo Marquee */}
      <LogoMarquee />

      {/* Section G: CTA */}
      <CTASection />
    </main>
  );
}
