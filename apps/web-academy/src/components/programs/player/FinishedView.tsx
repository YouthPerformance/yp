// ═══════════════════════════════════════════════════════════
// FinishedView Component
// Celebration screen after completing a workout
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gem, RotateCcw, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface FinishedViewProps {
  dayNumber: number;
  dayTitle: string;
  xpEarned: number;
  crystalsEarned: number;
  isFirstCompletion: boolean;
  onContinue: () => void;
  onReplay: () => void;
  themeColor: string;
}

export function FinishedView({
  dayNumber,
  dayTitle,
  xpEarned,
  crystalsEarned,
  isFirstCompletion,
  onContinue,
  onReplay,
  themeColor,
}: FinishedViewProps) {
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    // Delay reward animation
    const timer = setTimeout(() => setShowRewards(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full items-center justify-center p-6"
    >
      {/* Trophy Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="relative mb-8"
      >
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}80 100%)`,
            boxShadow: `0 0 60px ${themeColor}40`,
          }}
        >
          <Trophy className="w-16 h-16" style={{ color: "white" }} />
        </div>

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: themeColor,
              top: "50%",
              left: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i * Math.PI) / 4) * 80,
              y: Math.sin((i * Math.PI) / 4) * 80,
              opacity: 0,
            }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <h1
          className="font-bebas text-5xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          DAY {dayNumber} COMPLETE!
        </h1>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          {dayTitle}
        </p>
      </motion.div>

      {/* Rewards */}
      {showRewards && isFirstCompletion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-8 mb-12"
        >
          {/* XP Reward */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
              style={{
                backgroundColor: "var(--accent-primary)",
                boxShadow: "0 4px 20px rgba(0,200,200,0.3)",
              }}
            >
              <Zap className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
            </div>
            <span className="font-bebas text-2xl" style={{ color: "var(--accent-primary)" }}>
              +{xpEarned} XP
            </span>
          </motion.div>

          {/* Crystals Reward */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
              style={{
                backgroundColor: "#9C27B0",
                boxShadow: "0 4px 20px rgba(156,39,176,0.3)",
              }}
            >
              <Gem className="w-8 h-8" style={{ color: "white" }} />
            </div>
            <span className="font-bebas text-2xl" style={{ color: "#9C27B0" }}>
              +{crystalsEarned} 💎
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* Replay note for non-first completion */}
      {!isFirstCompletion && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm mb-8"
          style={{ color: "var(--text-tertiary)" }}
        >
          Great practice session!
        </motion.p>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        {/* Continue Button */}
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
          style={{
            backgroundColor: themeColor,
            color: "var(--bg-primary)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          CONTINUE
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Replay Button */}
        <motion.button
          onClick={onReplay}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          REPLAY
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
