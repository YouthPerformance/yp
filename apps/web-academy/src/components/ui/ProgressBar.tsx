// ═══════════════════════════════════════════════════════════
// PROGRESS BAR
// Animated progress indicator
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "cyan" | "gold" | "default";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "cyan",
  size = "md",
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    cyan: "var(--accent-primary)",
    gold: "var(--accent-gold)",
    default: "var(--text-secondary)",
  };

  return (
    <div className="w-full">
      <div
        className={`w-full ${heights[size]} rounded-full overflow-hidden`}
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <motion.div
          className={`${heights[size]} rounded-full`}
          style={{ backgroundColor: colors[variant] }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-mono" style={{ color: colors[variant] }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
