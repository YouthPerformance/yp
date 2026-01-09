// ═══════════════════════════════════════════════════════════
// PlaybackControls Component
// Unified play/pause/skip controls for split-screen player
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipForward, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

export interface PlaybackControlsProps {
  /** Whether playback is currently paused */
  isPaused: boolean;
  /** Toggle play/pause state */
  onTogglePause: () => void;
  /** Skip to next exercise */
  onSkip: () => void;
  /** Replay current exercise from beginning */
  onReplay?: () => void;
  /** Theme color for accent button */
  themeColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Layout variant */
  variant?: "row" | "column";
  /** Show replay button */
  showReplay?: boolean;
}

const sizeConfig = {
  sm: {
    mainButton: "w-12 h-12",
    mainIcon: "w-5 h-5",
    secondaryButton: "p-2",
    secondaryIcon: "w-4 h-4",
    gap: "gap-4",
  },
  md: {
    mainButton: "w-16 h-16",
    mainIcon: "w-6 h-6",
    secondaryButton: "p-3",
    secondaryIcon: "w-5 h-5",
    gap: "gap-6",
  },
  lg: {
    mainButton: "w-20 h-20",
    mainIcon: "w-8 h-8",
    secondaryButton: "p-4",
    secondaryIcon: "w-6 h-6",
    gap: "gap-8",
  },
};

/**
 * PlaybackControls - Unified playback control buttons
 *
 * Features:
 * - Play/Pause main button with theme color
 * - Skip with double-tap confirmation
 * - Optional replay button
 * - Size variants for different layouts
 *
 * @example
 * ```tsx
 * <PlaybackControls
 *   isPaused={isPaused}
 *   onTogglePause={togglePause}
 *   onSkip={handleSkip}
 *   themeColor="#FF6B00"
 *   size="md"
 * />
 * ```
 */
export function PlaybackControls({
  isPaused,
  onTogglePause,
  onSkip,
  onReplay,
  themeColor = "#00f6e0",
  size = "md",
  variant = "row",
  showReplay = false,
}: PlaybackControlsProps) {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const config = sizeConfig[size];

  const handleSkipPress = useCallback(() => {
    if (showSkipConfirm) {
      onSkip();
      setShowSkipConfirm(false);
    } else {
      setShowSkipConfirm(true);
      setTimeout(() => setShowSkipConfirm(false), 3000);
    }
  }, [showSkipConfirm, onSkip]);

  const containerClass = variant === "row"
    ? `flex items-center justify-center ${config.gap}`
    : `flex flex-col items-center ${config.gap}`;

  return (
    <div className={containerClass}>
      {/* Replay Button */}
      {showReplay && onReplay && (
        <motion.button
          onClick={onReplay}
          className={`${config.secondaryButton} rounded-full`}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Replay exercise"
        >
          <RotateCcw
            className={config.secondaryIcon}
            style={{ color: "var(--text-tertiary)" }}
          />
        </motion.button>
      )}

      {/* Play/Pause Button */}
      <motion.button
        onClick={onTogglePause}
        className={`${config.mainButton} rounded-full flex items-center justify-center`}
        style={{
          backgroundColor: themeColor,
          boxShadow: `0 4px 20px ${themeColor}60`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPaused ? "Play" : "Pause"}
      >
        {isPaused ? (
          <Play
            className={`${config.mainIcon} ml-1`}
            fill="white"
            style={{ color: "white" }}
          />
        ) : (
          <Pause
            className={config.mainIcon}
            fill="white"
            style={{ color: "white" }}
          />
        )}
      </motion.button>

      {/* Skip Button */}
      <div className="relative">
        <motion.button
          onClick={handleSkipPress}
          className={`${config.secondaryButton} rounded-full`}
          style={{
            backgroundColor: showSkipConfirm
              ? "rgba(239,68,68,0.3)"
              : "rgba(255,255,255,0.1)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Skip exercise"
        >
          <SkipForward
            className={config.secondaryIcon}
            style={{
              color: showSkipConfirm ? "#EF4444" : "var(--text-tertiary)",
            }}
          />
        </motion.button>

        {/* Skip confirmation tooltip */}
        <AnimatePresence>
          {showSkipConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(239,68,68,0.2)",
                  color: "#EF4444",
                }}
              >
                Tap again
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
