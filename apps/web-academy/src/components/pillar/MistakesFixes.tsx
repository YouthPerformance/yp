"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface MistakeFix {
  if: string;
  cause: string;
  fix: string;
  drillLink?: string;
}

export interface MistakesFixesProps {
  items: MistakeFix[];
  title?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// If/Cause/Fix cards for common mistakes.
// ═══════════════════════════════════════════════════════════

export function MistakesFixes({
  items,
  title = "Common Mistakes & Fixes",
  className = "",
}: MistakesFixesProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`mistakes-fixes ${className}`}>
      <h3 className="mistakes-title">{title}</h3>
      <div className="mistakes-grid">
        {items.map((item, i) => (
          <div key={i} className="mistake-card">
            <div className="mistake-row if">
              <span className="mistake-label">IF</span>
              <span className="mistake-text">{item.if}</span>
            </div>
            <div className="mistake-row cause">
              <span className="mistake-label">CAUSE</span>
              <span className="mistake-text">{item.cause}</span>
            </div>
            <div className="mistake-row fix">
              <span className="mistake-label">FIX</span>
              <span className="mistake-text">
                {item.fix}
                {item.drillLink && (
                  <>
                    {" "}
                    <Link href={item.drillLink} className="drill-link">
                      Try this drill \u2192
                    </Link>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .mistakes-fixes {
          padding-top: var(--pillar-space-2);
        }

        .mistakes-title {
          font-family: var(--pillar-font-display);
          font-size: 22px;
          color: var(--pillar-text-primary);
          margin-bottom: var(--pillar-space-5);
        }

        .mistakes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--pillar-space-4);
        }

        .mistake-card {
          background: var(--pillar-glass-bg);
          border: 1px solid var(--pillar-glass-border);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(var(--pillar-glass-blur));
          -webkit-backdrop-filter: blur(var(--pillar-glass-blur));
          transition: all var(--pillar-duration-slow) var(--pillar-ease-out);
        }

        .mistake-card:hover {
          border-color: rgba(0, 246, 224, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .mistake-row {
          display: flex;
          gap: var(--pillar-space-3);
          padding: var(--pillar-space-4);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .mistake-row:last-child {
          border-bottom: none;
        }

        .mistake-row.if {
          background: var(--pillar-status-warning-dim);
        }

        .mistake-row.cause {
          background: var(--pillar-status-danger-dim);
        }

        .mistake-row.fix {
          background: var(--pillar-status-success-dim);
        }

        .mistake-label {
          flex-shrink: 0;
          width: 50px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mistake-row.if .mistake-label {
          color: var(--pillar-status-warning);
        }

        .mistake-row.cause .mistake-label {
          color: var(--pillar-status-danger);
        }

        .mistake-row.fix .mistake-label {
          color: var(--pillar-status-success);
        }

        .mistake-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--pillar-text-secondary);
        }

        .drill-link {
          color: var(--pillar-brand-cyan);
          font-weight: 500;
          white-space: nowrap;
        }

        .drill-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default MistakesFixes;
