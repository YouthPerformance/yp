// ═══════════════════════════════════════════════════════════
// StackedLayout Component
// Mobile-first vertical split: coach on top, demo on bottom
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface StackedLayoutProps {
  /** Coach video pane (top) */
  coachPane: ReactNode;
  /** Demo video pane (bottom) */
  demoPane: ReactNode;
  /** Controls section */
  controls: ReactNode;
  /** Header section (exit, progress) */
  header?: ReactNode;
  /** Info overlay (exercise name, cue) */
  infoOverlay?: ReactNode;
  /** Timer component */
  timer?: ReactNode;
  /** Whether videos are currently paused */
  isPaused?: boolean;
}

/**
 * StackedLayout - Mobile vertical split screen
 *
 * Layout:
 * ```
 * ┌────────────────────────┐
 * │ ← Exit       3/8    ⚙️ │  Header (~8%)
 * ├────────────────────────┤
 * │                        │
 * │    ┌──────────────┐    │
 * │    │  COACH VIDEO │    │  ~42%
 * │    │      🔊      │    │
 * │    └──────────────┘    │
 * │                        │
 * │    ┌──────────────┐    │
 * │    │  DEMO VIDEO  │    │  ~42%
 * │    │      🔇      │    │
 * │    └──────────────┘    │
 * │                        │
 * ├────────────────────────┤
 * │   ▶️ PAUSE    ⏭️ SKIP   │  Controls (~8%)
 * │   ═══════○────────     │
 * └────────────────────────┘
 * ```
 */
export function StackedLayout({
  coachPane,
  demoPane,
  controls,
  header,
  infoOverlay,
  timer,
  isPaused = false,
}: StackedLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col h-full w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header - Fixed top */}
      {header && <div className="relative z-20 shrink-0 safe-top">{header}</div>}

      {/* Video Stack */}
      <div className="flex-1 flex flex-col gap-1 min-h-0 p-2">
        {/* Coach Video (Top) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 rounded-xl overflow-hidden relative"
        >
          {coachPane}
        </motion.div>

        {/* Demo Video (Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-xl overflow-hidden relative"
        >
          {demoPane}
        </motion.div>
      </div>

      {/* Timer - Floating between videos */}
      {timer && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          {timer}
        </div>
      )}

      {/* Info Overlay - Absolute positioned over videos */}
      {infoOverlay && (
        <div className="absolute inset-x-0 bottom-24 z-20 pointer-events-none">{infoOverlay}</div>
      )}

      {/* Controls - Fixed bottom */}
      <div className="relative z-20 shrink-0 safe-bottom px-4 pb-4">{controls}</div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <p
              className="font-bebas text-4xl tracking-wider mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              PAUSED
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Tap play to continue
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
