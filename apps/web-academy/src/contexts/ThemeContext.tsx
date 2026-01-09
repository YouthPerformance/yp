// ═══════════════════════════════════════════════════════════
// THEME CONTEXT
// Dual-Mode System: Athlete (Kids) vs Parent (Sponsor Report)
// ═══════════════════════════════════════════════════════════

"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateCSSVariables, themes } from "@/lib/theme-config";
import type { Theme, ThemeMode } from "@/types/theme";

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  toggleLightDark: () => void;
  isParentMode: boolean;
  isLightMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Storage key for persisting mode preference
const STORAGE_KEY = "bfr-theme-mode";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = "athlete" }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  // Load persisted mode on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored && (stored === "athlete" || stored === "athlete-light" || stored === "parent")) {
        setModeState(stored);
      }
    }
  }, []);

  // Persist mode changes
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
  }, []);

  // Toggle between athlete and parent modes
  const toggleMode = useCallback(() => {
    if (mode === "parent") {
      setMode("athlete");
    } else {
      setMode("parent");
    }
  }, [mode, setMode]);

  // Toggle light/dark within athlete mode
  const toggleLightDark = useCallback(() => {
    if (mode === "athlete") {
      setMode("athlete-light");
    } else if (mode === "athlete-light") {
      setMode("athlete");
    }
    // Parent mode stays as-is (already light)
  }, [mode, setMode]);

  // Get current theme
  const theme = useMemo(() => themes[mode], [mode]);

  // Apply CSS variables to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cssVars = generateCSSVariables(theme);
      const root = document.documentElement;

      Object.entries(cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Also set data attribute for conditional styling
      root.dataset.theme = mode;
    }
  }, [theme, mode]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode,
      toggleMode,
      toggleLightDark,
      isParentMode: mode === "parent",
      isLightMode: mode === "athlete-light" || mode === "parent",
    }),
    [theme, mode, setMode, toggleMode, toggleLightDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// ─────────────────────────────────────────────────────────────
// USER MODE HOOK
// Convenience hook for checking current mode
// ─────────────────────────────────────────────────────────────

export function useUserMode() {
  const { mode } = useTheme();
  return mode === "parent" ? "PARENT" : "ATHLETE";
}
