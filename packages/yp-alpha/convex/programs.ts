// ═══════════════════════════════════════════════════════════
// PROGRAMS - Convex Functions
// Access control and progress tracking for paid programs
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Check if user has access to a specific program
 * Returns access status and completed days
 */
export const getProgramAccess = query({
  args: {
    userId: v.optional(v.id("users")),
    programSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) {
      return {
        hasAccess: false,
        completedDays: [],
        currentDay: 1,
        isComplete: false,
      };
    }

    // Get user to check subscription status
    const user = await ctx.db.get(userId);
    if (!user) {
      return {
        hasAccess: false,
        completedDays: [],
        currentDay: 1,
        isComplete: false,
      };
    }

    // Pro subscribers have access to all programs
    if (user.subscriptionStatus === "pro") {
      const completedDays = await getCompletedDays(ctx, userId, args.programSlug);
      return {
        hasAccess: true,
        completedDays,
        currentDay: completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1,
        isComplete: completedDays.length >= 8,
      };
    }

    // Check for specific program entitlement
    const entitlement = await ctx.db
      .query("entitlements")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", userId!).eq("productSlug", args.programSlug)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!entitlement) {
      return {
        hasAccess: false,
        completedDays: [],
        currentDay: 1,
        isComplete: false,
      };
    }

    const completedDays = await getCompletedDays(ctx, userId, args.programSlug);
    return {
      hasAccess: true,
      completedDays,
      currentDay: completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1,
      isComplete: completedDays.length >= 8,
    };
  },
});

/**
 * Helper to get completed days for a program
 */
async function getCompletedDays(
  ctx: any,
  userId: any,
  programSlug: string
): Promise<number[]> {
  // Query workoutCompletions for this user
  // We use a convention: programSlug stored in metadata or dayNumber range
  // For basketball-chassis, we use dayNumbers 1001-1008 (1000 + dayNumber)
  const programOffset = getProgramOffset(programSlug);

  const completions = await ctx.db
    .query("workoutCompletions")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .filter((q: any) =>
      q.and(
        q.gte(q.field("dayNumber"), programOffset + 1),
        q.lte(q.field("dayNumber"), programOffset + 8)
      )
    )
    .collect();

  return completions.map((c: any) => c.dayNumber - programOffset);
}

/**
 * Get offset for program day numbers to avoid conflicts
 */
function getProgramOffset(programSlug: string): number {
  switch (programSlug) {
    case "basketball-chassis":
      return 1000;
    default:
      return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Complete a program day and award rewards
 */
export const completeProgramDay = mutation({
  args: {
    userId: v.id("users"),
    programSlug: v.string(),
    dayNumber: v.number(),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate the stored day number (with program offset)
    const programOffset = getProgramOffset(args.programSlug);
    const storedDayNumber = programOffset + args.dayNumber;

    // Check if already completed
    const existing = await ctx.db
      .query("workoutCompletions")
      .withIndex("by_user_day", (q) =>
        q.eq("userId", args.userId).eq("dayNumber", storedDayNumber)
      )
      .first();

    if (existing) {
      // Already completed - still allow replay but no rewards
      return {
        xpAwarded: 0,
        crystalsAwarded: 0,
        streak: user.streakCurrent,
        alreadyCompleted: true,
      };
    }

    // Award XP and crystals
    const xpPerDay = 150;
    const crystalsPerDay = 10;

    // Record completion
    await ctx.db.insert("workoutCompletions", {
      userId: args.userId,
      enrollmentId: undefined as any, // Programs don't use enrollments
      dayNumber: storedDayNumber,
      completedAt: Date.now(),
      durationSeconds: args.durationSeconds,
      xpEarned: xpPerDay,
    });

    // Update user stats
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const lastWorkout = user.lastWorkoutAt || 0;

    // Calculate streak
    let newStreak = user.streakCurrent;
    if (lastWorkout > oneDayAgo) {
      // Already worked out today, keep streak
    } else if (lastWorkout > oneDayAgo - 24 * 60 * 60 * 1000) {
      // Worked out yesterday, increment streak
      newStreak = (user.streakCurrent || 0) + 1;
    } else {
      // Streak broken, start fresh
      newStreak = 1;
    }

    await ctx.db.patch(args.userId, {
      xpTotal: (user.xpTotal || 0) + xpPerDay,
      crystals: (user.crystals || 0) + crystalsPerDay,
      streakCurrent: newStreak,
      streakBest: Math.max(user.streakBest || 0, newStreak),
      lastWorkoutAt: now,
    });

    // Check for program completion (Day 8)
    if (args.dayNumber === 8) {
      // Award completion bonus
      await ctx.db.patch(args.userId, {
        xpTotal: (user.xpTotal || 0) + xpPerDay + 200, // Extra bonus
      });

      // TODO: Unlock "Basketball Chassis Complete" card
      // This would insert into userCards table
    }

    return {
      xpAwarded: xpPerDay,
      crystalsAwarded: crystalsPerDay,
      streak: newStreak,
      alreadyCompleted: false,
      programComplete: args.dayNumber === 8,
    };
  },
});
