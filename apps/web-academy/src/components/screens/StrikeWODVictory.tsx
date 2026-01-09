// ═══════════════════════════════════════════════════════════
// STRIKE WOD VICTORY SCREEN
// Boss defeat celebration - Days 7, 14, 21, 28, 35, 42
// Intensity Budget: 50 points (1 EPIC moment)
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WolfParticles } from "@/components/effects/WolfParticles";
import { StatTicker } from "@/components/ui/StatTicker";
import { useHaptics } from "@/hooks/useHaptics";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface StrikeWODVictoryProps {
  bossName: string;
  bossDay: number;
  baseXP: number;
  streakMultiplier: number;
  finalXP: number;
  cardRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  cardName: string;
  cardPreviewUrl?: string;
  onViewCard?: () => void;
  onContinue?: () => void;
}

type AnimationPhase =
  | "entering"
  | "boss-defeated"
  | "base-xp"
  | "multiplier"
  | "final-xp"
  | "card-reveal"
  | "complete";

const RARITY_CONFIG = {
  common: { color: "#A0A0A0", glow: "rgba(160, 160, 160, 0.3)" },
  uncommon: { color: "#10B981", glow: "rgba(16, 185, 129, 0.3)" },
  rare: { color: "#3B82F6", glow: "rgba(59, 130, 246, 0.3)" },
  epic: { color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.3)" },
  legendary: { color: "#FBBF24", glow: "rgba(251, 191, 36, 0.4)" },
};

export function StrikeWODVictory({
  bossName,
  bossDay,
  baseXP,
  streakMultiplier,
  finalXP,
  cardRarity,
  cardName,
  cardPreviewUrl,
  onViewCard,
  onContinue,
}: StrikeWODVictoryProps) {
  const [phase, setPhase] = useState<AnimationPhase>("entering");
  const [showParticles, setShowParticles] = useState(false);
  const sound = useSound();
  const haptics = useHaptics();

  const rarityConfig = RARITY_CONFIG[cardRarity];

  // Animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Screen fade in (300ms)
    timers.push(
      setTimeout(() => {
        setPhase("boss-defeated");
        haptics.trigger("impact_heavy");
        sound.play("plate_drop_heavy.mp3", { volume: 0.8 });
      }, 300),
    );

    // Phase 2: Boss Defeated header (1500ms)
    timers.push(setTimeout(() => setPhase("base-xp"), 1800));

    // Phase 3: Base XP ticker (3000ms - slower for drama)
    timers.push(setTimeout(() => setPhase("multiplier"), 4800));

    // Phase 4: Multiplier calculation (1000ms)
    timers.push(setTimeout(() => setPhase("final-xp"), 5800));

    // Phase 5: Final XP (1500ms)
    timers.push(
      setTimeout(() => {
        setPhase("card-reveal");
        setShowParticles(true);
        haptics.trigger("impact_medium");
      }, 7300),
    );

    // Phase 6: Complete (after card reveal)
    timers.push(setTimeout(() => setPhase("complete"), 9000));

    return () => timers.forEach(clearTimeout);
  }, [haptics, sound]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cyan Particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <WolfParticles color="var(--accent-primary)" intensity={1.5} variant="celebration" />
          </div>
        )}
      </AnimatePresence>

      {/* Boss Defeated Header */}
      <AnimatePresence>
        {phase !== "entering" && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <motion.h1
              className="font-bebas text-5xl tracking-wider text-center"
              style={{ color: "var(--accent-primary)" }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(0, 246, 224, 0.5)",
                  "0 0 40px rgba(0, 246, 224, 0.8)",
                  "0 0 20px rgba(0, 246, 224, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              BOSS DEFEATED
            </motion.h1>
            <motion.p
              className="text-lg mt-2"
              style={{ color: "var(--text-secondary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {bossName} · Day {bossDay}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Base XP Ticker */}
      <AnimatePresence>
        {["base-xp", "multiplier", "final-xp", "card-reveal", "complete"].includes(phase) && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={baseXP}
              previousValue={0}
              variant="CELEBRATION"
              label="Base XP"
              suffix="XP"
              showDelta
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiplier Display */}
      <AnimatePresence>
        {["multiplier", "final-xp", "card-reveal", "complete"].includes(phase) && (
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            <span className="font-bebas text-3xl" style={{ color: "var(--text-secondary)" }}>
              ×
            </span>
            <motion.span
              className="font-bebas text-4xl"
              style={{ color: "var(--accent-gold)" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {streakMultiplier.toFixed(2)}
            </motion.span>
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              streak bonus
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final XP Ticker */}
      <AnimatePresence>
        {["final-xp", "card-reveal", "complete"].includes(phase) && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={finalXP}
              previousValue={baseXP}
              variant="STANDARD"
              label="Final XP"
              suffix="XP"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rare Card Earned */}
      <AnimatePresence>
        {["card-reveal", "complete"].includes(phase) && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Card Preview */}
            <motion.div
              className="relative w-48 h-64 rounded-xl mb-4 overflow-hidden"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: `2px solid ${rarityConfig.color}`,
                boxShadow: `0 0 30px ${rarityConfig.glow}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 30px ${rarityConfig.glow}`,
                  `0 0 50px ${rarityConfig.glow}`,
                  `0 0 30px ${rarityConfig.glow}`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {cardPreviewUrl ? (
                <img src={cardPreviewUrl} alt={cardName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">🐺</span>
                </div>
              )}

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                }}
                animate={{ x: [-200, 200] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>

            {/* Card Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="font-bebas text-xl tracking-wider block"
                style={{ color: rarityConfig.color }}
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                {cardRarity.toUpperCase()} CARD EARNED!
              </motion.span>
              <span className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                {cardName}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            className="flex flex-col gap-3 w-full max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onViewCard}
              className={cn(
                "py-4 rounded-lg font-semibold text-lg",
                "transition-transform hover:scale-105 active:scale-95",
              )}
              style={{
                backgroundColor: rarityConfig.color,
                color: "#000000",
              }}
            >
              VIEW YOUR CARD
            </button>
            <button
              onClick={onContinue}
              className={cn(
                "py-4 rounded-lg font-semibold text-lg",
                "transition-transform hover:scale-105 active:scale-95",
              )}
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              CONTINUE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StrikeWODVictory;
