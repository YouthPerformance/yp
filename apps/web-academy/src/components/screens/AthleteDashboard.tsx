// ═══════════════════════════════════════════════════════════
// ATHLETE DASHBOARD (HOME SCREEN)
// The first screen athletes see after login
// Shows daily status, streak, XP, upcoming workout
// Supports Free vs Pro subscription gating
// Intensity Budget: 10 points (Minor animations only)
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { StatTicker } from '@/components/ui/StatTicker';
import { WorkoutCard } from '@/components/dashboard/WorkoutCard';
import { UpsellModal } from '@/components/modals/UpsellModal';
import { cn } from '@/lib/utils';

type WolfRank = 'Pup' | 'Hunter' | 'Alpha' | 'Apex';
type SubscriptionStatus = 'free' | 'pro';

interface AthleteDashboardProps {
  athleteName: string;
  subscriptionStatus: SubscriptionStatus; // Free users see locked content
  currentDay: number;
  totalDays: number;
  currentXP: number;
  previousXP?: number;
  xpToNextRank: number;
  currentRank: WolfRank;
  currentStreak: number;
  streakExpiresIn?: number; // hours until streak expires
  todayCompleted: boolean;
  isBossDay: boolean;
  bossName?: string;
  recentCards: { id: string; name: string; rarity: string }[];
  onStartWorkout?: () => void;
  onViewCollection?: () => void;
  onViewLeaderboard?: () => void;
  onViewProfile?: () => void;
}

const RANK_CONFIG: Record<WolfRank, { emoji: string; color: string; nextRank: WolfRank | null; threshold: number }> = {
  Pup: { emoji: '🐺', color: '#A0A0A0', nextRank: 'Hunter', threshold: 1000 },
  Hunter: { emoji: '🐺', color: '#00F6E0', nextRank: 'Alpha', threshold: 3000 },
  Alpha: { emoji: '🐺', color: '#FBBF24', nextRank: 'Apex', threshold: 7000 },
  Apex: { emoji: '🐺', color: '#FF6B6B', nextRank: null, threshold: Infinity },
};

