// ═══════════════════════════════════════════════════════════
// BASKETBALL CHASSIS - Program Entry Point
// 8-Day Foundation Program for Basketball Athletes
// ═══════════════════════════════════════════════════════════

export * from './types';
export { DAYS } from './days';

import type { ProgramConfig, WorkoutTheme, WorkoutDay } from './types';
import { DAYS } from './days';

/**
 * Basketball Chassis Program Configuration
 */
export const PROGRAM: ProgramConfig = {
  slug: 'basketball-chassis',
  name: 'Basketball Chassis',
  description: '8-day foundation program for basketball athletes. Build mobility, stability, and explosive power.',
  totalDays: 8,
  dailyDuration: 15,
  equipment: [], // Bodyweight only
  targetAudience: 'Youth basketball athletes (ages 10-18)',
  xpPerDay: 150,
  crystalsPerDay: 10,
  completionBonusXp: 200,
  themeColors: {
    RELEASE: '#10B981',      // Emerald - mobility
    RESTORE: '#3B82F6',      // Blue - strength
    'RE-ENGINEER': '#8B5CF6', // Purple - stability
    INTEGRATE: '#F59E0B',    // Amber - power
  } as Record<WorkoutTheme, string>,
};

/**
 * Get theme color for a workout theme
 */
export function getThemeColor(theme: WorkoutTheme): string {
  return PROGRAM.themeColors[theme];
}

/**
 * Get theme label for display
 */
export function getThemeLabel(theme: WorkoutTheme): string {
  switch (theme) {
    case 'RELEASE':
      return 'Release';
    case 'RESTORE':
      return 'Restore';
    case 'RE-ENGINEER':
      return 'Re-Engineer';
    case 'INTEGRATE':
      return 'Integrate';
  }
}

/**
 * Calculate total duration for a day's exercises
 */
export function calculateDayDuration(exercises: { duration: number }[]): number {
  const totalSeconds = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  return Math.ceil(totalSeconds / 60);
}

/**
 * Get a specific day's workout by day number
 */
export function getDay(dayNumber: number): WorkoutDay | undefined {
  return DAYS.find((day) => day.dayNumber === dayNumber);
}
