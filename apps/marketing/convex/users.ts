import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create profile from onboarding data
export const getOrCreateProfile = mutation({
  args: {
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("parent"), v.literal("athlete"), v.literal("coach")),
    childNickname: v.optional(v.string()),
    ageBand: v.optional(v.union(v.literal("under8"), v.literal("8-12"), v.literal("13+"))),
    sport: v.optional(
      v.union(
        v.literal("basketball"),
        v.literal("barefoot"),
        v.literal("both"),
        v.literal("other"),
      ),
    ),
    space: v.optional(
      v.union(v.literal("apartment"), v.literal("driveway"), v.literal("gym"), v.literal("field")),
    ),
    painFlag: v.optional(
      v.union(
        v.literal("none"),
        v.literal("foot-ankle"),
        v.literal("knee-hip-back"),
        v.literal("not-sure"),
      ),
    ),
    goals: v.optional(
      v.array(
        v.object({
          id: v.string(),
          label: v.string(),
          tag: v.string(),
        }),
      ),
    ),
    lane: v.optional(v.string()),
    wolfPrompt: v.optional(v.string()),
    athleteIdentity: v.optional(
      v.union(
        v.literal("force-leaker"),
        v.literal("elasticity-block"),
        v.literal("absorption-deficit"),
        v.literal("control-gap"),
      ),
    ),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if profile exists by clerkId
    if (args.clerkId) {
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();

      if (existing) {
        // Update existing profile
        await ctx.db.patch(existing._id, {
          ...args,
          updatedAt: now,
        });
        return existing._id;
      }
    }

    // Check if profile exists by email
    if (args.email) {
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existing) {
        // Update existing profile
        await ctx.db.patch(existing._id, {
          ...args,
          updatedAt: now,
        });
        return existing._id;
      }
    }

    // Create new profile
    return await ctx.db.insert("profiles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get profile by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get profile by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Update profile
export const updateProfile = mutation({
  args: {
    profileId: v.id("profiles"),
    email: v.optional(v.string()),
    childNickname: v.optional(v.string()),
    ageBand: v.optional(v.union(v.literal("under8"), v.literal("8-12"), v.literal("13+"))),
    space: v.optional(
      v.union(v.literal("apartment"), v.literal("driveway"), v.literal("gym"), v.literal("field")),
    ),
    painFlag: v.optional(
      v.union(
        v.literal("none"),
        v.literal("foot-ankle"),
        v.literal("knee-hip-back"),
        v.literal("not-sure"),
      ),
    ),
    wolfPrompt: v.optional(v.string()),
    trainingReminders: v.optional(v.boolean()),
    progressReports: v.optional(v.boolean()),
    athleteIdentity: v.optional(
      v.union(
        v.literal("force-leaker"),
        v.literal("elasticity-block"),
        v.literal("absorption-deficit"),
        v.literal("control-gap"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { profileId, ...updates } = args;
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined),
    );
    await ctx.db.patch(profileId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Save profile from SaveProfile page (email capture flow)
export const saveProfileFromEmail = mutation({
  args: {
    email: v.string(),
    childNickname: v.optional(v.string()),
    role: v.optional(v.union(v.literal("parent"), v.literal("athlete"), v.literal("coach"))),
    ageBand: v.optional(v.union(v.literal("under8"), v.literal("8-12"), v.literal("13+"))),
    sport: v.optional(
      v.union(
        v.literal("basketball"),
        v.literal("barefoot"),
        v.literal("both"),
        v.literal("other"),
      ),
    ),
    space: v.optional(
      v.union(v.literal("apartment"), v.literal("driveway"), v.literal("gym"), v.literal("field")),
    ),
    painFlag: v.optional(
      v.union(
        v.literal("none"),
        v.literal("foot-ankle"),
        v.literal("knee-hip-back"),
        v.literal("not-sure"),
      ),
    ),
    goals: v.optional(
      v.array(
        v.object({
          id: v.string(),
          label: v.string(),
          tag: v.string(),
        }),
      ),
    ),
    lane: v.optional(v.string()),
    wolfPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if profile exists by email
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing profile
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new profile
    return await ctx.db.insert("profiles", {
      ...args,
      role: args.role || "parent",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update Wolf prompt only
export const updateWolfPrompt = mutation({
  args: {
    profileId: v.id("profiles"),
    wolfPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      wolfPrompt: args.wolfPrompt,
      updatedAt: Date.now(),
    });
  },
});

// Link Clerk ID to existing profile (after signup)
export const linkClerkId = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        clerkId: args.clerkId,
        updatedAt: Date.now(),
      });
      return profile._id;
    }

    return null;
  },
});
