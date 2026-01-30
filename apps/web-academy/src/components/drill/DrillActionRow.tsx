"use client";

import { useState } from "react";

export interface DrillActionRowProps {
  drillId: string;
  drillTitle: string;
  onStartTimer?: () => void;
  onAddToPlan?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isInPlan?: boolean;
  variant?: "full" | "compact";
}

export function DrillActionRow({
  drillId,
  drillTitle,
  onStartTimer,
  onAddToPlan,
  onSave,
  isSaved = false,
  isInPlan = false,
  variant = "full",
}: DrillActionRowProps) {
  const [saved, setSaved] = useState(isSaved);
  const [inPlan, setInPlan] = useState(isInPlan);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  const handleAddToPlan = () => {
    setInPlan(!inPlan);
    onAddToPlan?.();
  };

  return (
    <div className={`drill-action-row drill-action-row--${variant}`} data-layer="train">
      {/* Primary CTA: Start Drill - filled cyan, radioactive glow */}
      <button
        className="action-btn action-btn--primary"
        onClick={onStartTimer}
        aria-label={`Start ${drillTitle}`}
      >
        <span className="action-icon">▶</span>
        {variant === "full" && <span className="action-label">Start Drill</span>}
      </button>

      {/* Secondary: Add to Plan - outline/ghost */}
      <button
        className={`action-btn action-btn--secondary ${inPlan ? "action-btn--active" : ""}`}
        onClick={handleAddToPlan}
        aria-label={inPlan ? `Remove ${drillTitle} from plan` : `Add ${drillTitle} to plan`}
        aria-pressed={inPlan}
      >
        <span className="action-icon">{inPlan ? "✓" : "+"}</span>
        {variant === "full" && (
          <span className="action-label">{inPlan ? "In Plan" : "Add to Plan"}</span>
        )}
      </button>

      {/* Tertiary: Save - icon only, 40px square */}
      <button
        className={`action-btn action-btn--tertiary ${saved ? "action-btn--saved" : ""}`}
        onClick={handleSave}
        aria-label={saved ? `Unsave ${drillTitle}` : `Save ${drillTitle}`}
        aria-pressed={saved}
      >
        <span className="action-icon">{saved ? "🔖" : "📑"}</span>
      </button>

      <style jsx>{`
        .drill-action-row {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
        }

        .drill-action-row--compact {
          gap: var(--pillar-space-2);
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--pillar-space-2);
          border-radius: 10px;
          font-family: var(--pillar-font-body);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
          border: none;
        }

        /* Primary: Start Drill - filled cyan, radioactive glow */
        .action-btn--primary {
          flex: 2;
          padding: var(--pillar-space-4) var(--pillar-space-6);
          background: var(--pillar-brand-cyan);
          color: var(--pillar-surface-base);
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 0 20px rgba(0, 246, 224, 0.3);
        }

        .action-btn--primary:hover {
          background: #00FFE5;
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0, 246, 224, 0.5), 0 4px 16px rgba(0, 246, 224, 0.3);
        }

        .action-btn--primary:active {
          transform: translateY(0);
        }

        /* Secondary: Add to Plan - outline/ghost */
        .action-btn--secondary {
          flex: 1;
          padding: var(--pillar-space-3) var(--pillar-space-5);
          background: transparent;
          color: var(--pillar-text-primary);
          border: 1px solid var(--pillar-border-subtle);
        }

        .action-btn--secondary:hover {
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
          background: var(--pillar-glass-bg);
        }

        .action-btn--secondary.action-btn--active {
          background: var(--pillar-brand-cyan-dim);
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
        }

        /* Tertiary: Save - icon only, 40px square */
        .action-btn--tertiary {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          padding: 0;
          background: transparent;
          color: var(--pillar-text-secondary);
          border: 1px solid var(--pillar-border-subtle);
        }

        .action-btn--tertiary:hover {
          color: var(--pillar-brand-cyan);
          border-color: var(--pillar-brand-cyan);
          background: var(--pillar-glass-bg);
        }

        .action-btn--tertiary.action-btn--saved {
          color: var(--pillar-xp-gold);
          border-color: var(--pillar-xp-gold);
        }

        .drill-action-row--compact .action-btn--primary {
          padding: var(--pillar-space-3) var(--pillar-space-4);
          font-size: 13px;
        }

        .drill-action-row--compact .action-btn--secondary {
          padding: var(--pillar-space-2) var(--pillar-space-3);
          font-size: 13px;
        }

        .drill-action-row--compact .action-btn--tertiary {
          width: 36px;
          height: 36px;
        }

        .action-icon {
          font-size: 14px;
          line-height: 1;
        }

        .drill-action-row--compact .action-icon {
          font-size: 16px;
        }

        .drill-action-row--compact .action-label {
          display: none;
        }

        @media (max-width: 480px) {
          .action-label {
            display: none;
          }

          .action-btn--primary {
            flex: 1;
            padding: var(--pillar-space-3);
          }

          .action-btn--secondary {
            flex: 1;
            padding: var(--pillar-space-3);
          }

          .action-icon {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default DrillActionRow;
