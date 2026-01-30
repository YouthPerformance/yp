"use client";

export interface DrillQuickScanProps {
  trains: string[];
  useWhen: string[];
  equipment: string[];
  scale: string;
  topMistake: string;
}

interface ScanItemProps {
  label: string;
  value: string | string[];
  index: number;
  accent?: "cyan" | "purple" | "warning" | "default";
}

function ScanItem({ label, value, index, accent = "default" }: ScanItemProps) {
  const displayValue = Array.isArray(value) ? value.join(" · ") : value;

  return (
    <div
      className={`scan-item scan-item--${accent} drill-scan-item`}
      style={{ "--scan-index": index } as React.CSSProperties}
    >
      <span className="scan-label">{label}</span>
      <span className="scan-value">{displayValue}</span>

      <style jsx>{`
        .scan-item {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border-left: 3px solid var(--pillar-border-subtle);
          border-radius: 0 8px 8px 0;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .scan-item:hover {
          background: var(--pillar-surface-raised);
          transform: translateX(4px);
        }

        .scan-item--cyan {
          border-left-color: var(--pillar-brand-cyan);
        }

        .scan-item--purple {
          border-left-color: var(--pillar-brand-purple);
        }

        .scan-item--warning {
          border-left-color: var(--pillar-status-warning);
        }

        .scan-label {
          font-family: var(--pillar-font-mono);
          font-size: var(--drill-label-font-size, 10px);
          text-transform: uppercase;
          letter-spacing: var(--drill-label-letter-spacing, 2px);
          color: var(--pillar-text-muted);
        }

        .scan-item--cyan .scan-label {
          color: var(--pillar-brand-cyan);
        }

        .scan-item--purple .scan-label {
          color: var(--pillar-brand-purple);
        }

        .scan-item--warning .scan-label {
          color: var(--pillar-status-warning);
        }

        .scan-value {
          font-size: 15px;
          line-height: 1.5;
          color: var(--pillar-text-primary);
        }
      `}</style>
    </div>
  );
}

export function DrillQuickScan({
  trains,
  useWhen,
  equipment,
  scale,
  topMistake,
}: DrillQuickScanProps) {
  return (
    <section className="drill-quick-scan" data-layer="guide">
      <h2 className="section-title">Quick Scan</h2>
      <div className="scan-grid">
        <ScanItem label="Trains" value={trains} index={0} accent="cyan" />
        <ScanItem label="Use When" value={useWhen} index={1} accent="purple" />
        <ScanItem label="Equipment" value={equipment.length > 0 ? equipment : ["None required"]} index={2} />
        <ScanItem label="Scale" value={scale} index={3} />
        <ScanItem label="#1 Mistake" value={topMistake} index={4} accent="warning" />
      </div>

      <style jsx>{`
        .drill-quick-scan {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 24px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .scan-grid {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-3);
        }

        @media (min-width: 768px) {
          .scan-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--pillar-space-4);
          }

          /* Make #1 Mistake span full width */
          .scan-grid > :global(:last-child) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillQuickScan;
