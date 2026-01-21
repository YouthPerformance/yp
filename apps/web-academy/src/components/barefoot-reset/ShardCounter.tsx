// ═══════════════════════════════════════════════════════════
// Shard Counter - Glitch Shards display with animation
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Gem } from "lucide-react";
import { useEffect } from "react";

interface ShardCounterProps {
  shards: number;
  showCrystals?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ShardCounter({
  shards,
  showCrystals = false,
  size = "md",
  animated = true,
}: ShardCounterProps) {
  const crystals = Math.floor(shards / 100);
  const remainingShards = shards % 100;

  // Animated counter
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (v) => Math.floor(v));

  useEffect(() => {
    springValue.set(shards);
  }, [shards, springValue]);

  const sizes = {
    sm: { icon: "w-4 h-4", text: "text-sm", container: "px-2 py-1" },
    md: { icon: "w-5 h-5", text: "text-base", container: "px-3 py-1.5" },
    lg: { icon: "w-6 h-6", text: "text-xl", container: "px-4 py-2" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      {/* Crystals (if showing) */}
      {showCrystals && crystals > 0 && (
        <motion.div
          className={`flex items-center gap-1.5 ${s.container} rounded-full`}
          style={{
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            border: "1px solid rgba(168, 85, 247, 0.4)",
          }}
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
        >
          <span className="text-lg">💎</span>
          <span className={`font-bold ${s.text} text-purple-400`}>
            {crystals}
          </span>
        </motion.div>
      )}

      {/* Shards */}
      <motion.div
        className={`flex items-center gap-1.5 ${s.container} rounded-full`}
        style={{
          backgroundColor: "rgba(0, 255, 255, 0.1)",
          border: "1px solid rgba(0, 255, 255, 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
      >
        <Gem className={`${s.icon} text-cyan-400`} />
        {animated ? (
          <motion.span className={`font-bold ${s.text} text-cyan-400`}>
            {displayValue}
          </motion.span>
        ) : (
          <span className={`font-bold ${s.text} text-cyan-400`}>
            {showCrystals ? remainingShards : shards}
          </span>
        )}
      </motion.div>

      {/* Conversion hint */}
      {showCrystals && remainingShards >= 75 && (
        <motion.div
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {100 - remainingShards} to 💎
        </motion.div>
      )}
    </div>
  );
}

// Shard rain animation for celebrations
export function ShardRain({
  count = 20,
  duration = 2,
  onComplete,
}: {
  count?: number;
  duration?: number;
  onComplete?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration * (0.5 + Math.random() * 0.5),
            delay: Math.random() * (duration * 0.5),
            ease: "easeIn",
          }}
        >
          💎
        </motion.div>
      ))}
    </div>
  );
}
