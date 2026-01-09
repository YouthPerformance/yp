// WolfGrow - Premier Landing Page
// E14: Cinematic Apple/Nike style landing experience

import { useEffect } from "react";
import {
  Authority,
  Community,
  CursorGlow,
  FilmGrain,
  FooterCTA,
  Hero,
  Results,
  SmoothScroll,
  Solution,
  WolfBentoGrid,
} from "../components/wolf-grow";
import ProblemSection from "../components/wolf-grow/ProblemSection";
import analytics from "../lib/analytics";

function WolfGrow() {
  // Track page view
  useEffect(() => {
    analytics.trackPageView("wolf_grow_landing");
  }, []);

  return (
    <SmoothScroll>
      <div className="bg-[#050505] min-h-screen antialiased">
        {/* Premium UX layers */}
        <FilmGrain />
        <CursorGlow />

        {/* Sections */}
        <Hero />
        <ProblemSection />
        <WolfBentoGrid />
        <Solution />
        <Authority />
        <Results />
        <Community />
        <FooterCTA />

        {/* Footer */}
        <footer className="py-12 bg-[#050505] border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🐺</span>
              <span className="font-bebas text-xl text-white tracking-wider">WOLF GROW</span>
            </div>
            <p className="text-gray-500 text-sm">The Pro Academy in Your Pocket</p>
            <div className="flex justify-center gap-6 mt-6 text-gray-600 text-sm">
              <a href="/terms" className="hover:text-cyan-400 transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy
              </a>
              <a href="/contact" className="hover:text-cyan-400 transition-colors">
                Contact
              </a>
            </div>
            <p className="text-gray-700 text-xs mt-6">
              © 2024 YouthPerformance. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}

export default WolfGrow;
