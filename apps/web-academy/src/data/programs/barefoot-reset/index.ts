// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET 42-DAY PROGRAM
// "The Wolf Den" - Elite Training for Every Kid, Everywhere
// ═══════════════════════════════════════════════════════════

// Types
export * from './types';

// Exercise Database (81 exercises)
export * from './exercises';

// Workout/Mission Data (30 workouts)
export * from './workouts';

// 42-Day Calendar
export * from './calendar';

// Gamification System (Badges, Shards, Crystals, Chain, Wolf Evolution)
export * from './gamification';

// ─────────────────────────────────────────────────────────────
// PROGRAM SUMMARY
// ─────────────────────────────────────────────────────────────

import { PROGRAM_CONFIG } from './types';
import { EXERCISE_STATS } from './exercises';
import { WORKOUT_STATS } from './workouts';
import { CALENDAR_STATS } from './calendar';
import { GAMIFICATION_STATS, BADGES, CHAIN_CONFIG, WOLF_EVOLUTION_CONFIG } from './gamification';

export const PROGRAM_SUMMARY = {
  name: PROGRAM_CONFIG.name,
  slug: PROGRAM_CONFIG.slug,
  description: PROGRAM_CONFIG.description,

  // Structure
  exercises: EXERCISE_STATS,
  workouts: WORKOUT_STATS,
  calendar: CALENDAR_STATS,

  // Phases
  phases: [
    {
      name: 'Foundation',
      weeks: '1-2',
      workouts: '1-10',
      theme: 'The Wake Up',
      goal: 'Restore range of motion and eliminate pain',
    },
    {
      name: 'Progression',
      weeks: '3-4',
      workouts: '11-20',
      theme: 'The Armor',
      goal: 'Build steel ankles and load capacity',
    },
    {
      name: 'Mastery',
      weeks: '5-6',
      workouts: '21-30',
      theme: 'The Ignition',
      goal: 'Explosive power and sport transfer',
    },
  ],

  // R3 Framework → Neon Trinity Mapping
  r3ToNeon: {
    Release: { frequency: 'Flow', color: '#A855F7', description: 'Loosening, mobility' },
    Restore: { frequency: 'Forge', color: '#F97316', description: 'Stability, strength' },
    'Re-Engineer': { frequency: 'Volt', color: '#06B6D4', description: 'Explosiveness, power' },
  },

  // Rewards Summary
  rewards: {
    shardsPerExercise: 8,
    shardsPerWorkout: 48,
    xpPerWorkout: 100,
    totalPossibleShards: 48 * 30, // 1,440
    totalPossibleXp: 100 * 30, // 3,000
    strikeWodBonusRange: '25-200 shards',
    completionBonus: {
      shards: 500,
      xp: 1000,
      credit: '$88',
    },
  },

  // Strike WODs
  strikeWods: {
    regularCount: 15, // On odd workouts
    milestoneCount: 6, // Days 7, 14, 21, 28, 35, 42
    durationRange: '6-15 minutes',
    format: 'AMRAP',
    effortRating: '1-10 self-reported',
  },

  // Chain (Streak) Milestones
  chainMilestones: PROGRAM_CONFIG.chainMilestones,

  // Gamification System
  gamification: {
    ...GAMIFICATION_STATS,
    badges: BADGES,
    chainConfig: CHAIN_CONFIG,
    wolfEvolution: WOLF_EVOLUTION_CONFIG,
  },
};

// Log summary when imported in development
if (process.env.NODE_ENV === 'development') {
  console.log('🐺 Barefoot Reset Program Loaded');
  console.log(`   📚 ${EXERCISE_STATS.total} exercises`);
  console.log(`   🏋️ ${WORKOUT_STATS.total} workouts`);
  console.log(`   📅 ${CALENDAR_STATS.totalDays} calendar days`);
  console.log(`   ⚡ ${WORKOUT_STATS.withStrikeWod} Strike WODs`);
  console.log(`   🏆 ${GAMIFICATION_STATS.totalBadges} badges`);
  console.log(`   💎 ${GAMIFICATION_STATS.maxPossibleShards} max possible shards`);
}
