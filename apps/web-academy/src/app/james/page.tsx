"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroSection } from "./components/HeroSection";
import { PhilosophySection } from "./components/PhilosophySection";
import { OriginStorySection } from "./components/OriginStorySection";
import { MethodSteps } from "./components/MethodSteps";
import { StatsGrid } from "./components/StatsGrid";
import { LogoMarquee } from "./components/LogoMarquee";
import { GrainOverlay } from "./components/GrainOverlay";

// ═══════════════════════════════════════════════════════════
// JAMES SCOTT - THE PERFORMANCE SCIENTIST
// Founder Story Page - Pure About Us, No CTA
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

      {/* Section A: Hero */}
      <motion.div style={{ opacity: heroOpacity }}>
        <HeroSection />
      </motion.div>

      {/* Section B: Philosophy */}
      <PhilosophySection />

      {/* Section C: Origin Story - Why He Built This */}
      <OriginStorySection />

      {/* Section D: Method Steps */}
      <MethodSteps />

      {/* Section E: Stats/Credentials */}
      <StatsGrid />

      {/* Section F: Logo Marquee - Trusted By */}
      <LogoMarquee />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] px-6 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} YouthPerformance. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
