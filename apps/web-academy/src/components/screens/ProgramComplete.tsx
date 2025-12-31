// ═══════════════════════════════════════════════════════════
// PROGRAM COMPLETE SCREEN - DAY 42
// The ultimate payoff - Full intensity budget
// Intensity Budget: 100 points (maximum allowed)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatTicker } from '@/components/ui/StatTicker';
import { WolfParticles, Confetti } from '@/components/effects/WolfParticles';
import { WolfEyes } from '@/components/effects/WolfEyes';
import { useSound } from '@/hooks/useSound';
import { useHaptics } from '@/hooks/useHaptics';
import { cn } from '@/lib/utils';

interface ProgramCompleteProps {
  athleteName: string;
  totalXP: number;
  finalRank: 'Pup' | 'Hunter' | 'Alpha' | 'Apex';
  totalWorkouts: number;
  perfectWorkouts: number;
  longestStreak: number;
  totalCards: number;
  onShare?: () => void;
  onViewCertificate?: () => void;
  onContinue?: () => void;
}

type AnimationPhase =
  | 'entering'
  | 'eyes'
  | 'day-counter'
  | 'impact'
  | 'stats'
  | 'confetti'
  | 'certificate'
  | 'complete';

export function ProgramComplete({
  athleteName,
  totalXP,
  finalRank,
  totalWorkouts,
  perfectWorkouts,
  longestStreak,
  totalCards,
  onShare,
  onViewCertificate,
  onContinue,
}: ProgramCompleteProps) {
  const [phase, setPhase] = useState<AnimationPhase>('entering');
  const [dayCount, setDayCount] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const sound = useSound();
  const haptics = useHaptics();

  // Day counter animation (1 → 42, 4 seconds)
  useEffect(() => {
    if (phase !== 'day-counter') return;

    const interval = setInterval(() => {
      setDayCount((prev) => {
        if (prev >= 42) {
          clearInterval(interval);
          return 42;
        }
        // Play subtle tick sound
        sound.play('soft_click.mp3', { volume: 0.2 + (prev / 42) * 0.3 });
        return prev + 1;
      });
    }, 4000 / 42); // ~95ms per day

    return () => clearInterval(interval);
  }, [phase, sound]);

  // Main animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Entering (500ms)
    timers.push(setTimeout(() => setPhase('eyes'), 500));

    // Phase 2: Wolf Eyes (2000ms)
    timers.push(setTimeout(() => setPhase('day-counter'), 2500));

    // Phase 3: Day counter (4000ms)
    timers.push(setTimeout(() => {
      setPhase('impact');
      // MASSIVE triple-layered thud
      haptics.trigger('impact_heavy');
      setTimeout(() => haptics.trigger('impact_heavy'), 100);
      setTimeout(() => haptics.trigger('impact_heavy'), 200);
      sound.play('plate_drop_heavy.mp3', { volume: 1 });
      // Wolf howl
      setTimeout(() => {
        sound.play('wolf_howl_distant.mp3', { volume: 0.8 });
      }, 300);
    }, 6500));

    // Phase 4: Stats reveal (2000ms after impact)
    timers.push(setTimeout(() => setPhase('stats'), 8500));

    // Phase 5: Confetti explosion (1500ms after stats)
    timers.push(setTimeout(() => {
      setPhase('confetti');
      setShowConfetti(true);
    }, 10000));

    // Phase 6: Certificate (2000ms after confetti)
    timers.push(setTimeout(() => setPhase('certificate'), 12000));

    // Phase 7: Complete (1500ms after certificate)
    timers.push(setTimeout(() => setPhase('complete'), 13500));

    return () => timers.forEach(clearTimeout);
  }, [haptics, sound]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Confetti Explosion */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none">
            <Confetti
              colors={['#00F6E0', '#FBBF24', '#FFFFFF', '#FF6B6B']}
              count={100}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Wolf Eyes Phase */}
      <AnimatePresence>
        {phase === 'eyes' && (
          <WolfEyes
            color="#FBBF24"
            size="lg"
            glowIntensity={1.5}
            breathing
          />
        )}
      </AnimatePresence>

      {/* Day Counter */}
      <AnimatePresence>
        {['day-counter', 'impact', 'stats', 'confetti', 'certificate', 'complete'].includes(phase) && (
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.span
              className="font-bebas text-8xl"
              style={{
                color: phase === 'impact' || dayCount === 42 ? '#FBBF24' : 'var(--text-primary)',
              }}
              animate={
                dayCount === 42
                  ? {
                      scale: [1, 1.3, 1],
                      textShadow: [
                        '0 0 0px transparent',
                        '0 0 60px rgba(251, 191, 36, 1)',
                        '0 0 30px rgba(251, 191, 36, 0.5)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {dayCount}
            </motion.span>
            <span
              className="font-bebas text-2xl tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              DAYS COMPLETE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <AnimatePresence>
        {['stats', 'confetti', 'certificate', 'complete'].includes(phase) && (
          <motion.div
            className="grid grid-cols-2 gap-4 w-full max-w-sm px-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard label="Total XP" value={totalXP.toLocaleString()} />
            <StatCard label="Final Rank" value={finalRank} highlight />
            <StatCard label="Workouts" value={totalWorkouts.toString()} />
            <StatCard label="Perfect" value={perfectWorkouts.toString()} />
            <StatCard label="Best Streak" value={`${longestStreak} days`} />
            <StatCard label="Cards Earned" value={totalCards.toString()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Preview */}
      <AnimatePresence>
        {['certificate', 'complete'].includes(phase) && (
          <motion.div
            className="w-full max-w-sm px-6 mb-8"
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          >
            {/* Certificate Card */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%)',
                border: '2px solid #FBBF24',
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
              }}
            >
              <span className="text-4xl mb-2 block">🏆</span>
              <h2
                className="font-bebas text-2xl tracking-wider mb-1"
                style={{ color: '#FBBF24' }}
              >
                CERTIFICATE OF COMPLETION
              </h2>
              <p
                className="text-lg font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {athleteName}
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Barefoot Reset · 42-Day Program
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
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
                'transition-transform hover:scale-105 active:scale-95',
                'flex items-center justify-center gap-2'
              )}
              style={{
                backgroundColor: '#FBBF24',
                color: '#000000',
              }}
            >
              <span>📸</span>
              SHARE TO INSTAGRAM
            </button>
            <button
              onClick={onViewCertificate}
              className={cn(
                'py-4 rounded-lg font-semibold text-lg',
                'transition-transform hover:scale-105 active:scale-95'
              )}
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#000000',
              }}
            >
              VIEW CERTIFICATE
            </button>
            <button
              onClick={onContinue}
              className={cn(
                'py-3 rounded-lg font-medium',
                'transition-transform hover:scale-105 active:scale-95'
              )}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              Continue to Collection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <motion.div
      className="p-4 rounded-lg text-center"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: highlight ? '1px solid var(--accent-gold)' : '1px solid var(--border-default)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span
        className="font-bebas text-2xl block"
        style={{ color: highlight ? 'var(--accent-gold)' : 'var(--text-primary)' }}
      >
        {value}
      </span>
      <span
        className="text-xs uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default ProgramComplete;
