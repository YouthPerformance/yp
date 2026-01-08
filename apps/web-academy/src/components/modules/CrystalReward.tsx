// ═══════════════════════════════════════════════════════════
// CRYSTAL REWARD
// Animated crystal gain feedback
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrystalRewardProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function CrystalReward({ amount, show, onComplete }: CrystalRewardProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (amount <= 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                     flex flex-col items-center gap-2 pointer-events-none"
        >
          {/* Crystal particles */}
          <CrystalParticles />

          {/* Main crystal */}
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: 15 }}
            transition={{
              repeat: 2,
              repeatType: 'reverse',
              duration: 0.15,
            }}
            className="text-6xl"
          >
            💎
          </motion.div>

          {/* Amount */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-accent-primary"
          >
            +{amount}
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 bg-accent-primary/20 blur-3xl rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// CRYSTAL PARTICLES
// ─────────────────────────────────────────────────────────────

function CrystalParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
    delay: i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: Math.cos((p.angle * Math.PI) / 180) * 60,
            y: Math.sin((p.angle * Math.PI) / 180) * 60,
          }}
          transition={{
            duration: 0.8,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1
                     bg-accent-primary rounded-full"
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CRYSTAL COUNTER
// Persistent display of crystal count
// ─────────────────────────────────────────────────────────────

interface CrystalCounterProps {
  count: number;
  className?: string;
}

export function CrystalCounter({ count, className = '' }: CrystalCounterProps) {
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
                 bg-accent-primary/10 border border-accent-primary/20
                 ${className}`}
    >
      <span className="text-lg">💎</span>
      <motion.span
        key={displayCount}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-accent-primary"
      >
        {displayCount}
      </motion.span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOATING CRYSTAL
// Small inline crystal with hover effect
// ─────────────────────────────────────────────────────────────

interface FloatingCrystalProps {
  amount: number;
}

export function FloatingCrystal({ amount }: FloatingCrystalProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      className="inline-flex items-center gap-1 text-sm text-accent-primary"
    >
      <motion.span
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        💎
      </motion.span>
      <span>{amount}</span>
    </motion.span>
  );
}
