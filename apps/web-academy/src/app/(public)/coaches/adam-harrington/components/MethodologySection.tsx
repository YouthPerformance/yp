"use client";

interface MethodologyProps {
  title: string;
  subtitle: string;
  intro: string;
  pillars: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  results: {
    headline: string;
    stats: Array<{
      label: string;
      value: string;
      detail?: string;
    }>;
    closing: string;
  };
}

export function MethodologySection({
  title,
  subtitle,
  intro,
  pillars,
  results,
}: MethodologyProps) {
  return (
    <section className="methodology-section" id="methodology">
      <div className="methodology-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <div className="header-content">
            <h2 className="section-title">{title}</h2>
            <span className="section-subtitle">{subtitle}</span>
          </div>
          <span className="header-line" />
        </div>

        {/* Intro Block */}
        <div className="intro-block">
          <div className="intro-marker">
            <span className="marker-icon">◈</span>
          </div>
          <p className="intro-text">{intro}</p>
        </div>

        {/* How It Works - Pillars */}
        <div className="pillars-section">
          <h3 className="pillars-header">
            <span className="header-accent">//</span> HOW IT WORKS
          </h3>

          <div className="pillars-grid">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="pillar-card">
                {/* Corner ticks */}
                <div className="tick tick-tl" />
                <div className="tick tick-tr" />
                <div className="tick tick-bl" />
                <div className="tick tick-br" />

                <div className="pillar-number">{pillar.number}</div>
                <h4 className="pillar-title">{pillar.title}</h4>
                <p className="pillar-description">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h3 className="results-header">
            <span className="header-accent">//</span> {results.headline}
          </h3>

          <div className="results-grid">
            {results.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {stat.detail && <div className="stat-detail">{stat.detail}</div>}
              </div>
            ))}
          </div>

          <div className="results-closing">
            <span className="closing-marker">▸</span>
            <p className="closing-text">{results.closing}</p>
          </div>
        </div>

        {/* Protocol Link */}
        <div className="protocol-link">
          <a href="/basketball/silent-training" className="link-button">
            <span className="link-text">EXPLORE THE FULL PROTOCOL</span>
            <span className="link-arrow">→</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .methodology-section {
          padding: 80px 24px;
          background: #050505;
          position: relative;
          overflow: hidden;
        }

        .methodology-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 0%,
            rgba(0, 246, 224, 0.03) 0%,
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

        .header-content {
          text-align: center;
        }

        .section-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 3px;
          color: #00f6e0;
          text-transform: uppercase;
        }

        /* Intro Block */
        .intro-block {
          display: flex;
          gap: 20px;
          padding: 32px;
          background: rgba(0, 246, 224, 0.02);
          border: 1px solid rgba(0, 246, 224, 0.15);
          margin-bottom: 64px;
        }

        .intro-marker {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-icon {
          color: #00f6e0;
          font-size: 18px;
        }

        .intro-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 16px;
          line-height: 1.8;
          color: #999;
          margin: 0;
          max-width: 80ch;
        }

        /* Pillars Section */
        .pillars-section {
          margin-bottom: 64px;
        }

        .pillars-header,
        .results-header {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 3px;
          color: #666;
          margin: 0 0 32px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-accent {
          color: #00f6e0;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .pillar-card {
          position: relative;
          padding: 32px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: border-color 0.3s ease;
        }

        .pillar-card:hover {
          border-color: rgba(0, 246, 224, 0.3);
        }

        /* Corner Ticks */
        .tick {
          position: absolute;
          width: 10px;
          height: 10px;
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

        .pillar-number {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 48px;
          color: rgba(0, 246, 224, 0.15);
          line-height: 1;
          margin-bottom: 12px;
        }

        .pillar-title {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 13px;
          letter-spacing: 2px;
          color: #00f6e0;
          margin: 0 0 16px 0;
        }

        .pillar-description {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 14px;
          line-height: 1.7;
          color: #777;
          margin: 0;
        }

        /* Results Section */
        .results-section {
          margin-bottom: 48px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 24px;
          background: rgba(255, 215, 0, 0.02);
          border: 1px solid rgba(255, 215, 0, 0.15);
          text-align: center;
        }

        .stat-value {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 32px;
          color: #ffd700;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .stat-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 2px;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-detail {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 12px;
          color: #555;
        }

        .results-closing {
          display: flex;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-left: 3px solid #00f6e0;
        }

        .closing-marker {
          color: #00f6e0;
          flex-shrink: 0;
        }

        .closing-text {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.7;
          color: #888;
          margin: 0;
        }

        /* Protocol Link */
        .protocol-link {
          display: flex;
          justify-content: center;
          padding-top: 32px;
        }

        .link-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid #00f6e0;
          color: #00f6e0;
          text-decoration: none;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .link-button:hover {
          background: #00f6e0;
          color: #000;
        }

        .link-arrow {
          transition: transform 0.3s ease;
        }

        .link-button:hover .link-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .methodology-section {
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

          .intro-block {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .results-closing {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
