// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET - GAMIFICATION SYSTEM
// "The Wolf Den" - Badges, Shards, Crystals, Chain, Wolf Evolution
// ═══════════════════════════════════════════════════════════

import {
  Badge,
  BadgeTrigger,
  WolfEvolution,
  NeonFrequency,
  WOLF_EVOLUTION_THRESHOLDS,
  NEON_COLORS,
} from './types';

// ─────────────────────────────────────────────────────────────
// SHARD & CRYSTAL ECONOMY
// ─────────────────────────────────────────────────────────────

export const SHARD_ECONOMY = {
  // Per-exercise rewards
  perExercise: 8,
  perExerciseSkipped: 0,

  // Per-workout totals (6 exercises × 8 shards)
  perWorkoutBase: 48,
  perWorkoutWithAllExercises: 48,
  perWorkoutMinForChain: 40, // 5/6 exercises = 40 shards + chain

  // Strike WOD rewards (by effort rating)
  strikeWodByEffort: {
    low: 15,      // Effort 1-4
    medium: 20,   // Effort 5-7
    high: 25,     // Effort 8-10
  },

  // Milestone Strike WOD bonuses (days 7, 14, 21, 28, 35, 42)
  milestoneStrikeWodBonuses: {
    7: { shards: 50, xp: 100 },
    14: { shards: 75, xp: 150 },
    21: { shards: 100, xp: 200 },
    28: { shards: 100, xp: 200 },
    35: { shards: 125, xp: 250 },
    42: { shards: 200, xp: 500 },
  },

  // Chain milestone bonuses
  chainBonuses: {
    3: 25,
    7: 50,
    14: 100,
    21: 150,
    30: 300,
  },

  // Crystal conversion
  shardsPerCrystal: 100,

  // Program completion bonus
  completionBonus: {
    shards: 500,
    xp: 1000,
    credit: 88, // $88
  },
};

// Crystal conversion helper
export function shardsToCrystals(shards: number): {
  crystals: number;
  remainingShards: number;
} {
  return {
    crystals: Math.floor(shards / SHARD_ECONOMY.shardsPerCrystal),
    remainingShards: shards % SHARD_ECONOMY.shardsPerCrystal,
  };
}

// ─────────────────────────────────────────────────────────────
// WOLF EVOLUTION SYSTEM
// ─────────────────────────────────────────────────────────────

export const WOLF_EVOLUTION_CONFIG = {
  // XP thresholds for each level
  xpPerLevel: 100,

  // Evolution state details
  states: {
    Ghost: {
      name: 'Ghost Wolf',
      description: 'Your Wolf is materializing from the digital void',
      minLevel: 1,
      maxLevel: 5,
      visualStyle: 'Wireframe/hologram with scan lines',
      color: '#8B8B8B', // Gray
      animation: 'wolf_ghost',
    },
    Forming: {
      name: 'Forming Wolf',
      description: 'Your Wolf is taking shape, low-poly but solid',
      minLevel: 6,
      maxLevel: 15,
      visualStyle: 'Low-poly matte with flat shading',
      color: '#60A5FA', // Blue
      animation: 'wolf_forming',
    },
    Solid: {
      name: 'Solid Wolf',
      description: 'Your Wolf has fully materialized with detail and texture',
      minLevel: 16,
      maxLevel: 29,
      visualStyle: 'High-fidelity textured with smooth shading',
      color: '#34D399', // Green
      animation: 'wolf_solid',
    },
    Radiant: {
      name: 'Radiant Wolf',
      description: 'Your Wolf glows with inner power, radiating energy',
      minLevel: 30,
      maxLevel: Infinity,
      visualStyle: 'Emissive glow with particle effects',
      color: '#FBBF24', // Gold
      animation: 'wolf_radiant',
    },
  } as Record<WolfEvolution, {
    name: string;
    description: string;
    minLevel: number;
    maxLevel: number;
    visualStyle: string;
    color: string;
    animation: string;
  }>,
};

