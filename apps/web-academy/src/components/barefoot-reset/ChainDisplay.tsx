// ═══════════════════════════════════════════════════════════
// Chain Display - Streak visualization
// Wolf Protocol: "Chain" = Streak
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Flame, Link2 } from "lucide-react";

interface ChainDisplayProps {
  currentChain: number;
  bestChain: number;
  nextMilestone?: number;
  compact?: boolean;
}

const MILESTONES = [3, 7, 14, 21, 30, 42];

export function ChainDisplay({
  currentChain,
  bestChain,
  nextMilestone,
  compact = false,
}: ChainDisplayProps) {
  // Find next milestone
  const next = nextMilestone || MILESTONES.find((m) => m > currentChain) || 42;
  const progress = Math.min(100, (currentChain / next) * 100);

  // Determine chain "heat" level
  const heat =
    currentChain >= 21
      ? "legendary"
      : currentChain >= 14
      ? "epic"
      : currentChain >= 7
      ? "hot"
      : currentChain >= 3
      ? "warm"
      : "cold";

  const heatColors = {
    cold: "#6B7280",
    warm: "#F59E0B",
    hot: "#EF4444",
    epic: "#A855F7",
    legendary: "#FBBF24",
  };

  const heatColor = heatColors[heat];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: `${heatColor}20`,
            border: `1px solid ${heatColor}40`,
          }}
        >
          {currentChain > 0 ? (
            <Flame className="w-4 h-4" style={{ color: heatColor }} />
          ) : (
            <Link2 className="w-4 h-4 text-gray-500" />
          )}
          <span
            className="font-bold text-sm"
            style={{ color: currentChain > 0 ? heatColor : "#6B7280" }}
          >
            {currentChain}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-xl p-4"
      style={{
        background: `linear-gradient(135deg, ${heatColor}10 0%, transparent 100%)`,
        border: `1px solid ${heatColor}30`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {currentChain > 0 ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame className="w-5 h-5" style={{ color: heatColor }} />
            </motion.div>
          ) : (
            <Link2 className="w-5 h-5 text-gray-500" />
          )}
          <span className="font-bold text-white">Chain</span>
        </div>
        <span className="text-xs text-gray-400">Best: {bestChain}</span>
      </div>

      {/* Current count */}
      <div className="flex items-baseline gap-1 mb-3">
        <span
          className="font-bebas text-4xl"
          style={{ color: currentChain > 0 ? heatColor : "#6B7280" }}
        >
          {currentChain}
        </span>
        <span className="text-sm text-gray-400">days</span>
      </div>

      {/* Progress to next milestone */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Next: {next}-day milestone</span>
          <span>{next - currentChain} to go</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-gray-800">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: heatColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between mt-2">
        {MILESTONES.slice(0, 5).map((milestone) => (
          <div
            key={milestone}
            className={`text-xs ${
              currentChain >= milestone ? "text-white" : "text-gray-600"
            }`}
          >
            {milestone}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
