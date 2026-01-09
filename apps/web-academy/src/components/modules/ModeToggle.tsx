// ═══════════════════════════════════════════════════════════
// MODE TOGGLE
// Switch between Athlete and Parent content modes
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import type { ContentMode } from "@/data/modules/types";

interface ModeToggleProps {
  mode: ContentMode;
  onToggle: () => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onToggle, disabled }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full
        bg-bg-tertiary border border-border-default
        transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-accent-primary/50"}
      `}
      aria-label={`Switch to ${mode === "athlete" ? "parent" : "athlete"} mode`}
    >
      {/* Background slider */}
      <motion.div
        className="absolute inset-1 w-1/2 rounded-full bg-accent-primary/20"
        animate={{
          x: mode === "athlete" ? 0 : "100%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* Athlete option */}
      <div
        className={`
          relative z-10 flex items-center gap-1.5 px-2 py-1
          ${mode === "athlete" ? "text-accent-primary" : "text-text-tertiary"}
          transition-colors
        `}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">Athlete</span>
      </div>

      {/* Parent option */}
      <div
        className={`
          relative z-10 flex items-center gap-1.5 px-2 py-1
          ${mode === "parent" ? "text-accent-primary" : "text-text-tertiary"}
          transition-colors
        `}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Parent</span>
      </div>
    </button>
  );
}
