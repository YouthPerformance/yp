"use client";

interface MethodologyProps {
  title: string;
  subtitle: string;
  intro: string;
  pillars: Array<{
    number: string;
    title: string;
    description: string;
    href: string;
  }>;
  closing: string;
}

export function MethodologySection({
  title,
  subtitle,
  intro,
  pillars,
  closing,
}: MethodologyProps) {
  return (
    <section className="methodology-section" id="methodology">
      <div className="methodology-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <span className="section-subtitle">{subtitle}</span>
        </div>

        {/* Intro */}
        <p className="intro-text">{intro}</p>

        {/* Pillars Grid */}
        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <a key={pillar.number} href={pillar.href} className="pillar-card">
              {/* Corner ticks */}
              <div className="tick tick-tl" />
              <div className="tick tick-tr" />
              <div className="tick tick-bl" />
              <div className="tick tick-br" />

              <div className="pillar-header">
                <span className="pillar-number">{pillar.number}</span>
                <h3 className="pillar-title">{pillar.title}</h3>
              </div>
              <p className="pillar-description">{pillar.description}</p>
              <span className="pillar-link">→ Explore</span>
            </a>
          ))}
        </div>

        {/* Closing */}
        <div className="closing-block">
          <span className="closing-marker">◈</span>
          <p className="closing-text">{closing}</p>
        </div>
      </div>

      <style jsx>{`
        .methodology-section {
          padding: 80px 24px;
          background: #000;
          position: relative;
        }

        .methodology-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 0%,
            rgba(0, 246, 224, 0.04) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .methodology-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .section-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 3px;
          color: #00f6e0;
          text-transform: uppercase;
        }

        .intro-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 17px;
          line-height: 1.8;
          color: #777;
          text-align: center;
          max-width: 700px;
          margin: 0 auto 64px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .pillar-card {
          position: relative;
          padding: 32px;
          background: rgba(0, 246, 224, 0.02);
          border: 1px solid rgba(0, 246, 224, 0.15);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .pillar-card:hover {
          border-color: rgba(0, 246, 224, 0.4);
          transform: translateY(-4px);
        }

        /* Corner Ticks */
        .tick {
          position: absolute;
          width: 12px;
          height: 12px;
        }

        .tick-tl {
          top: 0;
          left: 0;
          border-top: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-tr {
          top: 0;
          right: 0;
          border-top: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .tick-bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid #00f6e0;
          border-left: 2px solid #00f6e0;
        }

        .tick-br {
          bottom: 0;
          right: 0;
          border-bottom: 2px solid #00f6e0;
          border-right: 2px solid #00f6e0;
        }

        .pillar-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 16px;
        }

        .pillar-number {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 48px;
          color: rgba(0, 246, 224, 0.2);
          line-height: 1;
        }

        .pillar-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 28px;
          color: #fff;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .pillar-description {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 14px;
          line-height: 1.7;
          color: #777;
          margin: 0;
          flex: 1;
        }

        .pillar-link {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          color: #00f6e0;
          margin-top: 24px;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }

        .pillar-card:hover .pillar-link {
          opacity: 1;
          transform: translateX(0);
        }

        .closing-block {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-left: 3px solid rgba(255, 215, 0, 0.5);
        }

        .closing-marker {
          color: #ffd700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .closing-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.7;
          color: #888;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 900px) {
          .pillars-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .methodology-section {
            padding: 48px 16px;
          }

          .pillar-card {
            padding: 24px;
          }

          .pillar-link {
            opacity: 1;
            transform: translateX(0);
          }

          .closing-block {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
