// ═══════════════════════════════════════════════════════════
// XP COUNTER
// Display XP earned during module (v2 economy)
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface XpCounterProps {
  count: number;
  className?: string;
}

export function XpCounter({ count, className = "" }: XpCounterProps) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayCount(count);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-accent-gold/10 border border-accent-gold/20
                 ${className}`}
    >
      <Zap className="w-4 h-4 text-accent-gold" />
      <motion.span
        key={displayCount}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-accent-gold"
      >
        {displayCount}
      </motion.span>
      <span className="text-accent-gold/70 text-sm">XP</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARD COUNTER
// Display shards earned (10 shards = 1 crystal)
// ─────────────────────────────────────────────────────────────

interface ShardCounterProps {
  count: number;
  className?: string;
}

export function ShardCounter({ count, className = "" }: ShardCounterProps) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-accent-primary/10 border border-accent-primary/20
                 ${className}`}
    >
      <span className="text-lg">💠</span>
      <span className="font-bold text-accent-primary">{count}</span>
      <span className="text-accent-primary/70 text-sm">/10</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// XP REWARD ANIMATION
// Shown when XP is earned
// ─────────────────────────────────────────────────────────────

interface XpRewardProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XpReward({ amount, show, onComplete }: XpRewardProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (amount <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.5, y: show ? 0 : 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                 flex flex-col items-center gap-2 pointer-events-none"
    >
      <motion.div
        initial={{ rotate: -15 }}
        animate={{ rotate: 15 }}
        transition={{ repeat: 2, repeatType: "reverse", duration: 0.15 }}
      >
        <Zap className="w-16 h-16 text-accent-gold" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-accent-gold"
      >
        +{amount} XP
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-accent-gold/20 blur-3xl rounded-full" />
    </motion.div>
  );
}
