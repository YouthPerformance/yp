// ═══════════════════════════════════════════════════════════
// READING PROGRESS BAR
// Fixed top bar showing scroll progress
// ═══════════════════════════════════════════════════════════

"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

interface ReadingProgressBarProps {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Fixed top progress bar that shows reading progress
 * Gradient from accent-primary to cyan-400
 */
export function ReadingProgressBar({ className = "" }: ReadingProgressBarProps) {
  const progress = useReadingProgress();

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-50 bg-black/20 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--accent-primary) 0%, #22d3ee 100%)",
          boxShadow: progress > 0 ? "0 0 10px rgba(0, 246, 224, 0.5)" : "none",
        }}
      />
    </div>
  );
}
