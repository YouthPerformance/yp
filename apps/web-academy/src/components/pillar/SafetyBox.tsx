"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface SafetyBoxProps {
  notes: string[];
  title?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Warning box with safety notes. Displays with a warning
// indicator for important safety information.
// ═══════════════════════════════════════════════════════════

export function SafetyBox({
  notes,
  title = "Safety Notes",
  className = "",
}: SafetyBoxProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className={`safety-box ${className}`}>
      <div className="safety-header">
        <span className="safety-icon">\u26A0\uFE0F</span>
        <h4 className="safety-title">{title}</h4>
      </div>
      <ul className="safety-list">
        {notes.map((note, i) => (
          <li key={i} className="safety-item">
            {note}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .safety-box {
          padding: var(--pillar-space-5);
          background: rgba(255, 176, 32, 0.08);
          border: 1px solid rgba(255, 176, 32, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(var(--pillar-glass-blur));
          -webkit-backdrop-filter: blur(var(--pillar-glass-blur));
          transition: all var(--pillar-duration-slow) var(--pillar-ease-out);
        }

        .safety-box:hover {
          border-color: rgba(255, 176, 32, 0.5);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .safety-header {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-3);
          margin-bottom: var(--pillar-space-4);
        }

        .safety-icon {
          font-size: 20px;
        }

        .safety-title {
          font-family: var(--pillar-font-display);
          font-size: 18px;
          color: var(--pillar-status-warning);
          margin: 0;
        }

        .safety-list {
          list-style: disc;
          padding-left: var(--pillar-space-6);
          margin: 0;
        }

        .safety-item {
          font-size: 14px;
          line-height: 1.6;
          color: var(--pillar-text-secondary);
          margin-bottom: var(--pillar-space-2);
        }

        .safety-item:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

export default SafetyBox;
