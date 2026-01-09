// ═══════════════════════════════════════════════════════════
// GAMIFICATION SYSTEM
// XP, Crystals, Streaks, Levels, Ranks
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

// XP rewards
export const XP_REWARDS = {
  WORKOUT_COMPLETE: 100,
  PERFECT_FORM_BONUS: 25,
  FIRST_WORKOUT_BONUS: 10,
  QUIZ_PASS: 20, // 70%+
  QUIZ_PERFECT: 35, // 100%
  STRIKEWOD_COMPLETE: 50,
  STRIKEWOD_PR: 30,
  EDUCATION_VIDEO: 15,
  INVITE_FRIEND: 50,
  STREAK_7_DAY: 100,
  STREAK_14_DAY: 200,
  STREAK_30_DAY: 500,
};

// Crystal rewards
export const CRYSTAL_REWARDS = {
  WORKOUT_COMPLETE: 5,
  PERFECT_FORM_BONUS: 3,
  STREAK_3_DAY: 25,
  STREAK_7_DAY: 50,
  STREAK_14_DAY: 100,
  STREAK_21_DAY: 150,
  STREAK_30_DAY: 300,
  STREAK_42_DAY: 500,
  LEVEL_UP: 20,
  RANK_UP: 100,
  STRIKEWOD_PR: 10,
  QUIZ_PERFECT: 5,
  ALL_DAILY_QUESTS: 15,
};

// Crystal costs
export const CRYSTAL_COSTS = {
  STREAK_FREEZE: 50,
  XP_BOOST: 75,
  CARD_PACK: 150,
  THEME_PACK: 200,
  STREAK_REPAIR_24H: 100,
  STREAK_REPAIR_48H: 200,
};

// Daily caps
export const DAILY_CAPS = {
  XP: 250,
  CRYSTALS: 50,
  QUIZZES_FOR_FULL_XP: 3,
  EDUCATION_VIDEOS: 3,
};

// Level thresholds (XP required for each level)
export const LEVEL_THRESHOLDS = [0, 200, 500, 900, 1500, 2300, 3300, 4500, 6000, 8000];

// Rank requirements
export const RANK_REQUIREMENTS = {
  pup: { level: 1, streak: 0 },
  hunter: { level: 3, streak: 7 },
  alpha: { level: 6, streak: 21 },
  apex: { level: 9, streak: 42 },
};

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function calculateLevel(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXpProgress(totalXp: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const level = calculateLevel(totalXp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 2000;
  const current = totalXp - currentThreshold;
  const required = nextThreshold - currentThreshold;

  return {
    current,
    required,
    percentage: Math.min(100, Math.round((current / required) * 100)),
  };
}

export function calculateRank(
  level: number,
  bestStreak: number,
): "pup" | "hunter" | "alpha" | "apex" {
  if (level >= RANK_REQUIREMENTS.apex.level && bestStreak >= RANK_REQUIREMENTS.apex.streak) {
    return "apex";
  }
  if (level >= RANK_REQUIREMENTS.alpha.level && bestStreak >= RANK_REQUIREMENTS.alpha.streak) {
    return "alpha";
  }
  if (level >= RANK_REQUIREMENTS.hunter.level && bestStreak >= RANK_REQUIREMENTS.hunter.streak) {
    return "hunter";
  }
  return "pup";
}

function isSameDay(date1: number, date2: number): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getDaysDifference(date1: number, date2: number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

export const getGamificationStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const level = calculateLevel(user.xpTotal);
    const xpProgress = getXpProgress(user.xpTotal);
    const rank = calculateRank(level, user.streakBest);

    return {
      level,
      xpTotal: user.xpTotal,
      xpProgress,
      rank,
      streakCurrent: user.streakCurrent,
      streakBest: user.streakBest,
      crystals: user.crystals,
    };
  },
});

