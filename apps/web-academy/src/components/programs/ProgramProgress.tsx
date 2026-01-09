// ═══════════════════════════════════════════════════════════
// ProgramProgress Component
// Progress bar and status for program completion
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";

interface ProgramProgressProps {
  completedDays: number;
  totalDays: number;
  accentColor?: string;
}

export function ProgramProgress({
  completedDays,
  totalDays,
  accentColor = "var(--accent-primary)",
}: ProgramProgressProps) {
  const progress = (completedDays / totalDays) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-2"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Text */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          Day {Math.min(completedDays + 1, totalDays)} of {totalDays}
        </span>
        <span className="text-xs font-bold" style={{ color: accentColor }}>
          {completedDays === totalDays ? "Complete!" : `${Math.round(progress)}%`}
        </span>
      </div>
    </div>
  );
}
