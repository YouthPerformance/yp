// ═══════════════════════════════════════════════════════════════
// LEADERBOARDS
// Ranked jump data with age group and location filtering
// Updates on jump completion
// ═══════════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Age groups for filtering
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
// UPDATE LEADERBOARD ENTRY
// Called after successful jump measurement
// ─────────────────────────────────────────────────────────────────
export const updateEntry = mutation({
  args: {
    userId: v.id("jumpUsers"),
    jumpId: v.id("jumps"),
    vpcId: v.optional(v.id("vpcs")),
    heightInches: v.number(),
    verificationTier: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get user info for denormalization
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user wants to appear on leaderboards
    if (!user.showOnLeaderboards) {
      return { updated: false, reason: "User opted out of leaderboards" };
    }

    const ageGroup = calculateAgeGroup(user.birthYear);

    // Check if user has existing entry
    const existing = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Only update if new jump is higher
      if (args.heightInches > existing.bestHeightInches) {
        await ctx.db.patch(existing._id, {
          bestHeightInches: args.heightInches,
          bestJumpId: args.jumpId,
          bestVpcId: args.vpcId,
          verificationTier: args.verificationTier,
          // Update denormalized user data
          city: user.city,
          state: user.state,
          country: user.country,
          ageGroup,
          gender: user.gender,
          updatedAt: now,
        });
        return { updated: true, isNewBest: true };
      } else {
        // Just update timestamps
        await ctx.db.patch(existing._id, {
          updatedAt: now,
        });
        return { updated: true, isNewBest: false };
      }
    } else {
      // Create new entry
      await ctx.db.insert("leaderboardEntries", {
        userId: args.userId,
        bestJumpId: args.jumpId,
        bestVpcId: args.vpcId,
        bestHeightInches: args.heightInches,
        verificationTier: args.verificationTier,
        // Denormalized user data for fast queries
        city: user.city,
        state: user.state,
        country: user.country,
        ageGroup,
        gender: user.gender,
        // Ranks will be computed later
        rankGlobal: undefined,
        rankCountry: undefined,
        rankState: undefined,
        rankCity: undefined,
        updatedAt: now,
      });
      return { updated: true, isNewBest: true };
    }
  },
});

