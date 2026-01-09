// ═══════════════════════════════════════════════════════════
// useViewportMode Hook
// Detects viewport size and orientation for responsive layouts
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useState } from "react";

export type ViewportMode = "mobile" | "tablet" | "desktop" | "tv";
export type Orientation = "portrait" | "landscape";

export interface ViewportState {
  /** Current viewport mode based on width + orientation */
  mode: ViewportMode;
  /** Current screen orientation */
  orientation: Orientation;
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  /** Whether the device supports touch */
  isTouch: boolean;
  /** Whether content is being cast to external display */
  isCasting: boolean;
}

/**
 * Breakpoint thresholds (in pixels)
 *
 * | Width        | Orientation | Layout   |
 * |--------------|-------------|----------|
 * | <640px       | Any         | Stacked  |
 * | 640-1023px   | Portrait    | Stacked  |
 * | 640-1023px   | Landscape   | Panel    |
 * | 1024-1919px  | Any         | Panel    |
 * | 1920px+      | Any         | Cinema   |
 */
const BREAKPOINTS = {
  tablet: 640,
  desktop: 1024,
  tv: 1920,
} as const;

function calculateMode(width: number, orientation: Orientation): ViewportMode {
  if (width >= BREAKPOINTS.tv) {
    return "tv";
  }
  if (width >= BREAKPOINTS.desktop) {
    return "desktop";
  }
  if (width >= BREAKPOINTS.tablet) {
    // Tablet can be either panel (landscape) or stacked (portrait)
    // Mode reflects capability, layout components handle orientation
    return "tablet";
  }
  return "mobile";
}

function getOrientation(width: number, height: number): Orientation {
  return width > height ? "landscape" : "portrait";
}

function getIsTouch(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Hook to detect viewport mode and orientation changes
 *
 * @returns ViewportState object with current viewport information
 *
 * @example
 * ```tsx
 * const { mode, orientation } = useViewportMode();
 *
 * // Render different layouts based on mode
 * if (mode === 'mobile' || (mode === 'tablet' && orientation === 'portrait')) {
 *   return <StackedLayout />;
 * }
 * if (mode === 'tv') {
 *   return <CinemaLayout />;
 * }
 * return <PanelLayout />;
 * ```
 */
export function useViewportMode(): ViewportState {
  const [state, setState] = useState<ViewportState>(() => {
    // SSR-safe defaults
    if (typeof window === "undefined") {
      return {
        mode: "mobile",
        orientation: "portrait",
        width: 375,
        height: 812,
        isTouch: true,
        isCasting: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = getOrientation(width, height);

    return {
      mode: calculateMode(width, orientation),
      orientation,
      width,
      height,
      isTouch: getIsTouch(),
      isCasting: false,
    };
  });

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = getOrientation(width, height);
    const mode = calculateMode(width, orientation);

    setState((prev) => {
      // Only update if something changed
      if (
        prev.mode === mode &&
        prev.orientation === orientation &&
        prev.width === width &&
        prev.height === height
      ) {
        return prev;
      }

      return {
        ...prev,
        mode,
        orientation,
        width,
        height,
      };
    });
  }, []);

  // Listen for resize and orientation changes
  useEffect(() => {
    // Initial update after hydration
    updateViewport();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    // Screen wake lock API for preventing sleep during workout
    // (not implemented here, but useful context)

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, [updateViewport]);

  // Detect casting via Presentation API
  useEffect(() => {
    if (typeof window === "undefined" || !("presentation" in navigator)) {
      return;
    }

    const checkCasting = () => {
      // @ts-expect-error - Presentation API types not complete
      const presentation = navigator.presentation;
      if (presentation?.receiver) {
        setState((prev) => ({ ...prev, isCasting: true }));
      }
    };

    checkCasting();
  }, []);

  return state;
}

/**
 * Helper to determine which layout to render
 */
export function getLayoutType(state: ViewportState): "stacked" | "panel" | "cinema" {
  const { mode, orientation } = state;

  // TV always gets cinema
  if (mode === "tv") {
    return "cinema";
  }

  // Desktop gets panel
  if (mode === "desktop") {
    return "panel";
  }

  // Tablet: landscape = panel, portrait = stacked
  if (mode === "tablet") {
    return orientation === "landscape" ? "panel" : "stacked";
  }

  // Mobile always stacked
  return "stacked";
}