// Calculate wolf level from total XP
export function calculateWolfLevel(totalXp: number): number {
  return Math.floor(totalXp / WOLF_EVOLUTION_CONFIG.xpPerLevel) + 1;
}

// Calculate wolf evolution state from level
export function getWolfEvolution(level: number): WolfEvolution {
  if (level >= WOLF_EVOLUTION_THRESHOLDS.Radiant.minLevel) return 'Radiant';
  if (level >= WOLF_EVOLUTION_THRESHOLDS.Solid.minLevel) return 'Solid';
  if (level >= WOLF_EVOLUTION_THRESHOLDS.Forming.minLevel) return 'Forming';
  return 'Ghost';
}

// Calculate progress to next evolution
export function getEvolutionProgress(level: number): {
  currentEvolution: WolfEvolution;
  nextEvolution: WolfEvolution | null;
  progress: number; // 0-100
  levelsToNext: number;
} {
  const currentEvolution = getWolfEvolution(level);

  const evolutionOrder: WolfEvolution[] = ['Ghost', 'Forming', 'Solid', 'Radiant'];
  const currentIndex = evolutionOrder.indexOf(currentEvolution);
  const nextEvolution = currentIndex < evolutionOrder.length - 1
    ? evolutionOrder[currentIndex + 1]
    : null;

  if (!nextEvolution) {
    return {
      currentEvolution,
      nextEvolution: null,
      progress: 100,
      levelsToNext: 0,
    };
  }

  const currentMin = WOLF_EVOLUTION_THRESHOLDS[currentEvolution].minLevel;
  const nextMin = WOLF_EVOLUTION_THRESHOLDS[nextEvolution].minLevel;
  const range = nextMin - currentMin;
  const progress = Math.min(100, Math.floor(((level - currentMin) / range) * 100));
  const levelsToNext = nextMin - level;

  return {
    currentEvolution,
    nextEvolution,
    progress,
    levelsToNext,
  };
}

// ─────────────────────────────────────────────────────────────
// CHAIN (STREAK) SYSTEM
// ─────────────────────────────────────────────────────────────

export const CHAIN_CONFIG = {
  // Minimum exercises to maintain chain
  minExercisesForChain: 5, // Out of 6 (70% threshold)

  // Chain behaviors
  chainBehavior: {
    onMissedDay: 'freeze_then_break', // Use freeze if available, otherwise break
    onPartialWorkout: 'freeze_chain', // Chain doesn't increment, doesn't break
    onSkippedAll: 'break_chain',      // Chain breaks
    onRestDay: 'maintain',            // Chain maintains on scheduled rest days
  },

  // Chain freezes (safety net)
  maxFreezes: 2,
  freezeRefreshInterval: 'weekly', // Get 1 freeze back each week

  // Milestones
  milestones: [
    { days: 3, name: 'Spark', shards: 25, description: 'First connection established' },
    { days: 7, name: 'Link', shards: 50, description: 'One week unbroken' },
    { days: 14, name: 'Bond', shards: 100, description: 'Two weeks strong' },
    { days: 21, name: 'Tether', shards: 150, description: 'Three weeks committed' },
    { days: 30, name: 'Fusion', shards: 300, description: 'One month unstoppable' },
    { days: 42, name: 'Unbroken', shards: 500, description: 'Perfect program completion' },
  ],
};

// Check if chain should update based on workout completion
export function evaluateChainUpdate(
  exercisesCompleted: number,
  totalExercises: number = 6
): 'increment' | 'freeze' | 'break' {
  const completionRate = exercisesCompleted / totalExercises;

  if (completionRate >= 0.7) return 'increment'; // 5+ of 6
  if (completionRate > 0) return 'freeze';       // 1-4 of 6
  return 'break';                                 // 0 of 6
}

// Get chain milestone if reached
export function getChainMilestone(chainDays: number): typeof CHAIN_CONFIG.milestones[0] | null {
  return CHAIN_CONFIG.milestones.find(m => m.days === chainDays) || null;
}

