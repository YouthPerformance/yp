/**
 * Option 2: "Fog of Noise" - Distorting Fog
 *
 * Visual Metaphor: Looking through a dirty window
 * Purpose: Represents the confusion and fragmented advice in youth sports
 *
 * Colors:
 * - Base: #000000 (Pure Black)
 * - Fluid: #003333 (Very Dark Cyan/Teal)
 * - No bright highlights - gunmetal grey only
 *
 * Parameters:
 * - Higher speed for swirling chaos
 * - Higher amplitude for distortion
 */

import Iridescence from "../../components/Iridescence";

function FogNoise() {
  // Dark teal/cyan fog color
  // #003333 -> RGB(0, 51, 51) -> [0, 0.2, 0.2]
  // With gunmetal undertones
  const fogColor = [0.05, 0.18, 0.18]; // Very dark teal

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Iridescence Background - More chaotic */}
      <div className="absolute inset-0">
        <Iridescence
          color={fogColor}
          speed={0.8} // Faster - lots of swirls and chaos
          amplitude={0.4} // Higher - more distortion
          mouseReact={true}
        />
      </div>

      {/* Heavy Vignette Overlay - Tunnel Vision */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 50%, #000000 85%)",
        }}
      />

      {/* Noise Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-dark-text-tertiary text-sm uppercase tracking-[0.3em] mb-6">
          The Fog of Bad Advice
        </p>

        <h1 className="text-4xl md:text-6xl font-yp-display uppercase text-white mb-6 max-w-4xl">
          Everyone Has an Opinion. Nobody Has a System.
        </h1>

        <p className="text-xl text-dark-text-secondary max-w-2xl mb-8">
          YouTube videos. Instagram trainers. Conflicting advice from coaches. Parents are drowning
          in noise with no clear path forward.
        </p>

        <div className="mt-12 max-w-2xl">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 text-dark-text-secondary">
              <span className="text-red-400/60">✕</span>
              <span>"Just run more sprints"</span>
            </div>
            <div className="flex items-center gap-4 text-dark-text-secondary">
              <span className="text-red-400/60">✕</span>
              <span>"Lift heavy - they'll grow into it"</span>
            </div>
            <div className="flex items-center gap-4 text-dark-text-secondary">
              <span className="text-red-400/60">✕</span>
              <span>"Play through the pain"</span>
            </div>
            <div className="flex items-center gap-4 text-dark-text-secondary">
              <span className="text-red-400/60">✕</span>
              <span>"Specialize early to get ahead"</span>
            </div>
          </div>
        </div>

        <p className="text-dark-text-tertiary text-xs mt-16 uppercase tracking-wider">
          Option 2: Fog of Noise - Chaotic, swirling, disorienting
        </p>
      </div>
    </div>
  );
}

export default FogNoise;
