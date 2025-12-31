// ═══════════════════════════════════════════════════════════
// EPIC UNLOCK SEQUENCE
// Dramatic animation when content is unlocked after payment
// "AUTHENTICATING..." → Lock shatters → "ACCESS GRANTED"
// Intensity Budget: 15 points (Epic moment)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';

type UnlockPhase = 'authenticating' | 'unlocking' | 'granted' | 'complete';

interface EpicUnlockSequenceProps {
  onComplete: () => void;
  delay?: number; // Initial delay before starting
}

// Particle configuration for lock shatter effect
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i * 30) * (Math.PI / 180),
  distance: 100 + Math.random() * 100,
  size: 4 + Math.random() * 8,
  rotation: Math.random() * 360,
}));

export function EpicUnlockSequence({ onComplete, delay = 500 }: EpicUnlockSequenceProps) {
  const { trigger } = useHaptics();
  const [phase, setPhase] = useState<UnlockPhase>('authenticating');

  useEffect(() => {
    // Phase timeline
    const timers: NodeJS.Timeout[] = [];

    // Start after initial delay
    timers.push(setTimeout(() => {
      trigger('impact_light');
    }, delay));

    // Authenticating → Unlocking (1.5s)
    timers.push(setTimeout(() => {
      setPhase('unlocking');
      trigger('impact_heavy');
    }, delay + 1500));

    // Unlocking → Granted (0.8s for shatter animation)
    timers.push(setTimeout(() => {
      setPhase('granted');
      trigger('success_pattern');
    }, delay + 2300));

    // Granted → Complete (2s to enjoy the moment)
    timers.push(setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, delay + 4300));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [delay, trigger, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Phase 1: Authenticating */}
        <AnimatePresence mode="wait">
          {phase === 'authenticating' && (
            <motion.div
              key="authenticating"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="w-24 h-24 rounded-full border-4 mb-8"
                style={{ borderColor: 'var(--accent-primary)' }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />

              {/* Loading dots */}
              <motion.p
                className="font-bebas text-2xl tracking-[0.3em]"
                style={{ color: 'var(--accent-primary)' }}
              >
                AUTHENTICATING
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Unlocking (Lock with cracks → shatter) */}
        <AnimatePresence mode="wait">
          {phase === 'unlocking' && (
            <motion.div
              key="unlocking"
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Central lock that will shatter */}
              <motion.div
                className="w-28 h-28 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0, 246, 224, 0.2)',
                  border: '3px solid var(--accent-primary)',
                }}
                animate={{
                  scale: [1, 1.1, 1.2],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 0.6, times: [0, 0.5, 1] }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{ scale: [1, 1.2, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                >
                  🔓
                </motion.span>
              </motion.div>

              {/* Shatter particles */}
              {PARTICLES.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-sm"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: 'var(--accent-primary)',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos(particle.angle) * particle.distance,
                    y: Math.sin(particle.angle) * particle.distance,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    rotate: particle.rotation,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Access Granted */}
        <AnimatePresence mode="wait">
          {phase === 'granted' && (
            <motion.div
              key="granted"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {/* Glowing checkmark */}
              <motion.div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
                style={{
                  backgroundColor: 'rgba(0, 246, 224, 0.2)',
                  border: '3px solid var(--accent-primary)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(0, 246, 224, 0.4)',
                    '0 0 60px 30px rgba(0, 246, 224, 0.2)',
                    '0 0 80px 40px rgba(0, 246, 224, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.span
                  className="text-5xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                >
                  ✓
                </motion.span>
              </motion.div>

              {/* Text reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h1
                  className="font-bebas text-4xl tracking-[0.2em] text-center"
                  style={{ color: 'var(--accent-primary)' }}
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(0, 246, 224, 0.5)',
                      '0 0 30px rgba(0, 246, 224, 0.8)',
                      '0 0 10px rgba(0, 246, 224, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ACCESS GRANTED
                </motion.h1>
                <motion.p
                  className="text-sm text-center mt-2"
                  style={{ color: 'var(--text-tertiary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Welcome to the 42-Day Reset
                </motion.p>
              </motion.div>

              {/* Radial lines burst */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-40"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, var(--accent-primary), transparent)',
                    transform: `rotate(${i * 45}deg)`,
                    transformOrigin: 'center',
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 0.5, 0], scaleY: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default EpicUnlockSequence;
