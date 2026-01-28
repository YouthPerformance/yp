/**
 * Memory Ingest Workflow
 * ======================
 *
 * Durable workflow for extracting and storing athlete memories.
 * Step memoization ensures only failed steps re-run on retry.
 *
 * Pipeline:
 * 1. Extract memories from conversation (memoized)
 * 2. Store memories in Convex (memoized)
 * 3. Update athlete_nodes graph (memoized)
 * 4. Generate embeddings (memoized)
 */

import { inngest } from "./inngest";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface ExtractedMemory {
  content: string;
  memoryType: "injury" | "goal" | "progress" | "emotion" | "preference" | "context";
  confidence: number;
}

interface NodeUpdate {
  key: string;
  category: "body_part" | "metric" | "mental" | "recovery";
  scoreDelta: number;
  status?: string;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────
// MEMORY EXTRACTION PATTERNS
// ─────────────────────────────────────────────────────────────

const PAIN_PATTERNS = [
  /my (\w+) (hurts?|aches?|is sore|is (swollen|stiff|tight))/gi,
  /(\w+) (pain|injury|strain|sprain)/gi,
  /(tweaked|rolled|pulled|injured) my (\w+)/gi,
];

const PROGRESS_PATTERNS = [
  /(hit|got|reached|achieved) (\d+)( inch| inches| cm)? (vertical|vert)/gi,
  /(pr|personal record|new best|pb)/gi,
  /(improved|increased|better) (my )?(\w+)/gi,
  /i (can now|finally|just) (\w+)/gi,
];

const GOAL_PATTERNS = [
  /i want to (\w+)/gi,
  /my goal is (to )?(\w+)/gi,
  /trying to (\w+)/gi,
  /working (on|towards) (\w+)/gi,
];

const BODY_PARTS = [
  "ankle", "knee", "hip", "back", "shoulder", "wrist",
  "elbow", "calf", "hamstring", "quad", "glute", "core",
  "foot", "achilles", "shin", "groin", "neck",
];

// ─────────────────────────────────────────────────────────────
// MEMORY INGEST WORKFLOW
// ─────────────────────────────────────────────────────────────

export const memoryIngestWorkflow = inngest.createFunction(
  {
    id: "memory-ingest",
    retries: 3,
    concurrency: {
      key: "event.data.userId",
      limit: 5, // Max 5 concurrent per user
    },
  },
  { event: "memory/ingest" },
  async ({ event, step }) => {
    const { userId, conversationId, userMessage, assistantResponse, intent, sentiment, voiceScore } = event.data;

    logger.info("Starting memory ingest workflow", { userId, conversationId });

    // ─────────────────────────────────────────────────────────
    // STEP 1: Extract Memories (Memoized)
    // If this step succeeds, it won't re-run on retry
    // ─────────────────────────────────────────────────────────
    const extractedMemories = await step.run("extract-memories", async () => {
      const memories: ExtractedMemory[] = [];
      const message = userMessage.toLowerCase();

      // Extract pain/injury mentions
      for (const pattern of PAIN_PATTERNS) {
        const matches = [...message.matchAll(pattern)];
        for (const match of matches) {
          memories.push({
            content: `Athlete reported: ${match[0]}`,
            memoryType: "injury",
            confidence: 0.9,
          });
        }
      }

      // Extract progress mentions
      for (const pattern of PROGRESS_PATTERNS) {
        const matches = [...message.matchAll(pattern)];
        for (const match of matches) {
          memories.push({
            content: `Progress update: ${match[0]}`,
            memoryType: "progress",
            confidence: 0.85,
          });
        }
      }

      // Extract goal mentions
      for (const pattern of GOAL_PATTERNS) {
        const matches = [...message.matchAll(pattern)];
        for (const match of matches) {
          memories.push({
            content: `Goal mentioned: ${match[0]}`,
            memoryType: "goal",
            confidence: 0.8,
          });
        }
      }

      // Extract emotional state from sentiment
      if (sentiment && sentiment !== "NEUTRAL") {
        memories.push({
          content: `Emotional state detected: ${sentiment} - "${userMessage.substring(0, 100)}"`,
          memoryType: "emotion",
          confidence: 0.75,
        });
      }

      logger.info("Extracted memories", { count: memories.length, userId });
      return memories;
    });

    // ─────────────────────────────────────────────────────────
    // STEP 2: Identify Node Updates (Memoized)
    // ─────────────────────────────────────────────────────────
    const nodeUpdates = await step.run("identify-node-updates", async () => {
      const updates: NodeUpdate[] = [];
      const message = userMessage.toLowerCase();

      // Check for body part mentions with negative indicators
      for (const part of BODY_PARTS) {
        if (message.includes(part)) {
          const isNegative = PAIN_PATTERNS.some((p) =>
            new RegExp(`${part}[^.]*?(hurt|pain|sore|injury|strain|swollen|stiff|tight)`, "i").test(message)
          );

          if (isNegative) {
            updates.push({
              key: part,
              category: "body_part",
              scoreDelta: -2,
              status: "Sore",
              notes: `Conversation mention: ${userMessage.substring(0, 100)}`,
            });
          }
        }
      }

      // Check for positive progress indicators
      if (PROGRESS_PATTERNS.some(p => p.test(message))) {
        const mentionedParts = BODY_PARTS.filter(part => message.includes(part));
        for (const part of mentionedParts) {
          updates.push({
            key: part,
            category: "body_part",
            scoreDelta: 1,
            status: "Improving",
            notes: `Progress noted: ${userMessage.substring(0, 100)}`,
          });
        }
      }

      logger.info("Identified node updates", { count: updates.length, userId });
      return updates;
    });

    // ─────────────────────────────────────────────────────────
    // STEP 3: Store Memories in Convex (Memoized)
    // This is where Convex mutations would be called
    // ─────────────────────────────────────────────────────────
    const storedMemoryIds = await step.run("store-memories", async () => {
      // In production, this would call Convex mutations
      // For now, return placeholder IDs
      const ids = extractedMemories.map((_, index) => `memory_${Date.now()}_${index}`);

      logger.info("Stored memories", { count: ids.length, userId });
      return ids;
    });

    // ─────────────────────────────────────────────────────────
    // STEP 4: Update Athlete Nodes (Memoized)
    // If steps 1-3 succeed but this fails, only this reruns
    // ─────────────────────────────────────────────────────────
    const updatedNodeIds = await step.run("update-nodes", async () => {
      // In production, this would call Convex mutations
      const ids = nodeUpdates.map((update) => `node_${userId}_${update.key}`);

      logger.info("Updated athlete nodes", { count: ids.length, userId });
      return ids;
    });

    // ─────────────────────────────────────────────────────────
    // STEP 5: Store Conversation Messages (Memoized)
    // ─────────────────────────────────────────────────────────
    await step.run("store-messages", async () => {
      // In production, this would store messages in Convex
      logger.info("Stored conversation messages", {
        userId,
        conversationId,
        userMessageLength: userMessage.length,
        assistantResponseLength: assistantResponse.length,
      });

      return {
        userMessageId: `msg_${Date.now()}_user`,
        assistantMessageId: `msg_${Date.now()}_assistant`,
      };
    });

    // ─────────────────────────────────────────────────────────
    // STEP 6: Queue Embedding Generation (Memoized)
    // Only high-value memories get embedded
    // ─────────────────────────────────────────────────────────
    const embeddingQueued = await step.run("queue-embeddings", async () => {
      const highValueMemories = extractedMemories.filter(m => m.confidence >= 0.8);

      if (highValueMemories.length > 0) {
        // In production, this would send embed events
        logger.info("Queued embeddings for high-value memories", {
          count: highValueMemories.length,
          userId,
        });
      }

      return highValueMemories.length;
    });

    // ─────────────────────────────────────────────────────────
    // RETURN SUMMARY
    // ─────────────────────────────────────────────────────────
    return {
      success: true,
      userId,
      conversationId,
      memoriesExtracted: extractedMemories.length,
      memoriesStored: storedMemoryIds.length,
      nodesUpdated: updatedNodeIds.length,
      embeddingsQueued: embeddingQueued,
      metadata: {
        intent,
        sentiment,
        voiceScore,
      },
    };
  }
);

// ─────────────────────────────────────────────────────────────
// MEMORY CONSOLIDATE WORKFLOW
// ─────────────────────────────────────────────────────────────

export const memoryConsolidateWorkflow = inngest.createFunction(
  {
    id: "memory-consolidate",
    retries: 2,
  },
  { event: "memory/consolidate" },
  async ({ event, step }) => {
    const { userId } = event.data;

    logger.info("Starting memory consolidation", { userId });

    // Step 1: Fetch unprocessed memories
    const memories = await step.run("fetch-unprocessed", async () => {
      // In production, query Convex for unprocessed memories
      return [];
    });

    // Step 2: Analyze patterns
    const patterns = await step.run("analyze-patterns", async () => {
      // Use LLM to identify patterns across memories
      return {
        correlations: [],
        nodeUpdates: [],
      };
    });

    // Step 3: Update graph
    await step.run("update-graph", async () => {
      // Apply patterns to athlete_nodes and correlations
      logger.info("Updated graph with patterns", {
        userId,
        correlations: patterns.correlations.length,
        nodeUpdates: patterns.nodeUpdates.length,
      });
    });

    // Step 4: Mark memories as processed
    await step.run("mark-processed", async () => {
      logger.info("Marked memories as processed", { userId });
    });

    return {
      success: true,
      userId,
      memoriesProcessed: memories.length,
      patternsFound: patterns.correlations.length,
    };
  }
);
