// ═══════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// Sticky sidebar (desktop) + collapsible FAB (mobile)
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useCallback } from "react";
import type { TocItem } from "@/lib/seo-content";
import { useActiveSection } from "@/hooks/useActiveSection";

interface TableOfContentsProps {
  /** TOC items extracted from content */
  items: TocItem[];
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Table of Contents component
 * - Desktop (lg+): Sticky left sidebar
 * - Mobile (<lg): FAB in bottom-right, expands to overlay drawer
 */
export function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const headingIds = items.map((item) => item.id);
  const activeId = useActiveSection(headingIds);

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsDrawerOpen(false);
    }
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP TOC (lg+)
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className={`hidden lg:block sticky top-24 w-64 flex-shrink-0 ${className}`}
        aria-label="Table of contents"
      >
        <div className="pr-4 border-l border-white/10">
          <p
            className="font-bebas text-sm tracking-wider mb-4 pl-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            ON THIS PAGE
          </p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    block w-full text-left text-sm py-1.5 transition-all duration-200
                    ${item.level === 3 ? "pl-8" : "pl-4"}
                    ${activeId === item.id
                      ? "text-accent-primary border-l-2 border-accent-primary -ml-[1px]"
                      : "text-text-secondary hover:text-text-primary border-l-2 border-transparent -ml-[1px]"
                    }
                  `}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE FAB + DRAWER (<lg)
          ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* FAB Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`
            fixed bottom-6 right-6 z-40
            w-14 h-14 rounded-full
            flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${isDrawerOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
          aria-label="Open table of contents"
          aria-expanded={isDrawerOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button>

        {/* Overlay backdrop */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50
            max-h-[70vh] overflow-y-auto
            rounded-t-2xl
            transform transition-transform duration-300 ease-out
            ${isDrawerOpen ? "translate-y-0" : "translate-y-full"}
          `}
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            borderBottom: "none",
          }}
          role="dialog"
          aria-label="Table of contents"
          aria-hidden={!isDrawerOpen}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: "var(--border-default)" }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <p className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-primary)" }}>
              ON THIS PAGE
            </p>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 -m-2"
              style={{ color: "var(--text-tertiary)" }}
              aria-label="Close table of contents"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* TOC List */}
          <ul className="px-6 pb-safe-bottom pb-8 space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    block w-full text-left py-3 transition-colors duration-200
                    ${item.level === 3 ? "pl-4" : "pl-0"}
                    ${activeId === item.id
                      ? "text-accent-primary"
                      : "text-text-secondary"
                    }
                  `}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
