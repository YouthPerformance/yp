// ═══════════════════════════════════════════════════════════
// FALLBACK BUTTONS
// Tap alternatives when voice isn't working
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import type { SortingStep, WolfIdentity } from '@/hooks/useVoiceSorting';

interface FallbackButtonsProps {
  step: SortingStep;
  onPainAnswer: (hasPain: boolean) => void;
  onVolumeAnswer: (isHighVolume: boolean) => void;
  onAmbitionAnswer: (identity: WolfIdentity) => void;
}

export function FallbackButtons({
  step,
  onPainAnswer,
  onVolumeAnswer,
  onAmbitionAnswer,
}: FallbackButtonsProps) {
  if (step === 'pain') {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <p className="text-gray-500 text-sm text-center mb-2">
          Or tap to answer:
        </p>
        <button
          onClick={() => onPainAnswer(true)}
          className="w-full py-4 px-6 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
        >
          Yeah, something hurts
        </button>
        <button
          onClick={() => onPainAnswer(false)}
          className="w-full py-4 px-6 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium hover:bg-green-500/30 transition-colors"
        >
          Nah, I'm good
        </button>
      </motion.div>
    );
  }

  if (step === 'volume') {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <p className="text-gray-500 text-sm text-center mb-2">
          Or tap to answer:
        </p>
        <button
          onClick={() => onVolumeAnswer(true)}
          className="w-full py-4 px-6 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-medium hover:bg-orange-500/30 transition-colors"
        >
          Multiple teams / Feeling heavy
        </button>
        <button
          onClick={() => onVolumeAnswer(false)}
          className="w-full py-4 px-6 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium hover:bg-green-500/30 transition-colors"
        >
          One team / Feeling fresh
        </button>
      </motion.div>
    );
  }

  if (step === 'ambition') {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <p className="text-gray-500 text-sm text-center mb-2">
          What do you want most?
        </p>
        <button
          onClick={() => onAmbitionAnswer('speed')}
          className="w-full py-4 px-6 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <span>⚡</span> Speed
        </button>
        <button
          onClick={() => onAmbitionAnswer('air')}
          className="w-full py-4 px-6 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <span>🦅</span> Bounce / Dunking
        </button>
        <button
          onClick={() => onAmbitionAnswer('tank')}
          className="w-full py-4 px-6 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <span>🛡️</span> Strength / Power
        </button>
      </motion.div>
    );
  }

  return null;
}
