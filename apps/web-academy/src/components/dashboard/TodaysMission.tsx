// ═══════════════════════════════════════════════════════════
// TODAY'S MISSION
// Main CTA card for starting daily workout
// Adapted from yp-academy for barefoot-app styling
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Zap, Target, Lock } from 'lucide-react';
import Link from 'next/link';

interface TodaysMissionProps {
  programName: string;
  programEmoji: string;
  dayNumber: number;
  workoutName: string;
  duration: string;
  intensity: 'low' | 'med' | 'high';
  focusArea: string;
  tags?: string[];
  isLocked?: boolean;
  onStart?: () => void;
  onLockedClick?: () => void;
}

const intensityConfig = {
  low: { label: 'Light', color: '#10B981' },
  med: { label: 'Moderate', color: 'var(--accent-gold)' },
  high: { label: 'Intense', color: '#EF4444' },
};

export function TodaysMission({
  programName,
  programEmoji,
  dayNumber,
  workoutName,
  duration,
  intensity,
  focusArea,
  tags = [],
  isLocked = false,
  onStart,
  onLockedClick,
}: TodaysMissionProps) {
  const intensityStyle = intensityConfig[intensity];

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick?.();
    } else {
      onStart?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <Lock className="w-8 h-8 mb-2" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Unlock to continue
          </span>
          <motion.button
            onClick={onLockedClick}
            className="mt-3 px-6 py-2 rounded-xl font-bebas tracking-wider"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            UPGRADE NOW
          </motion.button>
        </div>
      )}

      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{programEmoji}</span>
          <div>
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Today's Mission
            </p>
            <p className="font-bebas tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {programName} - Day {dayNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
          <Target className="w-4 h-4" />
          <span className="text-xs font-medium">{focusArea}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-bebas text-2xl tracking-wider mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {workoutName.toUpperCase()}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
            style={{
              backgroundColor: 'rgba(0, 246, 224, 0.15)',
              color: 'var(--accent-primary)',
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
            style={{
              backgroundColor: `${intensityStyle.color}20`,
              color: intensityStyle.color,
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            {intensityStyle.label}
          </div>
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link href={isLocked ? '#' : '/workout/player'} onClick={handleClick}>
          <motion.button
            className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" fill="currentColor" />
            START SESSION
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default TodaysMission;
