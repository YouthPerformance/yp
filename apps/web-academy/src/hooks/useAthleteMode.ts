"use client";

import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const STORAGE_KEY = "yp-athlete-mode";
const BODY_CLASS = "athlete-mode";

// ═══════════════════════════════════════════════════════════
// HOOK
// Toggle athlete mode with localStorage persistence and
// body class management.
// ═══════════════════════════════════════════════════════════

export function useAthleteMode(defaultValue = false) {
  const [isAthleteMode, setIsAthleteMode] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsAthleteMode(stored === "true");
    }
    setIsHydrated(true);
  }, []);

  // Sync body class with state
  useEffect(() => {
    if (!isHydrated) return;

    if (isAthleteMode) {
      document.body.classList.add(BODY_CLASS);
    } else {
      document.body.classList.remove(BODY_CLASS);
    }
  }, [isAthleteMode, isHydrated]);

  // Toggle function with persistence
  const toggleAthleteMode = useCallback(() => {
    setIsAthleteMode((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Direct setter with persistence
  const setAthleteMode = useCallback((value: boolean) => {
    setIsAthleteMode(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return {
    isAthleteMode,
    toggleAthleteMode,
    setAthleteMode,
    isHydrated,
  };
}

export default useAthleteMode;
