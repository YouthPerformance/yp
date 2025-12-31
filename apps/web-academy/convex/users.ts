// ═══════════════════════════════════════════════════════════
// USER FUNCTIONS
// Queries and mutations for user management
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get user by Clerk ID
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

/**
 * Get user by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

/**
 * Get user by ID
 */
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get user's current enrollment
 */
export const getCurrentEnrollment = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .first();
  },
});

/**
 * Get leaderboard (top users by XP)
 */
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => u.role === "athlete")
      .sort((a, b) => b.xpTotal - a.xpTotal)
      .slice(0, args.limit ?? 10);
  },
});

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create new user from onboarding
 */
export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("athlete"), v.literal("parent")),
    avatarColor: v.union(
      v.literal("cyan"),
      v.literal("gold"),
      v.literal("purple"),
      v.literal("green"),
      v.literal("red")
    ),
    sport: v.optional(v.string()),
    age: v.optional(v.number()),
    parentCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: args.role,
      avatarColor: args.avatarColor,
      sport: args.sport,
      age: args.age,
      xpTotal: 0,
      crystals: 0,
      rank: "pup",
      streakCurrent: 0,
      streakBest: 0,
      subscriptionStatus: "free",
      parentCode: args.parentCode,
      onboardingCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // If athlete, create initial enrollment
    if (args.role === "athlete") {
      await ctx.db.insert("enrollments", {
        userId,
        programSlug: "foundation-42",
        currentDay: 1,
        isActive: true,
        startedAt: now,
        totalWorkoutsCompleted: 0,
        totalXpEarned: 0,
      });
    }

    return userId;
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatarColor: v.optional(
      v.union(
        v.literal("cyan"),
        v.literal("gold"),
        v.literal("purple"),
        v.literal("green"),
        v.literal("red")
      )
    ),
    sport: v.optional(v.string()),
    age: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(filteredUpdates).length === 0) {
      return;
    }

    await ctx.db.patch(userId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Add XP and update rank
 */
export const addXp = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const newXp = user.xpTotal + args.amount;

    // Calculate new rank based on XP
    let newRank: "pup" | "hunter" | "alpha" | "apex" = "pup";
    if (newXp >= 7000) newRank = "apex";
    else if (newXp >= 3000) newRank = "alpha";
    else if (newXp >= 1000) newRank = "hunter";

    await ctx.db.patch(args.userId, {
      xpTotal: newXp,
      rank: newRank,
      updatedAt: Date.now(),
    });

    return { newXp, newRank, rankChanged: newRank !== user.rank };
  },
});

/**
 * Add crystals
 */
export const addCrystals = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      crystals: user.crystals + args.amount,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Update streak
 */
export const updateStreak = mutation({
  args: {
    userId: v.id("users"),
    increment: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();

    if (args.increment) {
      const newStreak = user.streakCurrent + 1;
      const newBest = Math.max(newStreak, user.streakBest);

      await ctx.db.patch(args.userId, {
        streakCurrent: newStreak,
        streakBest: newBest,
        lastWorkoutAt: now,
        updatedAt: now,
      });

      return { newStreak, newBest };
    } else {
      // Reset streak
      await ctx.db.patch(args.userId, {
        streakCurrent: 0,
        updatedAt: now,
      });

      return { newStreak: 0, newBest: user.streakBest };
    }
  },
});

/**
 * Update subscription status
 */
export const updateSubscription = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("free"), v.literal("pro")),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      subscriptionStatus: args.status,
      subscriptionExpiresAt: args.expiresAt,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Validate parent code and link athlete
 */
export const validateParentCode = mutation({
  args: {
    athleteUserId: v.id("users"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the parent code
    const parentCode = await ctx.db
      .query("parentCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!parentCode) {
      return { success: false, error: "Invalid code" };
    }

    if (parentCode.athleteId) {
      return { success: false, error: "Code already used" };
    }

    if (parentCode.expiresAt < Date.now()) {
      return { success: false, error: "Code expired" };
    }

    // Link athlete to parent
    const now = Date.now();

    await ctx.db.patch(parentCode._id, {
      athleteId: args.athleteUserId,
      claimedAt: now,
    });

    await ctx.db.patch(args.athleteUserId, {
      linkedParentId: parentCode.parentId,
      parentCode: args.code,
      updatedAt: now,
    });

    // Update parent's linked athletes
    const parent = await ctx.db.get(parentCode.parentId);
    if (parent) {
      const currentAthletes = parent.linkedAthleteIds ?? [];
      await ctx.db.patch(parentCode.parentId, {
        linkedAthleteIds: [...currentAthletes, args.athleteUserId],
        updatedAt: now,
      });
    }

    return { success: true, parentId: parentCode.parentId };
  },
});

/**
 * Generate parent code for athlete linking
 */
export const generateParentCode = mutation({
  args: {
    parentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Generate 6-character alphanumeric code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const now = Date.now();
    const expiresAt = now + 48 * 60 * 60 * 1000; // 48 hours

    await ctx.db.insert("parentCodes", {
      code,
      parentId: args.parentId,
      createdAt: now,
      expiresAt,
    });

    return { code, expiresAt };
  },
});
