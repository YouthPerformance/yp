// ═══════════════════════════════════════════════════════════
// RANK UP CEREMONY SCREEN
// The second most emotional moment - Full EPIC treatment
// This is the ONLY screen that breaks the 2-thud rule
// Intensity Budget: 50 points
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatTicker } from '@/components/ui/StatTicker';
import { WolfParticles, Confetti } from '@/components/effects/WolfParticles';
import { WolfEyes } from '@/components/effects/WolfEyes';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/utils';

type WolfRank = 'Pup' | 'Hunter' | 'Alpha' | 'Apex';

interface RankUpProps {
  previousRank: WolfRank;
  newRank: WolfRank;
  previousXP: number;
  newXP: number;
  thresholdXP: number;
  perks: string[];
  onShare?: () => void;
  onContinue?: () => void;
}

type AnimationPhase =
  | 'blackout'
  | 'eyes'
  | 'badge-drop'
  | 'xp-ticker'
  | 'perks'
  | 'complete';

const RANK_CONFIG: Record<WolfRank, { emoji: string; color: string; title: string }> = {
  Pup: { emoji: '🐺', color: '#A0A0A0', title: 'WOLF PUP' },
  Hunter: { emoji: '🐺', color: '#00F6E0', title: 'HUNTER' },
  Alpha: { emoji: '🐺', color: '#FBBF24', title: 'ALPHA' },
  Apex: { emoji: '🐺', color: '#FF6B6B', title: 'APEX PREDATOR' },
};

export function RankUp({
  previousRank,
  newRank,
  previousXP,
  newXP,
  thresholdXP,
  perks,
  onShare,
  onContinue,
}: RankUpProps) {
  const [phase, setPhase] = useState<AnimationPhase>('blackout');
  const [showParticles, setShowParticles] = useState(false);
  const sound = useSound();
  const haptics = useHaptics();

  const rankConfig = RANK_CONFIG[newRank];

  // Animation sequence - This screen breaks 2-thud rule intentionally
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Blackout (300ms)
    timers.push(setTimeout(() => setPhase('eyes'), 300));

    // Phase 2: Wolf Eyes (1500ms)
    timers.push(setTimeout(() => {
      setPhase('badge-drop');
      // Triple haptic pattern
      haptics.trigger('impact_heavy');
      setTimeout(() => haptics.trigger('impact_heavy'), 100);
      setTimeout(() => haptics.trigger('impact_heavy'), 200);
    }, 1800));

    // Phase 3: Badge drop (1000ms)
    timers.push(setTimeout(() => {
      setPhase('xp-ticker');
      // Wolf howl sound
      sound.play('wolf_howl_distant.mp3', { volume: 0.7 });
    }, 2800));

    // Phase 4: XP ticker (3000ms)
    timers.push(setTimeout(() => {
      setPhase('perks');
      setShowParticles(true);
    }, 5800));

    // Phase 5: Perks list (1500ms)
    timers.push(setTimeout(() => setPhase('complete'), 7300));

    return () => timers.forEach(clearTimeout);
  }, [haptics, sound]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gold Particles */}
      <AnimatePresence>
        {showParticles && (
          <div className="fixed inset-0 pointer-events-none">
            <Confetti colors={[rankConfig.color, '#FBBF24', '#FFFFFF']} count={60} />
          </div>
        )}
      </AnimatePresence>

      {/* Wolf Eyes Phase */}
      <AnimatePresence>
        {phase === 'eyes' && (
          <WolfEyes
            color={rankConfig.color}
            size="lg"
            glowIntensity={1.2}
            breathing
          />
        )}
      </AnimatePresence>

      {/* Badge Drop */}
      <AnimatePresence>
        {['badge-drop', 'xp-ticker', 'perks', 'complete'].includes(phase) && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: -100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            {/* Rank Badge */}
            <motion.div
              className="relative mb-6"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  backgroundColor: rankConfig.color,
                  opacity: 0.5,
                  transform: 'scale(1.5)',
                }}
              />
              {/* Badge */}
              <div
                className="relative w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${rankConfig.color} 0%, ${rankConfig.color}88 100%)`,
                  boxShadow: `0 0 40px ${rankConfig.color}`,
                }}
              >
                <span className="text-6xl">{rankConfig.emoji}</span>
              </div>
            </motion.div>

            {/* Rank Title */}
            <motion.h1
              className="font-bebas text-4xl tracking-wider text-center"
              style={{ color: rankConfig.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {rankConfig.title}
            </motion.h1>

            <motion.p
              className="text-lg mt-2"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Rank Achieved
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Ticker */}
      <AnimatePresence>
        {['xp-ticker', 'perks', 'complete'].includes(phase) && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatTicker
              value={newXP}
              previousValue={previousXP}
              variant="EPIC"
              label="Total XP"
              suffix="XP"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Perks List */}
      <AnimatePresence>
        {['perks', 'complete'].includes(phase) && (
          <motion.div
            className="w-full max-w-sm px-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2
              className="font-bebas text-xl tracking-wider text-center mb-4"
              style={{ color: 'var(--accent-gold)' }}
            >
              NEW PERKS UNLOCKED
            </h2>
            <div className="space-y-2">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span style={{ color: 'var(--accent-gold)' }}>✦</span>
                  <span style={{ color: 'var(--text-primary)' }}>{perk}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div
            className="flex flex-col gap-3 w-full max-w-xs px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onShare}
              className={cn(
                'py-4 rounded-lg font-semibold text-lg',
                'transition-transform hover:scale-105 active:scale-95'
              )}
              style={{
                backgroundColor: rankConfig.color,
                color: '#000000',
              }}
            >
              SHARE YOUR RANK
            </button>
            <button
              onClick={onContinue}
              className={cn(
                'py-4 rounded-lg font-semibold text-lg',
                'transition-transform hover:scale-105 active:scale-95'
              )}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
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

export default RankUp;
