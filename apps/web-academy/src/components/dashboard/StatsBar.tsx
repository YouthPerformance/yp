// ═══════════════════════════════════════════════════════════
// STATS BAR COMPONENT
// Shows Level, XP, Streak, and Crystals
// Ported from yp-academy/StatsBar.tsx
// ═══════════════════════════════════════════════════════════

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatsBarProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  crystals?: number;
  compact?: boolean;
}

export function StatsBar({
  level,
  xp,
  xpToNextLevel,
  streak,
  crystals = 0,
  compact = false,
}: StatsBarProps) {
  const xpProgress = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <StatItem icon="⚡" value={level} label="LVL" color="var(--accent-primary)" />
        <StatItem icon="🔥" value={streak} label="Streak" color="var(--accent-warning)" />
        <StatItem icon="💎" value={crystals} label="Crystals" color="var(--accent-secondary)" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Level Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--border-default)"
                strokeWidth="4"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 150.8' }}
                animate={{ strokeDasharray: `${xpProgress * 1.508} 150.8` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-mono text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {level}
              </span>
            </div>
          </div>
          <span
            className="text-xs mt-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Level
          </span>
        </div>

        {/* XP Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              XP
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--accent-primary)' }}
            >
              {xp.toLocaleString()}/{xpToNextLevel.toLocaleString()}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-default)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-lg">🔥</span>
            <span
              className="font-mono text-xl font-bold"
              style={{ color: 'var(--accent-warning)' }}
            >
              {streak}
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Streak
          </span>
        </div>

        {/* Crystals */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-lg">💎</span>
            <span
              className="font-mono text-xl font-bold"
              style={{ color: '#FFD700' }}
            >
              {crystals}
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Crystals
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <span
          className="font-mono text-lg font-bold block"
          style={{ color }}
        >
          {value}
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default StatsBar;