export const getDailyProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const today = Date.now();
    const isToday = user.lastXpResetAt && isSameDay(user.lastXpResetAt, today);

    return {
      dailyXpEarned: isToday ? user.dailyXpEarned || 0 : 0,
      dailyCrystalsEarned: isToday ? user.dailyCrystalsEarned || 0 : 0,
      xpCap: DAILY_CAPS.XP,
      crystalsCap: DAILY_CAPS.CRYSTALS,
      canEarnMoreXp: isToday ? (user.dailyXpEarned || 0) < DAILY_CAPS.XP : true,
      canEarnMoreCrystals: isToday ? (user.dailyCrystalsEarned || 0) < DAILY_CAPS.CRYSTALS : true,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

// Award XP with daily cap enforcement
export const awardXp = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { userId, amount, reason }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const isNewDay = !user.lastXpResetAt || !isSameDay(user.lastXpResetAt, now);

    // Reset daily counters if new day
    const dailyXpEarned = isNewDay ? 0 : user.dailyXpEarned || 0;

    // Calculate capped XP
    const remainingCap = DAILY_CAPS.XP - dailyXpEarned;
    const cappedAmount = Math.min(amount, Math.max(0, remainingCap));

    if (cappedAmount <= 0) {
      console.log(`[Gamification] XP cap reached for user ${userId}`);
      return { awarded: 0, reason: "Daily XP cap reached", newTotal: user.xpTotal };
    }

    // Check for level up
    const oldLevel = calculateLevel(user.xpTotal);
    const newXpTotal = user.xpTotal + cappedAmount;
    const newLevel = calculateLevel(newXpTotal);
    const leveledUp = newLevel > oldLevel;

    // Update user
    await ctx.db.patch(userId, {
      xpTotal: newXpTotal,
      dailyXpEarned: dailyXpEarned + cappedAmount,
      lastXpResetAt: now,
    });

    // If leveled up, award crystals
    if (leveledUp) {
      await ctx.db.patch(userId, {
        crystals: user.crystals + CRYSTAL_REWARDS.LEVEL_UP,
      });
    }

    console.log(`[Gamification] Awarded ${cappedAmount} XP to user ${userId} for: ${reason}`);

    return {
      awarded: cappedAmount,
      reason,
      newTotal: newXpTotal,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    };
  },
});

// Award crystals with daily cap enforcement
export const awardCrystals = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { userId, amount, reason }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const isNewDay = !user.lastXpResetAt || !isSameDay(user.lastXpResetAt, now);

    // Reset daily counters if new day
    const dailyCrystalsEarned = isNewDay ? 0 : user.dailyCrystalsEarned || 0;

    // Calculate capped crystals
    const remainingCap = DAILY_CAPS.CRYSTALS - dailyCrystalsEarned;
    const cappedAmount = Math.min(amount, Math.max(0, remainingCap));

    if (cappedAmount <= 0) {
      console.log(`[Gamification] Crystal cap reached for user ${userId}`);
      return { awarded: 0, reason: "Daily crystal cap reached", newTotal: user.crystals };
    }

    // Update user
    await ctx.db.patch(userId, {
      crystals: user.crystals + cappedAmount,
      dailyCrystalsEarned: dailyCrystalsEarned + cappedAmount,
    });

    console.log(`[Gamification] Awarded ${cappedAmount} crystals to user ${userId} for: ${reason}`);

    return {
      awarded: cappedAmount,
      reason,
      newTotal: user.crystals + cappedAmount,
    };
  },
});

