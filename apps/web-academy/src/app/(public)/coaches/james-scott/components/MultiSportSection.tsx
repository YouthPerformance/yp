"use client";

interface MultiSportProps {
  headline: string;
  sports: Array<{
    sport: string;
    name: string;
    role: string;
  }>;
  extras: string[];
}

export function MultiSportSection({
  headline,
  sports,
  extras,
}: MultiSportProps) {
  return (
    <section className="multisport-section">
      <div className="multisport-container">
        {/* Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-title">{headline}</h2>
          <span className="header-line" />
        </div>

        {/* Sports Grid */}
        <div className="sports-grid">
          {sports.map((item, index) => (
            <div key={index} className="sport-card">
              <span className="sport-label">{item.sport}</span>
              <span className="sport-name">{item.name}</span>
              <span className="sport-role">{item.role}</span>
            </div>
          ))}
        </div>

        {/* Extras */}
        <div className="extras-row">
          {extras.map((extra, index) => (
            <span key={index} className="extra-tag">
              + {extra}
            </span>
          ))}
        </div>

        {/* Closing Note */}
        <p className="closing-note">
          James&apos;s methodology isn&apos;t basketball-specific. It&apos;s human movement
          science that transfers across every sport.
        </p>
      </div>

      <style jsx>{`
        .multisport-section {
          padding: 80px 24px;
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .multisport-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 246, 224, 0.3),
            transparent
          );
        }

        .section-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0;
          white-space: nowrap;
        }

        .sports-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 32px;
        }

        .sport-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 24px;
          background: #0a0a0a;
          text-align: center;
        }

        .sport-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 3px;
          color: #00f6e0;
          margin-bottom: 12px;
        }

        .sport-name {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 28px;
          color: #fff;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .sport-role {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 13px;
          color: #666;
        }

        .extras-row {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .extra-tag {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 1px;
          color: #555;
        }

        .closing-note {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.7;
          color: #666;
          text-align: center;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .multisport-section {
            padding: 48px 16px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .header-line {
            width: 60px;
            flex: none;
          }

          .sports-grid {
            grid-template-columns: 1fr;
          }

          .extras-row {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
