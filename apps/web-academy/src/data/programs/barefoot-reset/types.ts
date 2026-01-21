// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET 42-DAY PROGRAM - TYPE DEFINITIONS
// "The Wolf Den" - Elite Training for Every Kid, Everywhere
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// R3 FRAMEWORK → NEON TRINITY MAPPING
// ─────────────────────────────────────────────────────────────
// Release   → Flow  (Purple) - Mobility, loosening, range of motion
// Restore   → Forge (Orange) - Stability, strength, foundational
// Re-Engineer → Volt (Cyan) - Explosiveness, coordination, speed

export type R3Category = 'Release' | 'Restore' | 'Re-Engineer';
export type NeonFrequency = 'Flow' | 'Forge' | 'Volt';

export const R3_TO_NEON: Record<R3Category, NeonFrequency> = {
  'Release': 'Flow',
  'Restore': 'Forge',
  'Re-Engineer': 'Volt',
};

export const NEON_COLORS: Record<NeonFrequency, string> = {
  'Flow': '#A855F7',   // Purple
  'Forge': '#F97316',  // Orange
  'Volt': '#06B6D4',   // Cyan
};

// ─────────────────────────────────────────────────────────────
// EXERCISE DEFINITION
// ─────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;                          // Unique identifier (slug)
  name: string;                        // Display name
  category: R3Category;                // R3 Framework category
  frequency: NeonFrequency;            // Mapped Neon Trinity frequency

  // Video content (Cloudflare Stream)
  videoUrl: string;                    // HLS manifest URL (.m3u8)
  thumbnailUrl?: string;               // Preview image

  // Coaching content
  description: string;                 // Exercise overview
  cues: string[];                      // Coaching cues (shown during exercise)
  tips?: string[];                     // Form tips
  progressions?: string[];             // How to make it harder

  // Timing defaults (can be overridden per-workout)
  defaultDurationSec: number;          // Base time in seconds
  defaultRounds: number;               // Number of rounds

  // Metadata
  equipment?: string[];                // Required equipment (empty = bodyweight)
  targetAreas?: string[];              // Body areas targeted
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ─────────────────────────────────────────────────────────────
// WORKOUT (MISSION) DEFINITION
// ─────────────────────────────────────────────────────────────

export interface WorkoutExercise {
  exerciseId: string;                  // Reference to Exercise.id
  durationSec: number;                 // Duration for this workout
  rounds: number;                      // Rounds for this workout
  side?: 'left' | 'right' | 'both' | 'alternate';
}

export interface Workout {
  workoutNumber: number;               // 1-30
  phase: WorkoutPhase;                 // Foundation, Progression, Mastery

  // Mission framing (Wolf Protocol terminology)
  missionName: string;                 // e.g., "Foundation Fundamentals"
  missionSubtitle?: string;            // Brief description

  // Exercises grouped by R3 category
  release: WorkoutExercise[];          // 2 exercises
  restore: WorkoutExercise[];          // 2 exercises
  reengineer: WorkoutExercise[];       // 2 exercises

  // Computed totals
  totalDurationSec: number;            // Sum of all exercise times
  estimatedMinutes: number;            // Rounded for display

  // Rewards
  shardsReward: number;                // ~8 per exercise = ~48 per workout
  xpReward: number;                    // XP earned

  // Strike WOD (optional bonus challenge)
  strikeWod?: StrikeWod;
}

export type WorkoutPhase = 'Foundation' | 'Progression' | 'Mastery';

export const PHASE_RANGES: Record<WorkoutPhase, { start: number; end: number }> = {
  'Foundation': { start: 1, end: 10 },
  'Progression': { start: 11, end: 20 },
  'Mastery': { start: 21, end: 30 },
};

// ─────────────────────────────────────────────────────────────
// STRIKE WOD (OPTIONAL BONUS CHALLENGE)
// ─────────────────────────────────────────────────────────────

export interface StrikeWodExercise {
  name: string;
  reps: number;
}

export interface StrikeWod {
  durationMinutes: number;             // 6, 8, 10, 12, or 14 minutes
  format: 'AMRAP';                     // As Many Rounds As Possible
  exercises: StrikeWodExercise[];      // 4 exercises per Strike WOD
  instructions: string;

  // Rewards (bonus on top of regular workout)
  bonusShards: number;
  bonusXp: number;
}

// ─────────────────────────────────────────────────────────────
// CALENDAR DAY (42-DAY SCHEDULE)
// ─────────────────────────────────────────────────────────────

export type DayType = 'workout' | 'rest' | 'milestone';

export interface CalendarDay {
  dayNumber: number;                   // 1-42
  type: DayType;
  workoutNumber?: number;              // Only for workout days (1-30)
  weekNumber: number;                  // 1-6
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

  // Weekly milestone Strike WOD (days 7, 14, 21, 28, 35, 42)
  isMilestoneDay: boolean;
  milestoneStrikeWod?: StrikeWod;      // Harder/special Strike WOD
}

// ─────────────────────────────────────────────────────────────
// USER PROGRESS
// ─────────────────────────────────────────────────────────────

