"use client";

import {
  ConversionCTA,
  DualTrack,
  Family,
  Hero,
  JourneyTimeline,
  Navigation,
  Origin,
  Receipts,
  VenturesGrid,
} from "./components";
import { WolfModeProvider } from "./providers/WolfModeProvider";
import { WolfModeToggle } from "./components/WolfModeToggle";
import { AskAdamWidget } from "./components/AskAdamWidget";

export default function AdamPage() {
  return (
    <WolfModeProvider>
      {/* Fixed Navigation */}
      <Navigation />

      <main className="overflow-x-hidden bg-bg-secondary">
        {/* Section A: Hero - The Hook */}
        <Hero />

        {/* Section B: Origin - The Real World Reset */}
        <Origin />

        {/* Section C: Dual-Track Value Props */}
        <DualTrack />

        {/* Section D: The Journey - Career Timeline */}
        <JourneyTimeline />

        {/* Section E: The Receipts - Social Proof */}
        <Receipts />

        {/* Section F: Current Ventures */}
        <VenturesGrid />

        {/* Section G: Family - Humanization */}
        <Family />

        {/* Section H: Conversion CTA */}
        <ConversionCTA />
      </main>

      {/* v3 Features */}
      <WolfModeToggle />
      <AskAdamWidget />
    </WolfModeProvider>
  );
}
