"use client";

import { useState, useEffect } from "react";
import type { TocItem } from "@/lib/seo-content";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface StickyTOCProps {
  toc: TocItem[];
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// Desktop sticky table of contents with active section tracking
// ═══════════════════════════════════════════════════════════

export function StickyTOC({ toc, className = "" }: StickyTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe all TOC headings
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  // Group TOC by main sections
  const mainSections = [
    { id: "train", label: "Quick Start" },
    { id: "guide", label: "Complete Guide" },
  ];

  return (
    <nav className={`sticky-toc ${className}`} aria-label="Table of contents">
      <div className="sticky-toc-header">ON THIS PAGE</div>
      <ul className="sticky-toc-list">
        {mainSections.map((section) => (
          <li key={section.id} className="sticky-toc-section">
            <a
              href={`#${section.id}`}
              className={`sticky-toc-link section-link ${activeId === section.id ? "active" : ""}`}
            >
              {section.label}
            </a>
          </li>
        ))}
        {toc
          .filter((item) => item.level === 2)
          .slice(0, 6)
          .map((item) => (
            <li key={item.id} className="sticky-toc-item">
              <a
                href={`#${item.id}`}
                className={`sticky-toc-link ${activeId === item.id ? "active" : ""}`}
              >
                {item.text}
              </a>
            </li>
          ))}
      </ul>

      <style jsx>{`
        .sticky-toc {
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 140px);
          overflow-y: auto;
          padding: var(--pillar-space-4);
          background: var(--pillar-surface-card);
          border: 1px solid var(--pillar-border-subtle);
          border-radius: 12px;
        }

        .sticky-toc-header {
          font-family: var(--pillar-font-mono);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--pillar-text-dim);
          margin-bottom: var(--pillar-space-3);
          padding-bottom: var(--pillar-space-2);
          border-bottom: 1px solid var(--pillar-border-subtle);
        }

        .sticky-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sticky-toc-section {
          margin-bottom: var(--pillar-space-1);
        }

        .sticky-toc-item {
          margin-bottom: var(--pillar-space-1);
        }

        .sticky-toc-link {
          display: block;
          padding: var(--pillar-space-2) var(--pillar-space-3);
          font-size: 13px;
          color: var(--pillar-text-muted);
          text-decoration: none;
          border-radius: 6px;
          transition: all var(--pillar-duration-fast);
          border-left: 2px solid transparent;
        }

        .sticky-toc-link:hover {
          color: var(--pillar-text-primary);
          background: var(--pillar-surface-raised);
        }

        .sticky-toc-link.active {
          color: var(--pillar-brand-cyan);
          background: var(--pillar-brand-cyan-dim);
          border-left-color: var(--pillar-brand-cyan);
        }

        .sticky-toc-link.section-link {
          font-weight: 600;
          color: var(--pillar-text-secondary);
        }

        .sticky-toc-link.section-link.active {
          color: var(--pillar-brand-cyan);
        }

        /* Only show on desktop */
        @media (max-width: 1200px) {
          .sticky-toc {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

export default StickyTOC;
