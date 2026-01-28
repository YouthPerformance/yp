"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface ProtocolDrill {
  slug: string;
  title: string;
  duration: string;
  noiseLevel: string;
}

export interface ProtocolSummaryProps {
  drills: ProtocolDrill[];
  visible?: boolean;
  sessionMeta?: string;
  onStartSession?: () => void;
  onSaveProtocol?: () => void;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function ProtocolSummary({
  drills,
  visible = true,
  sessionMeta = "20m · Carpet · <40dB",
  onStartSession,
  onSaveProtocol,
}: ProtocolSummaryProps) {
  if (!visible || drills.length === 0) return null;

  return (
    <div className="protocol-summary">
      <div className="protocol-header">
        <span className="protocol-title">\u2713 Protocol Generated</span>
        <span className="protocol-meta">{sessionMeta}</span>
      </div>

      {/* Protocol Drill List - Critical for SEO internal linking */}
      <ul className="protocol-drills">
        {drills.map((drill, index) => (
          <li key={drill.slug} className="protocol-drill">
            <div className="protocol-drill-info">
              <span className="protocol-drill-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Link href={`/drills/${drill.slug}`} className="protocol-drill-link">
                {drill.title}
              </Link>
            </div>
            <span className="protocol-drill-meta">
              {drill.duration} · <span className="protocol-drill-db">{drill.noiseLevel}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="protocol-actions">
        <button
          type="button"
          className="pillar-btn pillar-btn-primary"
          onClick={onStartSession}
        >
          Start Session \u2192
        </button>
        <button
          type="button"
          className="pillar-btn pillar-btn-secondary"
          onClick={onSaveProtocol}
        >
          Save Protocol
        </button>
      </div>

      <style jsx>{`
        .protocol-summary {
          margin-top: var(--pillar-space-6);
          padding: var(--pillar-space-5);
          background: var(--pillar-surface-raised);
          border: 1px solid var(--pillar-border-default);
          border-radius: 12px;
        }

        .protocol-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--pillar-space-4);
          padding-bottom: var(--pillar-space-4);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .protocol-title {
          font-family: var(--pillar-font-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--pillar-status-success);
        }

        .protocol-meta {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          color: var(--pillar-text-muted);
        }

        .protocol-drills {
          list-style: none;
          margin-bottom: var(--pillar-space-4);
          padding: 0;
        }

        .protocol-drill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--pillar-space-3) 0;
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .protocol-drill:last-child {
          border-bottom: none;
        }

        .protocol-drill-info {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
        }

        .protocol-drill-num {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          color: var(--pillar-text-muted);
          width: 24px;
        }

        .protocol-drill-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--pillar-text-primary);
          text-decoration: none;
        }

        .protocol-drill-link:hover {
          color: var(--pillar-brand-cyan);
        }

        .protocol-drill-meta {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          color: var(--pillar-text-muted);
        }

        .protocol-drill-db {
          color: var(--pillar-brand-cyan);
        }

        .protocol-actions {
          display: flex;
          gap: var(--pillar-space-3);
        }

        @media (max-width: 600px) {
          .protocol-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default ProtocolSummary;
