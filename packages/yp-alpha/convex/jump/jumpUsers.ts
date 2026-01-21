// ═══════════════════════════════════════════════════════════════
// JUMP USERS
// Athlete profiles for YP Jump
// Separate from main users table for clean separation
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Daily jump cap
const DAILY_JUMP_CAP = 20;

// Age groups for leaderboard filtering
type AgeGroup = "13-14" | "15-16" | "17-18" | "19-22";

function calculateAgeGroup(birthYear: number): AgeGroup {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age <= 14) return "13-14";
  if (age <= 16) return "15-16";
  if (age <= 18) return "17-18";
  return "19-22";
}

// ─────────────────────────────────────────────────────────────────
// CREATE JUMP USER
// Called during onboarding after auth
// ─────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    authUserId: v.string(),
    displayName: v.string(),
    birthYear: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate age (13-22)
    const currentYear = new Date().getFullYear();
    const age = currentYear - args.birthYear;

    if (age < 13) {
      throw new Error("You must be 13 or older to use YP Jump");
    }

    if (age > 22) {
      throw new Error("YP Jump is designed for athletes ages 13-22");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("jumpUsers")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    const now = Date.now();

    const userId = await ctx.db.insert("jumpUsers", {
      authUserId: args.authUserId,
      displayName: args.displayName,
      birthYear: args.birthYear,
      gender: args.gender,
      city: args.city,
      state: args.state,
      country: args.country,
      profileVisibility: "public",
      showOnLeaderboards: true,
      dailyJumpsUsed: 0,
      lastJumpResetAt: now,
      primaryDeviceKeyId: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return { userId, ageGroup: calculateAgeGroup(args.birthYear) };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET BY AUTH USER ID
// Look up jump user from BetterAuth ID
// ─────────────────────────────────────────────────────────────────
export const getByAuthUserId = query({
  args: {
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("jumpUsers")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();

    if (!user) return null;

    return {
      ...user,
      ageGroup: calculateAgeGroup(user.birthYear),
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET BY ID
// Direct lookup
// ─────────────────────────────────────────────────────────────────
export const get = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) return null;

    return {
      ...user,
      ageGroup: calculateAgeGroup(user.birthYear),
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// UPDATE PROFILE
// Edit display name, location, privacy settings
// ─────────────────────────────────────────────────────────────────
export const updateProfile = mutation({
  args: {
    userId: v.id("jumpUsers"),
    displayName: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    profileVisibility: v.optional(
      v.union(v.literal("public"), v.literal("regional"), v.literal("private"))
    ),
    showOnLeaderboards: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // Filter out undefined values
    const cleanUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    if (Object.keys(cleanUpdates).length === 0) {
      return { success: true };
    }

    cleanUpdates.updatedAt = Date.now();

    await ctx.db.patch(userId, cleanUpdates);

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// CHECK DAILY CAP
// Returns remaining jumps and whether user is over cap
// ─────────────────────────────────────────────────────────────────
export const checkDailyCap = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if we need to reset the daily count
    const now = Date.now();
    const lastReset = new Date(user.lastJumpResetAt);
    const today = new Date(now);

    // Reset if it's a new day (compare dates in user's timezone - simplified to UTC)
    const isNewDay =
      lastReset.getUTCDate() !== today.getUTCDate() ||
      lastReset.getUTCMonth() !== today.getUTCMonth() ||
      lastReset.getUTCFullYear() !== today.getUTCFullYear();

    const jumpsUsed = isNewDay ? 0 : user.dailyJumpsUsed;
    const remaining = Math.max(0, DAILY_JUMP_CAP - jumpsUsed);
    const isOverCap = jumpsUsed >= DAILY_JUMP_CAP;

    return {
      jumpsUsed,
      remaining,
      cap: DAILY_JUMP_CAP,
      isOverCap,
      needsReset: isNewDay,
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// INCREMENT DAILY JUMPS
// Called after successful jump submission
// ─────────────────────────────────────────────────────────────────
export const incrementDailyJumps = mutation({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const lastReset = new Date(user.lastJumpResetAt);
    const today = new Date(now);

    // Check if we need to reset
    const isNewDay =
      lastReset.getUTCDate() !== today.getUTCDate() ||
      lastReset.getUTCMonth() !== today.getUTCMonth() ||
      lastReset.getUTCFullYear() !== today.getUTCFullYear();

    if (isNewDay) {
      // Reset and increment
      await ctx.db.patch(args.userId, {
        dailyJumpsUsed: 1,
        lastJumpResetAt: now,
        updatedAt: now,
      });
      return { jumpsUsed: 1, remaining: DAILY_JUMP_CAP - 1, wasReset: true };
    } else {
      // Just increment
      const newCount = user.dailyJumpsUsed + 1;
      await ctx.db.patch(args.userId, {
        dailyJumpsUsed: newCount,
        updatedAt: now,
      });
      return {
        jumpsUsed: newCount,
        remaining: Math.max(0, DAILY_JUMP_CAP - newCount),
        wasReset: false,
      };
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// LINK DEVICE KEY
// Associate a device key with user
// ─────────────────────────────────────────────────────────────────
export const linkDeviceKey = mutation({
  args: {
    userId: v.id("jumpUsers"),
    deviceKeyId: v.id("deviceKeys"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      primaryDeviceKeyId: args.deviceKeyId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET USER STATS
// Aggregated stats for profile display
// ─────────────────────────────────────────────────────────────────
export const getStats = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Get all completed jumps for this user
    const jumps = await ctx.db
      .query("jumps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "complete"),
          q.neq(q.field("heightInches"), undefined)
        )
      )
      .collect();

    if (jumps.length === 0) {
      return {
        totalJumps: 0,
        bestHeightInches: null,
        bestHeightCm: null,
        averageHeightInches: null,
        averageHeightCm: null,
        ageGroup: calculateAgeGroup(user.birthYear),
      };
    }

    const heights = jumps
      .map((j) => j.heightInches)
      .filter((h): h is number => h !== undefined);
    const best = Math.max(...heights);
    const average = heights.reduce((a, b) => a + b, 0) / heights.length;

    return {
      totalJumps: jumps.length,
      bestHeightInches: best,
      bestHeightCm: best * 2.54,
      averageHeightInches: Math.round(average * 10) / 10,
      averageHeightCm: Math.round(average * 2.54 * 10) / 10,
      ageGroup: calculateAgeGroup(user.birthYear),
    };
  },
});
