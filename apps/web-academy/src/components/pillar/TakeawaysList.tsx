"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface TakeawaysListProps {
  items: string[];
  title?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Key takeaways displayed with arrow bullets for quick scanning.
// ═══════════════════════════════════════════════════════════

export function TakeawaysList({
  items,
  title = "Key Takeaways",
  className = "",
}: TakeawaysListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`takeaways ${className}`}>
      <h3 className="takeaways-title">{title}</h3>
      <ul className="takeaways-list">
        {items.map((item, i) => (
          <li key={i} className="takeaway-item">
            <span className="takeaway-arrow">\u2192</span>
            <span className="takeaway-text">{item}</span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .takeaways {
          padding: var(--pillar-space-6);
          background: var(--pillar-glass-bg);
          border: 1px solid var(--pillar-glass-border);
          border-radius: 16px;
          backdrop-filter: blur(var(--pillar-glass-blur));
          -webkit-backdrop-filter: blur(var(--pillar-glass-blur));
          transition: all var(--pillar-duration-slow) var(--pillar-ease-out);
        }

        .takeaways:hover {
          border-color: rgba(0, 246, 224, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .takeaways-title {
          font-family: var(--pillar-font-display);
          font-size: 22px;
          color: var(--pillar-text-primary);
          margin-bottom: var(--pillar-space-5);
        }

        .takeaways-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-4);
        }

        .takeaway-item {
          display: flex;
          align-items: flex-start;
          gap: var(--pillar-space-3);
        }

        .takeaway-arrow {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pillar-brand-cyan);
          font-weight: bold;
        }

        .takeaway-text {
          font-size: 15px;
          line-height: 1.6;
          color: var(--pillar-text-secondary);
        }
      `}</style>
    </div>
  );
}

export default TakeawaysList;
