// ═══════════════════════════════════════════════════════════
// AudioToggle Component
// Switch audio between coach and demo videos
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Headphones, Volume2, VolumeX } from "lucide-react";

export type AudioSource = "coach" | "demo" | "none";

export interface AudioToggleProps {
  /** Current audio source */
  audioSource: AudioSource;
  /** Called when audio source changes */
  onToggle: (source: AudioSource) => void;
  /** Theme color for active state */
  themeColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show labels */
  showLabels?: boolean;
  /** Layout variant */
  variant?: "toggle" | "buttons";
}

const sizeConfig = {
  sm: {
    button: "p-2",
    icon: "w-4 h-4",
    text: "text-xs",
  },
  md: {
    button: "p-3",
    icon: "w-5 h-5",
    text: "text-sm",
  },
  lg: {
    button: "p-4",
    icon: "w-6 h-6",
    text: "text-base",
  },
};

/**
 * AudioToggle - Switch audio between coach and demo
 *
 * Two variants:
 * - toggle: Single button that cycles through sources
 * - buttons: Two separate buttons for each source
 *
 * @example
 * ```tsx
 * // Toggle variant
 * <AudioToggle
 *   audioSource={audioSource}
 *   onToggle={setAudioSource}
 *   variant="toggle"
 * />
 *
 * // Buttons variant
 * <AudioToggle
 *   audioSource={audioSource}
 *   onToggle={setAudioSource}
 *   variant="buttons"
 *   showLabels
 * />
 * ```
 */
export function AudioToggle({
  audioSource,
  onToggle,
  themeColor = "#00f6e0",
  size = "md",
  showLabels = false,
  variant = "toggle",
}: AudioToggleProps) {
  const config = sizeConfig[size];

  // Toggle cycles: coach -> demo -> (none) -> coach
  const handleToggle = () => {
    const next: AudioSource = audioSource === "coach" ? "demo" : "coach";
    onToggle(next);
  };

  if (variant === "toggle") {
    return (
      <motion.button
        onClick={handleToggle}
        className={`${config.button} rounded-full flex items-center gap-2`}
        style={{
          backgroundColor: audioSource !== "none" ? `${themeColor}20` : "rgba(255,255,255,0.1)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Audio: ${audioSource}`}
      >
        {audioSource === "coach" ? (
          <Volume2 className={config.icon} style={{ color: themeColor }} />
        ) : audioSource === "demo" ? (
          <Headphones className={config.icon} style={{ color: themeColor }} />
        ) : (
          <VolumeX className={config.icon} style={{ color: "var(--text-tertiary)" }} />
        )}

        {showLabels && (
          <span
            className={`${config.text} font-medium`}
            style={{
              color: audioSource !== "none" ? themeColor : "var(--text-tertiary)",
            }}
          >
            {audioSource === "coach" ? "Coach" : audioSource === "demo" ? "Demo" : "Muted"}
          </span>
        )}
      </motion.button>
    );
  }

  // Buttons variant
  return (
    <div className="flex items-center gap-2">
      {/* Coach Audio Button */}
      <motion.button
        onClick={() => onToggle("coach")}
        className={`${config.button} rounded-full flex items-center gap-2`}
        style={{
          backgroundColor: audioSource === "coach" ? `${themeColor}20` : "rgba(255,255,255,0.1)",
          borderWidth: audioSource === "coach" ? 2 : 0,
          borderColor: themeColor,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Coach audio"
        aria-pressed={audioSource === "coach"}
      >
        <Volume2
          className={config.icon}
          style={{
            color: audioSource === "coach" ? themeColor : "var(--text-tertiary)",
          }}
        />
        {showLabels && (
          <span
            className={`${config.text} font-medium`}
            style={{
              color: audioSource === "coach" ? themeColor : "var(--text-tertiary)",
            }}
          >
            Coach
          </span>
        )}
      </motion.button>

      {/* Demo Audio Button */}
      <motion.button
        onClick={() => onToggle("demo")}
        className={`${config.button} rounded-full flex items-center gap-2`}
        style={{
          backgroundColor: audioSource === "demo" ? `${themeColor}20` : "rgba(255,255,255,0.1)",
          borderWidth: audioSource === "demo" ? 2 : 0,
          borderColor: themeColor,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Demo audio"
        aria-pressed={audioSource === "demo"}
      >
        <Headphones
          className={config.icon}
          style={{
            color: audioSource === "demo" ? themeColor : "var(--text-tertiary)",
          }}
        />
        {showLabels && (
          <span
            className={`${config.text} font-medium`}
            style={{
              color: audioSource === "demo" ? themeColor : "var(--text-tertiary)",
            }}
          >
            Demo
          </span>
        )}
      </motion.button>
    </div>
  );
}
