"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Physics-based scroll velocity tracker
 * Returns normalized velocity (-1 to 1) with spring physics for smooth decay
 *
 * Award-winning details:
 * - Tracks actual velocity (speed + direction), not just scroll position
 * - Uses spring physics for organic feel when stopping
 * - Normalizes across different scroll speeds/devices
 * - Respects reduced motion preferences
 */

interface ScrollVelocityState {
  /** Normalized velocity: -1 (up fast) to 1 (down fast), 0 = stopped */
  velocity: number;
  /** Absolute speed 0-1 regardless of direction */
  speed: number;
  /** Scroll direction: -1 up, 0 stopped, 1 down */
  direction: number;
  /** Raw velocity in px/ms before normalization */
  raw: number;
}

interface UseScrollVelocityOptions {
  /** Spring stiffness - higher = snappier return (default: 0.15) */
  stiffness?: number;
  /** Spring damping - higher = less bounce (default: 0.8) */
  damping?: number;
  /** Max velocity to normalize against in px/ms (default: 3) */
  maxVelocity?: number;
  /** Velocity threshold below which we consider "stopped" (default: 0.01) */
  threshold?: number;
  /** Respect prefers-reduced-motion (default: true) */
  respectReducedMotion?: boolean;
}

const DEFAULT_OPTIONS: Required<UseScrollVelocityOptions> = {
  stiffness: 0.15,
  damping: 0.8,
  maxVelocity: 3,
  threshold: 0.01,
  respectReducedMotion: true,
};

export function useScrollVelocity(
  options: UseScrollVelocityOptions = {}
): ScrollVelocityState {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    speed: 0,
    direction: 0,
    raw: 0,
  });

  // Refs for tracking without re-renders
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const currentVelocity = useRef(0);
  const targetVelocity = useRef(0);
  const rafId = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  // Spring physics update loop
  const updateSpring = useCallback(() => {
    // Spring force toward target
    const force = (targetVelocity.current - currentVelocity.current) * opts.stiffness;
    // Apply force with damping
    currentVelocity.current += force;
    currentVelocity.current *= opts.damping;

    // Snap to zero if below threshold
    if (Math.abs(currentVelocity.current) < opts.threshold) {
      currentVelocity.current = 0;
    }

    const velocity = currentVelocity.current;
    const speed = Math.abs(velocity);
    const direction = velocity > opts.threshold ? 1 : velocity < -opts.threshold ? -1 : 0;

    setState({
      velocity,
      speed,
      direction,
      raw: targetVelocity.current * opts.maxVelocity,
    });

    rafId.current = requestAnimationFrame(updateSpring);
  }, [opts.stiffness, opts.damping, opts.threshold, opts.maxVelocity]);

  useEffect(() => {
    // Check reduced motion preference
    if (opts.respectReducedMotion && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion.current = mediaQuery.matches;

      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion.current = e.matches;
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [opts.respectReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();

    const handleScroll = () => {
      // Skip if reduced motion preferred
      if (prefersReducedMotion.current) {
        targetVelocity.current = 0;
        return;
      }

      const now = performance.now();
      const deltaTime = now - lastTime.current;
      const deltaScroll = window.scrollY - lastScrollY.current;

      // Calculate velocity in px/ms, then normalize
      if (deltaTime > 0) {
        const rawVelocity = deltaScroll / deltaTime;
        // Normalize to -1 to 1 range, clamped
        const normalized = Math.max(-1, Math.min(1, rawVelocity / opts.maxVelocity));
        targetVelocity.current = normalized;
      }

      lastScrollY.current = window.scrollY;
      lastTime.current = now;
    };

    // Decay velocity when not scrolling
    const handleScrollEnd = () => {
      targetVelocity.current = 0;
    };

    let scrollEndTimer: ReturnType<typeof setTimeout>;
    const handleScrollWithEnd = () => {
      handleScroll();
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(handleScrollEnd, 100);
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(updateSpring);

    // Listen to scroll
    window.addEventListener("scroll", handleScrollWithEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollWithEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearTimeout(scrollEndTimer);
    };
  }, [updateSpring, opts.maxVelocity]);

  return state;
}

/**
 * Simplified hook that just returns velocity number
 */
export function useScrollSpeed(options?: UseScrollVelocityOptions): number {
  const { speed } = useScrollVelocity(options);
  return speed;
}

export default useScrollVelocity;
