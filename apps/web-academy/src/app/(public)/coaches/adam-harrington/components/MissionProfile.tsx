"use client";

interface MissionProfileProps {
  specialty: string;
  focus: string;
  content: string;
  signature?: string;
}

export function MissionProfile({
  specialty,
  focus,
  content,
}: MissionProfileProps) {
  // Split content into paragraphs for the detailed section
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <section className="mission-profile">
      <div className="mission-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">CLASSIFIED DOSSIER</h2>
          <span className="header-line" />
        </div>

        {/* Data Fields Block - Semantic <dl> for SEO extraction */}
        <dl className="data-block" aria-label="Operator File">
          {/* Corner Ticks */}
          <div className="tick tick-tl" />
          <div className="tick tick-tr" />
          <div className="tick tick-bl" />
          <div className="tick tick-br" />

          <div className="data-row">
            <dt className="data-label">SUBJECT:</dt>
            <dd className="data-value">Adam Harrington</dd>
          </div>
          <div className="data-row">
            <dt className="data-label">ROLE:</dt>
            <dd className="data-value">NBA Shooting Coach / Director of Player Development</dd>
          </div>
          <div className="data-row">
            <dt className="data-label">AFFILIATION:</dt>
            <dd className="data-value">YouthPerformance // OKC Thunder (Former)</dd>
          </div>
          <div className="data-row">
            <dt className="data-label">EXPERIENCE:</dt>
            <dd className="data-value">20+ Years / NBA, WNBA, College, Youth</dd>
          </div>
          <div className="data-row">
            <dt className="data-label">MISSION:</dt>
            <dd className="data-value highlight">Declassify Elite NBA Training Data</dd>
          </div>
        </dl>

        {/* Specialty Tags */}
        <div className="specialty-row">
          <div className="specialty-tag">
            <span className="tag-bracket">[</span>
            <span className="tag-text">{specialty}</span>
            <span className="tag-bracket">]</span>
          </div>
          <div className="specialty-tag">
            <span className="tag-bracket">[</span>
            <span className="tag-text">{focus}</span>
            <span className="tag-bracket">]</span>
          </div>
        </div>

        {/* Intel Divider */}
        <div className="intel-divider">
          <span className="divider-text">— INTEL RECORD —</span>
        </div>

        {/* Content as Terminal Output */}
        <div className="terminal-output">
          {paragraphs.map((para, index) => {
            const isQuote = para.includes('"');
            const isClosing = index === paragraphs.length - 1;

            return (
              <div key={index} className="terminal-line">
                <span className="line-prefix">&gt;</span>
                <p
                  className={`line-content ${isQuote ? "quote-style" : ""} ${isClosing ? "closing-style" : ""}`}
                >
                  {para}
                </p>
              </div>
            );
          })}
        </div>

        {/* File Stamp */}
        <div className="file-stamp">
          <span className="stamp-text">FILE STATUS: ACTIVE</span>
          <span className="stamp-divider">//</span>
          <span className="stamp-text">ACCESS LEVEL: PUBLIC</span>
        </div>
      </div>

      <style jsx>{`
        .mission-profile {
          padding: 80px 24px;
          background: #030303;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: overlay;
          position: relative;
        }

        .mission-profile::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          pointer-events: none;
          opacity: 0.5;
        }

        .mission-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
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

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #00f6e0;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Data Block - The Core "Classified" Look */
        .data-block {
          position: relative;
          padding: 32px;
          background: rgba(0, 246, 224, 0.02);
          border: 1px solid rgba(0, 246, 224, 0.2);
          margin-bottom: 32px;
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

        .data-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .data-row:last-child {
          border-bottom: none;
        }

        .data-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 2px;
          color: #00f6e0;
          min-width: 120px;
          flex-shrink: 0;
        }

        .data-value {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 16px;
          color: #fff;
          letter-spacing: 0.5px;
        }

        .data-value.highlight {
          color: #00f6e0;
          font-weight: 600;
          text-shadow: 0 0 20px rgba(0, 246, 224, 0.3);
        }

        /* Specialty Tags */
        .specialty-row {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .specialty-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tag-bracket {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 14px;
          color: #00f6e0;
        }

        .tag-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 2px;
          color: #888;
          text-transform: uppercase;
        }

        /* Intel Divider */
        .intel-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }

        .divider-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 4px;
          color: #333;
        }

        /* Terminal Output */
        .terminal-output {
          padding: 24px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .terminal-line {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .terminal-line:last-child {
          margin-bottom: 0;
        }

        .line-prefix {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 14px;
          color: #00f6e0;
          opacity: 0.5;
          flex-shrink: 0;
          line-height: 1.8;
        }

        .line-content {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 15px;
          line-height: 1.8;
          color: #777;
          margin: 0;
          max-width: 68ch;
        }

        .quote-style {
          color: #00f6e0;
          font-style: italic;
        }

        .closing-style {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 24px;
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1.4;
        }

        /* File Stamp */
        .file-stamp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stamp-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 2px;
          color: #333;
        }

        .stamp-divider {
          color: #222;
        }

        @media (max-width: 768px) {
          .mission-profile {
            padding: 48px 16px;
          }

          .data-block {
            padding: 24px 16px;
          }

          .data-row {
            flex-direction: column;
            gap: 4px;
          }

          .data-label {
            min-width: auto;
          }

          .specialty-row {
            flex-direction: column;
          }

          .terminal-output {
            padding: 16px;
          }

          .closing-style {
            font-size: 20px;
          }

          .file-stamp {
            flex-direction: column;
            gap: 8px;
          }

          .stamp-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
