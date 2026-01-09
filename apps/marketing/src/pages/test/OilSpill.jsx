/**
 * Option 1: "Oil Spill" - The Corrupted Wolf
 *
 * Visual Metaphor: Gasoline on wet pavement
 * Purpose: Represents wasted money parents are spending on bad training
 *
 * Colors (Murky Array):
 * - #08090A (Void Black - The base)
 * - #112226 (Deep Swamp Cyan - Brand color, drowned)
 * - #1A1A2E (Midnight Blue - Adds depth)
 * - #2E1A25 (Bruised Purple - Pain/dissonance)
 */

import Iridescence from "../../components/Iridescence";

function OilSpill() {
  // Convert hex to RGB (0-1 range)
  // Using a blend of the murky colors: Deep Swamp Cyan + Bruised Purple
  // #112226 -> RGB(17, 34, 38) -> [0.067, 0.133, 0.149]
  // #2E1A25 -> RGB(46, 26, 37) -> [0.18, 0.102, 0.145]
  // Blended murky color for the shader
  const murkyColor = [0.12, 0.11, 0.15]; // Dark cyan-purple blend

  return (
    <div className="relative min-h-screen bg-[#08090A] overflow-hidden">
      {/* Iridescence Background */}
      <div className="absolute inset-0">
        <Iridescence
          color={murkyColor}
          speed={0.5} // Slow and oozing - feels heavy/stuck
          amplitude={0.2} // Low movement - stagnant pool of bad advice
          mouseReact={true}
        />
      </div>

      {/* Vignette Overlay - Forces eye to center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, #000000 90%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-dark-text-tertiary text-sm uppercase tracking-[0.3em] mb-6">
          The Problem
        </p>

        <h1 className="text-4xl md:text-6xl font-yp-display uppercase text-white mb-6 max-w-4xl">
          70% of Young Athletes Quit Sports by Age 13
        </h1>

        <p className="text-xl text-dark-text-secondary max-w-2xl mb-8">
          Bad advice. Fragmented training. No real foundation. Parents are spending thousands on
          programs that don't work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl">
          <div className="text-center">
            <p className="text-3xl font-yp-display text-red-400 mb-2">$3,000+</p>
            <p className="text-dark-text-tertiary text-sm">Average yearly spend on youth sports</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-yp-display text-red-400 mb-2">70%</p>
            <p className="text-dark-text-tertiary text-sm">Quit before high school</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-yp-display text-red-400 mb-2">8/10</p>
            <p className="text-dark-text-tertiary text-sm">Youth injuries are preventable</p>
          </div>
        </div>

        <p className="text-dark-text-tertiary text-xs mt-16 uppercase tracking-wider">
          Option 1: Oil Spill Effect - Slow, murky, suffocating
        </p>
      </div>
    </div>
  );
}

export default OilSpill;
