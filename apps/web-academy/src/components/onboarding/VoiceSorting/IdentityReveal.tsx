// ═══════════════════════════════════════════════════════════
// IDENTITY REVEAL
// Dramatic full-screen reveal animation
// ═══════════════════════════════════════════════════════════

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { WolfIdentity, TrainingPath } from '@/hooks/useVoiceSorting';

interface IdentityRevealProps {
  identity: WolfIdentity;
  trainingPath: TrainingPath;
  coachComment: string;
  onComplete: () => void;
}

const IDENTITY_CONFIG: Record<WolfIdentity, {
  title: string;
  color: string;
  bgGradient: string;
  icon: string;
}> = {
  speed: {
    title: 'SPEED WOLF',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-900/50 via-black to-black',
    icon: '⚡',
  },
  tank: {
    title: 'TANK WOLF',
    color: 'text-purple-400',
    bgGradient: 'from-purple-900/50 via-black to-black',
    icon: '🛡️',
  },
  air: {
    title: 'AIR WOLF',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/50 via-black to-black',
    icon: '🦅',
  },
};

const PATH_NAMES: Record<TrainingPath, string> = {
  glass: 'RELEASE Path',
  grinder: 'RESTORE Path',
  prospect: 'RE-ENGINEER Path',
};

export function IdentityReveal({
  identity,
  trainingPath,
  coachComment,
  onComplete,
}: IdentityRevealProps) {
  const config = IDENTITY_CONFIG[identity];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play wolf howl on mount
  useEffect(() => {
    const playHowl = async () => {
      try {
        audioRef.current = new Audio('/sounds/wolf_howl_distant.mp3');
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
      } catch (e) {
        console.log('Audio autoplay blocked:', e);
      }
    };

    playHowl();

    // Trigger haptic if available
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 200]);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b ${config.bgGradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wolf eyes glow first */}
      <motion.div
        className="absolute top-1/3 flex gap-16"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1], scale: [0.5, 1.2, 1] }}
        transition={{ duration: 1, times: [0, 0.3, 1] }}
      >
        <motion.div
          className={`w-4 h-4 rounded-full bg-${identity === 'speed' ? 'cyan' : identity === 'tank' ? 'purple' : 'yellow'}-400 blur-sm`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className={`w-4 h-4 rounded-full bg-${identity === 'speed' ? 'cyan' : identity === 'tank' ? 'purple' : 'yellow'}-400 blur-sm`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
        />
      </motion.div>

      {/* Icon */}
      <motion.div
        className="text-6xl mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        {config.icon}
      </motion.div>

      {/* Title */}
      <motion.h1
        className={`text-5xl md:text-7xl font-black ${config.color} mb-4 tracking-wider`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {config.title}
      </motion.h1>

      {/* Path subtitle */}
      <motion.p
        className="text-xl text-gray-400 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {PATH_NAMES[trainingPath]}
      </motion.p>

      {/* Coach comment */}
      <motion.p
        className="text-lg text-gray-300 text-center max-w-md px-6 mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {coachComment}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        className={`px-8 py-4 rounded-full font-bold text-lg text-black ${
          identity === 'speed' ? 'bg-cyan-400 hover:bg-cyan-300' :
          identity === 'tank' ? 'bg-purple-400 hover:bg-purple-300' :
          'bg-yellow-400 hover:bg-yellow-300'
        } transition-colors`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        onClick={onComplete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start First Mission
      </motion.button>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              identity === 'speed' ? 'bg-cyan-400' :
              identity === 'tank' ? 'bg-purple-400' :
              'bg-yellow-400'
            }`}
            initial={{
              x: '50%',
              y: '50%',
              opacity: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: 0.5 + Math.random() * 1.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
