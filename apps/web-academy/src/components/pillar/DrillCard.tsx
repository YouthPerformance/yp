"use client";

import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface DrillData {
  slug: string;
  title: string;
  duration: string;
  noiseLevel: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status?: "complete" | "in-progress" | "locked";
  progress?: number;
  xp?: number;
  thumbnail?: string;
}

export interface DrillCardProps {
  drill: DrillData;
  showProgress?: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function DrillCard({ drill, showProgress = false }: DrillCardProps) {
  const getDifficultyStars = () => {
    const count =
      drill.difficulty === "beginner"
        ? 1
        : drill.difficulty === "intermediate"
        ? 2
        : 3;
    return "\u2605".repeat(count) + "\u2606".repeat(3 - count);
  };

  const getStatusStyles = () => {
    switch (drill.status) {
      case "complete":
        return {
          border: "var(--pillar-status-success)",
          label: "Complete",
          color: "var(--pillar-status-success)",
        };
      case "in-progress":
        return {
          border: "var(--pillar-brand-cyan)",
          label: "In Progress",
          color: "var(--pillar-brand-cyan)",
        };
      case "locked":
        return {
          border: "var(--pillar-border-subtle)",
          label: "Locked",
          color: "var(--pillar-text-dim)",
        };
      default:
        return {
          border: "var(--pillar-border-subtle)",
          label: "",
          color: "",
        };
    }
  };

  const status = getStatusStyles();
  const isLocked = drill.status === "locked";

  return (
    <div className={`drill-card ${isLocked ? "locked" : ""}`}>
      <div className="drill-card-inner">
        {/* Thumbnail */}
        <div className="drill-thumbnail">
          {drill.thumbnail ? (
            <img src={drill.thumbnail} alt="" />
          ) : (
            <div className="drill-thumbnail-placeholder" />
          )}
          {drill.status && (
            <span
              className="drill-status-badge"
              style={{ color: status.color, borderColor: status.border }}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="drill-content">
          <Link
            href={isLocked ? "#" : `/drills/${drill.slug}`}
            className="drill-title"
          >
            {drill.title}
          </Link>

          <div className="drill-meta">
            <span className="drill-stars">{getDifficultyStars()}</span>
            <span className="drill-duration">{drill.duration}</span>
            <span className="drill-db">{drill.noiseLevel}</span>
          </div>

          {/* Progress Bar (Athlete Mode) */}
          {showProgress && drill.progress !== undefined && (
            <div className="drill-progress athlete-only">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${drill.progress}%` }}
                />
              </div>
              <span className="progress-text">{drill.progress}%</span>
            </div>
          )}

          {/* XP Badge (Athlete Mode) */}
          {drill.xp && (
            <span className="drill-xp-badge athlete-only">+{drill.xp} XP</span>
          )}
        </div>
      </div>

      <style jsx>{`
        .drill-card {
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
          overflow: hidden;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .drill-card:hover:not(.locked) {
          border-color: var(--pillar-brand-cyan);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .drill-card.locked {
          opacity: 0.6;
        }

        .drill-card-inner {
          display: flex;
          flex-direction: column;
        }

        .drill-thumbnail {
          position: relative;
          aspect-ratio: 16/10;
          background: var(--pillar-surface-raised);
          overflow: hidden;
        }

        .drill-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .drill-thumbnail-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--pillar-surface-raised), var(--pillar-surface-elevated));
        }

        .drill-status-badge {
          position: absolute;
          top: var(--pillar-space-2);
          right: var(--pillar-space-2);
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid;
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 600;
        }

        .drill-content {
          padding: var(--pillar-space-4);
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-2);
        }

        .drill-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--pillar-text-primary);
          text-decoration: none;
          line-height: 1.3;
        }

        .drill-title:hover {
          color: var(--pillar-brand-cyan);
        }

        .drill-meta {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          font-size: 12px;
          color: var(--pillar-text-muted);
        }

        .drill-stars {
          color: var(--pillar-xp-gold);
          letter-spacing: -1px;
        }

        .drill-db {
          font-family: var(--pillar-font-mono);
          color: var(--pillar-brand-cyan);
        }

        .drill-progress {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          margin-top: var(--pillar-space-2);
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: var(--pillar-border-default);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--pillar-brand-cyan);
        }

        .progress-text {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          color: var(--pillar-text-muted);
        }

        .drill-xp-badge {
          align-self: flex-start;
          padding: var(--pillar-space-1) var(--pillar-space-2);
          background: var(--pillar-status-success-dim);
          border: 1px solid var(--pillar-status-success);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--pillar-status-success);
          margin-top: var(--pillar-space-2);
        }
      `}</style>
    </div>
  );
}

export default DrillCard;
