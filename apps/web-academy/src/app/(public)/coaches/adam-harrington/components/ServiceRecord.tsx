"use client";

interface StatCard {
  icon: string;
  value: string;
  label: string;
  verified?: boolean;
}

interface ServiceRecordProps {
  stats: StatCard[];
}

export function ServiceRecord({ stats }: ServiceRecordProps) {
  return (
    <section className="service-record">
      <div className="record-container">
        {/* Section Label */}
        <div className="section-header">
          <span className="header-line" />
          <h2 className="section-label">SERVICE RECORD</h2>
          <span className="header-line" />
        </div>

        {/* Unified Stats Toolbar - Semantic <dl> for SEO */}
        <dl className="stats-toolbar" aria-label="Career Statistics">
          {stats.map((stat, index) => (
            <div key={index} className="stat-cell">
              {/* Corner Tick */}
              <div className="corner-tick" />

              <dd className="stat-value">{stat.value}</dd>
              <dt className="stat-label">
                {stat.label}
                {stat.verified && <span className="verified-tag">✓ VERIFIED</span>}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <style jsx>{`
        .service-record {
          padding: 64px 24px;
          background: #050505;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: overlay;
        }

        .record-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .header-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 246, 224, 0.2),
            transparent
          );
        }

        .section-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          color: #555;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Unified Toolbar - No gaps, just dividers */
        .stats-toolbar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a0a;
        }

        .stat-cell {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 32px 16px;
          text-align: center;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-cell:last-child {
          border-right: none;
        }

        .stat-cell:hover {
          background: rgba(0, 246, 224, 0.03);
        }

        /* Corner Tick */
        .corner-tick {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 8px;
          height: 8px;
          border-top: 1px solid rgba(0, 246, 224, 0.4);
          border-left: 1px solid rgba(0, 246, 224, 0.4);
        }

        .stat-value {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 28px;
          color: #fff;
          line-height: 1.1;
          letter-spacing: 0.02em;
        }

        .stat-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 10px;
          letter-spacing: 2px;
          color: #00f6e0;
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .verified-tag {
          display: inline-block;
          padding: 2px 6px;
          background: rgba(0, 246, 224, 0.1);
          border: 1px solid rgba(0, 246, 224, 0.2);
          font-size: 8px;
          letter-spacing: 1px;
          color: #00f6e0;
        }

        @media (max-width: 768px) {
          .service-record {
            padding: 48px 16px;
          }

          .stats-toolbar {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-cell {
            padding: 24px 12px;
          }

          .stat-cell:nth-child(2) {
            border-right: none;
          }

          .stat-cell:nth-child(1),
          .stat-cell:nth-child(2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .stat-cell:nth-child(3),
          .stat-cell:nth-child(4) {
            border-right: none;
          }

          .stat-cell:nth-child(3) {
            border-right: 1px solid rgba(255, 255, 255, 0.1);
          }

          .stat-value {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}
