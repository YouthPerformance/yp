"use client";

interface ProLogo {
  name: string;
  logo?: string; // Path to logo image
  type: "athlete" | "team" | "brand";
  label?: string;
}

interface ProLogosBarProps {
  logos: ProLogo[];
}

export function ProLogosBar({ logos }: ProLogosBarProps) {
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="logos-section">
      <div className="logos-header">
        <span className="header-accent">//</span>
        <span className="header-text">TRUSTED BY</span>
        <span className="header-accent">//</span>
      </div>

      <div className="logos-track-container">
        <div className="logos-track">
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="logo-item">
              {logo.logo ? (
                <img
                  src={logo.logo}
                  alt={logo.name}
                  className="logo-image"
                />
              ) : (
                <span className="logo-name">{logo.name}</span>
              )}
              {logo.label && <span className="logo-label">{logo.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .logos-section {
          background: #000;
          border-top: 1px solid rgba(255, 215, 0, 0.15);
          border-bottom: 1px solid rgba(255, 215, 0, 0.15);
          padding: 20px 0;
          overflow: hidden;
        }

        .logos-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .header-accent {
          color: #333;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
        }

        .header-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 3px;
          color: #555;
          text-transform: uppercase;
        }

        .logos-track-container {
          position: relative;
          width: 100%;
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .logos-track {
          display: flex;
          gap: 40px;
          animation: scroll 40s linear infinite;
          width: max-content;
          align-items: center;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .logo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .logo-image {
          height: 28px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%) brightness(1.5);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .logo-item:hover .logo-image {
          filter: grayscale(0%) brightness(1);
          opacity: 1;
        }

        .logo-name {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 16px;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease;
        }

        .logo-item:hover .logo-name {
          color: #fff;
        }

        .logo-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 8px;
          letter-spacing: 1px;
          color: #555;
          text-transform: uppercase;
          padding: 2px 6px;
          background: rgba(255, 215, 0, 0.08);
          border: 1px solid rgba(255, 215, 0, 0.15);
        }

        .logos-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .logos-header {
            display: none;
          }

          .logos-track {
            gap: 24px;
            animation-duration: 25s;
          }

          .logo-item {
            padding: 6px 12px;
          }

          .logo-image {
            height: 22px;
          }

          .logo-name {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
