"use client";

import { DrillBenchmark } from "@/data/drills/drill-v3-types";

export interface DrillBenchmarksProps {
  benchmarks: DrillBenchmark[];
}

export function DrillBenchmarks({ benchmarks }: DrillBenchmarksProps) {
  return (
    <section id="benchmarks" className="drill-benchmarks" data-layer="guide" aria-labelledby="benchmarks-heading">
      <h2 id="benchmarks-heading" className="section-title">Performance Benchmarks</h2>

      {/* Desktop Table */}
      <div className="benchmarks-table-wrapper">
        <table className="benchmarks-table" role="table">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Prescription</th>
              <th scope="col">Target</th>
              <th scope="col">Advance Rule</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((benchmark, index) => (
              <tr key={benchmark.level} className={`benchmark-row benchmark-row--${benchmark.level}`}>
                <td className="benchmark-level">
                  <span className={`level-badge level-badge--${benchmark.level}`}>
                    {benchmark.levelLabel}
                  </span>
                </td>
                <td className="benchmark-goal">{benchmark.goal}</td>
                <td className="benchmark-sets">{benchmark.sets}</td>
                <td className="benchmark-advance">{benchmark.advanceWhen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="benchmarks-cards">
        {benchmarks.map((benchmark) => (
          <div key={benchmark.level} className={`benchmark-card benchmark-card--${benchmark.level}`}>
            <div className="card-header">
              <span className={`level-badge level-badge--${benchmark.level}`}>
                {benchmark.levelLabel}
              </span>
            </div>
            <div className="card-body">
              <div className="card-row">
                <span className="row-label">Prescription</span>
                <span className="row-value">{benchmark.goal}</span>
              </div>
              <div className="card-row">
                <span className="row-label">Target</span>
                <span className="row-value">{benchmark.sets}</span>
              </div>
              <div className="card-row">
                <span className="row-label">Advance Rule</span>
                <span className="row-value">{benchmark.advanceWhen}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .drill-benchmarks {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        /* Desktop Table */
        .benchmarks-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid var(--pillar-border-subtle);
        }

        .benchmarks-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .benchmarks-table th {
          padding: var(--pillar-space-4) var(--pillar-space-5);
          background: var(--pillar-surface-raised);
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-text-muted);
          text-align: left;
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .benchmarks-table td {
          padding: var(--pillar-space-4) var(--pillar-space-5);
          background: var(--pillar-surface-card);
          color: var(--pillar-text-primary);
          border-bottom: 1px solid var(--pillar-border-subtle);
          vertical-align: middle;
        }

        .benchmarks-table tr:last-child td {
          border-bottom: none;
        }

        .benchmark-row:hover td {
          background: var(--pillar-surface-raised);
        }

        .level-badge {
          display: inline-block;
          padding: var(--pillar-space-1) var(--pillar-space-3);
          border-radius: 100px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .level-badge--beginner {
          background: rgba(0, 255, 136, 0.15);
          color: var(--pillar-status-success);
        }

        .level-badge--intermediate {
          background: rgba(0, 246, 224, 0.15);
          color: var(--pillar-brand-cyan);
        }

        .level-badge--advanced {
          background: rgba(124, 22, 255, 0.15);
          color: var(--pillar-brand-purple);
        }

        .level-badge--elite {
          background: rgba(255, 215, 0, 0.15);
          color: var(--pillar-xp-gold);
        }

        /* Mobile Cards */
        .benchmarks-cards {
          display: none;
          flex-direction: column;
          gap: var(--pillar-space-4);
        }

        .benchmark-card {
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }

        .card-header {
          padding: var(--pillar-space-3) var(--pillar-space-4);
          background: var(--pillar-surface-raised);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .card-body {
          padding: var(--pillar-space-4);
        }

        .card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-2) 0;
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .card-row:last-child {
          border-bottom: none;
        }

        .row-label {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-muted);
          flex-shrink: 0;
        }

        .row-value {
          font-size: 13px;
          color: var(--pillar-text-primary);
          text-align: right;
        }

        @media (max-width: 768px) {
          .benchmarks-table-wrapper {
            display: none;
          }

          .benchmarks-cards {
            display: flex;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillBenchmarks;
