// ═══════════════════════════════════════════════════════════
// WORKOUT CARD COMPONENT
// Bento-style card for daily workouts
// Supports locked state for free users (triggers upsell)
// Uses Framer Motion for hover transitions
// Intensity Budget: 6 points
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  day: number;
  title: string;
  subtitle?: string;
  duration?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
  isLocked?: boolean; // Free users see locked content
  isBossDay?: boolean;
  bossName?: string;
  xpReward?: number;
  onClick?: () => void;
  onLockedClick?: () => void; // Triggers UpsellModal for free users
}

export function WorkoutCard({
  day,
  title,
  subtitle,
  duration = '15 min',
  isCompleted = false,
  isCurrent = false,
  isLocked = false,
  isBossDay = false,
  bossName,
  xpReward = 50,
  onClick,
  onLockedClick,
}: WorkoutCardProps) {
  const handleClick = () => {
    if (isLocked && onLockedClick) {
      // Free user clicking locked content → trigger upsell
      onLockedClick();
    } else if (onClick && !isCompleted) {
      // Pro user or unlocked content → start workout
      onClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'relative w-full rounded-2xl p-5 text-left overflow-hidden',
        'transition-all duration-200',
        isLocked && 'cursor-pointer'
      )}
      style={{
        backgroundColor: isLocked
          ? 'var(--bg-tertiary)'
          : isCompleted
          ? 'var(--bg-secondary)'
          : isCurrent
          ? 'var(--accent-primary)'
          : 'var(--bg-secondary)',
        border: isCompleted
          ? '1px solid var(--border-default)'
          : isCurrent && !isLocked
          ? 'none'
          : '1px solid var(--border-default)',
        opacity: isLocked ? 0.85 : 1,
      }}
      whileHover={!isCompleted ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isCompleted ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Lock Overlay for Free Users */}
      {isLocked && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <motion.div
            className="flex flex-col items-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '2px solid var(--accent-primary)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span
              className="font-bebas text-sm tracking-wider"
              style={{ color: 'var(--accent-primary)' }}
            >
              TAP TO UNLOCK
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* Content */}
      <div className={cn('relative', isLocked && 'blur-[2px]')}>
        <div className="flex items-start justify-between mb-3">
          {/* Day Badge */}
          <div
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: isCurrent && !isLocked
                ? 'rgba(0, 0, 0, 0.2)'
                : 'var(--bg-tertiary)',
            }}
          >
            <span
              className="font-bebas text-sm tracking-wider"
              style={{
                color: isCurrent && !isLocked
                  ? 'var(--bg-primary)'
                  : 'var(--text-tertiary)',
              }}
            >
              DAY {day}
            </span>
          </div>

          {/* Status/XP Badge */}
          {isCompleted ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 246, 224, 0.15)' }}
            >
              <span style={{ color: 'var(--accent-primary)' }}>✓</span>
            </div>
          ) : (
            <div
              className="px-2 py-1 rounded-full"
              style={{
                backgroundColor: isCurrent && !isLocked
                  ? 'rgba(0, 0, 0, 0.2)'
                  : 'var(--bg-tertiary)',
              }}
            >
              <span
                className="font-mono text-xs"
                style={{
                  color: isCurrent && !isLocked
                    ? 'var(--bg-primary)'
                    : 'var(--accent-primary)',
                }}
              >
                +{xpReward} XP
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-bebas text-2xl tracking-wider mb-1"
          style={{
            color: isCurrent && !isLocked
              ? 'var(--bg-primary)'
              : isCompleted
              ? 'var(--text-secondary)'
              : 'var(--text-primary)',
          }}
        >
          {isBossDay ? `STRIKE WOD: ${bossName || title}` : title}
        </h3>

        {/* Subtitle / Duration */}
        <div className="flex items-center gap-3">
          <span
            className="text-sm"
            style={{
              color: isCurrent && !isLocked
                ? 'rgba(0, 0, 0, 0.6)'
                : 'var(--text-tertiary)',
            }}
          >
            {subtitle || duration}
          </span>

          {isBossDay && (
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                color: '#FF6B6B',
              }}
            >
              BOSS FIGHT
            </span>
          )}
        </div>

        {/* Play button for current day */}
        {isCurrent && !isCompleted && !isLocked && (
          <motion.div
            className="absolute right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">▶</span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

export default WorkoutCard;
