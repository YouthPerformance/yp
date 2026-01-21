// ═══════════════════════════════════════════════════════════
// Mission Card - Today's workout preview
// Wolf Protocol: "Mission" = Workout
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Clock, Gem, Play, Zap } from "lucide-react";
import Link from "next/link";

interface MissionCardProps {
  missionNumber: number;
  missionName: string;
  subtitle?: string;
  phase: "Foundation" | "Progression" | "Mastery";
  durationMin: number;
  shardsReward: number;
  hasStrikeWod?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  href: string;
}

const PHASE_COLORS = {
  Foundation: "#60A5FA", // Blue
  Progression: "#34D399", // Green
  Mastery: "#FBBF24", // Gold
};

export function MissionCard({
  missionNumber,
  missionName,
  subtitle,
  phase,
  durationMin,
  shardsReward,
  hasStrikeWod = false,
  isCompleted = false,
  isLocked = false,
  href,
}: MissionCardProps) {
  const phaseColor = PHASE_COLORS[phase];

  const CardContent = (
    <motion.div
      className={`relative rounded-2xl p-5 overflow-hidden ${
        isLocked ? "opacity-50" : ""
      }`}
      style={{
        background: isCompleted
          ? `linear-gradient(135deg, ${phaseColor}15 0%, transparent 100%)`
          : "rgba(255,255,255,0.05)",
        border: `1px solid ${isCompleted ? phaseColor : "rgba(255,255,255,0.1)"}`,
      }}
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
    >
      {/* Phase badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-xs font-bold tracking-wider px-2 py-1 rounded"
          style={{
            backgroundColor: `${phaseColor}20`,
            color: phaseColor,
          }}
        >
          {phase.toUpperCase()}
        </div>

        {hasStrikeWod && (
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Zap className="w-3 h-3" />
            <span>Strike WOD</span>
          </div>
        )}
      </div>

      {/* Mission title */}
      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-1">Mission {missionNumber}</p>
        <h3 className="font-bebas text-2xl tracking-wide text-white">
          {missionName.toUpperCase()}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <Clock className="w-4 h-4" />
          <span>{durationMin} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-cyan-400">
          <Gem className="w-4 h-4" />
          <span>{shardsReward} Shards</span>
        </div>
      </div>

      {/* CTA button */}
      <motion.div
        className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
        style={{
          backgroundColor: isCompleted ? "rgba(255,255,255,0.1)" : phaseColor,
          color: isCompleted ? "white" : "black",
        }}
        whileHover={{ opacity: 0.9 }}
      >
        {isCompleted ? (
          <>
            <span>✓ COMPLETED</span>
          </>
        ) : isLocked ? (
          <>
            <span>🔒 LOCKED</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" fill="currentColor" />
            <span>START MISSION</span>
          </>
        )}
      </motion.div>

      {/* Completed checkmark overlay */}
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${phaseColor}30` }}
          >
            ✓
          </div>
        </div>
      )}
    </motion.div>
  );

  if (isLocked) {
    return <div className="cursor-not-allowed">{CardContent}</div>;
  }

  return <Link href={href}>{CardContent}</Link>;
}