// ─────────────────────────────────────────────────────────────
// SPIDER CHART (NEON TRINITY) TRACKING
// ─────────────────────────────────────────────────────────────

export const SPIDER_CHART_CONFIG = {
  // Categories (R3 → Neon mapping)
  axes: [
    {
      r3: 'Re-Engineer' as const,
      neon: 'Volt' as const,
      color: NEON_COLORS.Volt,
      position: 'top',
      label: 'Speed & Explosiveness',
    },
    {
      r3: 'Restore' as const,
      neon: 'Forge' as const,
      color: NEON_COLORS.Forge,
      position: 'bottom-left',
      label: 'Strength & Stability',
    },
    {
      r3: 'Release' as const,
      neon: 'Flow' as const,
      color: NEON_COLORS.Flow,
      position: 'bottom-right',
      label: 'Mobility & Flow',
    },
  ],

  // Max points per axis (scales visualization)
  maxPointsPerAxis: 1000,

  // Points awarded per exercise by category
  pointsPerExercise: {
    Flow: 10,   // Release exercises
    Forge: 10,  // Restore exercises
    Volt: 10,   // Re-Engineer exercises
  },
};

// Calculate spider chart data from frequency progress
export function calculateSpiderChartData(frequencyProgress: {
  Flow: number;
  Forge: number;
  Volt: number;
}): { axis: NeonFrequency; value: number; normalized: number }[] {
  const max = SPIDER_CHART_CONFIG.maxPointsPerAxis;

  return SPIDER_CHART_CONFIG.axes.map(axis => ({
    axis: axis.neon,
    value: frequencyProgress[axis.neon],
    normalized: Math.min(1, frequencyProgress[axis.neon] / max),
  }));
}

// ─────────────────────────────────────────────────────────────
// BADGE DEFINITIONS
// ─────────────────────────────────────────────────────────────

