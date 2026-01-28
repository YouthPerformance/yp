"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface XPProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

export interface PillarTopBarProps {
  breadcrumbs: Breadcrumb[];
  updatedDate?: string;
  xpProgress?: XPProgress;
  isAthleteMode?: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function PillarTopBar({
  breadcrumbs,
  updatedDate,
  xpProgress,
  isAthleteMode = false,
}: PillarTopBarProps) {
  const progressPercent = xpProgress
    ? Math.round((xpProgress.currentXP / xpProgress.nextLevelXP) * 100)
    : 0;

  return (
    <header className="pillar-top-bar">
      <div className="pillar-top-bar-left">
        <Link href="/" className="pillar-logo">
          Y<span>P</span>
        </Link>
        <nav className="pillar-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              <span className="pillar-breadcrumb-sep">/</span>
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span className="pillar-breadcrumb-current">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="pillar-top-bar-right">
        <div className="pillar-status-chip">
          <span className="pillar-status-dot" />
          <span>LIVE</span>
        </div>

        {/* Parent mode - show update date */}
        {updatedDate && (
          <div className="pillar-status-chip parent-only">
            Updated {updatedDate}
          </div>
        )}

        {/* Athlete mode - show XP header */}
        {xpProgress && (
          <div className="pillar-xp-header athlete-only">
            <div className="pillar-xp-level">
              <div className="pillar-level-badge">{xpProgress.level}</div>
              <div className="pillar-level-progress">
                <span className="pillar-level-label">Level {xpProgress.level}</span>
                <div className="pillar-level-bar">
                  <div
                    className="pillar-level-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <span className="pillar-xp-count">
              {xpProgress.totalXP.toLocaleString()} XP
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .pillar-top-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--pillar-space-3) var(--pillar-content-padding);
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .pillar-top-bar-left {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
        }

        .pillar-logo {
          font-family: var(--pillar-font-display);
          font-size: 24px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          text-decoration: none;
        }

        .pillar-logo span {
          color: var(--pillar-brand-cyan);
        }

        .pillar-breadcrumbs {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-size: 13px;
          color: var(--pillar-text-muted);
        }

        .pillar-breadcrumbs a {
          color: var(--pillar-text-secondary);
          text-decoration: none;
        }

        .pillar-breadcrumbs a:hover {
          color: var(--pillar-brand-cyan);
        }

        .pillar-breadcrumb-sep {
          color: var(--pillar-text-dim);
        }

        .pillar-breadcrumb-current {
          color: var(--pillar-text-primary);
        }

        .pillar-top-bar-right {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
        }

        .pillar-status-chip {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-1) var(--pillar-space-3);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 100px;
          font-size: 12px;
          color: var(--pillar-text-secondary);
        }

        .pillar-status-dot {
          width: 6px;
          height: 6px;
          background: var(--pillar-status-success);
          border-radius: 50%;
          animation: pillar-pulse 2s ease-in-out infinite;
        }

        .pillar-xp-header {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-4);
        }

        .pillar-xp-level {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
        }

        .pillar-level-badge {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--pillar-brand-cyan), var(--pillar-brand-purple));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--pillar-font-mono);
          font-size: 13px;
          font-weight: 700;
          color: var(--pillar-surface-base);
        }

        .pillar-level-progress {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pillar-level-label {
          font-size: 10px;
          color: var(--pillar-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pillar-level-bar {
          width: 80px;
          height: 4px;
          background: var(--pillar-border-default);
          border-radius: 2px;
          overflow: hidden;
        }

        .pillar-level-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--pillar-brand-cyan), var(--pillar-brand-purple));
        }

        .pillar-xp-count {
          font-family: var(--pillar-font-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--pillar-brand-cyan);
        }

        @media (max-width: 768px) {
          .pillar-breadcrumbs {
            display: none;
          }

          .pillar-xp-header {
            gap: var(--pillar-space-2);
          }

          .pillar-level-bar {
            width: 60px;
          }
        }
      `}</style>
    </header>
  );
}

export default PillarTopBar;
