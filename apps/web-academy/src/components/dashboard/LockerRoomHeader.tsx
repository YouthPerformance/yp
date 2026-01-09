// ═══════════════════════════════════════════════════════════
// LOCKER ROOM HEADER
// User info, rank badge, and action buttons
// Adapted from yp-academy for barefoot-app styling
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Settings, Users } from "lucide-react";

export type Rank = "pup" | "hunter" | "alpha" | "apex";

interface LockerRoomHeaderProps {
  userName: string;
  avatarColor?: string;
  rank: Rank;
  sport?: string;
  age?: number;
  onParentModeClick?: () => void;
  onSettingsClick?: () => void;
}

const RANK_CONFIG: Record<Rank, { label: string; color: string; emoji: string }> = {
  pup: { label: "Pup", color: "#9CA3AF", emoji: "🐺" },
  hunter: { label: "Hunter", color: "var(--accent-primary)", emoji: "🐺" },
  alpha: { label: "Alpha", color: "var(--accent-gold)", emoji: "🐺" },
  apex: { label: "Apex", color: "#EF4444", emoji: "🐺" },
};

export function LockerRoomHeader({
  userName,
  avatarColor = "#00F6E0",
  rank,
  sport,
  age,
  onParentModeClick,
  onSettingsClick,
}: LockerRoomHeaderProps) {
  const rankConfig = RANK_CONFIG[rank];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${avatarColor}20`,
              border: `2px solid ${rankConfig.color}`,
            }}
          >
            <span className="text-2xl">{rankConfig.emoji}</span>
          </div>
          {/* Online indicator */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
            style={{
              backgroundColor: "#10B981",
              border: "2px solid var(--bg-primary)",
            }}
          />
        </motion.div>

        {/* Name & Details */}
        <div>
          <h1
            className="font-bebas text-xl tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            {userName.toUpperCase()}
          </h1>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{
                backgroundColor: `${rankConfig.color}20`,
                color: rankConfig.color,
              }}
            >
              {rankConfig.label}
            </span>
            {sport && <span>{sport}</span>}
            {sport && age && <span>·</span>}
            {age && <span>Age {age}</span>}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Parent Mode Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onParentModeClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <Users className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Parent
          </span>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
          className="p-2 rounded-full transition-colors"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <Settings className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </motion.button>
      </div>
    </motion.header>
  );
}

export default LockerRoomHeader;
