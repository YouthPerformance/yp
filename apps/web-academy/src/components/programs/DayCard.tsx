// ═══════════════════════════════════════════════════════════
// DayCard Component
// Visual representation of a program day with status
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight } from 'lucide-react';
import type { WorkoutTheme } from '@/data/programs/basketball-chassis';

type DayStatus = 'locked' | 'unlocked' | 'current' | 'completed';

interface DayCardProps {
  dayNumber: number;
  theme: WorkoutTheme;
  title: string;
  status: DayStatus;
  themeColor: string;
  onClick?: () => void;
}

export function DayCard({
  dayNumber,
  theme,
  title,
  status,
  themeColor,
  onClick,
}: DayCardProps) {
  const isClickable = status !== 'locked';

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`
        w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all
        ${status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        backgroundColor: status === 'current' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
        border: status === 'current'
          ? `1px solid ${themeColor}`
          : '1px solid var(--border-default)',
      }}
      whileHover={isClickable ? { scale: 1.01 } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
    >
      {/* Status Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor:
            status === 'completed'
              ? themeColor
              : status === 'current'
              ? `${themeColor}20`
              : 'var(--bg-secondary)',
        }}
      >
        {status === 'locked' && (
          <Lock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        )}
        {status === 'completed' && (
          <Check className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
        )}
        {(status === 'unlocked' || status === 'current') && (
          <span
            className="text-sm font-bold"
            style={{ color: status === 'current' ? themeColor : 'var(--text-secondary)' }}
          >
            {dayNumber}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${themeColor}20`,
              color: themeColor,
            }}
          >
            {theme.replace('-', ' ')}
          </span>
        </div>
        <p
          className="text-sm font-medium truncate"
          style={{
            color: status === 'locked' ? 'var(--text-tertiary)' : 'var(--text-primary)',
          }}
        >
          Day {dayNumber}: {title}
        </p>
      </div>

      {/* Arrow */}
      {isClickable && (
        <ChevronRight
          className="w-5 h-5 flex-shrink-0"
          style={{ color: status === 'current' ? themeColor : 'var(--text-tertiary)' }}
        />
      )}
    </motion.button>
  );
}
