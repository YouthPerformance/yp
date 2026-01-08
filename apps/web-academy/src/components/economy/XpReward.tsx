'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { XpIcon } from './icons';

interface XpRewardProps {
  /** XP amount to show */
  amount: number;
  /** Trigger the animation */
  show: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Position relative to trigger element */
  position?: 'center' | 'top-right' | 'inline';
}

/**
 * XpReward - Float-up animation when XP is earned
 *
 * Shows "+50 XP" with lightning icon floating up
 * Used after: Exercise complete, quiz answer, level finish
 */
export function XpReward({
  amount,
  show,
  onComplete,
  position = 'inline',
}: XpRewardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const positionClasses = {
    center: 'fixed inset-0 flex items-center justify-center pointer-events-none z-50',
    'top-right': 'absolute -top-2 -right-2 pointer-events-none',
    inline: 'inline-flex items-center',
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
            className="flex items-center gap-1 rounded-full bg-yellow-950/80 px-2 py-1 backdrop-blur-sm"
            initial={{ scale: 0.5, y: 10 }}
            animate={{
              scale: [0.5, 1.1, 1],
              y: [10, -5, -20],
            }}
            exit={{ scale: 0.8, y: -30, opacity: 0 }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          >
            <XpIcon size={20} animated />
            <motion.span
              className="text-sm font-bold text-yellow-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 8 }}
            >
              +{amount} XP
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default XpReward;