// Complete workout with all rewards
export const completeWorkout = mutation({
  args: {
    userId: v.id("users"),
    enrollmentId: v.id("enrollments"),
    dayNumber: v.number(),
    durationSeconds: v.number(),
    perfectForm: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, enrollmentId, dayNumber, durationSeconds, perfectForm }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const enrollment = await ctx.db.get(enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");

    // Validate workout duration (min 5 minutes)
    if (durationSeconds < 300) {
      throw new Error("Workout too short to count");
    }

    const now = Date.now();

    // Check if this is first workout of the day
    const isFirstWorkoutToday = !user.lastWorkoutAt || !isSameDay(user.lastWorkoutAt, now);

    // Calculate XP
    let xpToAward = XP_REWARDS.WORKOUT_COMPLETE;
    let crystalsToAward = CRYSTAL_REWARDS.WORKOUT_COMPLETE;
    const bonuses: string[] = [];

    if (perfectForm) {
      xpToAward += XP_REWARDS.PERFECT_FORM_BONUS;
      crystalsToAward += CRYSTAL_REWARDS.PERFECT_FORM_BONUS;
      bonuses.push("Perfect Form");
    }

    if (isFirstWorkoutToday) {
      xpToAward += XP_REWARDS.FIRST_WORKOUT_BONUS;
      bonuses.push("First Workout");
    }

    // Update streak
    const streakResult = await updateStreak(ctx, user, now);

    // Check for streak milestone rewards
    const streakMilestones = checkStreakMilestones(streakResult.newStreak, user.streakCurrent);

    // Award XP
    const xpResult = await awardXpInternal(ctx, userId, user, xpToAward, now);

    // Award crystals
    const crystalResult = await awardCrystalsInternal(ctx, userId, user, crystalsToAward, now);

    // Award streak milestone crystals
    for (const milestone of streakMilestones) {
      await awardCrystalsInternal(ctx, userId, user, milestone.crystals, now);
    }

    // Record workout completion
    await ctx.db.insert("workoutCompletions", {
      userId,
      enrollmentId,
      dayNumber,
      completedAt: now,
      xpEarned: xpResult.awarded,
      durationSeconds,
    });

    // Update enrollment progress
    await ctx.db.patch(enrollmentId, {
      currentDay: Math.max(enrollment.currentDay, dayNumber + 1),
    });

    // Update user's last workout timestamp
    await ctx.db.patch(userId, {
      lastWorkoutAt: now,
    });

    return {
      xpAwarded: xpResult.awarded,
      crystalsAwarded: crystalResult.awarded,
      bonuses,
      streak: streakResult.newStreak,
      streakMilestones,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
    };
  },
});

// Update streak logic
async function updateStreak(ctx: any, user: any, now: number) {
  const lastWorkoutAt = user.lastWorkoutAt || 0;
  const daysSinceLastWorkout = getDaysDifference(lastWorkoutAt, now);

  let newStreak = user.streakCurrent;
  let streakBroken = false;

  if (daysSinceLastWorkout === 0) {
    // Already worked out today, no change
  } else if (daysSinceLastWorkout === 1) {
    // Perfect - continue streak
    newStreak = user.streakCurrent + 1;
  } else if (daysSinceLastWorkout === 2 && user.streakFreezes > 0) {
    // Missed 1 day but have freeze
    newStreak = user.streakCurrent + 1;
    await ctx.db.patch(user._id, {
      streakFreezes: user.streakFreezes - 1,
    });
  } else if (daysSinceLastWorkout > 1) {
    // Streak broken
    newStreak = 1;
    streakBroken = true;
  } else {
    // First workout ever
    newStreak = 1;
  }

  const newBest = Math.max(user.streakBest, newStreak);

  await ctx.db.patch(user._id, {
    streakCurrent: newStreak,
    streakBest: newBest,
  });

  return { newStreak, newBest, streakBroken };
}

// Check for streak milestone rewards
function checkStreakMilestones(
  newStreak: number,
  oldStreak: number,
): Array<{ days: number; crystals: number; xp: number }> {
  const milestones = [
    { days: 3, crystals: CRYSTAL_REWARDS.STREAK_3_DAY, xp: 0 },
    { days: 7, crystals: CRYSTAL_REWARDS.STREAK_7_DAY, xp: XP_REWARDS.STREAK_7_DAY },
    { days: 14, crystals: CRYSTAL_REWARDS.STREAK_14_DAY, xp: XP_REWARDS.STREAK_14_DAY },
    { days: 21, crystals: CRYSTAL_REWARDS.STREAK_21_DAY, xp: 0 },
    { days: 30, crystals: CRYSTAL_REWARDS.STREAK_30_DAY, xp: XP_REWARDS.STREAK_30_DAY },
    { days: 42, crystals: CRYSTAL_REWARDS.STREAK_42_DAY, xp: 0 },
  ];

  return milestones.filter((m) => newStreak >= m.days && oldStreak < m.days);
}

