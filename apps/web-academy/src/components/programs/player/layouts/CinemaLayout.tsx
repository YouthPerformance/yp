// ═══════════════════════════════════════════════════════════
// CinemaLayout Component
// TV/Large Desktop: Side-by-side videos with minimal chrome
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface CinemaLayoutProps {
  /** Coach video pane (left) */
  coachPane: ReactNode;
  /** Demo video pane (right) */
  demoPane: ReactNode;
  /** Exercise name */
  exerciseName: string;
  /** Coaching cue text */
  cue: string;
  /** Exercise index (0-based) */
  exerciseIndex: number;
  /** Total exercises */
  totalExercises: number;
  /** Time remaining display (formatted string like "0:45") */
  timeDisplay: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Theme color for accents */
  themeColor?: string;
  /** Whether videos are paused */
  isPaused?: boolean;
  /** Whether being viewed on remote display (hides controls) */
  isRemoteDisplay?: boolean;
}

/**
 * CinemaLayout - TV and large desktop (1920px+)
 *
 * Optimized for 10-foot viewing distance with:
 * - Large text (readable from couch)
 * - Minimal UI chrome
 * - Safe zone margins (5% all sides)
 * - High contrast for varying room lighting
 *
 * Layout:
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                                                                          │
 * │     ┌─────────────────────────────┐   ┌─────────────────────────────┐   │
 * │     │                             │   │                             │   │
 * │     │       COACH VIDEO           │   │       DEMO VIDEO            │   │
 * │     │                             │   │                             │   │
 * │     │             🔊              │   │             🔇              │   │
 * │     │                             │   │                             │   │
 * │     └─────────────────────────────┘   └─────────────────────────────┘   │
 * │                                                                          │
 * │     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○━━━━━━━━━━━━━━━━━━━━━    │
 * │                                                                          │
 * │     BULLETPROOF ANKLES                    3 / 8                  0:45   │
 * │     "Drive through the big toe, feel the arch activate"                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * When casting, phone shows controls instead.
 */
export function CinemaLayout({
  coachPane,
  demoPane,
  exerciseName,
  cue,
  exerciseIndex,
  totalExercises,
  timeDisplay,
  progress,
  themeColor = "#00f6e0",
  isPaused = false,
  isRemoteDisplay = false,
}: CinemaLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col h-full w-full overflow-hidden"
      style={{
        backgroundColor: "#000",
        // Safe zone padding for TV overscan
        padding: "5%",
      }}
    >
      {/* Video Row */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Coach Video (Left) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 rounded-2xl overflow-hidden"
        >
          {coachPane}
        </motion.div>

        {/* Demo Video (Right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-2xl overflow-hidden"
        >
          {demoPane}
        </motion.div>
      </div>

      {/* Bottom Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="shrink-0 mt-6"
      >
        {/* Progress Bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: themeColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Info Row */}
        <div className="flex items-end justify-between">
          {/* Left: Title & Cue */}
          <div className="max-w-[60%]">
            <h1
              className="font-bebas text-5xl xl:text-6xl tracking-wide mb-2"
              style={{ color: "#fff" }}
            >
              {exerciseName.toUpperCase()}
            </h1>
            <p
              className="text-xl xl:text-2xl leading-relaxed"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              "{cue}"
            </p>
          </div>

          {/* Right: Progress & Timer */}
          <div className="text-right">
            <p
              className="text-2xl font-medium mb-1"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {exerciseIndex + 1} / {totalExercises}
            </p>
            <p
              className="font-bebas text-6xl xl:text-7xl tabular-nums"
              style={{ color: themeColor }}
            >
              {timeDisplay}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Remote Display Notice */}
      {isRemoteDisplay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-8 right-8"
        >
          <div
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            📱 Control from your phone
          </div>
        </motion.div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p
              className="font-bebas text-7xl tracking-wider mb-4"
              style={{ color: "#fff" }}
            >
              PAUSED
            </p>
            <p className="text-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
              {isRemoteDisplay ? "Use your phone to continue" : "Tap anywhere to continue"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
