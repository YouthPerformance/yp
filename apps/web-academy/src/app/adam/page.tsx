"use client";

import { ConversionCTA, DualTrack, Hero, Navigation, Origin, Receipts } from "./components";

export default function AdamPage() {
  return (
    <>
      {/* Fixed Navigation */}
      <Navigation />

      <main className="overflow-x-hidden bg-bg-secondary">
        {/* Section A: Hero - The Hook */}
        <Hero />

        {/* Section B: Origin - The Real World Reset */}
        <Origin />

        {/* Section C: Dual-Track Value Props */}
        <DualTrack />

        {/* Section D: The Receipts - Social Proof */}
        <Receipts />

        {/* Section E: Conversion CTA */}
        <ConversionCTA />
      </main>
    </>
  );
}