export function AthleteDashboard({
  athleteName,
  subscriptionStatus,
  currentDay,
  totalDays,
  currentXP,
  previousXP,
  xpToNextRank,
  currentRank,
  currentStreak,
  streakExpiresIn,
  todayCompleted,
  isBossDay,
  bossName,
  recentCards,
  onStartWorkout,
  onViewCollection,
  onViewLeaderboard,
  onViewProfile,
}: AthleteDashboardProps) {
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const rankConfig = RANK_CONFIG[currentRank];
  const isFreeUser = subscriptionStatus === 'free';

  // Calculate rank progress
  const rankProgress = useMemo(() => {
    const prevThreshold = currentRank === 'Pup' ? 0 :
      currentRank === 'Hunter' ? 1000 :
      currentRank === 'Alpha' ? 3000 : 7000;
    const nextThreshold = rankConfig.threshold;
    if (nextThreshold === Infinity) return 100;
    return Math.min(100, ((currentXP - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
  }, [currentXP, currentRank, rankConfig.threshold]);

  // Streak urgency
  const streakUrgent = streakExpiresIn !== undefined && streakExpiresIn < 4;

  // Handle workout click - free users trigger upsell
  const handleWorkoutClick = () => {
    if (isFreeUser) {
      setShowUpsellModal(true);
    } else if (onStartWorkout) {
      onStartWorkout();
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen px-6 py-8 pb-24"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <motion.p
              className="text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome back,
            </motion.p>
            <motion.h1
              className="font-bebas text-4xl tracking-wider"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {athleteName.toUpperCase()}
            </motion.h1>
          </div>
          <motion.button
            onClick={onViewProfile}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--border-default)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl">{rankConfig.emoji}</span>
          </motion.button>
        </header>

        {/* Day Progress Card */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Day
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-bebas text-5xl"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {currentDay}
                </span>
                <span
                  className="font-bebas text-2xl"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  /{totalDays}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="text-right">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Streak
              </span>
              <div className="flex items-center gap-2">
                <motion.span
                  className="font-bebas text-4xl"
                  style={{ color: streakUrgent ? 'var(--accent-warning)' : 'var(--accent-primary)' }}
                  animate={streakUrgent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: streakUrgent ? Infinity : 0 }}
                >
                  {currentStreak}
                </motion.span>
                <motion.span
                  className="text-2xl"
                  animate={streakUrgent ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5, repeat: streakUrgent ? Infinity : 0 }}
                >
                  🔥
                </motion.span>
              </div>
              {streakUrgent && (
                <span
                  className="text-xs"
                  style={{ color: 'var(--accent-warning)' }}
                >
                  {streakExpiresIn}h left!
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-default)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(currentDay / totalDays) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Today's Workout Card - with Lock for Free Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <WorkoutCard
            day={currentDay}
            title={isBossDay ? bossName || 'Diagnostic Scan' : 'Diagnostic Scan'}
            subtitle={isBossDay ? 'Boss fight • 20 min' : '15 min • Earn XP'}
            duration={isBossDay ? '20 min' : '15 min'}
            isCompleted={todayCompleted}
            isCurrent={!todayCompleted}
            isLocked={isFreeUser} // Free users see locked content
            isBossDay={isBossDay}
            bossName={bossName}
            xpReward={isBossDay ? 150 : 50}
            onClick={onStartWorkout}
            onLockedClick={() => setShowUpsellModal(true)}
          />
        </motion.div>

        {/* Free User Banner */}
        {isFreeUser && (
          <motion.button
            onClick={() => setShowUpsellModal(true)}
            className="w-full rounded-xl p-4 mb-6 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 246, 224, 0.15) 0%, rgba(0, 163, 184, 0.15) 100%)',
              border: '1px solid var(--accent-primary)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(0, 246, 224, 0.2)' }}
            >
              <span className="text-2xl">🔓</span>
            </div>
            <div className="text-left flex-1">
              <span
                className="font-bebas text-lg tracking-wider block"
                style={{ color: 'var(--accent-primary)' }}
              >
                UNLOCK FULL PROGRAM
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Get 42 days of guided training for just $88
              </span>
            </div>
            <span style={{ color: 'var(--accent-primary)' }}>→</span>
          </motion.button>
        )}

        {/* XP & Rank Section */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${rankConfig.color}40 0%, ${rankConfig.color}20 100%)`,
                  border: `2px solid ${rankConfig.color}`,
                }}
              >
                <span className="text-xl">{rankConfig.emoji}</span>
              </div>
              <div>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Current Rank
                </span>
                <span
                  className="font-bebas text-2xl tracking-wider block"
                  style={{ color: rankConfig.color }}
                >
                  {currentRank.toUpperCase()}
                </span>
              </div>
            </div>

            <StatTicker
              value={currentXP}
              previousValue={previousXP || currentXP}
              variant="SUBTLE"
              label=""
              suffix="XP"
            />
          </div>

          {/* Rank progress */}
          {rankConfig.nextRank && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Progress to {rankConfig.nextRank}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {xpToNextRank} XP to go
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--border-default)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: rankConfig.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={onViewCollection}
            className="rounded-xl p-4 text-left transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span className="text-2xl mb-2 block">🃏</span>
            <span
              className="font-bebas text-lg tracking-wider block"
              style={{ color: 'var(--text-primary)' }}
            >
              COLLECTION
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {recentCards.length} cards
            </span>
          </button>

          <button
            onClick={onViewLeaderboard}
            className="rounded-xl p-4 text-left transition-transform active:scale-95"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span className="text-2xl mb-2 block">🏆</span>
            <span
              className="font-bebas text-lg tracking-wider block"
              style={{ color: 'var(--text-primary)' }}
            >
              LEADERBOARD
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              See rankings
            </span>
          </button>
        </motion.div>

        {/* Recent Cards Preview */}
        {recentCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-bebas text-lg tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                RECENT CARDS
              </span>
              <button
                onClick={onViewCollection}
                className="text-sm"
                style={{ color: 'var(--accent-primary)' }}
              >
                View All →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentCards.slice(0, 4).map((card, i) => (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 w-20 h-28 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="text-3xl">🐺</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Upsell Modal - Triggered when free users click locked content */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        athleteName={athleteName}
      />
    </>
  );
}

export default AthleteDashboard;
