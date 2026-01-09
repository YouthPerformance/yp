// ═══════════════════════════════════════════════════════════
// USE ANONYMOUS PROGRESS
// localStorage-based progress tracking for anonymous users
// Allows teaser modules to be completed without authentication
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "yp-teaser-progress";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface TeaserProgress {
  moduleSlug: string;
  completedAt: number;
  score: number;
  totalChecks: number;
  xpEarned: number;
  shardsEarned: number;
  timeElapsed: number;
  emailCaptured?: string;
}

interface AnonymousProgressState {
  teaserProgress: Record<string, TeaserProgress>;
  lastUpdated: number;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useAnonymousProgress() {
  const [state, setState] = useState<AnonymousProgressState>(() => ({
    teaserProgress: {},
    lastUpdated: 0,
  }));
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AnonymousProgressState;
        setState(parsed);
      }
    } catch (error) {
      console.error("[useAnonymousProgress] Failed to load from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  const saveState = useCallback((newState: AnonymousProgressState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error("[useAnonymousProgress] Failed to save to localStorage:", error);
    }
  }, []);

  // Save teaser completion
  const saveTeaserCompletion = useCallback(
    (
      moduleSlug: string,
      stats: {
        score: number;
        totalChecks: number;
        xpEarned: number;
        shardsEarned: number;
        timeElapsed: number;
      },
    ) => {
      const newProgress: TeaserProgress = {
        moduleSlug,
        completedAt: Date.now(),
        score: stats.score,
        totalChecks: stats.totalChecks,
        xpEarned: stats.xpEarned,
        shardsEarned: stats.shardsEarned,
        timeElapsed: stats.timeElapsed,
      };

      const newState: AnonymousProgressState = {
        ...state,
        teaserProgress: {
          ...state.teaserProgress,
          [moduleSlug]: newProgress,
        },
        lastUpdated: Date.now(),
      };

      saveState(newState);
      return newProgress;
    },
    [state, saveState],
  );

  // Record email capture for a teaser
  const recordEmailCapture = useCallback(
    (moduleSlug: string, email: string) => {
      const existing = state.teaserProgress[moduleSlug];
      if (!existing) return;

      const newState: AnonymousProgressState = {
        ...state,
        teaserProgress: {
          ...state.teaserProgress,
          [moduleSlug]: {
            ...existing,
            emailCaptured: email,
          },
        },
        lastUpdated: Date.now(),
      };

      saveState(newState);
    },
    [state, saveState],
  );

  // Get progress for a specific teaser
  const getTeaserProgress = useCallback(
    (moduleSlug: string): TeaserProgress | null => {
      return state.teaserProgress[moduleSlug] ?? null;
    },
    [state],
  );

  // Check if a teaser has been completed
  const isTeaserCompleted = useCallback(
    (moduleSlug: string): boolean => {
      return !!state.teaserProgress[moduleSlug];
    },
    [state],
  );

  // Get all completed teasers for migration
  const getAllProgress = useCallback((): TeaserProgress[] => {
    return Object.values(state.teaserProgress);
  }, [state]);

  // Clear progress after migration to Convex
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setState({ teaserProgress: {}, lastUpdated: 0 });
    } catch (error) {
      console.error("[useAnonymousProgress] Failed to clear localStorage:", error);
    }
  }, []);

  return {
    isLoaded,
    saveTeaserCompletion,
    recordEmailCapture,
    getTeaserProgress,
    isTeaserCompleted,
    getAllProgress,
    clearProgress,
  };
}

// ─────────────────────────────────────────────────────────────
// MIGRATION HELPER
// For migrating anonymous progress to Convex after sign-up
// ─────────────────────────────────────────────────────────────

export async function migrateAnonymousProgress(
  progress: TeaserProgress[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convexMutation: (args: any) => Promise<void>,
): Promise<{ migrated: number; failed: number }> {
  let migrated = 0;
  let failed = 0;

  for (const p of progress) {
    try {
      await convexMutation({
        moduleSlug: p.moduleSlug,
        completedAt: p.completedAt,
        score: p.score,
        totalChecks: p.totalChecks,
        xpEarned: p.xpEarned,
        shardsEarned: p.shardsEarned,
        timeElapsed: p.timeElapsed,
      });
      migrated++;
    } catch (error) {
      console.error(`[migrateAnonymousProgress] Failed to migrate ${p.moduleSlug}:`, error);
      failed++;
    }
  }

  return { migrated, failed };
}
