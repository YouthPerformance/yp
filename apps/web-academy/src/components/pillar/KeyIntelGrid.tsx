"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface IntelCard {
  type: "objective" | "avoid" | "tip" | "safety";
  emoji: string;
  title: string;
  content: string;
}

export interface KeyIntelGridProps {
  cards: IntelCard[];
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function KeyIntelGrid({ cards, className = "" }: KeyIntelGridProps) {
  const getTypeStyles = (type: IntelCard["type"]) => {
    switch (type) {
      case "objective":
        return {
          border: "var(--pillar-status-success)",
          bg: "var(--pillar-status-success-dim)",
        };
      case "avoid":
        return {
          border: "var(--pillar-status-danger)",
          bg: "var(--pillar-status-danger-dim)",
        };
      case "tip":
        return {
          border: "var(--pillar-brand-cyan)",
          bg: "var(--pillar-brand-cyan-dim)",
        };
      case "safety":
        return {
          border: "var(--pillar-status-warning)",
          bg: "var(--pillar-status-warning-dim)",
        };
      default:
        return {
          border: "var(--pillar-border-default)",
          bg: "transparent",
        };
    }
  };

  return (
    <section className={`key-intel-section ${className}`}>
      <div className="pillar-section-header">
        <span className="pillar-section-label">Key Intel</span>
      </div>

      <div className="key-intel-grid">
        {cards.map((card, i) => {
          const styles = getTypeStyles(card.type);
          return (
            <div
              key={i}
              className="intel-card"
              style={{
                borderColor: styles.border,
                backgroundColor: styles.bg,
              }}
            >
              <div className="intel-card-header">
                <span className="intel-emoji">{card.emoji}</span>
                <span className="intel-title">{card.title}</span>
              </div>
              <p className="intel-content">{card.content}</p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .key-intel-section {
          margin-top: var(--pillar-space-10);
        }

        .key-intel-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--pillar-space-4);
        }

        @media (max-width: 600px) {
          .key-intel-grid {
            grid-template-columns: 1fr;
          }
        }

        .intel-card {
          padding: var(--pillar-space-5);
          border: 1px solid;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-3);
        }

        .intel-card-header {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
        }

        .intel-emoji {
          font-size: 20px;
        }

        .intel-title {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--pillar-text-primary);
        }

        .intel-content {
          font-size: 14px;
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          margin: 0;
        }
      `}</style>
    </section>
  );
}

export default KeyIntelGrid;
