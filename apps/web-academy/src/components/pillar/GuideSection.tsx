"use client";

import type { ReactNode } from "react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface GuideSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// This is the canonical #guide section for AI crawlers and
// research readers. Contains complete guide content.
// ═══════════════════════════════════════════════════════════

export function GuideSection({
  title,
  subtitle = "Complete Guide",
  children,
  className = "",
}: GuideSectionProps) {
  return (
    <section id="guide" className={`guide-section ${className}`}>
      <div className="guide-header">
        <span className="guide-label">{subtitle}</span>
        <h2 className="guide-title">{title}</h2>
        <div className="guide-divider" />
      </div>

      <div className="guide-content">{children}</div>

      <style jsx>{`
        .guide-section {
          margin-top: var(--pillar-space-16);
          padding: var(--pillar-space-12) 0;
          border-top: 1px solid var(--pillar-border-subtle);
          scroll-margin-top: 6rem;
        }

        .guide-header {
          margin-bottom: var(--pillar-space-10);
        }

        .guide-label {
          display: inline-block;
          padding: var(--pillar-space-1) var(--pillar-space-3);
          background: var(--pillar-brand-purple-dim);
          border: 1px solid var(--pillar-brand-purple);
          border-radius: 4px;
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-brand-purple);
          margin-bottom: var(--pillar-space-4);
        }

        .guide-title {
          font-family: var(--pillar-font-display);
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1;
          margin-bottom: var(--pillar-space-4);
          color: var(--pillar-text-primary);
        }

        .guide-divider {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--pillar-brand-cyan), var(--pillar-brand-purple));
          border-radius: 2px;
        }

        .guide-content {
          display: flex;
          flex-direction: column;
          gap: var(--pillar-space-10);
        }
      `}</style>
    </section>
  );
}

export default GuideSection;
