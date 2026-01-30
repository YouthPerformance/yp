"use client";

export interface DrillUnlockConditionProps {
  successLooksLike: string;
  advanceWhen: string;
  isCompleted?: boolean;
}

export function DrillUnlockCondition({
  successLooksLike,
  advanceWhen,
  isCompleted = false,
}: DrillUnlockConditionProps) {
  return (
    <section
      className="drill-unlock"
      data-layer="guide"
      aria-labelledby="success-heading"
    >
      <h2 id="success-heading" className="section-title">
        <span className="title-icon">✓</span>
        Success Criteria
      </h2>

      <div className="unlock-card">
        {/* Success Criteria */}
        <div className="unlock-section">
          <div className="unlock-label">
            <span className="label-icon">✓</span>
            Success Looks Like
          </div>
          <p className="unlock-text">{successLooksLike}</p>
        </div>

        {/* Advance When */}
        <div className="unlock-section unlock-section--advance">
          <div className="unlock-label">
            <span className="label-icon">🎯</span>
            Advance When
          </div>
          <p className="unlock-text unlock-text--highlight">{advanceWhen}</p>
        </div>

        {/* Completion Badge (TRAIN layer - athlete only) */}
        {isCompleted && (
          <div className="unlock-badge drill-unlock-badge athlete-only" data-layer="train">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Mastered!</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .drill-unlock {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .title-icon {
          font-size: 24px;
        }

        .unlock-card {
          position: relative;
          padding: var(--pillar-space-6);
          background: linear-gradient(
            135deg,
            rgba(0, 255, 136, 0.05) 0%,
            rgba(0, 246, 224, 0.05) 100%
          );
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 16px;
        }

        .unlock-section {
          margin-bottom: var(--pillar-space-5);
        }

        .unlock-section:last-of-type {
          margin-bottom: 0;
        }

        .unlock-section--advance {
          padding-top: var(--pillar-space-5);
          border-top: 1px solid var(--pillar-border-subtle);
        }

        .unlock-label {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--pillar-status-success);
          margin-bottom: var(--pillar-space-2);
        }

        .label-icon {
          font-size: 14px;
        }

        .unlock-text {
          font-size: 16px;
          line-height: 1.6;
          color: var(--pillar-text-primary);
          margin: 0;
        }

        .unlock-text--highlight {
          font-weight: 600;
          color: var(--pillar-brand-cyan);
        }

        .unlock-badge {
          position: absolute;
          top: var(--pillar-space-4);
          right: var(--pillar-space-4);
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          padding: var(--pillar-space-2) var(--pillar-space-4);
          background: var(--pillar-xp-gold);
          border-radius: 100px;
          animation: drill-unlock-pulse 2s ease-in-out infinite;
        }

        .badge-icon {
          font-size: 16px;
        }

        .badge-text {
          font-family: var(--pillar-font-body);
          font-size: 12px;
          font-weight: 700;
          color: var(--pillar-surface-base);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes drill-unlock-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 215, 0, 0);
            transform: scale(1.02);
          }
        }

        @media (max-width: 480px) {
          .unlock-card {
            padding: var(--pillar-space-4);
          }

          .unlock-badge {
            position: static;
            margin-top: var(--pillar-space-4);
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillUnlockCondition;
