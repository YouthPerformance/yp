// ═══════════════════════════════════════════════════════════
// USE READING PROGRESS HOOK
// Scroll-based progress percentage
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";

interface UseReadingProgressOptions {
  /** Element to track scroll progress within (defaults to document) */
  containerRef?: React.RefObject<HTMLElement>;
  /** Throttle interval in ms */
  throttleMs?: number;
}

/**
 * Hook that returns the reading progress as a percentage (0-100)
 * based on scroll position
 */
export function useReadingProgress(
  options: UseReadingProgressOptions = {}
): number {
  const { containerRef, throttleMs = 16 } = options;

  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    if (typeof window === "undefined") return 0;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (containerRef?.current) {
      // Container-specific progress
      const el = containerRef.current;
      scrollTop = el.scrollTop;
      scrollHeight = el.scrollHeight;
      clientHeight = el.clientHeight;
    } else {
      // Document-level progress
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) return 0;

    const rawProgress = (scrollTop / maxScroll) * 100;
    return Math.min(100, Math.max(0, rawProgress));
  }, [containerRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    let lastKnownProgress = 0;

    const handleScroll = () => {
      lastKnownProgress = calculateProgress();

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setProgress(lastKnownProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Calculate initial progress
    setProgress(calculateProgress());

    // Add scroll listener
    const target = containerRef?.current || window;
    target.addEventListener("scroll", handleScroll, { passive: true });

    // Also listen for resize
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [containerRef, calculateProgress, throttleMs]);

  return progress;
}
