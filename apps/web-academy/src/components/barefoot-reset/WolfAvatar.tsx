// ═══════════════════════════════════════════════════════════
// Wolf Avatar - Animated Wolf with Evolution States
// Ghost → Forming → Solid → Radiant
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type WolfEvolution = "Ghost" | "Forming" | "Solid" | "Radiant";

interface WolfAvatarProps {
  level: number;
  size?: number;
  showLevel?: boolean;
  animated?: boolean;
  mood?: "idle" | "happy" | "sleeping" | "concerned";
}

const EVOLUTION_CONFIG = {
  Ghost: {
    minLevel: 1,
    maxLevel: 5,
    color: "#8B8B8B",
    glow: "rgba(139, 139, 139, 0.3)",
    style: "opacity-60",
    emoji: "🐺",
  },
  Forming: {
    minLevel: 6,
    maxLevel: 15,
    color: "#60A5FA",
    glow: "rgba(96, 165, 250, 0.4)",
    style: "",
    emoji: "🐺",
  },
  Solid: {
    minLevel: 16,
    maxLevel: 29,
    color: "#34D399",
    glow: "rgba(52, 211, 153, 0.5)",
    style: "",
    emoji: "🐺",
  },
  Radiant: {
    minLevel: 30,
    maxLevel: Infinity,
    color: "#FBBF24",
    glow: "rgba(251, 191, 36, 0.6)",
    style: "",
    emoji: "🐺✨",
  },
};

function getEvolution(level: number): WolfEvolution {
  if (level >= 30) return "Radiant";
  if (level >= 16) return "Solid";
  if (level >= 6) return "Forming";
  return "Ghost";
}

export function WolfAvatar({
  level,
  size = 120,
  showLevel = true,
  animated = true,
  mood = "idle",
}: WolfAvatarProps) {
  const evolution = useMemo(() => getEvolution(level), [level]);
  const config = EVOLUTION_CONFIG[evolution];

  // Calculate progress to next evolution
  const nextEvolution = evolution === "Radiant" ? null :
    evolution === "Solid" ? "Radiant" :
    evolution === "Forming" ? "Solid" : "Forming";

  const nextThreshold = nextEvolution ? EVOLUTION_CONFIG[nextEvolution].minLevel : level;
  const currentMin = config.minLevel;
  const progress = nextEvolution
    ? ((level - currentMin) / (nextThreshold - currentMin)) * 100
    : 100;

  return (
    <div className="relative flex flex-col items-center">
      {/* Wolf Container */}
      <motion.div
        className={`relative rounded-full flex items-center justify-center ${config.style}`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
        animate={animated ? {
          scale: mood === "happy" ? [1, 1.05, 1] : [1, 1.02, 1],
        } : undefined}
        transition={{
          duration: mood === "happy" ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer ring (evolution progress) */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={3}
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke={config.color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (size / 2 - 4)}
            initial={{ strokeDashoffset: 2 * Math.PI * (size / 2 - 4) }}
            animate={{
              strokeDashoffset: 2 * Math.PI * (size / 2 - 4) * (1 - progress / 100),
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Wolf emoji/icon */}
        <motion.div
          className="text-5xl select-none"
          style={{ fontSize: size * 0.4 }}
          animate={mood === "sleeping" ? { rotate: [-5, 5, -5] } : undefined}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {mood === "sleeping" ? "😴" : config.emoji}
        </motion.div>

        {/* Glitch effect for Ghost state */}
        {evolution === "Ghost" && animated && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${config.color}20 50%, transparent 100%)`,
            }}
            animate={{
              x: [-size * 0.1, size * 0.1, -size * 0.1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Particle effect for Radiant state */}
        {evolution === "Radiant" && animated && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: config.color }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * (size * 0.6),
                  y: Math.sin((i * 60 * Math.PI) / 180) * (size * 0.6),
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Level badge */}
      {showLevel && (
        <motion.div
          className="mt-2 px-3 py-1 rounded-full text-sm font-bold"
          style={{
            backgroundColor: `${config.color}20`,
            color: config.color,
            border: `1px solid ${config.color}40`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Lv. {level} • {evolution}
        </motion.div>
      )}
    </div>
  );
}