// Internal XP award (reusable)
async function awardXpInternal(ctx: any, userId: any, user: any, amount: number, now: number) {
  const isNewDay = !user.lastXpResetAt || !isSameDay(user.lastXpResetAt, now);
  const dailyXpEarned = isNewDay ? 0 : user.dailyXpEarned || 0;
  const remainingCap = DAILY_CAPS.XP - dailyXpEarned;
  const cappedAmount = Math.min(amount, Math.max(0, remainingCap));

  const oldLevel = calculateLevel(user.xpTotal);
  const newXpTotal = user.xpTotal + cappedAmount;
  const newLevel = calculateLevel(newXpTotal);
  const leveledUp = newLevel > oldLevel;

  await ctx.db.patch(userId, {
    xpTotal: newXpTotal,
    dailyXpEarned: dailyXpEarned + cappedAmount,
    lastXpResetAt: now,
  });

  return { awarded: cappedAmount, leveledUp, newLevel: leveledUp ? newLevel : undefined };
}

// Internal crystals award (reusable)
async function awardCrystalsInternal(
  ctx: any,
  userId: any,
  user: any,
  amount: number,
  now: number,
) {
  const isNewDay = !user.lastXpResetAt || !isSameDay(user.lastXpResetAt, now);
  const dailyCrystalsEarned = isNewDay ? 0 : user.dailyCrystalsEarned || 0;
  const remainingCap = DAILY_CAPS.CRYSTALS - dailyCrystalsEarned;
  const cappedAmount = Math.min(amount, Math.max(0, remainingCap));

  // Refresh user to get latest crystals value
  const freshUser = await ctx.db.get(userId);

  await ctx.db.patch(userId, {
    crystals: (freshUser?.crystals || 0) + cappedAmount,
    dailyCrystalsEarned: dailyCrystalsEarned + cappedAmount,
  });

  return { awarded: cappedAmount };
}

// Purchase streak freeze
export const purchaseStreakFreeze = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const cost = CRYSTAL_COSTS.STREAK_FREEZE;
    const maxFreezes = 2;

    if (user.crystals < cost) {
      throw new Error("Not enough crystals");
    }

    if ((user.streakFreezes || 0) >= maxFreezes) {
      throw new Error("Already at max streak freezes");
    }

    await ctx.db.patch(userId, {
      crystals: user.crystals - cost,
      streakFreezes: (user.streakFreezes || 0) + 1,
    });

    return {
      success: true,
      newCrystals: user.crystals - cost,
      freezes: (user.streakFreezes || 0) + 1,
    };
  },
});

// Repair broken streak
export const repairStreak = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const lastWorkoutAt = user.lastWorkoutAt || 0;
    const hoursSinceLastWorkout = (now - lastWorkoutAt) / (1000 * 60 * 60);

    let cost = 0;
    if (hoursSinceLastWorkout <= 24) {
      throw new Error("Streak is not broken yet");
    } else if (hoursSinceLastWorkout <= 48) {
      cost = CRYSTAL_COSTS.STREAK_REPAIR_24H;
    } else if (hoursSinceLastWorkout <= 72) {
      cost = CRYSTAL_COSTS.STREAK_REPAIR_48H;
    } else {
      throw new Error("Too late to repair streak");
    }

    if (user.crystals < cost) {
      throw new Error("Not enough crystals");
    }

    await ctx.db.patch(userId, {
      crystals: user.crystals - cost,
      // Don't restore streak yet - they need to complete a workout
    });

    return { success: true, cost, newCrystals: user.crystals - cost };
  },
});
