"use client";

export interface DrillCuesCardsProps {
  doThis: string;
  dontDoThis: string;
  focusOn: string;
}

interface CueCardProps {
  type: "do" | "dont" | "focus";
  label: string;
  content: string;
  icon: string;
}

function CueCard({ type, label, content, icon }: CueCardProps) {
  return (
    <div className={`cue-card cue-card--${type}`}>
      <div className="cue-header">
        <span className="cue-icon">{icon}</span>
        <span className="cue-label">{label}</span>
      </div>
      <p className="cue-content">{content}</p>

      <style jsx>{`
        .cue-card {
          flex: 1;
          min-width: var(--drill-cue-card-width, 160px);
          padding: var(--pillar-space-5);
          border-radius: 12px;
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .cue-card:hover {
          transform: translateY(-2px);
        }

        .cue-card--do {
          background: var(--drill-cue-do-bg);
          border: 1px solid rgba(0, 255, 136, 0.35);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.08);
        }

        .cue-card--do:hover {
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.15), 0 8px 24px rgba(0, 255, 136, 0.1);
        }

        .cue-card--dont {
          background: var(--drill-cue-dont-bg);
          border: 1px solid rgba(255, 71, 87, 0.35);
          box-shadow: 0 0 12px rgba(255, 71, 87, 0.08);
        }

        .cue-card--dont:hover {
          border-color: rgba(255, 71, 87, 0.6);
          box-shadow: 0 0 20px rgba(255, 71, 87, 0.15), 0 8px 24px rgba(255, 71, 87, 0.1);
        }

        .cue-card--focus {
          background: var(--drill-cue-focus-bg);
          border: 1px solid rgba(0, 246, 224, 0.35);
          box-shadow: 0 0 12px rgba(0, 246, 224, 0.08);
        }

        .cue-card--focus:hover {
          border-color: rgba(0, 246, 224, 0.6);
          box-shadow: 0 0 20px rgba(0, 246, 224, 0.15), 0 8px 24px rgba(0, 246, 224, 0.1);
        }

        .cue-header {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          margin-bottom: var(--pillar-space-3);
        }

        .cue-icon {
          font-size: 20px;
        }

        .cue-label {
          font-family: var(--pillar-font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .cue-card--do .cue-label {
          color: var(--drill-cue-do);
        }

        .cue-card--dont .cue-label {
          color: var(--drill-cue-dont);
        }

        .cue-card--focus .cue-label {
          color: var(--drill-cue-focus);
        }

        .cue-content {
          font-size: 15px;
          line-height: 1.6;
          color: var(--pillar-text-primary);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export function DrillCuesCards({ doThis, dontDoThis, focusOn }: DrillCuesCardsProps) {
  return (
    <section id="cues" className="drill-cues" data-layer="guide" aria-labelledby="cues-heading">
      <h2 id="cues-heading" className="section-title">Quick Cues</h2>
      <div className="cues-grid">
        <CueCard type="do" label="Do This" content={doThis} icon="✓" />
        <CueCard type="dont" label="Don't Do" content={dontDoThis} icon="✗" />
        <CueCard type="focus" label="Focus On" content={focusOn} icon="◎" />
      </div>

      <style jsx>{`
        .drill-cues {
          padding: var(--drill-section-gap, 48px) 0;
        }

        .section-title {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          letter-spacing: 0.02em;
          color: var(--pillar-text-primary);
          margin: 0 0 var(--pillar-space-6) 0;
        }

        .cues-grid {
          display: flex;
          gap: var(--drill-cue-card-gap, 12px);
        }

        @media (max-width: 768px) {
          .cues-grid {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

export default DrillCuesCards;
