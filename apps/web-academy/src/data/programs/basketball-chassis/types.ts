// ═══════════════════════════════════════════════════════════
// BASKETBALL CHASSIS - Type Definitions
// 8-Day Foundation Program for Basketball Athletes
// ═══════════════════════════════════════════════════════════

/**
 * R3 Framework phases for workout progression
 */
export type WorkoutTheme = 'RELEASE' | 'RESTORE' | 'RE-ENGINEER' | 'INTEGRATE';

/**
 * Exercise side indication for unilateral movements
 */
export type ExerciseSide = 'left' | 'right' | 'both' | 'alternate';

/**
 * Individual exercise within a workout day
 */
export interface Exercise {
  /** Unique identifier (e.g., "bball-d1-e1") */
  id: string;

  /** Display name (e.g., "Ankle Circles") */
  name: string;

  /** Duration in seconds */
  duration: number;

  /** Number of reps (if rep-based instead of time-based) */
  reps?: number;

  /** Number of sets (typically 1 for circuit-style) */
  sets: number;

  /** Which side(s) to perform */
  side?: ExerciseSide;

  /** Required equipment (empty array = bodyweight) */
  equipment: string[];

  /** URL to exercise demonstration video */
  videoUrl: string;

  /** URL to thumbnail image for preview */
  thumbnailUrl: string;

  /** Primary coaching cue to display */
  cue: string;

  /** Additional tips/form reminders */
  tips: string[];
}

/**
 * A single day's workout in the program
 */
export interface WorkoutDay {
  /** Day number (1-8) */
  dayNumber: number;

  /** R3 Framework theme */
  theme: WorkoutTheme;

  /** Day title (e.g., "Unlock Your Ankles") */
  title: string;

  /** Subtitle/description */
  subtitle: string;

  /** Total duration in minutes */
  duration: number;

  /** Main exercises for this day */
  exercises: Exercise[];
}

/**
 * Program metadata and configuration
 */
export interface ProgramConfig {
  /** URL-safe identifier */
  slug: string;

  /** Display name */
  name: string;

  /** Short description */
  description: string;

  /** Total number of days */
  totalDays: number;

  /** Duration per day in minutes */
  dailyDuration: number;

  /** Equipment requirements */
  equipment: string[];

  /** Target audience */
  targetAudience: string;

  /** XP awarded per day completion */
  xpPerDay: number;

  /** Crystals awarded per day completion */
  crystalsPerDay: number;

  /** Bonus XP for completing entire program */
  completionBonusXp: number;

  /** Theme color mapping */
  themeColors: Record<WorkoutTheme, string>;
}

/**
 * User's progress in a program
 */
export interface ProgramProgress {
  /** Days completed (array of day numbers) */
  completedDays: number[];

  /** Current day (next to complete) */
  currentDay: number;

  /** Whether program is fully completed */
  isComplete: boolean;

  /** Total XP earned from this program */
  totalXpEarned: number;
}
