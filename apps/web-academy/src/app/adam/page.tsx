"use client";

import {
  Navigation,
  Hero,
  CredentialsBar,
  JourneyTimeline,
  AthletesSection,
  TestimonialCarousel,
  Philosophy,
  VenturesGrid,
  Family,
  FinalCTA,
} from "./components";

export default function AdamPage() {
  return (
    <>
      {/* Fixed Navigation */}
      <Navigation />

      <main className="overflow-x-hidden">
        {/* Section 1: Hero with Stats */}
        <Hero />

        {/* Section 2: Credentials Bar */}
        <CredentialsBar />

        {/* Section 3: Journey Timeline */}
        <JourneyTimeline />

        {/* Section 4: Athletes Developed */}
        <AthletesSection />

        {/* Section 5: Testimonials Carousel */}
        <TestimonialCarousel />

        {/* Section 6: Philosophy + NeoBall */}
        <Philosophy />

        {/* Section 7: Ventures Grid */}
        <VenturesGrid />

        {/* Section 8: Family / Beyond the Court */}
        <Family />

        {/* Section 9: Final CTA + Footer */}
        <FinalCTA />
      </main>
    </>
  );
}
