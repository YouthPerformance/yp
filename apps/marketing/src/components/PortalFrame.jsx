/**
 * PortalFrame - "Layer Cake" Phone Mockup Architecture
 *
 * Layer 1: RetroGrid background (Atmosphere)
 * Layer 2: Phone Chassis (Static PNG - screen area transparent)
 * Layer 3: Screen Slot (Content injection div)
 * Layer 4: Hologram VFX (Floating elements)
 *
 * Uses the "Slots Pattern" - pass anything into screenContent
 */

import TiltedCard from "./TiltedCard";

export default function PortalFrame({
  screenContent,
  hologram = "court",
  caption,
  chassisSrc = null, // CSS-only by default until PNG assets are added
  className = "",
}) {
  return (
    <div className={`relative w-full max-w-md mx-auto group ${className}`}>
      {/* WRAPPER: The Physics Engine (Tilt Effect) */}
      <TiltedCard scaleOnHover={1.05} rotateAmplitude={10} className="relative z-10">
        {/* LAYER 2: The Phone Chassis (Hardware) */}
        <div className="relative w-full aspect-[9/19] bg-transparent">
          {chassisSrc && (
            <img
              src={chassisSrc}
              alt="YP Device"
              className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
              onError={(e) => {
                // Fallback to a CSS phone frame if image not found
                e.target.style.display = "none";
              }}
            />
          )}

          {/* Phone Frame Fallback (CSS) */}
          <div className="absolute inset-[2%] rounded-[3rem] border-[8px] border-gray-800 bg-black z-10 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl z-30" />

            {/* LAYER 3: The Screen Slot (Software) */}
            <div className="absolute inset-2 top-8 rounded-[2rem] overflow-hidden bg-[#08090A]">
              {screenContent}
            </div>
          </div>

          {/* LAYER 4: The Hologram (VFX) */}
          {hologram === "court" && (
            <div
              className="absolute -right-16 top-16 w-48 h-48 z-30 opacity-60 pointer-events-none mix-blend-screen"
              style={{
                animation: "float 6s ease-in-out infinite",
                filter: "blur(0.5px)",
              }}
            >
              <img
                src="/assets/portal-frame/vfx-hologram-court.png"
                alt="Hologram"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to CSS hologram
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full relative">
                      <div class="absolute inset-0 border border-cyan-500/30 rounded-lg transform rotate-12 skew-x-6"></div>
                      <div class="absolute inset-4 border border-cyan-500/20 rounded-lg transform rotate-6 skew-x-3"></div>
                      <div class="absolute inset-8 bg-cyan-500/10 rounded-lg"></div>
                    </div>
                  `;
                }}
              />
            </div>
          )}

          {hologram === "data" && (
            <div
              className="absolute -left-12 top-24 w-40 h-40 z-30 opacity-50 pointer-events-none mix-blend-screen"
              style={{
                animation: "float 8s ease-in-out infinite reverse",
              }}
            >
              <img
                src="/assets/portal-frame/vfx-hologram-data.png"
                alt="Data Cloud"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </TiltedCard>

      {/* LAYER 5: The Floor Reflection (Grounding) */}
      <div className="absolute -bottom-8 left-10 right-10 h-4 bg-cyan-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

      {/* CAPTION: The "Code" Label */}
      {caption && (
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-cyan-500 tracking-[0.2em] uppercase opacity-70">
            // {caption}
          </p>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
