// ═══════════════════════════════════════════════════════════
// WORKOUT PLAYER PAGE
// Video player with exercise tracking
// ═══════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Play, Pause, SkipForward, Volume2, VolumeX, CheckCircle } from 'lucide-react';

export default function WorkoutPlayerPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [progress, setProgress] = useState(0);

  const exercises = [
    { name: 'Ankle Circles', duration: 60 },
    { name: 'Toe Spreads', duration: 45 },
    { name: 'Calf Raises', duration: 60 },
    { name: 'Heel Walks', duration: 30 },
    { name: 'Single Leg Balance', duration: 45 },
    { name: 'Pogos', duration: 30 },
  ];

  const handleComplete = () => {
    // TODO: Record completion in Convex
    router.push('/home');
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Video Area */}
      <div className="relative aspect-video bg-black">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl mb-4 block">🐺</span>
            <p className="text-lg font-bebas tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {exercises[currentExercise]?.name.toUpperCase()}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Video player placeholder
            </p>
          </motion.div>
        </div>

        {/* Close Button */}
        <motion.button
          onClick={() => router.push('/home')}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </motion.button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Exercise Info */}
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Exercise {currentExercise + 1} of {exercises.length}
          </p>
          <h2 className="font-bebas text-2xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {exercises[currentExercise]?.name.toUpperCase()}
          </h2>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Volume2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </motion.button>

          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="var(--bg-primary)" style={{ color: 'var(--bg-primary)' }} />
            )}
          </motion.button>

          <motion.button
            onClick={() => {
              if (currentExercise < exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <motion.div
              key={ex.name}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                backgroundColor: i === currentExercise ? 'var(--bg-secondary)' : 'transparent',
                border: i === currentExercise ? '1px solid var(--accent-primary)' : '1px solid transparent',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentExercise(i)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: i < currentExercise ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  }}
                >
                  {i < currentExercise ? (
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: i === currentExercise ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {ex.name}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {ex.duration}s
              </span>
            </motion.div>
          ))}
        </div>

        {/* Complete Button */}
        <motion.button
          onClick={handleComplete}
          className="w-full mt-6 py-4 rounded-xl font-bebas text-lg tracking-wider"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-primary)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          COMPLETE WORKOUT
        </motion.button>
      </div>
    </main>
  );
}
