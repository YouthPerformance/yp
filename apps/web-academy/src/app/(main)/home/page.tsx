// ═══════════════════════════════════════════════════════════
// HOME PAGE - ATHLETE DASHBOARD
// Main dashboard with stats, today's mission, and lockers
// ═══════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LockerRoomHeader,
  StatsBar,
  TodaysMission,
} from '@/components/dashboard';
import { UpsellModal } from '@/components/modals';
import { useUserContext } from '@/contexts/UserContext';

// Wolf color to hex mapping
const WOLF_COLORS: Record<string, string> = {
  cyan: '#00F6E0',
  gold: '#FFD700',
  purple: '#9B30FF',
  green: '#10B981',
  red: '#DC143C',
};

// Program config
const PROGRAM = {
  name: 'Foundation',
  emoji: '🐺',
  totalDays: 42,
};

// Helper functions
function getWorkoutName(day: number): string {
  const workouts = [
    'Foundation Flow',
    'Ankle Awakening',
    'Balance Basics',
    'Foot Fundamentals',
    'Ground Connection',
    'Mobility Matrix',
    'Spring Activation',
  ];
  return workouts[(day - 1) % workouts.length];
}

function getPhase(day: number): string {
  if (day <= 14) return 'Release Phase';
  if (day <= 28) return 'Restore Phase';
  return 'Reengineer Phase';
}

export default function HomePage() {
  const router = useRouter();
  const { user, enrollment, level, xpToNextLevel, isLoaded, authState } = useUserContext();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [parentModeActive, setParentModeActive] = useState(false);

  // Show loading state while user data loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">🐺</span>
          <p style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Get user data with fallbacks for when not signed in
  const userData = {
    name: user?.name || 'Athlete',
    avatarColor: WOLF_COLORS[user?.avatarColor || 'cyan'] || '#00F6E0',
    rank: user?.rank || 'pup',
    sport: user?.sport || 'Training',
    age: user?.age || 14,
    xp: user?.xpTotal || 0,
    streak: user?.streakCurrent || 0,
    crystals: user?.crystals || 0,
    currentDay: enrollment?.currentDay || 1,
    subscriptionStatus: user?.subscriptionStatus || 'free',
  };

  // Determine if workout is locked (Day 2+ for free users)
  const isWorkoutLocked =
    userData.subscriptionStatus === 'free' && userData.currentDay > 1;

  const handleStartWorkout = () => {
    if (isWorkoutLocked) {
      setShowUpsellModal(true);
    } else {
      router.push('/workout/player');
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Header */}
      <LockerRoomHeader
        userName={userData.name}
        avatarColor={userData.avatarColor}
        rank={userData.rank}
        sport={userData.sport}
        age={userData.age}
        onParentModeClick={() => setParentModeActive(!parentModeActive)}
        onSettingsClick={() => router.push('/profile')}
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <StatsBar
          level={level}
          xp={userData.xp}
          xpToNextLevel={xpToNextLevel}
          streak={userData.streak}
          crystals={userData.crystals}
        />
      </motion.div>

      {/* Free User Banner */}
      {userData.subscriptionStatus === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4 p-3 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--accent-gold)' }}
            >
              Free Trial - Day 1 Only
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Upgrade to unlock all 42 days
            </p>
          </div>
          <motion.button
            onClick={() => setShowUpsellModal(true)}
            className="px-4 py-2 rounded-lg text-xs font-bebas tracking-wider"
            style={{
              backgroundColor: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            UPGRADE
          </motion.button>
        </motion.div>
      )}

      {/* Today's Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <TodaysMission
          programName={PROGRAM.name}
          programEmoji={PROGRAM.emoji}
          dayNumber={userData.currentDay}
          workoutName={getWorkoutName(userData.currentDay)}
          duration="12 min"
          intensity="med"
          focusArea={getPhase(userData.currentDay)}
          tags={['Ankle Mobility', 'Foundation']}
          isLocked={isWorkoutLocked}
          onStart={handleStartWorkout}
          onLockedClick={() => setShowUpsellModal(true)}
        />
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <h3
          className="font-bebas text-lg tracking-wider mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          YOUR JOURNEY
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
              Day {userData.currentDay}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              of {PROGRAM.totalDays}
            </p>
          </div>
          <div className="flex-1 mx-4">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--accent-primary)' }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(userData.currentDay / PROGRAM.totalDays) * 100}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-lg font-mono font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {Math.round((userData.currentDay / PROGRAM.totalDays) * 100)}%
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              complete
            </p>
          </div>
        </div>
      </motion.div>

      {/* Parent Mode Overlay */}
      {parentModeActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setParentModeActive(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-6 max-w-sm w-full text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              PARENT MODE
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              View your athlete's progress, manage notifications, and access parental
              controls.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Coming Soon
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        athleteName={userData.name}
      />
    </main>
  );
}
