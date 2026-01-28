"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Metric {
  value: string;
  label: string;
  highlight?: boolean;
}

export interface MetricsStripProps {
  metrics: Metric[];
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <div className="metrics-strip">
      {metrics.map((metric, i) => (
        <div key={i} className="metric-item">
          <span className={`metric-value ${metric.highlight ? "cyan" : ""}`}>
            {metric.value}
          </span>
          <span className="metric-label">{metric.label}</span>
        </div>
      ))}

      <style jsx>{`
        .metrics-strip {
          display: flex;
          gap: var(--pillar-space-6);
          margin-bottom: var(--pillar-space-6);
          padding: var(--pillar-space-4) 0;
          border-top: 1px solid var(--pillar-border-subtle);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-value {
          font-family: var(--pillar-font-mono);
          font-size: 20px;
          font-weight: 600;
          color: var(--pillar-text-primary);
        }

        .metric-value.cyan {
          color: var(--pillar-brand-cyan);
        }

        .metric-label {
          font-size: 11px;
          color: var(--pillar-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 600px) {
          .metrics-strip {
            gap: var(--pillar-space-4);
            flex-wrap: wrap;
          }

          .metric-value {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default MetricsStrip;
