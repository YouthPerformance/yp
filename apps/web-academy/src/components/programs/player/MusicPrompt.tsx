// ═══════════════════════════════════════════════════════════
// MusicPrompt Component
// Sheet modal prompting user to play their own music
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { Music, ChevronUp } from 'lucide-react';

interface MusicPromptProps {
  onDismiss: () => void;
}

export function MusicPrompt({ onDismiss }: MusicPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="flex flex-col h-full items-center justify-end p-6"
    >
      {/* Sheet Card */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="w-full rounded-3xl p-8 flex flex-col items-center space-y-6 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Music Icon */}
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
          }}
        >
          <Music className="w-12 h-12" style={{ color: 'white' }} />
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h2
            className="font-bebas text-2xl tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            FOR MUSIC, USE YOUR OWN APP
          </h2>
          <p className="text-sm px-4" style={{ color: 'var(--text-tertiary)' }}>
            Listen to music from other apps during your workouts. You'll still
            hear your coach's cues.
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 w-4 rounded-full`}
              style={{
                backgroundColor: i === 2 ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Swipe hint */}
      <motion.button
        onClick={onDismiss}
        className="w-full flex items-center justify-center gap-2 mt-8 mb-12"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Tap to begin
        </span>
      </motion.button>
    </motion.div>
  );
}