export const BADGES: Badge[] = [
  // ═══════════════════════════════════════════════════════════
  // CHAIN (STREAK) BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chain-3',
    name: 'Spark',
    description: '3-day chain established - first connection to the network',
    icon: '⚡',
    rarity: 'common',
    trigger: 'chain_milestone',
    requirement: 3,
  },
  {
    id: 'chain-7',
    name: 'Link',
    description: '7-day chain - one week unbroken',
    icon: '🔗',
    rarity: 'uncommon',
    trigger: 'chain_milestone',
    requirement: 7,
  },
  {
    id: 'chain-14',
    name: 'Bond',
    description: '14-day chain - two weeks of dedication',
    icon: '⛓️',
    rarity: 'rare',
    trigger: 'chain_milestone',
    requirement: 14,
  },
  {
    id: 'chain-21',
    name: 'Tether',
    description: '21-day chain - habit has formed',
    icon: '🔒',
    rarity: 'epic',
    trigger: 'chain_milestone',
    requirement: 21,
  },
  {
    id: 'chain-30',
    name: 'Fusion',
    description: '30-day chain - you and Wolf are one',
    icon: '💫',
    rarity: 'legendary',
    trigger: 'chain_milestone',
    requirement: 30,
  },
  {
    id: 'chain-42',
    name: 'Unbroken',
    description: '42-day perfect chain - complete program without breaking',
    icon: '🏆',
    rarity: 'legendary',
    trigger: 'chain_milestone',
    requirement: 42,
  },

  // ═══════════════════════════════════════════════════════════
  // PHASE COMPLETION BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'phase-foundation',
    name: 'Foundation Forged',
    description: 'Completed Phase 1: Foundation (Workouts 1-10)',
    icon: '🏗️',
    rarity: 'uncommon',
    trigger: 'phase_complete',
    requirement: 10,
  },
  {
    id: 'phase-progression',
    name: 'Progression Unlocked',
    description: 'Completed Phase 2: Progression (Workouts 11-20)',
    icon: '📈',
    rarity: 'rare',
    trigger: 'phase_complete',
    requirement: 20,
  },
  {
    id: 'phase-mastery',
    name: 'Mastery Achieved',
    description: 'Completed Phase 3: Mastery (Workouts 21-30)',
    icon: '👑',
    rarity: 'epic',
    trigger: 'phase_complete',
    requirement: 30,
  },
  {
    id: 'program-complete',
    name: 'Wolf Reborn',
    description: 'Completed the entire 42-Day Barefoot Reset',
    icon: '🐺',
    rarity: 'legendary',
    trigger: 'phase_complete',
    requirement: 30, // 30 workouts = program complete
  },

  // ═══════════════════════════════════════════════════════════
  // STRIKE WOD BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'strike-first',
    name: 'First Strike',
    description: 'Completed your first Strike WOD',
    icon: '⚡',
    rarity: 'common',
    trigger: 'strike_wod_complete',
    requirement: 1,
  },
  {
    id: 'strike-5',
    name: 'Lightning Rod',
    description: 'Completed 5 Strike WODs',
    icon: '🌩️',
    rarity: 'uncommon',
    trigger: 'strike_wod_complete',
    requirement: 5,
  },
  {
    id: 'strike-10',
    name: 'Storm Chaser',
    description: 'Completed 10 Strike WODs',
    icon: '⛈️',
    rarity: 'rare',
    trigger: 'strike_wod_complete',
    requirement: 10,
  },
  {
    id: 'strike-15',
    name: 'Thunder God',
    description: 'Completed all 15 regular Strike WODs',
    icon: '⚡👑',
    rarity: 'epic',
    trigger: 'strike_wod_complete',
    requirement: 15,
  },
  {
    id: 'strike-21',
    name: 'Electric Legend',
    description: 'Completed all 21 Strike WODs (15 regular + 6 milestone)',
    icon: '🌟',
    rarity: 'legendary',
    trigger: 'strike_wod_complete',
    requirement: 21,
  },

  // ═══════════════════════════════════════════════════════════
  // PERFECT WEEK BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'perfect-week-1',
    name: 'Perfect Week',
    description: 'Completed all 5 workouts in a single week',
    icon: '🌟',
    rarity: 'uncommon',
    trigger: 'perfect_week',
    requirement: 1,
  },
  {
    id: 'perfect-week-3',
    name: 'Perfect Streak',
    description: 'Completed 3 perfect weeks',
    icon: '✨',
    rarity: 'rare',
    trigger: 'perfect_week',
    requirement: 3,
  },
  {
    id: 'perfect-week-6',
    name: 'Perfect Program',
    description: 'All 6 weeks completed perfectly - 30/30 workouts',
    icon: '💎',
    rarity: 'legendary',
    trigger: 'perfect_week',
    requirement: 6,
  },

  // ═══════════════════════════════════════════════════════════
  // SHARD COLLECTION BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'shards-100',
    name: 'Shard Hunter',
    description: 'Collected 100 Glitch Shards',
    icon: '💎',
    rarity: 'common',
    trigger: 'total_shards',
    requirement: 100,
  },
  {
    id: 'shards-500',
    name: 'Shard Collector',
    description: 'Collected 500 Glitch Shards',
    icon: '💠',
    rarity: 'uncommon',
    trigger: 'total_shards',
    requirement: 500,
  },
  {
    id: 'shards-1000',
    name: 'Shard Master',
    description: 'Collected 1000 Glitch Shards',
    icon: '🔷',
    rarity: 'rare',
    trigger: 'total_shards',
    requirement: 1000,
  },
  {
    id: 'shards-2000',
    name: 'Shard Lord',
    description: 'Collected 2000 Glitch Shards - maximum dedication',
    icon: '💎👑',
    rarity: 'legendary',
    trigger: 'total_shards',
    requirement: 2000,
  },

  // ═══════════════════════════════════════════════════════════
  // WOLF EVOLUTION BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'wolf-forming',
    name: 'Wolf Forming',
    description: 'Your Wolf has begun to take shape (Level 6)',
    icon: '🐺',
    rarity: 'common',
    trigger: 'wolf_evolution',
    requirement: 6,
  },
  {
    id: 'wolf-solid',
    name: 'Wolf Solid',
    description: 'Your Wolf has fully materialized (Level 16)',
    icon: '🐺✨',
    rarity: 'rare',
    trigger: 'wolf_evolution',
    requirement: 16,
  },
  {
    id: 'wolf-radiant',
    name: 'Wolf Radiant',
    description: 'Your Wolf radiates pure energy (Level 30)',
    icon: '🐺🌟',
    rarity: 'legendary',
    trigger: 'wolf_evolution',
    requirement: 30,
  },

  // ═══════════════════════════════════════════════════════════
  // SPECIAL / SECRET BADGES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Completed a workout before 7 AM',
    icon: '🌅',
    rarity: 'uncommon',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Completed a workout after 9 PM',
    icon: '🦉',
    rarity: 'uncommon',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
  {
    id: 'double-down',
    name: 'Double Down',
    description: 'Completed 2 workouts in one day (catch-up)',
    icon: '⚡⚡',
    rarity: 'rare',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Recovered from System Instability to complete the program',
    icon: '🔧',
    rarity: 'rare',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
  {
    id: 'max-effort',
    name: 'Max Effort',
    description: 'Rated effort 10/10 on a Strike WOD',
    icon: '💀',
    rarity: 'uncommon',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
  {
    id: 'consistent-beast',
    name: 'Consistent Beast',
    description: 'Maintained effort rating 8+ on 10 consecutive Strike WODs',
    icon: '🔥',
    rarity: 'epic',
    trigger: 'phase_complete', // Special trigger handled in code
    requirement: 0,
  },
];

// Badge helper functions
export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByTrigger(trigger: BadgeTrigger): Badge[] {
  return BADGES.filter(b => b.trigger === trigger);
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}

// Check which badges are earned based on current stats
export function checkEarnedBadges(stats: {
  chainCurrent: number;
  chainBest: number;
  totalWorkouts: number;
  totalStrikeWods: number;
  perfectWeeks: number;
  totalShards: number;
  wolfLevel: number;
}): Badge[] {
  const earned: Badge[] = [];

  for (const badge of BADGES) {
    let isEarned = false;

    switch (badge.trigger) {
      case 'chain_milestone':
        isEarned = stats.chainBest >= badge.requirement;
        break;
      case 'phase_complete':
        isEarned = stats.totalWorkouts >= badge.requirement;
        break;
      case 'strike_wod_complete':
        isEarned = stats.totalStrikeWods >= badge.requirement;
        break;
      case 'perfect_week':
        isEarned = stats.perfectWeeks >= badge.requirement;
        break;
      case 'total_shards':
        isEarned = stats.totalShards >= badge.requirement;
        break;
      case 'wolf_evolution':
        isEarned = stats.wolfLevel >= badge.requirement;
        break;
    }

    if (isEarned) {
      earned.push(badge);
    }
  }

  return earned;
}

// ─────────────────────────────────────────────────────────────
// REWARD CALCULATION HELPERS
// ─────────────────────────────────────────────────────────────

export interface WorkoutRewardCalculation {
  baseShards: number;
  exercisesCompleted: number;
  exercisesSkipped: number;
  exerciseShards: number;
  chainBonus: number;
  strikeWodBonus: number;
  totalShards: number;
  xpEarned: number;
  chainUpdated: boolean;
  chainBroken: boolean;
  newBadges: Badge[];
}

export function calculateWorkoutRewards(params: {
  exercisesCompleted: number;
  exercisesSkipped: number;
  strikeWodAttempted: boolean;
  strikeWodEffortRating?: number;
  currentChain: number;
  existingBadgeIds: string[];
  totalShardsBefore: number;
  totalWorkoutsBefore: number;
  totalStrikeWodsBefore: number;
  perfectWeeksBefore: number;
  wolfLevelBefore: number;
}): WorkoutRewardCalculation {
  const {
    exercisesCompleted,
    exercisesSkipped,
    strikeWodAttempted,
    strikeWodEffortRating = 0,
    currentChain,
    existingBadgeIds,
    totalShardsBefore,
    totalWorkoutsBefore,
    totalStrikeWodsBefore,
    perfectWeeksBefore,
    wolfLevelBefore,
  } = params;

  // Calculate exercise shards
  const exerciseShards = exercisesCompleted * SHARD_ECONOMY.perExercise;

  // Calculate chain status
  const chainAction = evaluateChainUpdate(exercisesCompleted);
  const chainUpdated = chainAction === 'increment';
  const chainBroken = chainAction === 'break';
  const newChain = chainUpdated ? currentChain + 1 : (chainBroken ? 0 : currentChain);

  // Calculate chain bonus (if milestone reached)
  const milestone = chainUpdated ? getChainMilestone(newChain) : null;
  const chainBonus = milestone?.shards || 0;

  // Calculate Strike WOD bonus
  let strikeWodBonus = 0;
  if (strikeWodAttempted && strikeWodEffortRating > 0) {
    if (strikeWodEffortRating <= 4) {
      strikeWodBonus = SHARD_ECONOMY.strikeWodByEffort.low;
    } else if (strikeWodEffortRating <= 7) {
      strikeWodBonus = SHARD_ECONOMY.strikeWodByEffort.medium;
    } else {
      strikeWodBonus = SHARD_ECONOMY.strikeWodByEffort.high;
    }
  }

  // Total shards
  const totalShards = exerciseShards + chainBonus + strikeWodBonus;

  // XP calculation (flat rate per workout)
  const xpEarned = SHARD_ECONOMY.perWorkoutBase > 0 ? 100 : 0; // Always 100 XP per workout

  // Check for new badges
  const newStats = {
    chainCurrent: newChain,
    chainBest: Math.max(currentChain, newChain),
    totalWorkouts: totalWorkoutsBefore + 1,
    totalStrikeWods: strikeWodAttempted ? totalStrikeWodsBefore + 1 : totalStrikeWodsBefore,
    perfectWeeks: perfectWeeksBefore, // Would need to calculate based on week completion
    totalShards: totalShardsBefore + totalShards,
    wolfLevel: calculateWolfLevel((wolfLevelBefore - 1) * 100 + xpEarned),
  };

  const allEarnedBadges = checkEarnedBadges(newStats);
  const newBadges = allEarnedBadges.filter(b => !existingBadgeIds.includes(b.id));

  return {
    baseShards: SHARD_ECONOMY.perWorkoutBase,
    exercisesCompleted,
    exercisesSkipped,
    exerciseShards,
    chainBonus,
    strikeWodBonus,
    totalShards,
    xpEarned,
    chainUpdated,
    chainBroken,
    newBadges,
  };
}

// ─────────────────────────────────────────────────────────────
// GAMIFICATION STATS
// ─────────────────────────────────────────────────────────────

export const GAMIFICATION_STATS = {
  totalBadges: BADGES.length,
  badgesByRarity: {
    common: BADGES.filter(b => b.rarity === 'common').length,
    uncommon: BADGES.filter(b => b.rarity === 'uncommon').length,
    rare: BADGES.filter(b => b.rarity === 'rare').length,
    epic: BADGES.filter(b => b.rarity === 'epic').length,
    legendary: BADGES.filter(b => b.rarity === 'legendary').length,
  },
  chainMilestones: CHAIN_CONFIG.milestones.length,
  wolfEvolutions: Object.keys(WOLF_EVOLUTION_CONFIG.states).length,
  maxPossibleShards:
    (30 * 48) +                        // 30 workouts × 48 shards
    (15 * 25) +                        // 15 regular Strike WODs × 25 max
    (50 + 75 + 100 + 100 + 125 + 200) + // 6 milestone Strike WODs
    (25 + 50 + 100 + 150 + 300 + 500) + // Chain milestone bonuses
    500,                               // Completion bonus
  maxPossibleXp:
    (30 * 100) +                       // 30 workouts × 100 XP
    1000,                              // Completion bonus
};
