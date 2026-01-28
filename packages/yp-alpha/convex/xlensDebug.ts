// ═══════════════════════════════════════════════════════════════
// xLENS DEBUG QUERIES
// Temporary queries to inspect jump data
// ═══════════════════════════════════════════════════════════════

import { query, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Get all recent web jumps for debugging
export const getRecentJumps = query({
  args: {},
  handler: async (ctx) => {
    // Get all jumps from xlensWebJumps table, most recent first
    const jumps = await ctx.db
      .query("xlensWebJumps")
      .order("desc")
      .take(10);

    // For each jump, get video URL
    const jumpsWithUrls = await Promise.all(
      jumps.map(async (jump) => {
        let videoUrl = null;
        if (jump.storageId) {
          videoUrl = await ctx.storage.getUrl(jump.storageId);
        }
        return {
          ...jump,
          videoUrl,
        };
      })
    );

    return jumpsWithUrls;
  },
});

// ─────────────────────────────────────────────────────────────────
// RE-ANALYZE SPECIFIC JUMPS
// Call this from dashboard Functions tab to re-process with correct heights
// ─────────────────────────────────────────────────────────────────
export const triggerReanalysis = action({
  args: {
    jumpId: v.string(),
    userHeightInches: v.number(),
  },
  handler: async (ctx, args) => {
    console.log(`[xLENS Debug] Triggering re-analysis for ${args.jumpId} with height ${args.userHeightInches}"`);

    await ctx.runAction(internal.xlensHttp.reanalyzeJump, {
      jumpId: args.jumpId,
      userHeightInches: args.userHeightInches,
    });

    return { status: "queued", jumpId: args.jumpId, userHeightInches: args.userHeightInches };
  },
});

// ─────────────────────────────────────────────────────────────────
// RE-ANALYZE ALL TEST JUMPS
// Batch process the 4 test videos with corrected heights
// Subject 1 (you): 6'2" = 74 inches
// Subject 2 (nephew): 4'4" = 52 inches
// ─────────────────────────────────────────────────────────────────
export const reanalyzeTestVideos = action({
  args: {},
  handler: async (ctx): Promise<unknown> => {
    // Jump configurations with corrected heights
    // Based on Convex data inspection:
    // Row 1: 8:37 PM - Subject 1 (6'2" = 74") - mock height was 22.7"
    // Row 2: 8:35 PM - Subject 2 (4'4" = 52") - mock height was 29"
    // Row 3: 8:32 PM - Unknown (assume Subject 2) - mock height was 28.4"
    // Row 4: 8:32 PM - Unknown (assume Subject 2) - mock height was 22.6"

    const jumpConfigs = [
      { jumpId: "td77ry27nvh9k4yp7c4s3428nx7zv5g8", userHeightInches: 74 }, // 6'2" - you
      { jumpId: "td7d1bbnxmrcv7qcw47h2j330x7zv1mr", userHeightInches: 52 }, // 4'4" - nephew
      { jumpId: "td7bqtbj7fe0cgvkh8ag7v1nn57zvgpc", userHeightInches: 52 }, // assume nephew
      { jumpId: "td7aq4wwtreb07mzcgkkd1kjgh7zvrtw", userHeightInches: 52 }, // assume nephew
    ];

    console.log("[xLENS Debug] Starting batch re-analysis of test videos");

    const results = await ctx.runAction(internal.xlensHttp.reanalyzeAllJumps, {
      jumpConfigs,
    });

    return results;
  },
});
