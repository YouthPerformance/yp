"use client";

import { useCallback } from "react";

export interface TocSection {
  id: string;
  label: string;
  enabled: boolean;
}

export interface DrillTableOfContentsProps {
  hasSteps?: boolean;
  hasCues?: boolean;
  hasMistakes?: boolean;
  hasBenchmarks?: boolean;
  hasProgression?: boolean;
}

export function DrillTableOfContents({
  hasSteps = true,
  hasCues = true,
  hasMistakes = true,
  hasBenchmarks = true,
  hasProgression = true,
}: DrillTableOfContentsProps) {
  const sections: TocSection[] = [
    { id: "how-to", label: "How-To", enabled: hasSteps },
    { id: "cues", label: "Cues", enabled: hasCues },
    { id: "mistakes", label: "Mistakes", enabled: hasMistakes },
    { id: "benchmarks", label: "Benchmarks", enabled: hasBenchmarks },
    { id: "progression", label: "Progression", enabled: hasProgression },
  ];

  const enabledSections = sections.filter((s) => s.enabled);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      // Update URL hash without jumping
      history.pushState(null, "", `#${id}`);
    }
  }, []);

  if (enabledSections.length === 0) {
    return null;
  }

  return (
    <nav className="drill-toc" aria-label="Page sections">
      <div className="toc-chips">
        {enabledSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="toc-chip"
            onClick={(e) => handleClick(e, section.id)}
          >
            {section.label}
          </a>
        ))}
      </div>

      <style jsx>{`
        .drill-toc {
          padding: var(--pillar-space-4) 0;
          margin-bottom: var(--pillar-space-2);
        }

        .toc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--pillar-space-2);
        }

        .toc-chip {
          display: inline-flex;
          align-items: center;
          padding: var(--pillar-space-2) var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 100px;
          font-family: var(--pillar-font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--pillar-text-secondary);
          text-decoration: none;
          white-space: nowrap;
          transition: all var(--pillar-duration-fast) var(--pillar-ease-out);
        }

        .toc-chip:hover {
          background: var(--pillar-surface-raised);
          border-color: var(--pillar-brand-cyan);
          color: var(--pillar-text-primary);
        }

        .toc-chip:active {
          transform: scale(0.98);
        }

        /* Mobile: horizontal scroll */
        @media (max-width: 600px) {
          .toc-chips {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: var(--pillar-space-2);
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .toc-chips::-webkit-scrollbar {
            display: none;
          }

          .toc-chip {
            flex-shrink: 0;
            font-size: 12px;
            padding: var(--pillar-space-2) var(--pillar-space-3);
          }
        }
      `}</style>
    </nav>
  );
}

export default DrillTableOfContents;
