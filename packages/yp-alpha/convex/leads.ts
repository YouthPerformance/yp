// @ts-nocheck
// NOTE: Type narrowing issue with Convex query builder
// ═══════════════════════════════════════════════════════════
// LEADS - Email Capture for Teaser Module Conversion
// ═══════════════════════════════════════════════════════════

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─────────────────────────────────────────────────────────────
// CAPTURE EMAIL
// Stores email from teaser completion for follow-up/retargeting
// ─────────────────────────────────────────────────────────────

export const captureEmail = mutation({
  args: {
    email: v.string(),
    source: v.string(), // e.g., "bpa-teaser-completion"
    rewardSlug: v.optional(v.string()), // e.g., "bpa-drill-stack-preview"
    metadata: v.optional(v.any()), // Session data, UTM, etc.
  },
  handler: async (ctx, args) => {
    const { email, source, rewardSlug, metadata } = args;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already captured from this source
    const existing = await ctx.db
      .query("emailCaptures")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => q.eq(q.field("source"), source))
      .first();

    if (existing) {
      // Already captured - update reward if not already set
      if (!existing.rewardUnlocked && rewardSlug) {
        await ctx.db.patch(existing._id, {
          rewardUnlocked: rewardSlug,
        });
      }
      return {
        success: true,
        alreadyCaptured: true,
        captureId: existing._id,
      };
    }

    // Create new capture
    const captureId = await ctx.db.insert("emailCaptures", {
      email: normalizedEmail,
      source,
      capturedAt: Date.now(),
      rewardUnlocked: rewardSlug,
      metadata,
    });

    return {
      success: true,
      alreadyCaptured: false,
      captureId,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// CHECK EMAIL CAPTURED
// Check if an email has already been captured for a source
// ─────────────────────────────────────────────────────────────

export const checkEmailCaptured = query({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, source } = args;
    const normalizedEmail = email.toLowerCase().trim();

    let query = ctx.db
      .query("emailCaptures")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail));

    if (source) {
      query = query.filter((q) => q.eq(q.field("source"), source));
    }

    const capture = await query.first();

    if (!capture) {
      return { captured: false };
    }

    return {
      captured: true,
      source: capture.source,
      rewardUnlocked: capture.rewardUnlocked,
      capturedAt: capture.capturedAt,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// MARK CONVERTED
// Update a capture when user purchases the product
// ─────────────────────────────────────────────────────────────

export const markConverted = mutation({
  args: {
    email: v.string(),
    productSlug: v.string(), // e.g., "barefoot-reset-42"
  },
  handler: async (ctx, args) => {
    const { email, productSlug } = args;
    const normalizedEmail = email.toLowerCase().trim();

    // Find all captures for this email
    const captures = await ctx.db
      .query("emailCaptures")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .collect();

    if (captures.length === 0) {
      return { success: false, message: "No captures found for email" };
    }

    // Update all captures with conversion info
    for (const capture of captures) {
      if (!capture.convertedAt) {
        await ctx.db.patch(capture._id, {
          convertedAt: Date.now(),
          convertedTo: productSlug,
        });
      }
    }

    return { success: true, updatedCount: captures.length };
  },
});

// ─────────────────────────────────────────────────────────────
// LINK USER TO CAPTURES
// When a user signs up, link their captures to their user ID
// ─────────────────────────────────────────────────────────────

export const linkUserToCaptures = mutation({
  args: {
    email: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { email, userId } = args;
    const normalizedEmail = email.toLowerCase().trim();

    // Find all captures for this email
    const captures = await ctx.db
      .query("emailCaptures")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .collect();

    // Link each capture to the user
    for (const capture of captures) {
      if (!capture.userId) {
        await ctx.db.patch(capture._id, { userId });
      }
    }

    return { success: true, linkedCount: captures.length };
  },
});

// ─────────────────────────────────────────────────────────────
// GET CAPTURE STATS
// Analytics for conversion tracking
// ─────────────────────────────────────────────────────────────

export const getCaptureStats = query({
  args: {
    source: v.optional(v.string()),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { source, daysBack = 30 } = args;
    const cutoffTime = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    let query = ctx.db.query("emailCaptures");

    if (source) {
      query = query.withIndex("by_source", (q) => q.eq("source", source));
    }

    const captures = await query.collect();

    // Filter by date
    const recentCaptures = captures.filter((c) => c.capturedAt >= cutoffTime);

    // Calculate stats
    const totalCaptures = recentCaptures.length;
    const converted = recentCaptures.filter((c) => c.convertedAt).length;
    const conversionRate = totalCaptures > 0 ? converted / totalCaptures : 0;

    // Group by source
    const bySource: Record<string, number> = {};
    for (const capture of recentCaptures) {
      bySource[capture.source] = (bySource[capture.source] || 0) + 1;
    }

    return {
      totalCaptures,
      converted,
      conversionRate: Math.round(conversionRate * 100) / 100,
      bySource,
      period: `${daysBack} days`,
    };
  },
});
