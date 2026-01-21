// ═══════════════════════════════════════════════════════════
// BAREFOOT RESET - 42-DAY CALENDAR SCHEDULE
// 30 Workouts spread across 42 calendar days (5 on, 2 off)
// ═══════════════════════════════════════════════════════════

import { CalendarDay, StrikeWod } from './types';

// ─────────────────────────────────────────────────────────────
// WEEKLY MILESTONE STRIKE WODS (Days 7, 14, 21, 28, 35, 42)
// These are special/harder Strike WODs at the end of each week
// ─────────────────────────────────────────────────────────────

export const MILESTONE_STRIKE_WODS: Record<number, StrikeWod> = {
  7: {
    durationMinutes: 8,
    format: 'AMRAP',
    exercises: [
      { name: 'Depth Jumps (Vertical)', reps: 5 },
      { name: 'Skater Squats', reps: 8 },
      { name: 'Side-Lying Leg Lifts', reps: 12 },
      { name: 'Low Squat Soleus Raises', reps: 20 },
    ],
    instructions: 'WEEK 1 MILESTONE: As many rounds as possible in 8 minutes. Show what you learned!',
    bonusShards: 50,
    bonusXp: 100,
  },
  14: {
    durationMinutes: 10,
    format: 'AMRAP',
    exercises: [
      { name: 'Broad Jumps', reps: 5 },
      { name: 'Lateral Bounds', reps: 8 },
      { name: 'Knee Drive Crunches', reps: 12 },
      { name: 'Single-Leg Calf Raises', reps: 20 },
    ],
    instructions: 'WEEK 2 MILESTONE: As many rounds as possible in 10 minutes. Push your limits!',
    bonusShards: 75,
    bonusXp: 150,
  },
  21: {
    durationMinutes: 12,
    format: 'AMRAP',
    exercises: [
      { name: 'Jump Squats', reps: 5 },
      { name: 'Floating Heel Split Squats', reps: 8 },
      { name: 'Flutter Kicks', reps: 12 },
      { name: 'Massai Jumps', reps: 20 },
    ],
    instructions: 'WEEK 3 MILESTONE: Foundation Phase Complete! 12 minutes of glory.',
    bonusShards: 100,
    bonusXp: 200,
  },
  28: {
    durationMinutes: 12,
    format: 'AMRAP',
    exercises: [
      { name: 'Tuck Jumps', reps: 5 },
      { name: 'Forefoot RFESS', reps: 8 },
      { name: 'Shoulder Taps', reps: 12 },
      { name: 'Single-Leg Vertical Bounds', reps: 20 },
    ],
    instructions: 'WEEK 4 MILESTONE: Steel ankles forming. 12 minutes, no breaks!',
    bonusShards: 100,
    bonusXp: 200,
  },
  35: {
    durationMinutes: 14,
    format: 'AMRAP',
    exercises: [
      { name: 'Depth Jumps (Vertical)', reps: 5 },
      { name: 'Skater Squats', reps: 8 },
      { name: 'Plank Walk-Ups', reps: 12 },
      { name: 'Staggered Stance Massai Jumps', reps: 20 },
    ],
    instructions: 'WEEK 5 MILESTONE: Progression Phase Complete! 14 minutes of power.',
    bonusShards: 125,
    bonusXp: 250,
  },
  42: {
    durationMinutes: 15,
    format: 'AMRAP',
    exercises: [
      { name: 'Broad Jumps', reps: 6 },
      { name: 'Floating Heel Split Squats', reps: 10 },
      { name: 'Knee Drive Crunches', reps: 15 },
      { name: 'Massai Jumps', reps: 25 },
    ],
    instructions: 'FINAL MILESTONE: 42-Day Complete! 15 minutes - leave nothing on the floor!',
    bonusShards: 200,
    bonusXp: 500,
  },
};

