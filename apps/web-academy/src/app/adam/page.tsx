"use client";

import {
  Hero,
  Philosophy,
  Giants,
  Testimonials,
  Timeline,
  Family,
  CTA,
} from "./components";

export default function AdamPage() {
  return (
    <main className="h-screen overflow-y-scroll scroll-smooth scrollbar-hide">
      {/* Section 1: The Hook */}
      <Hero />

      {/* Section 2: The Philosophy */}
      <Philosophy />

      {/* Section 3: Wall of Giants */}
      <Giants />

      {/* Section 4: Testimonials */}
      <Testimonials />

      {/* Section 5: The Timeline */}
      <Timeline />

      {/* Section 6: Family & Values */}
      <Family />

      {/* Section 7: The Ask */}
      <CTA />
    </main>
  );
}
