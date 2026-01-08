// ═══════════════════════════════════════════════════════════
// ANSWER BUTTONS
// Primary tap interface for voice sorting questions
// Brand cyan: #00f6e0
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

// Brand cyan color
const BRAND_CYAN = "#00f6e0";

export function AnswerButtons({
  step,
  onPainAnswer,
  onVolumeAnswer,
  onAmbitionAnswer,
  highlighted = false,
}: AnswerButtonsProps) {
  const highlightClass = highlighted ? "ring-2 ring-white/20 ring-offset-2 ring-offset-black" : "";

  // Shared button styles using brand cyan
  const buttonBase = `w-full py-5 px-6 rounded-xl font-semibold text-lg active:scale-95 transition-all ${highlightClass}`;

  if (step === "pain") {
    return (
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => onPainAnswer(true)}
          className={buttonBase}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
        >
          Yeah, something hurts
        </button>
        <button
          onClick={() => onPainAnswer(false)}
          className={buttonBase}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
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
          className={buttonBase}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
        >
          Multiple teams / Feeling heavy
        </button>
        <button
          onClick={() => onVolumeAnswer(false)}
          className={buttonBase}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
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
          className={`${buttonBase} flex items-center justify-center gap-2`}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
        >
          <span>⚡</span> Speed
        </button>
        <button
          onClick={() => onAmbitionAnswer("air")}
          className={`${buttonBase} flex items-center justify-center gap-2`}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
        >
          <span>🦅</span> Bounce / Vertical
        </button>
        <button
          onClick={() => onAmbitionAnswer("tank")}
          className={`${buttonBase} flex items-center justify-center gap-2`}
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(0, 246, 224, 0.4)",
            color: BRAND_CYAN,
          }}
        >
          <span>🛡️</span> Strength / Power
        </button>
      </motion.div>
    );
  }

  return null;
}
