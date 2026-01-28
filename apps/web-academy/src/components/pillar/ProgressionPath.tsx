"use client";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface ProgressionNode {
  id: string;
  title: string;
  status: "complete" | "current" | "locked";
  criteria?: string;
}

export interface ProgressionPathProps {
  nodes: ProgressionNode[];
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function ProgressionPath({ nodes, className = "" }: ProgressionPathProps) {
  const getStatusIcon = (status: ProgressionNode["status"]) => {
    switch (status) {
      case "complete":
        return "\u2713";
      case "current":
        return "\u25CF";
      case "locked":
        return "\uD83D\uDD12";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: ProgressionNode["status"]) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "current":
        return "In Progress";
      case "locked":
        return "Locked";
      default:
        return "";
    }
  };

  return (
    <div className={`progression-section ${className}`}>
      <div className="pillar-section-header">
        <span className="pillar-section-label">Progression Path</span>
      </div>

      <div className="progression-track">
        {nodes.map((node, index) => (
          <div key={node.id} className="progression-node">
            <div className={`node-circle ${node.status}`}>
              {getStatusIcon(node.status)}
            </div>
            <span className="node-title">{node.title}</span>
            <span className={`node-status ${node.status}`}>
              {getStatusLabel(node.status)}
            </span>
            {node.criteria && (
              <span className="node-criteria">{node.criteria}</span>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .progression-section {
          margin-top: var(--pillar-space-10);
        }

        .progression-track {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          padding: 0 var(--pillar-space-8);
          margin-bottom: var(--pillar-space-6);
        }

        .progression-track::before {
          content: '';
          position: absolute;
          top: 22px;
          left: 100px;
          right: 100px;
          height: 3px;
          background: var(--pillar-border-default);
        }

        .progression-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--pillar-space-2);
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 140px;
        }

        .node-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: var(--pillar-surface-card);
          border: 2px solid var(--pillar-border-default);
          transition: all var(--pillar-duration-normal) var(--pillar-ease-out);
        }

        .node-circle.complete {
          background: var(--pillar-status-success);
          border-color: var(--pillar-status-success);
          color: var(--pillar-surface-base);
        }

        .node-circle.current {
          background: var(--pillar-brand-cyan-dim);
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
          box-shadow: 0 0 20px var(--pillar-brand-cyan-dim);
        }

        .node-circle.locked {
          background: var(--pillar-surface-raised);
          border-color: var(--pillar-border-subtle);
          color: var(--pillar-text-dim);
        }

        .node-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--pillar-text-primary);
        }

        .node-status {
          font-size: 11px;
          color: var(--pillar-text-muted);
        }

        .node-status.complete {
          color: var(--pillar-status-success);
        }

        .node-status.current {
          color: var(--pillar-brand-cyan);
        }

        .node-criteria {
          font-size: 11px;
          color: var(--pillar-text-muted);
          font-style: italic;
          margin-top: var(--pillar-space-1);
        }

        @media (max-width: 768px) {
          .progression-track {
            flex-direction: column;
            gap: var(--pillar-space-6);
            padding: 0;
          }

          .progression-track::before {
            display: none;
          }

          .progression-node {
            flex-direction: row;
            text-align: left;
            max-width: none;
            gap: var(--pillar-space-4);
          }

          .node-circle {
            flex-shrink: 0;
          }

          .node-title,
          .node-status,
          .node-criteria {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}

export default ProgressionPath;
