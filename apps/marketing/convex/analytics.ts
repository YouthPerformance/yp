import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track an analytics event
export const trackEvent = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    anonymousId: v.optional(v.string()),
    event: v.string(),
    properties: v.optional(v.any()),
    url: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyticsEvents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get events for a profile
export const getEventsForProfile = query({
  args: {
    profileId: v.id("profiles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyticsEvents")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Get events by type
export const getEventsByType = query({
  args: {
    event: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyticsEvents")
      .withIndex("by_event", (q) => q.eq("event", args.event))
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Store quiz response
export const storeQuizResponse = mutation({
  args: {
    profileId: v.optional(v.id("profiles")),
    anonymousId: v.optional(v.string()),
    answers: v.array(
      v.object({
        questionId: v.number(),
        answer: v.string(),
      }),
    ),
    scores: v.object({
      forceLeaker: v.number(),
      elasticity: v.number(),
      absorption: v.number(),
      control: v.number(),
    }),
    identityType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizResponses", {
      ...args,
      completedAt: Date.now(),
    });
  },
});

// Get quiz response
export const getQuizResponse = query({
  args: {
    profileId: v.optional(v.id("profiles")),
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.profileId) {
      return await ctx.db
        .query("quizResponses")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .order("desc")
        .first();
    }

    if (args.anonymousId) {
      return await ctx.db
        .query("quizResponses")
        .withIndex("by_anonymous", (q) => q.eq("anonymousId", args.anonymousId))
        .order("desc")
        .first();
    }

    return null;
  },
});

// Store email lead
export const storeLead = mutation({
  args: {
    email: v.string(),
    profileId: v.optional(v.id("profiles")),
    source: v.string(),
    athleteIdentity: v.optional(v.string()),
    subscribed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if lead already exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing lead
      await ctx.db.patch(existing._id, {
        profileId: args.profileId ?? existing.profileId,
        athleteIdentity: args.athleteIdentity ?? existing.athleteIdentity,
      });
      return existing._id;
    }

    return await ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get lead by email
export const getLeadByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Funnel metrics query (for dashboard)
export const getFunnelMetrics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const start = args.startDate ?? Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const end = args.endDate ?? Date.now();

    // Get all events in date range
    const events = await ctx.db
      .query("analyticsEvents")
      .filter((q) => q.and(q.gte(q.field("createdAt"), start), q.lte(q.field("createdAt"), end)))
      .collect();

    // Count events by type
    const eventCounts: Record<string, number> = {};
    events.forEach((event) => {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    });

    // Get leads count
    const leads = await ctx.db
      .query("leads")
      .filter((q) => q.and(q.gte(q.field("createdAt"), start), q.lte(q.field("createdAt"), end)))
      .collect();

    // Get quiz completions
    const quizzes = await ctx.db
      .query("quizResponses")
      .filter((q) =>
        q.and(q.gte(q.field("completedAt"), start), q.lte(q.field("completedAt"), end)),
      )
      .collect();

    return {
      events: eventCounts,
      totalLeads: leads.length,
      totalQuizzes: quizzes.length,
      dateRange: { start, end },
    };
  },
});
