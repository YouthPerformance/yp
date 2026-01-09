/**
 * Wolf Memory Ingestion - The Learning Loop
 * ==========================================
 *
 * After every conversation, we extract insights and update the graph.
 * This is how AskYP "remembers" athletes long-term.
 *
 * Flow:
 * 1. User chats with AskYP
 * 2. After response, this mutation fires
 * 3. We extract key information from the exchange
 * 4. Update athlete_nodes and memories tables
 */

import { v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * Ingest a conversation exchange into memory
 * Called after every AskYP response
 */
export const ingestConversation = mutation({
  args: {
    userId: v.string(),
    userMessage: v.string(),
    assistantResponse: v.string(),
    intent: v.optional(v.string()),
    sentiment: v.optional(v.string()),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // ─────────────────────────────────────────────────────────────
    // 1. EXTRACT KEY INFORMATION FROM USER MESSAGE
    // Pattern matching for common athlete updates
    // ─────────────────────────────────────────────────────────────
    const message = args.userMessage.toLowerCase();
    const extractedMemories: Array<{
      content: string;
      memoryType: "injury" | "goal" | "progress" | "emotion" | "preference" | "context";
    }> = [];

    // Injury/Pain Detection
    const painPatterns = [
      /my (\w+) (hurts?|aches?|is sore|is (swollen|stiff|tight))/gi,
      /(\w+) (pain|injury|strain|sprain)/gi,
      /(tweaked|rolled|pulled|injured) my (\w+)/gi,
    ];

    for (const pattern of painPatterns) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        extractedMemories.push({
          content: `Athlete reported: ${match[0]}`,
          memoryType: "injury",
        });
      }
    }

    // Progress Updates
    const progressPatterns = [
      /(hit|got|reached|achieved) (\d+)( inch| inches| cm)? (vertical|vert)/gi,
      /(pr|personal record|new best|pb)/gi,
      /(improved|increased|better) (my )?(\w+)/gi,
      /i (can now|finally|just) (\w+)/gi,
    ];

    for (const pattern of progressPatterns) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        extractedMemories.push({
          content: `Progress update: ${match[0]}`,
          memoryType: "progress",
        });
      }
    }

    // Goal Detection
    const goalPatterns = [
      /i want to (\w+)/gi,
      /my goal is (to )?(\w+)/gi,
      /trying to (\w+)/gi,
      /working (on|towards) (\w+)/gi,
    ];

    for (const pattern of goalPatterns) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        extractedMemories.push({
          content: `Goal mentioned: ${match[0]}`,
          memoryType: "goal",
        });
      }
    }

    // Emotional State (from sentiment)
    if (args.sentiment && args.sentiment !== "NEUTRAL") {
      extractedMemories.push({
        content: `Emotional state detected: ${args.sentiment} - "${args.userMessage.substring(0, 100)}"`,
        memoryType: "emotion",
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. STORE EXTRACTED MEMORIES
    // ─────────────────────────────────────────────────────────────
    for (const memory of extractedMemories) {
      await ctx.db.insert("memories", {
        userId: args.userId,
        conversationId: args.conversationId,
        content: memory.content,
        memoryType: memory.memoryType,
        extractedAt: now,
        processed: false,
        sourceMessage: args.userMessage,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. UPDATE ATHLETE NODES BASED ON KEYWORDS
    // Auto-create/update nodes for mentioned body parts
    // ─────────────────────────────────────────────────────────────
    const bodyParts = [
      "ankle",
      "knee",
      "hip",
      "back",
      "shoulder",
      "wrist",
      "elbow",
      "calf",
      "hamstring",
      "quad",
      "glute",
      "core",
      "foot",
      "achilles",
    ];

    const mentionedParts = bodyParts.filter((part) => message.includes(part));

    for (const part of mentionedParts) {
      // Check for negative indicators
      const isNegative = painPatterns.some((_p) =>
        new RegExp(`${part}[^.]*?(hurt|pain|sore|injury|strain|swollen|stiff|tight)`, "i").test(
          message,
        ),
      );

      if (isNegative) {
        // Update or create node with lower score
        const existing = await ctx.db
          .query("athlete_nodes")
          .withIndex("by_user_key", (q) => q.eq("userId", args.userId).eq("key", part))
          .first();

        if (existing) {
          // Decrease score if pain mentioned
          const newScore = Math.max(1, existing.score - 2);
          await ctx.db.patch(existing._id, {
            score: newScore,
            status: newScore < 4 ? "Injured" : "Sore",
            notes: `Updated: ${args.userMessage.substring(0, 100)}`,
            lastUpdated: now,
          });
        } else {
          // Create new node with concerning score
          await ctx.db.insert("athlete_nodes", {
            userId: args.userId,
            key: part,
            category: "body_part",
            status: "Sore",
            score: 4,
            notes: `First mention: ${args.userMessage.substring(0, 100)}`,
            lastUpdated: now,
          });
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. STORE THE MESSAGE IN MESSAGES TABLE
    // ─────────────────────────────────────────────────────────────
    if (args.conversationId) {
      // Store user message
      await ctx.db.insert("messages", {
        conversationId: args.conversationId,
        userId: args.userId,
        role: "user",
        content: args.userMessage,
        intent: args.intent,
        sentiment: args.sentiment,
        createdAt: now,
      });

      // Store assistant response
      await ctx.db.insert("messages", {
        conversationId: args.conversationId,
        userId: args.userId,
        role: "assistant",
        content: args.assistantResponse,
        createdAt: now,
      });

      // Update conversation timestamp
      await ctx.db.patch(args.conversationId, {
        lastMessageAt: now,
      });
    }

    return {
      success: true,
      memoriesExtracted: extractedMemories.length,
      nodesUpdated: mentionedParts.length,
    };
  },
});

/**
 * Create or get a conversation
 */
export const getOrCreateConversation = mutation({
  args: {
    userId: v.string(),
    title: v.optional(v.string()),
    modelUsed: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for recent conversation (within last 30 minutes)
    const recentConversation = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    if (recentConversation && recentConversation.lastMessageAt > thirtyMinutesAgo) {
      return { conversationId: recentConversation._id, isNew: false };
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      userId: args.userId,
      title: args.title || "New Chat",
      lastMessageAt: now,
      modelUsed: args.modelUsed,
      messageCount: 0,
    });

    return { conversationId, isNew: true };
  },
});

/**
 * Manually update an athlete node
 * Used by coaches or from assessments
 */
export const updateAthleteNode = mutation({
  args: {
    userId: v.string(),
    key: v.string(),
    category: v.union(
      v.literal("body_part"),
      v.literal("metric"),
      v.literal("mental"),
      v.literal("recovery"),
    ),
    status: v.string(),
    score: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("athlete_nodes")
      .withIndex("by_user_key", (q) => q.eq("userId", args.userId).eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        score: args.score,
        notes: args.notes,
        lastUpdated: now,
      });
      return { nodeId: existing._id, action: "updated" };
    }

    const nodeId = await ctx.db.insert("athlete_nodes", {
      userId: args.userId,
      key: args.key,
      category: args.category,
      status: args.status,
      score: args.score,
      notes: args.notes,
      lastUpdated: now,
    });

    return { nodeId, action: "created" };
  },
});

/**
 * Add a correlation between nodes
 */
export const addCorrelation = mutation({
  args: {
    userId: v.string(),
    fromNode: v.string(),
    toNode: v.string(),
    relationship: v.union(
      v.literal("CAUSES"),
      v.literal("IMPROVES"),
      v.literal("BLOCKS"),
      v.literal("CORRELATES"),
    ),
    strength: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if correlation already exists
    const existing = await ctx.db
      .query("correlations")
      .withIndex("by_user_from", (q) => q.eq("userId", args.userId).eq("fromNode", args.fromNode))
      .filter((q) => q.eq(q.field("toNode"), args.toNode))
      .first();

    if (existing) {
      // Update strength and count
      await ctx.db.patch(existing._id, {
        strength: (existing.strength + args.strength) / 2, // Average
        observedAt: now,
        observedCount: (existing.observedCount || 1) + 1,
      });
      return { correlationId: existing._id, action: "updated" };
    }

    const correlationId = await ctx.db.insert("correlations", {
      userId: args.userId,
      fromNode: args.fromNode,
      toNode: args.toNode,
      relationship: args.relationship,
      strength: args.strength,
      observedAt: now,
      observedCount: 1,
    });

    return { correlationId, action: "created" };
  },
});
