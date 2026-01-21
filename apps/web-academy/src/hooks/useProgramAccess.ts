// ═══════════════════════════════════════════════════════════
// useProgramAccess Hook
// Check user's access and progress for a program
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUserContext } from "@/contexts/UserContext";

// Dev mode detection
const DEV_BYPASS_AUTH = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";

export interface ProgramAccessState {
  /** Whether user has access to the program */
  hasAccess: boolean;

  /** Array of completed day numbers */
  completedDays: number[];

  /** Current day to work on (next incomplete) */
  currentDay: number;

  /** Whether entire program is complete */
  isComplete: boolean;

  /** Loading state */
  isLoading: boolean;

  /** User ID for mutations */
  userId: Id<"users"> | null;
}

/**
 * Hook to check user's access and progress for a specific program
 * @param programSlug - The program identifier (e.g., "basketball-chassis")
 */
export function useProgramAccess(programSlug: string): ProgramAccessState {
  const { user, isLoaded } = useUserContext();

  // Dev mode: skip Convex queries, return mock data
  const isDevMode = DEV_BYPASS_AUTH && user?.authUserId === "dev_auth_123";

  // NOTE: tickets module is disabled, always grant access for now
  // TODO: Re-enable when tickets.ts is restored
  const accessResult = true; // was: useQuery(api.tickets.hasAccess, ...)

  // Get user's workout completions to derive program progress (skip in dev mode)
  const completions = useQuery(
    api.progress.getUserProgress,
    isDevMode ? "skip" : user?._id ? { userId: user._id } : "skip",
  );

  // Dev mode: return mock access state
  if (isDevMode) {
    return {
      hasAccess: true,
      completedDays: [], // Start fresh in dev mode
      currentDay: 1,
      isComplete: false,
      isLoading: false,
      userId: user?._id ?? null,
    };
  }

  // Still loading user, access, or completions
  if (!isLoaded || accessResult === undefined || (user && completions === undefined)) {
    return {
      hasAccess: false,
      completedDays: [],
      currentDay: 1,
      isComplete: false,
      isLoading: true,
      userId: null,
    };
  }

  // No user logged in
  if (!user) {
    return {
      hasAccess: false,
      completedDays: [],
      currentDay: 1,
      isComplete: false,
      isLoading: false,
      userId: null,
    };
  }

  // Check access via entitlements
  // TODO: Remove bypass before production
  const hasAccess = true; // BYPASS FOR TESTING - was: accessResult === true;

  // Calculate completed days from completions
  // Filter for this program's day range (1000-1007 for basketball-chassis)
  const programDayOffset = programSlug === "basketball-chassis" ? 1000 : 0;
  const completedDays: number[] = [];

  if (completions) {
    completions.forEach((c: { dayNumber: number }) => {
      if (c.dayNumber >= programDayOffset + 1 && c.dayNumber <= programDayOffset + 8) {
        completedDays.push(c.dayNumber - programDayOffset);
      }
    });
  }

  // Calculate current day (first incomplete)
  let currentDay = 1;
  for (let i = 1; i <= 8; i++) {
    if (!completedDays.includes(i)) {
      currentDay = i;
      break;
    }
    if (i === 8) {
      currentDay = 8; // All complete
    }
  }

  const isComplete = completedDays.length >= 8;

  return {
    hasAccess,
    completedDays,
    currentDay,
    isComplete,
    isLoading: false,
    userId: user._id,
  };
}

/**
 * Check if a specific day is unlocked
 */
export function isDayUnlocked(dayNumber: number, completedDays: number[]): boolean {
  // Day 1 is always unlocked
  if (dayNumber === 1) return true;

  // Day N is unlocked if Day N-1 is completed
  return completedDays.includes(dayNumber - 1);
}

/**
 * Get the status of a specific day
 */
export function getDayStatus(
  dayNumber: number,
  completedDays: number[],
  currentDay: number,
): "locked" | "unlocked" | "current" | "completed" {
  if (completedDays.includes(dayNumber)) {
    return "completed";
  }

  if (dayNumber === currentDay) {
    return "current";
  }

  if (isDayUnlocked(dayNumber, completedDays)) {
    return "unlocked";
  }

  return "locked";
}
