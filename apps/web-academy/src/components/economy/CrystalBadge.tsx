"use client";

import { motion } from "framer-motion";
import { CrystalIcon } from "./icons";

interface CrystalBadgeProps {
  /** Total crystal count */
  count: number;
  /** Show as compact inline badge */
  compact?: boolean;
  /** Show change animation (+1, -5, etc) */
  showChange?: number | null;
  /** Visual variant */
  variant?: "default" | "gold" | "rare";
}

/**
 * CrystalBadge - Display total crystal count
 *
 * Used in: Nav header, profile, shop, partner vault
 * Animation: Count ticks up/down smoothly
 */
export function CrystalBadge({
  count,
  compact = false,
  showChange = null,
  variant = "default",
}: CrystalBadgeProps) {
  const iconSize = compact ? 18 : 28;
  const textSize = compact ? "text-sm" : "text-xl";

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${
          compact ? "bg-purple-950/50 px-2 py-0.5" : "bg-purple-950/70 px-3 py-1.5 backdrop-blur-sm"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <CrystalIcon size={iconSize} variant={variant} glowing />

      <motion.span
        key={count}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`font-bold text-purple-300 ${textSize}`}
      >
        {count.toLocaleString()}
      </motion.span>

      {/* Change indicator (+1, -5, etc) */}
      {showChange !== null && showChange !== 0 && (
        <motion.span
          initial={{ opacity: 0, x: -10, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            text-xs font-bold
            ${showChange > 0 ? "text-green-400" : "text-red-400"}
          `}
        >
          {showChange > 0 ? "+" : ""}
          {showChange}
        </motion.span>
      )}
    </motion.div>
  );
}

export default CrystalBadge;