// ─────────────────────────────────────────────────────────────
// 42-DAY CALENDAR
// Mon-Fri = Workout Days, Sat-Sun = Rest Days
// ─────────────────────────────────────────────────────────────

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function generateCalendar(): CalendarDay[] {
  const calendar: CalendarDay[] = [];
  let workoutNumber = 1;

  for (let day = 1; day <= 42; day++) {
    const weekNumber = Math.ceil(day / 7);
    const dayOfWeekIndex = (day - 1) % 7;
    const dayOfWeek = DAY_NAMES[dayOfWeekIndex];
    const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
    const isMilestoneDay = day % 7 === 0; // Days 7, 14, 21, 28, 35, 42

    const calendarDay: CalendarDay = {
      dayNumber: day,
      type: isWeekend ? 'rest' : (isMilestoneDay ? 'milestone' : 'workout'),
      weekNumber,
      dayOfWeek,
      isMilestoneDay,
    };

    // Assign workout number for workout days
    if (!isWeekend && workoutNumber <= 30) {
      calendarDay.workoutNumber = workoutNumber;
      workoutNumber++;
    }

    // Add milestone Strike WOD for milestone days
    if (isMilestoneDay && MILESTONE_STRIKE_WODS[day]) {
      calendarDay.milestoneStrikeWod = MILESTONE_STRIKE_WODS[day];
    }

    calendar.push(calendarDay);
  }

  return calendar;
}

export const CALENDAR: CalendarDay[] = generateCalendar();

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function getCalendarDay(dayNumber: number): CalendarDay | undefined {
  return CALENDAR.find(d => d.dayNumber === dayNumber);
}

export function getCalendarDayByWorkout(workoutNumber: number): CalendarDay | undefined {
  return CALENDAR.find(d => d.workoutNumber === workoutNumber);
}

export function getWeekDays(weekNumber: number): CalendarDay[] {
  return CALENDAR.filter(d => d.weekNumber === weekNumber);
}

export function getWorkoutDays(): CalendarDay[] {
  return CALENDAR.filter(d => d.type === 'workout' || d.type === 'milestone');
}

export function getRestDays(): CalendarDay[] {
  return CALENDAR.filter(d => d.type === 'rest');
}

export function getMilestoneDays(): CalendarDay[] {
  return CALENDAR.filter(d => d.isMilestoneDay);
}

// ─────────────────────────────────────────────────────────────
// CALENDAR STATS
// ─────────────────────────────────────────────────────────────

export const CALENDAR_STATS = {
  totalDays: CALENDAR.length,
  workoutDays: getWorkoutDays().length,
  restDays: getRestDays().length,
  milestoneDays: getMilestoneDays().length,
  weeks: 6,
  workoutsPerWeek: 5,
};

// ─────────────────────────────────────────────────────────────
// CALENDAR VISUALIZATION
// Week-by-week breakdown for debugging/display
// ─────────────────────────────────────────────────────────────

export const CALENDAR_BY_WEEK = [
  {
    week: 1,
    theme: 'Foundation Start',
    days: getWeekDays(1),
    workouts: [1, 2, 3, 4, 5],
    milestoneDay: 7,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[7],
  },
  {
    week: 2,
    theme: 'Foundation Core',
    days: getWeekDays(2),
    workouts: [6, 7, 8, 9, 10],
    milestoneDay: 14,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[14],
  },
  {
    week: 3,
    theme: 'Foundation Complete / Progression Start',
    days: getWeekDays(3),
    workouts: [11, 12, 13, 14, 15],
    milestoneDay: 21,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[21],
  },
  {
    week: 4,
    theme: 'Progression Core',
    days: getWeekDays(4),
    workouts: [16, 17, 18, 19, 20],
    milestoneDay: 28,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[28],
  },
  {
    week: 5,
    theme: 'Progression Complete / Mastery Start',
    days: getWeekDays(5),
    workouts: [21, 22, 23, 24, 25],
    milestoneDay: 35,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[35],
  },
  {
    week: 6,
    theme: 'Mastery Complete',
    days: getWeekDays(6),
    workouts: [26, 27, 28, 29, 30],
    milestoneDay: 42,
    milestoneStrikeWod: MILESTONE_STRIKE_WODS[42],
  },
];
