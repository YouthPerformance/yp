"use client";

interface Stat {
  icon: string;
  value: string;
  label: string;
  verified?: boolean;
  attributed?: boolean;
}

interface ServiceRecordProps {
  stats: Stat[];
}

export function ServiceRecord({ stats }: ServiceRecordProps) {
  return (
    <section className="service-record">
      <div className="record-container">
        <div className="record-bar">
          {stats.map((stat, index) => (
            <div key={index} className="stat-cell">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              {stat.verified && (
                <span className="badge badge-verified" title="Publicly Verified">
                  ✓
                </span>
              )}
              {stat.attributed && (
                <span className="badge badge-attributed" title="First-Party Claim">
                  ◈
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .service-record {
          padding: 0 24px;
          background: #000;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .record-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .record-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .stat-cell {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .stat-cell:last-child {
          border-right: none;
        }

        .stat-icon {
          font-size: 24px;
          opacity: 0.8;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: var(--pillar-font-display, "Bebas Neue", sans-serif);
          font-size: 18px;
          color: #fff;
          letter-spacing: 0.02em;
        }

        .stat-label {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 9px;
          letter-spacing: 1.5px;
          color: #666;
          text-transform: uppercase;
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          border-radius: 2px;
        }

        .badge-verified {
          background: rgba(0, 246, 224, 0.15);
          color: #00f6e0;
          border: 1px solid rgba(0, 246, 224, 0.3);
        }

        .badge-attributed {
          background: rgba(255, 215, 0, 0.15);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        @media (max-width: 900px) {
          .record-bar {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-cell:nth-child(2) {
            border-right: none;
          }

          .stat-cell:nth-child(1),
          .stat-cell:nth-child(2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
        }

        @media (max-width: 480px) {
          .record-bar {
            grid-template-columns: 1fr;
          }

          .stat-cell {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .stat-cell:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}