export interface WorkoutCompletion {
  workoutNumber: number;
  completedAt: number;                 // Timestamp
  durationSec: number;                 // Actual time taken
  exercisesCompleted: number;          // Out of 6
  shardsEarned: number;
  xpEarned: number;

  // Strike WOD (if attempted)
  strikeWodAttempted: boolean;
  strikeWodEffortRating?: number;      // 1-10 self-reported
  strikeWodBonusShards?: number;
  strikeWodBonusXp?: number;
}

export interface UserProgress {
  enrollmentId: string;
  userId: string;

  // Current state
  currentWorkout: number;              // Next workout to complete (1-30)
  currentCalendarDay: number;          // Current day in 42-day calendar

  // Completions
  completedWorkouts: WorkoutCompletion[];
  totalWorkoutsCompleted: number;

  // Chain tracking (renamed from streak)
  chainCurrent: number;                // Consecutive workout days
  chainBest: number;                   // Best chain achieved
  chainFreezes: number;                // Available freezes (max 2)
  lastWorkoutDate?: string;            // ISO date string

  // Spider Chart data (Neon Trinity)
  frequencyProgress: {
    Flow: number;                      // Release exercises completed
    Forge: number;                     // Restore exercises completed
    Volt: number;                      // Re-Engineer exercises completed
  };

  // Rewards accumulated
  totalShards: number;
  totalXp: number;
  crystals: number;                    // 100 shards = 1 crystal

  // Wolf evolution
  wolfLevel: number;                   // Calculated from XP
  wolfEvolution: WolfEvolution;

  // Completion rewards
  programCompleted: boolean;
  completedAt?: number;
  creditEarned: number;                // $88 on completion
  creditCode?: string;
  certificateUrl?: string;
}

export type WolfEvolution = 'Ghost' | 'Forming' | 'Solid' | 'Radiant';

export const WOLF_EVOLUTION_THRESHOLDS: Record<WolfEvolution, { minLevel: number; maxLevel: number }> = {
  'Ghost': { minLevel: 1, maxLevel: 5 },
  'Forming': { minLevel: 6, maxLevel: 15 },
  'Solid': { minLevel: 16, maxLevel: 29 },
  'Radiant': { minLevel: 30, maxLevel: Infinity },
};

// ─────────────────────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;                        // Emoji or icon name
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Unlock conditions
  trigger: BadgeTrigger;
  requirement: number;                 // Value needed to unlock
}

export type BadgeTrigger =
  | 'chain_milestone'                  // Chain length (3, 7, 14, 21, 30)
  | 'phase_complete'                   // Workout 10, 20, 30
  | 'strike_wod_complete'              // Complete N Strike WODs
  | 'perfect_week'                     // 5/5 workouts in a week
  | 'total_shards'                     // Accumulate N shards
  | 'wolf_evolution';                  // Reach evolution state

// ─────────────────────────────────────────────────────────────
// PROGRAM CONFIG
// ─────────────────────────────────────────────────────────────

export interface ProgramConfig {
  slug: 'barefoot-reset';
  name: string;
  description: string;

  // Structure
  totalWorkouts: 30;
  totalCalendarDays: 42;
  workoutsPerWeek: 5;
  restDaysPerWeek: 2;                  // Sat, Sun

  // Phases
  phases: {
    name: WorkoutPhase;
    workouts: number;                  // 10 per phase
    description: string;
  }[];

  // Rewards
  shardsPerExercise: number;           // ~8
  xpPerWorkout: number;                // ~100
  completionBonus: {
    shards: number;
    xp: number;
    credit: number;                    // $88
  };

  // Chain milestones
  chainMilestones: {
    days: number;
    shards: number;
    badgeId: string;
  }[];

  // Placeholder video (for MVP)
  placeholderVideoUrl: string;
}

export const PROGRAM_CONFIG: ProgramConfig = {
  slug: 'barefoot-reset',
  name: 'The 42-Day Barefoot Reset',
  description: 'Build bulletproof feet. Eliminate shin splints. Unlock instant speed.',

  totalWorkouts: 30,
  totalCalendarDays: 42,
  workoutsPerWeek: 5,
  restDaysPerWeek: 2,

  phases: [
    {
      name: 'Foundation',
      workouts: 10,
      description: 'Restore range of motion and eliminate pain',
    },
    {
      name: 'Progression',
      workouts: 10,
      description: 'Build steel ankles and load capacity',
    },
    {
      name: 'Mastery',
      workouts: 10,
      description: 'Explosive power and sport transfer',
    },
  ],

  shardsPerExercise: 8,
  xpPerWorkout: 100,
  completionBonus: {
    shards: 500,
    xp: 1000,
    credit: 88,
  },

  chainMilestones: [
    { days: 3, shards: 25, badgeId: 'chain-3' },
    { days: 7, shards: 50, badgeId: 'chain-7' },
    { days: 14, shards: 100, badgeId: 'chain-14' },
    { days: 21, shards: 150, badgeId: 'chain-21' },
    { days: 30, shards: 300, badgeId: 'chain-30' },
  ],

  placeholderVideoUrl: 'https://customer-tuqbcyjvhe5ykkrx.cloudflarestream.com/2abab0f03a4fce3728c40b9e238e1580/manifest/video.m3u8',
};
