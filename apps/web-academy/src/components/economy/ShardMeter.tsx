"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CrystalIcon, ShardIcon } from "./icons";

interface ShardMeterProps {
  /** Current shard count (0-9, resets at 10) */
  shards: number;
  /** Total crystals earned */
  crystals?: number;
  /** Show crystal count next to meter */
  showCrystalCount?: boolean;
  /** Compact mode for nav/header */
  compact?: boolean;
  /** Callback when conversion happens (10 shards → 1 crystal) */
  onConvert?: () => void;
}

/**
 * ShardMeter - Visual progress toward next crystal
 *
 * 10 segments that fill as shards are earned.
 * When full, celebrates and resets to 0.
 *
 * Design: Horizontal meter with 10 shard slots
 * Animation: Segments pulse on fill, explode on conversion
 */
export function ShardMeter({
  shards,
  crystals = 0,
  showCrystalCount = true,
  compact = false,
  onConvert,
}: ShardMeterProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [prevShards, setPrevShards] = useState(shards);

  // Detect when we hit 10 and need to celebrate
  useEffect(() => {
    if (shards === 0 && prevShards === 9) {
      // Just converted!
      setCelebrating(true);
      onConvert?.();
      const timer = setTimeout(() => setCelebrating(false), 1500);
      return () => clearTimeout(timer);
    }
    setPrevShards(shards);
  }, [shards, prevShards, onConvert]);

  const segmentSize = compact ? 12 : 16;
  const gap = compact ? 2 : 3;

  return (
    <div className="flex items-center gap-2">
      {/* Crystal count */}
      {showCrystalCount && (
        <div className="flex items-center gap-1">
          <CrystalIcon size={compact ? 18 : 24} />
          <span className={`font-bold text-purple-400 ${compact ? "text-sm" : "text-base"}`}>
            {crystals}
          </span>
        </div>
      )}

      {/* Shard meter */}
      <div className="flex items-center rounded-full bg-slate-900/50 px-2 py-1" style={{ gap }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const isFilled = i < shards;
          const isLatest = i === shards - 1 && shards > 0;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: isLatest ? [1, 1.3, 1] : 1,
                opacity: isFilled ? 1 : 0.3,
              }}
              transition={{
                scale: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2 },
              }}
            >
              <ShardIcon size={segmentSize} filled={isFilled} glowing={isLatest} />
            </motion.div>
          );
        })}
      </div>

      {/* Shard count text */}
      <span className={`font-mono text-cyan-400 ${compact ? "text-xs" : "text-sm"}`}>
        {shards}/10
      </span>

      {/* Conversion celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="flex flex-col items-center gap-4"
            >
              <CrystalIcon size={96} variant="default" glowing />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-purple-300"
              >
                +1 Crystal!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShardMeter;