// ─────────────────────────────────────────────────────────────────
// GET GLOBAL LEADERBOARD
// Top jumpers worldwide
// ─────────────────────────────────────────────────────────────────
export const getGlobal = query({
  args: {
    limit: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    minTier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    let entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_global_rank")
      .order("desc")
      .take(limit * 2); // Fetch extra for filtering

    // Apply filters
    if (args.gender) {
      entries = entries.filter((e) => e.gender === args.gender);
    }

    if (args.minTier) {
      const tierOrder = ["measured", "bronze", "silver", "gold"];
      const minIndex = tierOrder.indexOf(args.minTier);
      entries = entries.filter(
        (e) => tierOrder.indexOf(e.verificationTier) >= minIndex
      );
    }

    // Add rank
    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────
// GET AGE GROUP LEADERBOARD
// ─────────────────────────────────────────────────────────────────
export const getByAgeGroup = query({
  args: {
    ageGroup: v.union(
      v.literal("13-14"),
      v.literal("15-16"),
      v.literal("17-18"),
      v.literal("19-22")
    ),
    limit: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    let entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_age_group", (q) => q.eq("ageGroup", args.ageGroup))
      .order("desc")
      .take(limit * 2);

    // Apply gender filter
    if (args.gender) {
      entries = entries.filter((e) => e.gender === args.gender);
    }

    // Sort by height and add rank
    entries.sort((a, b) => b.bestHeightInches - a.bestHeightInches);

    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────
// GET COUNTRY LEADERBOARD
// ─────────────────────────────────────────────────────────────────
export const getByCountry = query({
  args: {
    country: v.string(),
    limit: v.optional(v.number()),
    ageGroup: v.optional(
      v.union(
        v.literal("13-14"),
        v.literal("15-16"),
        v.literal("17-18"),
        v.literal("19-22")
      )
    ),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    let entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_country", (q) => q.eq("country", args.country))
      .take(limit * 3);

    // Apply filters
    if (args.ageGroup) {
      entries = entries.filter((e) => e.ageGroup === args.ageGroup);
    }

    if (args.gender) {
      entries = entries.filter((e) => e.gender === args.gender);
    }

    // Sort by height and add rank
    entries.sort((a, b) => b.bestHeightInches - a.bestHeightInches);

    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────
// GET STATE LEADERBOARD
// ─────────────────────────────────────────────────────────────────
export const getByState = query({
  args: {
    country: v.string(),
    state: v.string(),
    limit: v.optional(v.number()),
    ageGroup: v.optional(
      v.union(
        v.literal("13-14"),
        v.literal("15-16"),
        v.literal("17-18"),
        v.literal("19-22")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    let entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_state", (q) =>
        q.eq("country", args.country).eq("state", args.state)
      )
      .take(limit * 2);

    if (args.ageGroup) {
      entries = entries.filter((e) => e.ageGroup === args.ageGroup);
    }

    // Sort by height and add rank
    entries.sort((a, b) => b.bestHeightInches - a.bestHeightInches);

    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────
// GET CITY LEADERBOARD
// ─────────────────────────────────────────────────────────────────
export const getByCity = query({
  args: {
    country: v.string(),
    state: v.optional(v.string()),
    city: v.string(),
    limit: v.optional(v.number()),
    ageGroup: v.optional(
      v.union(
        v.literal("13-14"),
        v.literal("15-16"),
        v.literal("17-18"),
        v.literal("19-22")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    let entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_city", (q) =>
        q.eq("country", args.country).eq("state", args.state).eq("city", args.city)
      )
      .take(limit * 2);

    if (args.ageGroup) {
      entries = entries.filter((e) => e.ageGroup === args.ageGroup);
    }

    // Sort by height and add rank
    entries.sort((a, b) => b.bestHeightInches - a.bestHeightInches);

    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────
// GET USER'S RANK
// Where does a specific user rank?
// ─────────────────────────────────────────────────────────────────
export const getUserRank = query({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!entry) {
      return null;
    }

    // Count users with higher jumps for global rank
    const higherGlobal = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_global_rank")
      .filter((q) => q.gt(q.field("bestHeightInches"), entry.bestHeightInches))
      .collect();

    // Count in same age group
    const higherInAgeGroup = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_age_group", (q) => q.eq("ageGroup", entry.ageGroup))
      .filter((q) => q.gt(q.field("bestHeightInches"), entry.bestHeightInches))
      .collect();

    // Count in same country
    const higherInCountry = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_country", (q) => q.eq("country", entry.country))
      .filter((q) => q.gt(q.field("bestHeightInches"), entry.bestHeightInches))
      .collect();

    return {
      entry,
      globalRank: higherGlobal.length + 1,
      ageGroupRank: higherInAgeGroup.length + 1,
      countryRank: higherInCountry.length + 1,
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// COMPUTE RANKS
// Scheduled job to update cached rank values
// ─────────────────────────────────────────────────────────────────
export const computeRanks = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all entries sorted by height
    const entries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_global_rank")
      .order("desc")
      .collect();

    // Compute global ranks
    for (let i = 0; i < entries.length; i++) {
      await ctx.db.patch(entries[i]._id, {
        rankGlobal: i + 1,
        updatedAt: now,
      });
    }

    // TODO: Compute country/state/city ranks in batches

    return { updated: entries.length };
  },
});

// ─────────────────────────────────────────────────────────────────
// GET LEADERBOARD STATS
// Summary statistics
// ─────────────────────────────────────────────────────────────────
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allEntries = await ctx.db.query("leaderboardEntries").collect();

    if (allEntries.length === 0) {
      return {
        totalAthletes: 0,
        averageHeight: 0,
        maxHeight: 0,
        byAgeGroup: {},
        byCountry: {},
      };
    }

    const heights = allEntries.map((e) => e.bestHeightInches);
    const averageHeight = heights.reduce((a, b) => a + b, 0) / heights.length;
    const maxHeight = Math.max(...heights);

    // Group by age group
    const byAgeGroup: Record<string, number> = {};
    for (const entry of allEntries) {
      byAgeGroup[entry.ageGroup] = (byAgeGroup[entry.ageGroup] || 0) + 1;
    }

    // Group by country (top 10)
    const countryCount: Record<string, number> = {};
    for (const entry of allEntries) {
      countryCount[entry.country] = (countryCount[entry.country] || 0) + 1;
    }
    const byCountry = Object.fromEntries(
      Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    );

    return {
      totalAthletes: allEntries.length,
      averageHeight: Math.round(averageHeight * 10) / 10,
      maxHeight,
      byAgeGroup,
      byCountry,
    };
  },
});

// ─────────────────────────────────────────────────────────────────
// REMOVE USER FROM LEADERBOARD
// When user opts out or is banned
// ─────────────────────────────────────────────────────────────────
export const removeUser = mutation({
  args: {
    userId: v.id("jumpUsers"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("leaderboardEntries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (entry) {
      await ctx.db.delete(entry._id);
      return { removed: true };
    }

    return { removed: false };
  },
});
