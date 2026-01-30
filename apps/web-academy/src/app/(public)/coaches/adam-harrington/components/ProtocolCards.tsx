"use client";

import Link from "next/link";

interface Protocol {
  number: string;
  category: string;
  title: string;
  count: string;
  href: string;
}

interface ProtocolCardsProps {
  protocols: Protocol[];
}

export function ProtocolCards({ protocols }: ProtocolCardsProps) {
  return (
    <section className="protocol-cards" id="protocols">
      <div className="protocols-container">
        <div className="section-header">
          <span className="header-bracket">[</span>
          <h2 className="section-label">AUTHORED PROTOCOLS</h2>
          <span className="header-bracket">]</span>
        </div>

        <div className="protocols-grid">
          {protocols.map((protocol) => (
            <Link
              key={protocol.number}
              href={protocol.href}
              className="protocol-card"
            >
              {/* Corner Ticks */}
              <div className="tick tick-tl" />
              <div className="tick tick-tr" />
              <div className="tick tick-bl" />
              <div className="tick tick-br" />

              <span className="protocol-number">{protocol.number}</span>
              <span className="protocol-category">{protocol.category}</span>
              <h3 className="protocol-title">{protocol.title}</h3>
              <div className="protocol-divider" />
              <span className="protocol-count">{protocol.count}</span>
              <span className="protocol-cta">
                EXPLORE <span className="cta-arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .protocol-cards {
          padding: 80px 24px;
          background: #030303;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: overlay;
          position: relative;
        }

        .protocol-cards::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          opacity: 0.4;
        }

        .protocols-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 48px;
        }

        .header-bracket {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 14px;
          color: #00f6e0;
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 3px;
          color: #666;
          margin: 0;
          text-transform: uppercase;
        }

        .protocols-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(0, 246, 224, 0.1);
          padding: 2px;
        }

        .protocol-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 32px;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-decoration: none;
          min-height: 300px;
          transition: all 0.3s ease;
        }

        .protocol-card:hover {
          background: rgba(0, 246, 224, 0.08);
          border-color: rgba(0, 246, 224, 0.4);
          box-shadow: 0 0 30px rgba(0, 246, 224, 0.15);
        }

        .protocol-card:hover .tick {
          width: 20px;
          height: 20px;
        }

        .protocol-card:hover .cta-arrow {
          transform: translateX(6px);
        }

        /* Corner Ticks */
        .tick {
          position: absolute;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
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

        .protocol-number {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 64px;
          color: rgba(0, 246, 224, 0.25);
          line-height: 1;
          margin-bottom: 8px;
        }

        .protocol-category {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          letter-spacing: 3px;
          color: #00f6e0;
          margin-bottom: 12px;
        }

        .protocol-title {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 36px;
          color: #fff;
          margin: 0;
          line-height: 1.1;
          letter-spacing: 0.02em;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }

        .protocol-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #00f6e0, transparent);
          margin: 24px 0;
        }

        .protocol-count {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 13px;
          color: #888;
          margin-bottom: auto;
          letter-spacing: 1px;
        }

        .protocol-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--pillar-font-mono, monospace);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #00f6e0;
          margin-top: 24px;
          padding: 8px 0;
          border-top: 1px solid rgba(0, 246, 224, 0.15);
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        @media (max-width: 900px) {
          .protocols-grid {
            grid-template-columns: 1fr;
          }

          .protocol-card {
            min-height: auto;
            padding: 28px;
          }

          .protocol-number {
            font-size: 48px;
          }

          .protocol-title {
            font-size: 28px;
          }
        }

        @media (max-width: 768px) {
          .protocol-cards {
            padding: 48px 16px;
          }
        }
      `}</style>
    </section>
  );
}
