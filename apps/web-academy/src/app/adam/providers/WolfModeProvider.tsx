"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WolfModeContextType {
  isWolfMode: boolean;
  toggleWolfMode: () => void;
}

const WolfModeContext = createContext<WolfModeContextType | undefined>(undefined);

const STORAGE_KEY = "yp-wolf-mode";

export function WolfModeProvider({ children }: { children: ReactNode }) {
  const [isWolfMode, setIsWolfMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsWolfMode(true);
    }
  }, []);

  // Sync to localStorage and body attribute
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, String(isWolfMode));

    if (isWolfMode) {
      document.body.setAttribute("data-wolf-mode", "true");
      document.body.classList.add("wolf-mode");
    } else {
      document.body.removeAttribute("data-wolf-mode");
      document.body.classList.remove("wolf-mode");
    }
  }, [isWolfMode, mounted]);

  const toggleWolfMode = () => {
    setIsWolfMode((prev) => !prev);
  };

  return (
    <WolfModeContext.Provider value={{ isWolfMode, toggleWolfMode }}>
      {children}
    </WolfModeContext.Provider>
  );
}

export function useWolfMode() {
  const context = useContext(WolfModeContext);
  if (context === undefined) {
    throw new Error("useWolfMode must be used within a WolfModeProvider");
  }
  return context;
}
