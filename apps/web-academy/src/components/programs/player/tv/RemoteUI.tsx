// ═══════════════════════════════════════════════════════════
// RemoteUI Component
// Phone controller interface when casting to TV
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { CastCommand } from "@/hooks/useCastSession";

export interface RemoteUIProps {
  /** Send a command to the TV */
  onCommand: (command: CastCommand) => void;
  /** Current playback state */
  isPaused: boolean;
  /** Current audio source */
  audioSource: "coach" | "demo";
  /** Current exercise name */
  exerciseName: string;
  /** Next exercise name (if any) */
  nextExerciseName?: string;
  /** Time remaining display */
  timeDisplay: string;
  /** Exercise index */
  exerciseIndex: number;
  /** Total exercises */
  totalExercises: number;
  /** Theme color */
  themeColor?: string;
  /** Exit callback */
  onExit?: () => void;
}

/**
 * RemoteUI - Phone controller when casting to TV
 *
 * Shows on the phone while workout plays on TV.
 * Sends commands via cast session.
 *
 * Layout:
 * ```
 * ┌─────────────────────────┐
 * │                         │
 * │   Now Playing:          │
 * │   TOE YOGA              │
 * │                         │
 * │   Next: Arch Lifts      │
 * │                         │
 * │        ⏱️ 0:45          │
 * │                         │
 * │   [◀️]  [⏸️]  [▶️]       │
 * │                         │
 * │   [🔊 Coach] [🎧 Demo]  │
 * │                         │
 * └─────────────────────────┘
 * ```
 */
export function RemoteUI({
  onCommand,
  isPaused,
  audioSource,
  exerciseName,
  nextExerciseName,
  timeDisplay,
  exerciseIndex,
  totalExercises,
  themeColor = "#00f6e0",
  onExit,
}: RemoteUIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {onExit && (
          <motion.button
            onClick={onExit}
            className="p-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </motion.button>
        )}

        <div
          className="px-4 py-2 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${themeColor}20`,
            color: themeColor,
          }}
        >
          📺 Casting to TV
        </div>
      </div>

      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p
          className="text-sm uppercase tracking-wider mb-2"
          style={{ color: "var(--text-tertiary)" }}
        >
          Now Playing
        </p>

        <h1
          className="font-bebas text-4xl text-center mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {exerciseName.toUpperCase()}
        </h1>

        {/* Progress indicator */}
        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {exerciseIndex + 1} of {totalExercises}
        </p>

        {/* Timer */}
        <div
          className="font-bebas text-6xl tabular-nums mb-8"
          style={{ color: themeColor }}
        >
          {timeDisplay}
        </div>

        {/* Next up */}
        {nextExerciseName && (
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Up Next
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {nextExerciseName}
            </p>
          </div>
        )}
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {/* Previous */}
        <motion.button
          onClick={() => onCommand({ type: "seek", payload: 0 })}
          className="p-4 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipBack className="w-6 h-6" style={{ color: "var(--text-tertiary)" }} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={() => onCommand({ type: isPaused ? "play" : "pause" })}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: themeColor,
            boxShadow: `0 4px 30px ${themeColor}60`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPaused ? (
            <Play className="w-8 h-8 ml-1" fill="white" style={{ color: "white" }} />
          ) : (
            <Pause className="w-8 h-8" fill="white" style={{ color: "white" }} />
          )}
        </motion.button>

        {/* Skip */}
        <motion.button
          onClick={() => onCommand({ type: "skip" })}
          className="p-4 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward className="w-6 h-6" style={{ color: "var(--text-tertiary)" }} />
        </motion.button>
      </div>

      {/* Audio Source Toggle */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          onClick={() => onCommand({ type: "audio", payload: "coach" })}
          className="flex items-center gap-2 px-4 py-3 rounded-full"
          style={{
            backgroundColor:
              audioSource === "coach"
                ? `${themeColor}20`
                : "rgba(255,255,255,0.1)",
            borderWidth: audioSource === "coach" ? 2 : 0,
            borderColor: themeColor,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Volume2
            className="w-5 h-5"
            style={{
              color: audioSource === "coach" ? themeColor : "var(--text-tertiary)",
            }}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: audioSource === "coach" ? themeColor : "var(--text-tertiary)",
            }}
          >
            Coach
          </span>
        </motion.button>

        <motion.button
          onClick={() => onCommand({ type: "audio", payload: "demo" })}
          className="flex items-center gap-2 px-4 py-3 rounded-full"
          style={{
            backgroundColor:
              audioSource === "demo"
                ? `${themeColor}20`
                : "rgba(255,255,255,0.1)",
            borderWidth: audioSource === "demo" ? 2 : 0,
            borderColor: themeColor,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <VolumeX
            className="w-5 h-5"
            style={{
              color: audioSource === "demo" ? themeColor : "var(--text-tertiary)",
            }}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: audioSource === "demo" ? themeColor : "var(--text-tertiary)",
            }}
          >
            Demo
          </span>
        </motion.button>
      </div>

      {/* Safe area spacer */}
      <div className="h-8 safe-bottom" />
    </motion.div>
  );
}
