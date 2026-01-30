"use client";

interface CTABlockProps {
  headline: string;
  subtext: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export function CTABlock({
  headline,
  subtext,
  primaryCta,
  secondaryCta,
}: CTABlockProps) {
  return (
    <section className="cta-section">
      <div className="cta-container">
        {/* Background Grid */}
        <div className="grid-overlay" />

        {/* Content */}
        <div className="cta-content">
          <h2 className="cta-headline">{headline}</h2>
          <p className="cta-subtext">{subtext}</p>

          <div className="cta-buttons">
            <a href={primaryCta.href} className="cta-primary">
              <span className="cta-primary-text">{primaryCta.label}</span>
              <span className="cta-arrow">→</span>
            </a>
            {secondaryCta && (
              <a href={secondaryCta.href} className="cta-secondary">
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>

        {/* Corner Accents */}
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>

      <style jsx>{`
        .cta-section {
          padding: 80px 24px;
          background: #000;
        }

        .cta-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: 64px 48px;
          background: linear-gradient(
            135deg,
            rgba(255, 215, 0, 0.05) 0%,
            rgba(0, 246, 224, 0.02) 100%
          );
          border: 1px solid rgba(255, 215, 0, 0.2);
          overflow: hidden;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(255, 215, 0, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 215, 0, 0.03) 1px,
              transparent 1px
            );
          background-size: 32px 32px;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .cta-headline {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
          margin: 0 0 16px 0;
          line-height: 1.1;
        }

        .cta-subtext {
          font-family: var(--pillar-font-body, sans-serif);
          font-size: 17px;
          line-height: 1.6;
          color: #888;
          margin: 0 0 40px 0;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
          color: #000;
          text-decoration: none;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .cta-primary:hover .cta-arrow {
          transform: translateX(4px);
        }

        .cta-secondary {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          letter-spacing: 2px;
          color: #666;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .cta-secondary:hover {
          color: #ffd700;
        }

        /* Corner Accents */
        .corner {
          position: absolute;
          width: 24px;
          height: 24px;
        }

        .corner-tl {
          top: -1px;
          left: -1px;
          border-top: 3px solid #ffd700;
          border-left: 3px solid #ffd700;
        }

        .corner-tr {
          top: -1px;
          right: -1px;
          border-top: 3px solid #ffd700;
          border-right: 3px solid #ffd700;
        }

        .corner-bl {
          bottom: -1px;
          left: -1px;
          border-bottom: 3px solid #ffd700;
          border-left: 3px solid #ffd700;
        }

        .corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 3px solid #ffd700;
          border-right: 3px solid #ffd700;
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 48px 16px;
          }

          .cta-container {
            padding: 40px 24px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
