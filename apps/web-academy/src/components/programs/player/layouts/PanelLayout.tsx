// ═══════════════════════════════════════════════════════════
// PanelLayout Component
// Tablet/Desktop: Videos stacked left, info panel right
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface PanelLayoutProps {
  /** Coach video pane */
  coachPane: ReactNode;
  /** Demo video pane */
  demoPane: ReactNode;
  /** Controls section */
  controls: ReactNode;
  /** Header section (exit, progress) */
  header?: ReactNode;
  /** Exercise name */
  exerciseName: string;
  /** Coaching cue text */
  cue: string;
  /** Timer component */
  timer?: ReactNode;
  /** Side indicator (e.g., "Left Side", "Alternate") */
  sideLabel?: string | null;
  /** Exercise index (0-based) */
  exerciseIndex: number;
  /** Total exercises */
  totalExercises: number;
  /** Theme color for accents */
  themeColor?: string;
  /** Whether videos are paused */
  isPaused?: boolean;
}

/**
 * PanelLayout - Tablet landscape & desktop
 *
 * Layout:
 * ```
 * ┌──────────────────────────────────┬─────────────────────────────────┐
 * │  ← Exit                       ⚙️ │                                 │
 * ├──────────────────────────────────┤      BULLETPROOF ANKLES         │
 * │                                  │      ══════════════════         │
 * │    ┌────────────────────┐        │                                 │
 * │    │    COACH VIDEO     │        │      Exercise 3 of 8            │
 * │    │    (James)  🔊     │        │      ━━━━━━━━○━━━━━━━           │
 * │    └────────────────────┘        │                                 │
 * │                                  │      ⏱️  0:45                    │
 * │    ┌────────────────────┐        │                                 │
 * │    │    DEMO VIDEO      │        │      ─────────────────          │
 * │    │    (Athlete) 🔇    │        │      "Drive through the         │
 * │    └────────────────────┘        │       big toe, feel the         │
 * │                                  │       arch activate"            │
 * │                                  │                                 │
 * │                                  │      [  ▶️ PAUSE  ]             │
 * │                                  │      [  ⏭️ SKIP   ]             │
 * └──────────────────────────────────┴─────────────────────────────────┘
 *            60%                                   40%
 * ```
 */
export function PanelLayout({
  coachPane,
  demoPane,
  controls,
  header,
  exerciseName,
  cue,
  timer,
  sideLabel,
  exerciseIndex,
  totalExercises,
  themeColor = "#00f6e0",
  isPaused = false,
}: PanelLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-full w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Left Side - Videos (60%) */}
      <div className="w-[60%] flex flex-col h-full">
        {/* Header */}
        {header && (
          <div className="shrink-0 p-4">{header}</div>
        )}

        {/* Video Stack */}
        <div className="flex-1 flex flex-col gap-2 p-4 pt-0 min-h-0">
          {/* Coach Video */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 rounded-xl overflow-hidden"
          >
            {coachPane}
          </motion.div>

          {/* Demo Video */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 rounded-xl overflow-hidden"
          >
            {demoPane}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Info Panel (40%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="w-[40%] flex flex-col h-full p-6 border-l"
        style={{ borderColor: "var(--border-default)" }}
      >
        {/* Exercise Title */}
        <div className="mb-8">
          <h1
            className="font-bebas text-4xl lg:text-5xl tracking-wide mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {exerciseName.toUpperCase()}
          </h1>

          {sideLabel && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${themeColor}20`,
                color: themeColor,
              }}
            >
              {sideLabel}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm mb-2" style={{ color: "var(--text-tertiary)" }}>
            Exercise {exerciseIndex + 1} of {totalExercises}
          </p>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border-default)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: themeColor }}
              initial={{ width: 0 }}
              animate={{ width: `${((exerciseIndex + 1) / totalExercises) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Timer */}
        {timer && (
          <div className="flex justify-center mb-8">
            {timer}
          </div>
        )}

        {/* Divider */}
        <div
          className="w-full h-px mb-6"
          style={{ backgroundColor: "var(--border-default)" }}
        />

        {/* Coaching Cue */}
        <div className="flex-1">
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            "{cue}"
          </p>
        </div>

        {/* Controls */}
        <div className="mt-auto pt-6">
          {controls}
        </div>
      </motion.div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p
              className="font-bebas text-5xl tracking-wider mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              PAUSED
            </p>
            <p className="text-base" style={{ color: "var(--text-tertiary)" }}>
              Tap play to continue
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
