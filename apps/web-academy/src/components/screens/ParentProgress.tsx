// ═══════════════════════════════════════════════════════════
// PARENT PROGRESS SCREEN
// Translates XP into parent-understandable metrics
// "Sponsor Report" Theme - Same brand, calmer energy
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { StatTicker } from '@/components/ui/StatTicker';
import { cn } from '@/lib/utils';

interface SkillData {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface WeeklyDataPoint {
  day: string;
  minutes: number;
  completed: boolean;
}

interface ParentProgressProps {
  athleteName: string;
  durabilityScore: number;
  previousDurabilityScore: number;
  weeklyData: WeeklyDataPoint[];
  skills: SkillData[];
  phase: 'Foundation' | 'Build' | 'Peak';
  weekNumber: number;
  onBack?: () => void;
}

export function ParentProgress({
  athleteName,
  durabilityScore,
  previousDurabilityScore,
  weeklyData,
  skills,
  phase,
  weekNumber,
  onBack,
}: ParentProgressProps) {
  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
    const completedDays = weeklyData.filter((d) => d.completed).length;
    return { totalMinutes, completedDays };
  }, [weeklyData]);

  // Get max minutes for chart scaling
  const maxMinutes = useMemo(() => {
    return Math.max(...weeklyData.map((d) => d.minutes), 20);
  }, [weeklyData]);

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <BackArrow />
        </button>
        <div>
          <h1
            className="font-bebas text-2xl tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            {athleteName.toUpperCase()}'S PROGRESS
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Week {weekNumber} · {phase} Phase
          </p>
        </div>
      </header>

      {/* Durability Score */}
      <section
        className="rounded-xl p-6 mb-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Durability Score
          </h2>
          <TrendBadge
            current={durabilityScore}
            previous={previousDurabilityScore}
          />
        </div>

        <div className="flex items-end gap-6">
          <StatTicker
            value={durabilityScore}
            previousValue={previousDurabilityScore}
            variant="PROFESSIONAL"
            label=""
            suffix="/100"
          />

          {/* Progress bar */}
          <div className="flex-1 pb-2">
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--border-default)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${durabilityScore}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-xs mt-4 italic"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Estimates training consistency, not injury prediction. Consult a
          healthcare provider for medical advice.
        </p>
      </section>

      {/* Weekly Trend Chart */}
      <section
        className="rounded-xl p-6 mb-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Weekly Activity
          </h2>
          <span
            className="text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {weeklyStats.totalMinutes} min total
          </span>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-2 h-32 mb-2">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full rounded-t-sm"
                style={{
                  backgroundColor: day.completed
                    ? 'var(--accent-primary)'
                    : 'var(--border-default)',
                }}
                initial={{ height: 0 }}
                animate={{
                  height: `${(day.minutes / maxMinutes) * 100}%`,
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            </div>
          ))}
        </div>

        {/* Day Labels */}
        <div className="flex gap-2">
          {weeklyData.map((day, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {day.day}
            </div>
          ))}
        </div>
      </section>

      {/* Skill Focus Breakdown */}
      <section
        className="rounded-xl p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Skill Focus
        </h2>

        <div className="space-y-4">
          {skills.map((skill, i) => (
            <SkillRow key={i} skill={skill} index={i} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SKILL ROW COMPONENT
// ─────────────────────────────────────────────────────────────

interface SkillRowProps {
  skill: SkillData;
  index: number;
}

function SkillRow({ skill, index }: SkillRowProps) {
  const trendIcon = useMemo(() => {
    switch (skill.trend) {
      case 'up':
        return { symbol: '↑', color: 'var(--accent-primary)' };
      case 'down':
        return { symbol: '↓', color: 'var(--accent-warning)' };
      default:
        return { symbol: '→', color: 'var(--text-tertiary)' };
    }
  }, [skill.trend]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {skill.name}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-mono"
            style={{ color: 'var(--text-primary)' }}
          >
            {skill.score}%
          </span>
          <span style={{ color: trendIcon.color }}>{trendIcon.symbol}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-1"
        style={{ backgroundColor: 'var(--border-default)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.score}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
        />
      </div>

      <p
        className="text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {skill.description}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// TREND BADGE COMPONENT
// ─────────────────────────────────────────────────────────────

interface TrendBadgeProps {
  current: number;
  previous: number;
}

function TrendBadge({ current, previous }: TrendBadgeProps) {
  const diff = current - previous;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  if (isNeutral) {
    return (
      <span
        className="text-xs px-2 py-1 rounded-full"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
        }}
      >
        No change
      </span>
    );
  }

  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{
        backgroundColor: isPositive
          ? 'rgba(0, 191, 176, 0.15)'
          : 'rgba(245, 158, 11, 0.15)',
        color: isPositive ? 'var(--accent-primary)' : 'var(--accent-warning)',
      }}
    >
      {isPositive ? '+' : ''}{diff} pts
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// BACK ARROW ICON
// ─────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ color: 'var(--text-primary)' }}
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ParentProgress;
