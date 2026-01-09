"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShardIcon } from "./icons";

interface ShardRewardProps {
  /** Number of shards to show (+1, +2, etc) */
  amount: number;
  /** Trigger the animation */
  show: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Position relative to trigger element */
  position?: "center" | "top-right" | "inline";
}

/**
 * ShardReward - Float-up animation when shards are earned
 *
 * Shows "+1" with shard icon floating up and fading out
 * Used after: Wolf Drop, level complete, quiz correct
 */
export function ShardReward({ amount, show, onComplete, position = "center" }: ShardRewardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const positionClasses = {
    center: "fixed inset-0 flex items-center justify-center pointer-events-none z-50",
    "top-right": "absolute -top-2 -right-2 pointer-events-none",
    inline: "inline-flex items-center",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={positionClasses[position]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex items-center gap-1 rounded-full bg-cyan-950/80 px-3 py-2 backdrop-blur-sm"
            initial={{ scale: 0.5, y: 20 }}
            animate={{
              scale: [0.5, 1.2, 1],
              y: [20, -10, -30],
            }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          >
            <ShardIcon size={32} filled glowing />
            <motion.span
              className="text-2xl font-bold text-cyan-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 8 }}
            >
              +{amount}
            </motion.span>
          </motion.div>

          {/* Sparkle particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-cyan-400"
              initial={{
                opacity: 1,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1, 0.5],
                x: Math.cos((i * Math.PI * 2) / 6) * 60,
                y: Math.sin((i * Math.PI * 2) / 6) * 60 - 30,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ShardReward;
