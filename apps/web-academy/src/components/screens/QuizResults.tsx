// ═══════════════════════════════════════════════════════════
// QUIZ RESULTS SCREEN
// Displays score with STANDARD variant ticker
// Shows pass/fail state and "First Attempt" bonus
// Intensity Budget: 15 points (15 Major)
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { StatTicker } from "@/components/ui/StatTicker";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  previousXP: number;
  xpEarned: number;
  isFirstAttempt?: boolean;
  firstAttemptBonus?: number;
  passThreshold?: number;
  onRetry?: () => void;
  onContinue?: () => void;
}

type AnimationPhase = "entering" | "score" | "result" | "bonus" | "xp" | "complete";

export function QuizResults({
  correctAnswers,
  totalQuestions,
  previousXP,
  xpEarned,
  isFirstAttempt = false,
  firstAttemptBonus = 10,
  passThreshold = 0.7,
  onRetry,
  onContinue,
}: QuizResultsProps) {
  const [phase, setPhase] = useState<AnimationPhase>("entering");

  // Calculate results
  const percentage = useMemo(() => {
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const passed = useMemo(() => {
    return correctAnswers / totalQuestions >= passThreshold;
  }, [correctAnswers, totalQuestions, passThreshold]);

  const showFirstAttemptBonus = useMemo(() => {
    return passed && isFirstAttempt && percentage >= 80;
  }, [passed, isFirstAttempt, percentage]);

  // Animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Screen fade in (300ms)
    timers.push(setTimeout(() => setPhase("score"), 300));

    // Phase 2: Score ticker (1500ms duration)
    timers.push(setTimeout(() => setPhase("result"), 1800));

    // Phase 3: Pass/Fail result (800ms)
    const resultDuration = 800;
    const postResultTime = 1800 + resultDuration;

    if (showFirstAttemptBonus) {
      // Phase 4a: First attempt bonus (if applicable)
      timers.push(setTimeout(() => setPhase("bonus"), postResultTime));
      timers.push(setTimeout(() => setPhase("xp"), postResultTime + 1000));
      timers.push(setTimeout(() => setPhase("complete"), postResultTime + 2500));
    } else if (passed) {
      // Phase 4b: XP earned (if passed, no bonus)
      timers.push(setTimeout(() => setPhase("xp"), postResultTime));
      timers.push(setTimeout(() => setPhase("complete"), postResultTime + 1500));
    } else {
      // Phase 4c: Fail state (show retry immediately)
      timers.push(setTimeout(() => setPhase("complete"), postResultTime));
    }

    return () => timers.forEach(clearTimeout);
  }, [passed, showFirstAttemptBonus]);

  // Get result styling based on score
  const resultStyling = useMemo(() => {
    if (!passed) {
      return {
        text: "NEED MORE PRACTICE",
        emoji: "💪",
        color: "var(--accent-warning)",
        subtext: `You need ${Math.ceil(passThreshold * 100)}% to pass. Try again!`,
      };
    }
    if (percentage >= 90) {
      return {
        text: "EXCELLENT!",
        emoji: "🐺",
        color: "var(--accent-gold)",
        subtext: "You crushed it!",
      };
    }
    if (percentage >= 80) {
      return {
        text: "GREAT JOB!",
        emoji: "🔥",
        color: "var(--accent-primary)",
        subtext: "Strong performance!",
      };
    }
    return {
      text: "PASSED!",
      emoji: "✓",
      color: "var(--accent-primary)",
      subtext: "Keep going!",
    };
  }, [passed, percentage, passThreshold]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.h2
        className="font-bebas text-2xl tracking-wider mb-8"
        style={{ color: "var(--text-secondary)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        QUIZ COMPLETE
      </motion.h2>

      {/* Score Display - STANDARD variant */}
      <AnimatePresence>
        {["score", "result", "bonus", "xp", "complete"].includes(phase) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={percentage}
              previousValue={0}
              variant="STANDARD"
              label="Score"
              suffix="%"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions breakdown */}
      <AnimatePresence>
        {["score", "result", "bonus", "xp", "complete"].includes(phase) && (
          <motion.div
            className="text-center mb-8"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-mono text-lg">
              {correctAnswers} / {totalQuestions} correct
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pass/Fail Result */}
      <AnimatePresence>
        {["result", "bonus", "xp", "complete"].includes(phase) && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.span
              className="text-5xl mb-3"
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {resultStyling.emoji}
            </motion.span>
            <h3
              className="font-bebas text-3xl tracking-wider mb-2"
              style={{ color: resultStyling.color }}
            >
              {resultStyling.text}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {resultStyling.subtext}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First Attempt Bonus */}
      <AnimatePresence>
        {showFirstAttemptBonus && ["bonus", "xp", "complete"].includes(phase) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{
                backgroundColor: "var(--accent-gold)",
                color: "var(--bg-primary)",
              }}
            >
              <span>🎯</span>
              <span>+{firstAttemptBonus} FIRST ATTEMPT BONUS!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Earned (only if passed) */}
      <AnimatePresence>
        {passed && ["xp", "complete"].includes(phase) && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={xpEarned + (showFirstAttemptBonus ? firstAttemptBonus : 0)}
              previousValue={0}
              variant="SUBTLE"
              label="XP Earned"
              suffix="XP"
              showDelta
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.button
            className={cn(
              "px-8 py-4 rounded-lg font-semibold text-lg",
              "transition-transform hover:scale-105 active:scale-95",
            )}
            style={{
              backgroundColor: passed ? "var(--accent-primary)" : "var(--text-secondary)",
              color: "var(--bg-primary)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={passed ? onContinue : onRetry}
          >
            {passed ? "CONTINUE" : "TRY AGAIN"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Retry hint for failed */}
      <AnimatePresence>
        {!passed && phase === "complete" && (
          <motion.p
            className="mt-4 text-sm"
            style={{ color: "var(--text-tertiary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Review the exercises and try again
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuizResults;
