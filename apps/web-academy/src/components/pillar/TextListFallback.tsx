"use client";

import Link from "next/link";
import type { DrillData } from "./DrillCard";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface TextListFallbackProps {
  drills: DrillData[];
  title?: string;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// This component provides a collapsible plain text list of drills
// for SEO crawlers and AI citation. The <details> element ensures
// crawlers can access all internal links.
// ═══════════════════════════════════════════════════════════

export function TextListFallback({
  drills,
  title = "All Drills (Text List)",
  className = "",
}: TextListFallbackProps) {
  if (!drills || drills.length === 0) return null;

  return (
    <details className={`text-list-fallback ${className}`}>
      <summary className="text-list-summary">{title}</summary>
      <ul className="text-list">
        {drills.map((drill) => (
          <li key={drill.slug} className="text-list-item">
            <Link href={`/drills/${drill.slug}`} className="text-list-link">
              {drill.title}
            </Link>
            <span className="text-list-meta">
              {" "}&mdash; {drill.duration} &mdash; {drill.noiseLevel}
            </span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .text-list-fallback {
          margin-top: var(--pillar-space-6);
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 8px;
        }

        .text-list-summary {
          cursor: pointer;
          font-family: var(--pillar-font-mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--pillar-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: var(--pillar-space-2);
          user-select: none;
        }

        .text-list-summary::-webkit-details-marker {
          color: var(--pillar-text-muted);
        }

        .text-list-summary:hover {
          color: var(--pillar-brand-cyan);
        }

        .text-list {
          list-style: disc;
          padding-left: var(--pillar-space-6);
          margin-top: var(--pillar-space-4);
        }

        .text-list-item {
          margin-bottom: var(--pillar-space-2);
          font-size: 14px;
          color: var(--pillar-text-secondary);
        }

        .text-list-link {
          color: var(--pillar-text-primary);
          text-decoration: none;
        }

        .text-list-link:hover {
          color: var(--pillar-brand-cyan);
          text-decoration: underline;
        }

        .text-list-meta {
          color: var(--pillar-text-muted);
        }
      `}</style>
    </details>
  );
}

export default TextListFallback;
