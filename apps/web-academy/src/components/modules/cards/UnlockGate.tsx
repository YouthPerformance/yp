// ═══════════════════════════════════════════════════════════
// UNLOCK GATE
// Section threshold screen - shows when user needs more correct answers
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lock, Unlock } from "lucide-react";
import type { LearningSection } from "@/data/modules/types";

interface UnlockGateProps {
  section: LearningSection;
  currentScore: number;
  isUnlocked: boolean;
  onUnlock?: () => void;
}

export function UnlockGate({ section, currentScore, isUnlocked, onUnlock }: UnlockGateProps) {
  const threshold = section.unlockThreshold;
  const progress = Math.min(100, (currentScore / threshold) * 100);
  const meetsThreshold = currentScore >= threshold;

  // Already unlocked state
  if (isUnlocked) {
    return (
      <div className="flex flex-col h-full min-h-full items-center justify-center px-6 py-8 text-center bg-bg-primary">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center mb-6"
        >
          <Unlock className="w-12 h-12 text-accent-primary" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bebas uppercase tracking-wide text-accent-primary mb-2"
        >
          Section Unlocked
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-text-secondary mb-4"
        >
          {section.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-accent-primary"
        >
          <CheckCircle className="w-5 h-5" />
          <span>
            {currentScore}/{threshold} correct
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-text-tertiary uppercase tracking-widest">
            Swipe up to continue
          </p>
          <div className="mt-2 animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-accent-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    );
  }

  // Meets threshold but not yet unlocked
  if (meetsThreshold && !isUnlocked) {
    return (
      <div className="flex flex-col h-full min-h-full items-center justify-center px-6 py-8 text-center bg-bg-primary">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-accent-gold/20 flex items-center justify-center mb-6"
        >
          <Unlock className="w-12 h-12 text-accent-gold" />
        </motion.div>

        <h2 className="text-3xl font-bebas uppercase tracking-wide text-white mb-2">
          Ready to Unlock
        </h2>

        <p className="text-lg text-text-secondary mb-4">{section.title}</p>

        <div className="flex items-center gap-2 text-accent-primary mb-8">
          <CheckCircle className="w-5 h-5" />
          <span>
            {currentScore}/{threshold} correct
          </span>
        </div>

        <button
          onClick={onUnlock}
          className="px-8 py-4 bg-accent-primary text-black font-bold uppercase tracking-wide rounded-xl
                   hover:bg-accent-primary-hover transition-colors
                   shadow-[0_0_20px_rgba(0,246,224,0.3)]"
        >
          Unlock Section →
        </button>
      </div>
    );
  }

  // Locked state - needs more correct answers
  return (
    <div className="flex flex-col h-full min-h-full items-center justify-center px-6 py-8 text-center bg-bg-primary">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 rounded-full bg-bg-tertiary border-2 border-border-default flex items-center justify-center mb-6"
      >
        <Lock className="w-12 h-12 text-text-tertiary" />
      </motion.div>

      <h2 className="text-3xl font-bebas uppercase tracking-wide text-white mb-2">
        Section Locked
      </h2>

      <p className="text-lg text-text-secondary mb-2">{section.title}</p>

      <p className="text-sm text-text-tertiary mb-6">Answer more questions correctly to unlock</p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>
            {currentScore}/{threshold}
          </span>
        </div>
        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent-primary/50 to-accent-primary rounded-full"
          />
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          {threshold - currentScore} more correct{" "}
          {threshold - currentScore === 1 ? "answer" : "answers"} needed
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-text-tertiary">Go back and answer more questions</p>
      </div>
    </div>
  );
}
