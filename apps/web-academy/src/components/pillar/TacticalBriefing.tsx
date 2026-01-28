"use client";

import type { ReactNode } from "react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface TacticalBriefingProps {
  children: ReactNode;
  label?: string;
  defaultOpen?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Collapsible accordion for deep SEO content.
// Machine Win: Google expands and reads everything in DOM.
// Human Win: UI stays tight, nerds can expand.
// ═══════════════════════════════════════════════════════════

export function TacticalBriefing({
  children,
  label = "TACTICAL BRIEFING",
  defaultOpen = false,
  className = "",
}: TacticalBriefingProps) {
  return (
    <details className={`tactical-briefing ${className}`} open={defaultOpen}>
      <summary className="tactical-briefing-summary">
        <span className="tactical-briefing-label">{label}</span>
      </summary>
      <div className="tactical-briefing-content">{children}</div>

      <style jsx>{`
        .tactical-briefing {
          margin: var(--pillar-space-6) 0;
        }

        .tactical-briefing-summary {
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--pillar-text-muted);
          cursor: pointer;
          padding: var(--pillar-space-4) var(--pillar-space-5);
          background: var(--pillar-surface-card);
          border: 1px dashed var(--pillar-border-subtle);
          border-radius: 8px;
          list-style: none;
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          transition: all var(--pillar-duration-fast);
          user-select: none;
        }

        .tactical-briefing-summary::-webkit-details-marker {
          display: none;
        }

        .tactical-briefing-summary::before {
          content: '+';
          font-size: 18px;
          font-weight: bold;
          color: var(--pillar-text-dim);
          transition: transform var(--pillar-duration-fast);
          flex-shrink: 0;
        }

        .tactical-briefing-summary:hover {
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
        }

        .tactical-briefing-summary:hover::before {
          color: var(--pillar-brand-cyan);
        }

        .tactical-briefing[open] .tactical-briefing-summary {
          border-style: solid;
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-brand-cyan);
          border-radius: 8px 8px 0 0;
        }

        .tactical-briefing[open] .tactical-briefing-summary::before {
          transform: rotate(45deg);
          color: var(--pillar-brand-cyan);
        }

        .tactical-briefing-label {
          flex: 1;
        }

        .tactical-briefing-content {
          padding: var(--pillar-space-6);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-brand-cyan);
          border-top: none;
          border-radius: 0 0 8px 8px;
        }

        /* Add some spacing between elements inside */
        .tactical-briefing-content > :global(*:not(:last-child)) {
          margin-bottom: var(--pillar-space-8);
        }
      `}</style>
    </details>
  );
}

export default TacticalBriefing;
