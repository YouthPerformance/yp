// ═══════════════════════════════════════════════════════════
// ANSWER BUTTONS
// Primary tap interface for voice sorting questions
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import type { SortingStep, WolfIdentity } from "@/hooks/useVoiceSorting";

interface AnswerButtonsProps {
  step: SortingStep;
  onPainAnswer: (hasPain: boolean) => void;
  onVolumeAnswer: (isHighVolume: boolean) => void;
  onAmbitionAnswer: (identity: WolfIdentity) => void;
  highlighted?: boolean; // Pulse effect after voice failure
}

export function AnswerButtons({
  step,
  onPainAnswer,
  onVolumeAnswer,
  onAmbitionAnswer,
  highlighted = false,
}: AnswerButtonsProps) {
  const highlightClass = highlighted ? "ring-2 ring-white/20 ring-offset-2 ring-offset-black" : "";

  if (step === "pain") {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => onPainAnswer(true)}
          className={`w-full py-5 px-6 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 font-semibold text-lg hover:bg-red-500/20 active:scale-95 transition-all ${highlightClass}`}
        >
          Yeah, something hurts
        </button>
        <button
          onClick={() => onPainAnswer(false)}
          className={`w-full py-5 px-6 rounded-xl bg-green-500/10 border border-green-500/40 text-green-400 font-semibold text-lg hover:bg-green-500/20 active:scale-95 transition-all ${highlightClass}`}
        >
          Nah, I&apos;m good
        </button>
      </motion.div>
    );
  }

  if (step === "volume") {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => onVolumeAnswer(true)}
          className={`w-full py-5 px-6 rounded-xl bg-orange-500/10 border border-orange-500/40 text-orange-400 font-semibold text-lg hover:bg-orange-500/20 active:scale-95 transition-all ${highlightClass}`}
        >
          Multiple teams / Feeling heavy
        </button>
        <button
          onClick={() => onVolumeAnswer(false)}
          className={`w-full py-5 px-6 rounded-xl bg-green-500/10 border border-green-500/40 text-green-400 font-semibold text-lg hover:bg-green-500/20 active:scale-95 transition-all ${highlightClass}`}
        >
          One team / Feeling fresh
        </button>
      </motion.div>
    );
  }

  if (step === "ambition") {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => onAmbitionAnswer("speed")}
          className={`w-full py-5 px-6 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-semibold text-lg hover:bg-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${highlightClass}`}
        >
          <span>⚡</span> Speed
        </button>
        <button
          onClick={() => onAmbitionAnswer("air")}
          className={`w-full py-5 px-6 rounded-xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 font-semibold text-lg hover:bg-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${highlightClass}`}
        >
          <span>🦅</span> Bounce / Vertical
        </button>
        <button
          onClick={() => onAmbitionAnswer("tank")}
          className={`w-full py-5 px-6 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-400 font-semibold text-lg hover:bg-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${highlightClass}`}
        >
          <span>🛡️</span> Strength / Power
        </button>
      </motion.div>
    );
  }

  return null;
}
