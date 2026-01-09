// ═══════════════════════════════════════════════════════════
// WORKOUT COMPLETE SCREEN
// The most important screen in the app.
// This is where habit formation happens.
// Intensity Budget: 30 points (25 Major + 5 Minor)
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { StatTicker } from "@/components/ui/StatTicker";
import { COOLDOWN_MS } from "@/lib/ticker-config";
import { cn } from "@/lib/utils";

interface WorkoutCompleteProps {
  xpEarned: number;
  previousXP: number;
  newStreak: number;
  previousStreak: number;
  totalXP: number;
  isPerfect?: boolean;
  perfectBonus?: number;
  onViewCard?: () => void;
  onContinue?: () => void;
}

type AnimationPhase = "entering" | "title" | "xp" | "streak" | "total" | "bonus" | "complete";

export function WorkoutComplete({
  xpEarned,
  previousXP,
  newStreak,
  previousStreak,
  totalXP,
  isPerfect = false,
  perfectBonus = 25,
  onViewCard,
  onContinue,
}: WorkoutCompleteProps) {
  const [phase, setPhase] = useState<AnimationPhase>("entering");

  // Animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Screen fade in (300ms)
    timers.push(setTimeout(() => setPhase("title"), 300));

    // Phase 2: Title drops (500ms after fade)
    timers.push(setTimeout(() => setPhase("xp"), 800));

    // Phase 3: XP ticker (2500ms duration + 400ms cooldown)
    timers.push(setTimeout(() => setPhase("streak"), 800 + 2500 + COOLDOWN_MS.afterMajor));

    // Phase 4: Streak increment (800ms)
    timers.push(setTimeout(() => setPhase("total"), 800 + 2500 + COOLDOWN_MS.afterMajor + 800));

    // Phase 5: Total XP (800ms)
    const totalPhaseStart = 800 + 2500 + COOLDOWN_MS.afterMajor + 800 + 800;
    timers.push(setTimeout(() => setPhase(isPerfect ? "bonus" : "complete"), totalPhaseStart));

    // Phase 6 (if perfect): Bonus XP
    if (isPerfect) {
      timers.push(setTimeout(() => setPhase("complete"), totalPhaseStart + 1500));
    }

    return () => timers.forEach(clearTimeout);
  }, [isPerfect]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Title */}
      <AnimatePresence>
        {phase !== "entering" && (
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <span className="text-4xl mb-2">🐺</span>
            <h1
              className="font-bebas text-4xl md:text-5xl tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              WORKOUT COMPLETE
            </h1>
            <span className="text-4xl mt-2">🐺</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main XP Ticker - CELEBRATION variant */}
      <AnimatePresence>
        {["xp", "streak", "total", "bonus", "complete"].includes(phase) && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={xpEarned}
              previousValue={0}
              variant={isPerfect ? "EPIC" : "CELEBRATION"}
              label="XP Earned"
              suffix="XP"
              showDelta
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Perfect Bonus - Only if isPerfect */}
      <AnimatePresence>
        {isPerfect && ["bonus", "complete"].includes(phase) && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: "var(--accent-gold)",
                color: "var(--bg-primary)",
              }}
            >
              +{perfectBonus} PERFECT BONUS!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak Counter */}
      <AnimatePresence>
        {["streak", "total", "bonus", "complete"].includes(phase) && (
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Streak:
            </span>
            <motion.span
              className="font-bebas text-2xl"
              style={{ color: "var(--text-primary)" }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {previousStreak} → {newStreak}
            </motion.span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              🔥
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <AnimatePresence>
        {["streak", "total", "bonus", "complete"].includes(phase) && (
          <motion.div
            className="w-full max-w-xs mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-1 rounded-full" style={{ backgroundColor: "var(--border-default)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--accent-primary)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total XP Ticker - SUBTLE variant */}
      <AnimatePresence>
        {["total", "bonus", "complete"].includes(phase) && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={totalXP}
              previousValue={previousXP}
              variant="SUBTLE"
              label="Total XP"
              suffix="XP"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Card Button */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.button
            className={cn(
              "px-8 py-4 rounded-lg font-semibold text-lg",
              "transition-transform hover:scale-105 active:scale-95",
            )}
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-primary)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 0.3,
              scale: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
            }}
            onClick={onViewCard}
          >
            VIEW YOUR CARD
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default WorkoutComplete;
