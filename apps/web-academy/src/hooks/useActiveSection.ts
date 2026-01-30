// ═══════════════════════════════════════════════════════════
// USE ACTIVE SECTION HOOK
// Intersection Observer for TOC highlighting
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";

interface UseActiveSectionOptions {
  /** Selector for heading elements to observe */
  headingSelector?: string;
  /** Root margin for the intersection observer */
  rootMargin?: string;
  /** Threshold for intersection */
  threshold?: number | number[];
}

/**
 * Hook that tracks which section is currently active based on scroll position
 * Uses Intersection Observer API for performance
 */
export function useActiveSection(
  headingIds: string[],
  options: UseActiveSectionOptions = {}
): string | null {
  const {
    headingSelector = "h2[id], h3[id]",
    rootMargin = "-80px 0px -80% 0px",
    threshold = 0,
  } = options;

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Find the first visible section
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          // Sort by position in viewport (top to bottom)
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined" || headingIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    // Observe all headings with IDs
    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headingIds, rootMargin, threshold, handleIntersection]);

  return activeId;
}
