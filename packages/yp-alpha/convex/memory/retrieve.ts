/**
 * Wolf Recall Protocol - Memory Retrieval Layer
 * =============================================
 *
 * When an athlete asks a question, we don't just answer blind.
 * We check the graph, find red flags, and inject context.
 *
 * Example:
 * User: "Can I dunk today?"
 * System: Check graph... Left Ankle is Score 4 (Critical)
 * Response: "Negative. Your ankle is flagged. Low-impact rim touches instead."
 */

import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Get Athlete Context for AskYP
 *
 * Fetches:
 * 1. "The Red List" - Critical nodes (score < 6) that ALWAYS matter
 * 2. "Topic Specific" - Nodes relevant to what they're asking about
 * 3. "Recent Chat" - Last conversation for continuity
 */
export const getAthleteContext = query({
  args: {
    userId: v.string(),
    userQuery: v.string(),
  },
  handler: async (ctx, args) => {
    // ─────────────────────────────────────────────────────────────
    // 1. FETCH "THE RED LIST" (Always Relevant)
    // Any body part or metric that is "Critical" (Score < 6)
    // We ALWAYS want to know if the user has active issues.
    // ─────────────────────────────────────────────────────────────
    const criticalNodes = await ctx.db
      .query("athlete_nodes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.lt(q.field("score"), 6))
      .collect();

    // ─────────────────────────────────────────────────────────────
    // 2. FETCH "TOPIC SPECIFIC" NODES (Keyword Match for MVP)
    // If user mentions "jump", we want "vertical_jump", "knees", "ankles"
    // V2: Upgrade to Vector Search for semantic matching
    // ─────────────────────────────────────────────────────────────
    const allNodes = await ctx.db
      .query("athlete_nodes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Simple client-side filter for relevant keys (fast for <100 nodes)
    const keywords = args.userQuery.toLowerCase().split(/\s+/);
    const relevantNodes = allNodes.filter((node) =>
      keywords.some((k) => k.length > 3 && node.key.includes(k)),
    );

    // Also check for common body part mappings
    const bodyPartMappings: Record<string, string[]> = {
      dunk: ["ankle", "knee", "vertical", "calf", "hip"],
      jump: ["ankle", "knee", "vertical", "calf"],
      run: ["ankle", "knee", "hip", "hamstring", "calf"],
      shoot: ["shoulder", "wrist", "elbow", "confidence"],
      sprint: ["hamstring", "hip", "ankle", "quad"],
      lift: ["back", "shoulder", "knee", "core"],
    };

    // Find additional relevant nodes based on activity keywords
    const activityKeywords = keywords.filter((k) => bodyPartMappings[k]);
    const relatedParts = activityKeywords.flatMap((k) => bodyPartMappings[k] || []);

    const activityRelatedNodes = allNodes.filter((node) =>
      relatedParts.some((part) => node.key.includes(part)),
    );

    // Merge unique nodes
    const allRelevantNodes = [
      ...new Map([...relevantNodes, ...activityRelatedNodes].map((n) => [n._id, n])).values(),
    ];

    // ─────────────────────────────────────────────────────────────
    // 3. FETCH RECENT CONVERSATION (Short-term memory)
    // ─────────────────────────────────────────────────────────────
    const recentChat = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    // ─────────────────────────────────────────────────────────────
    // 4. FETCH RECENT CORRELATIONS (What causes what)
    // ─────────────────────────────────────────────────────────────
    const correlations = await ctx.db
      .query("correlations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .take(10);

    // ─────────────────────────────────────────────────────────────
    // 5. FETCH UNPROCESSED MEMORIES (Recent insights)
    // ─────────────────────────────────────────────────────────────
    const recentMemories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(5);

    // ─────────────────────────────────────────────────────────────
    // BUILD THE RETURN OBJECT
    // ─────────────────────────────────────────────────────────────
    return {
      status: "success",

      // Red flags - MUST be acknowledged before high-load activities
      red_flags: criticalNodes.map((n) => ({
        key: n.key,
        status: n.status,
        score: n.score,
        notes: n.notes,
        formatted: `${n.key.replace(/_/g, " ")} is CRITICAL - ${n.status} (Score: ${n.score}/10)`,
      })),

      // Relevant context for the topic at hand
      relevant_context: allRelevantNodes
        .filter((n) => n.score >= 6) // Don't duplicate red flags
        .map((n) => ({
          key: n.key,
          status: n.status,
          score: n.score,
          formatted: `${n.key.replace(/_/g, " ")}: ${n.status} (${n.score}/10)`,
        })),

      // Known correlations for this athlete
      known_correlations: correlations.map((c) => ({
        from: c.fromNode,
        to: c.toNode,
        relationship: c.relationship,
        strength: c.strength,
        formatted: `${c.fromNode} ${c.relationship} ${c.toNode} (${Math.round(c.strength * 100)}% confidence)`,
      })),

      // Recent memories for context
      recent_insights: recentMemories.map((m) => m.content),

      // Conversation continuity
      last_chat_id: recentChat?._id ?? null,
      last_chat_title: recentChat?.title ?? null,

      // Summary stats
      stats: {
        total_nodes: allNodes.length,
        critical_count: criticalNodes.length,
        has_active_issues: criticalNodes.length > 0,
      },
    };
  },
});

/**
 * Quick check for active injuries
 * Used by UI to show warning badges
 */
export const hasActiveIssues = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const criticalNodes = await ctx.db
      .query("athlete_nodes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.lt(q.field("score"), 6))
      .take(1);

    return {
      hasIssues: criticalNodes.length > 0,
      issueCount: criticalNodes.length,
    };
  },
});

/**
 * Get athlete's full graph for dashboard view
 */
export const getFullGraph = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const nodes = await ctx.db
      .query("athlete_nodes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const correlations = await ctx.db
      .query("correlations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Group nodes by category
    const byCategory = nodes.reduce(
      (acc, node) => {
        const cat = node.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(node);
        return acc;
      },
      {} as Record<string, typeof nodes>,
    );

    return {
      nodes,
      correlations,
      byCategory,
      summary: {
        total: nodes.length,
        critical: nodes.filter((n) => n.score < 6).length,
        healthy: nodes.filter((n) => n.score >= 8).length,
        improving: nodes.filter((n) => n.status === "Improving").length,
      },
    };
  },
});
