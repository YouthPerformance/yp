/**
 * RetroGrid - Synthwave/Vaporwave grid background
 * Layer 1 of the Portal Frame architecture
 */

export default function RetroGrid({ className = '' }) {
  return (
    <div className={`retro-grid-container ${className}`}>
      {/* Horizon line glow */}
      <div className="retro-grid-horizon" />

      {/* The grid itself */}
      <div className="retro-grid" />

      {/* Top fade to black */}
      <div className="retro-grid-fade" />

      <style>{`
        .retro-grid-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(to bottom, #08090A 0%, #0a1a1f 50%, #08090A 100%);
        }

        .retro-grid-horizon {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00F0FF, transparent);
          box-shadow: 0 0 60px 20px rgba(0, 240, 255, 0.3);
          opacity: 0.6;
        }

        .retro-grid {
          position: absolute;
          left: -50%;
          right: -50%;
          top: 50%;
          bottom: -50%;
          background-image:
            linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(500px) rotateX(60deg);
          transform-origin: top center;
          animation: grid-scroll 20s linear infinite;
        }

        .retro-grid-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #08090A 0%, transparent 40%, transparent 60%, #08090A 100%);
          pointer-events: none;
        }

        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 60px;
          }
        }
      `}</style>
    </div>
  )
}
