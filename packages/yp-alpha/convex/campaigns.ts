// ═══════════════════════════════════════════════════════════
// CAMPAIGNS - GPT UPLINK CONTENT MULTIPLEXER
// CRUD operations for content campaigns
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ─────────────────────────────────────────────────────────────
// TYPE VALIDATORS
// ─────────────────────────────────────────────────────────────

const authorValidator = v.union(v.literal("ADAM"), v.literal("JAMES"));
const statusValidator = v.union(
  v.literal("DRAFT"),
  v.literal("READY"),
  v.literal("PUBLISHED"),
  v.literal("FAILED")
);
const platformValidator = v.union(
  v.literal("BLOG"),
  v.literal("LINKEDIN"),
  v.literal("TWITTER"),
  v.literal("INSTAGRAM")
);

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Create a new campaign with all 4 content assets
 * Called by the GPT webhook when content is submitted
 */
export const createCampaign = mutation({
  args: {
    author: authorValidator,
    rawInput: v.string(),
    content: v.object({
      blog: v.object({
        title: v.string(),
        body: v.string(),
      }),
      linkedin: v.object({
        body: v.string(),
      }),
      twitter: v.object({
        thread: v.array(v.string()),
      }),
      instagram: v.object({
        caption: v.string(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the parent campaign
    const campaignId = await ctx.db.insert("campaigns", {
      author: args.author,
      title: args.content.blog.title,
      rawInput: args.rawInput,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    });

    // Create content assets for each platform
    const platforms = [
      {
        platform: "BLOG" as const,
        title: args.content.blog.title,
        body: args.content.blog.body,
      },
      {
        platform: "LINKEDIN" as const,
        title: args.content.blog.title,
        body: args.content.linkedin.body,
      },
      {
        platform: "TWITTER" as const,
        body: args.content.twitter.thread.join("\n\n---\n\n"),
      },
      {
        platform: "INSTAGRAM" as const,
        body: args.content.instagram.caption,
      },
    ];

    for (const asset of platforms) {
      await ctx.db.insert("content_assets", {
        campaignId,
        platform: asset.platform,
        title: asset.title,
        body: asset.body,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { campaignId };
  },
});

/**
 * Update campaign status
 */
export const updateStatus = mutation({
  args: {
    campaignId: v.id("campaigns"),
    status: statusValidator,
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.errorMessage !== undefined) {
      updates.errorMessage = args.errorMessage;
    }

    if (args.status === "PUBLISHED") {
      updates.publishedAt = Date.now();
    }

    await ctx.db.patch(args.campaignId, updates);
  },
});

/**
 * Update content asset body
 */
export const updateAsset = mutation({
  args: {
    assetId: v.id("content_assets"),
    body: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      body: args.body,
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    await ctx.db.patch(args.assetId, updates);

    // Also update the parent campaign's updatedAt
    const asset = await ctx.db.get(args.assetId);
    if (asset) {
      await ctx.db.patch(asset.campaignId, { updatedAt: Date.now() });
    }
  },
});

/**
 * Record Make.com webhook response after distribution
 */
export const recordDistribution = mutation({
  args: {
    campaignId: v.id("campaigns"),
    success: v.boolean(),
    response: v.optional(v.any()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      status: args.success ? "PUBLISHED" : "FAILED",
      publishedAt: args.success ? Date.now() : undefined,
      makeWebhookResponse: args.response,
      errorMessage: args.errorMessage,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a campaign and all its assets
 */
export const deleteCampaign = mutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    // Delete all content assets first
    const assets = await ctx.db
      .query("content_assets")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    for (const asset of assets) {
      await ctx.db.delete(asset._id);
    }

    // Delete the campaign
    await ctx.db.delete(args.campaignId);
  },
});

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get a single campaign with all its assets
 */
export const getCampaign = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) return null;

    const assets = await ctx.db
      .query("content_assets")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    // Organize assets by platform
    const assetsByPlatform: Record<string, typeof assets[0]> = {};
    for (const asset of assets) {
      assetsByPlatform[asset.platform] = asset;
    }

    return {
      ...campaign,
      assets: assetsByPlatform,
    };
  },
});

/**
 * List campaigns with optional filters
 */
export const listCampaigns = query({
  args: {
    author: v.optional(authorValidator),
    status: v.optional(statusValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let campaignsQuery;

    if (args.author && args.status) {
      campaignsQuery = ctx.db
        .query("campaigns")
        .withIndex("by_author_status", (q) =>
          q.eq("author", args.author!).eq("status", args.status!)
        );
    } else if (args.author) {
      campaignsQuery = ctx.db
        .query("campaigns")
        .withIndex("by_author", (q) => q.eq("author", args.author!));
    } else if (args.status) {
      campaignsQuery = ctx.db
        .query("campaigns")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else {
      campaignsQuery = ctx.db
        .query("campaigns")
        .withIndex("by_created");
    }

    const campaigns = await campaignsQuery
      .order("desc")
      .take(limit);

    return campaigns;
  },
});

/**
 * Get campaign count by status (for dashboard stats)
 */
export const getCampaignStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("campaigns").collect();

    const stats = {
      total: all.length,
      draft: 0,
      ready: 0,
      published: 0,
      failed: 0,
    };

    for (const campaign of all) {
      switch (campaign.status) {
        case "DRAFT":
          stats.draft++;
          break;
        case "READY":
          stats.ready++;
          break;
        case "PUBLISHED":
          stats.published++;
          break;
        case "FAILED":
          stats.failed++;
          break;
      }
    }

    return stats;
  },
});
