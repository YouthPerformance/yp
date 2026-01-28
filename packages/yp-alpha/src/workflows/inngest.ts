/**
 * Inngest Client + Event Schemas
 * ==============================
 *
 * Durable workflow infrastructure for async operations.
 * Step memoization ensures retries only re-run failed steps.
 *
 * Events:
 * - memory/ingest: Extract and store athlete memories
 * - content/embed: Generate embeddings for content
 * - voice/audit: Batch voice compliance auditing
 */

import { Inngest, EventSchemas } from "inngest";

// ─────────────────────────────────────────────────────────────
// EVENT TYPES
// ─────────────────────────────────────────────────────────────

/**
 * Memory Ingest Event
 * Triggered after each AskYP conversation
 */
export interface MemoryIngestEvent {
  name: "memory/ingest";
  data: {
    userId: string;
    conversationId: string;
    userMessage: string;
    assistantResponse: string;
    intent?: string;
    sentiment?: string;
    voiceScore?: number;
  };
}

/**
 * Content Embed Event
 * Triggered when content needs embedding
 */
export interface ContentEmbedEvent {
  name: "content/embed";
  data: {
    contentType: "drill" | "protocol" | "guide" | "qna" | "athlete_node";
    contentId: string;
    text: string;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Batch Embed Event
 * Triggered for bulk embedding operations
 */
export interface BatchEmbedEvent {
  name: "content/batch-embed";
  data: {
    contentType: "drill" | "protocol" | "guide" | "qna" | "athlete_node";
    contentIds: string[];
  };
}

/**
 * Voice Audit Event
 * Triggered for batch voice compliance checking
 */
export interface VoiceAuditEvent {
  name: "voice/audit";
  data: {
    responses: Array<{
      id: string;
      content: string;
      model: string;
    }>;
  };
}

/**
 * Memory Consolidate Event
 * Triggered to consolidate memories into athlete_nodes
 */
export interface MemoryConsolidateEvent {
  name: "memory/consolidate";
  data: {
    userId: string;
  };
}

/**
 * Critic Review Event
 * Triggered for Loop-Against-Critic pattern
 */
export interface CriticReviewEvent {
  name: "critic/review";
  data: {
    content: string;
    contentType?: "response" | "article" | "plan" | "email" | "social";
    userId?: string;
    config?: {
      approvalThreshold?: number;
      maxAttempts?: number;
      guidelines?: string;
      failOnCritical?: boolean;
      focusAreas?: Array<"voice" | "accuracy" | "safety" | "clarity" | "tone">;
    };
    metadata?: {
      traceId?: string;
      onRejection?: boolean;
    };
  };
}

/**
 * Critic Batch Review Event
 * Triggered for batch content review
 */
export interface CriticBatchReviewEvent {
  name: "critic/batch-review";
  data: {
    contents: string[];
    contentType?: "response" | "article" | "plan" | "email" | "social";
    userId?: string;
    config?: {
      approvalThreshold?: number;
      maxAttempts?: number;
      failOnCritical?: boolean;
    };
  };
}

/**
 * Critic Quick Review Event
 * Triggered for single-pass review without revision
 */
export interface CriticQuickReviewEvent {
  name: "critic/quick-review";
  data: {
    content: string;
    contentType?: "response" | "article" | "plan" | "email" | "social";
    userId?: string;
    metadata?: {
      traceId?: string;
    };
  };
}

// ─────────────────────────────────────────────────────────────
// TOM CHIEF OF STAFF EVENTS
// ─────────────────────────────────────────────────────────────

export type TomUserId = "mike" | "james" | "adam" | "annie";

/**
 * Tom Briefing Event
 * Triggered to generate and deliver morning/weekly briefings
 */
export interface TomBriefingEvent {
  name: "tom/briefing";
  data: {
    userId: TomUserId;
    briefingType: "morning" | "weekly";
    deliveryMethod?: "email" | "whatsapp";
  };
}

/**
 * Tom Capture Event
 * Triggered when a message is received via WhatsApp/voice
 */
export interface TomCaptureEvent {
  name: "tom/capture";
  data: {
    userId: TomUserId;
    content: string;
    source: "voice" | "text" | "whatsapp";
    messageId?: string;
  };
}

/**
 * Tom Knowledge Sync Event
 * Triggered to sync Google Drive/Notion documents
 */
export interface TomKnowledgeSyncEvent {
  name: "tom/knowledge-sync";
  data: {
    userId: TomUserId;
    folderId?: string;
  };
}

/**
 * Tom Trend Scan Event
 * Triggered to scan trending topics (primarily for Adam)
 */
export interface TomTrendScanEvent {
  name: "tom/trend-scan";
  data: {
    userId: TomUserId;
    category: "nba" | "youth_sports" | "basketball_skills" | "general";
  };
}

// ─────────────────────────────────────────────────────────────
// EVENT SCHEMA TYPE
// ─────────────────────────────────────────────────────────────

export type WolfPackEvents = {
  "memory/ingest": MemoryIngestEvent;
  "content/embed": ContentEmbedEvent;
  "content/batch-embed": BatchEmbedEvent;
  "voice/audit": VoiceAuditEvent;
  "memory/consolidate": MemoryConsolidateEvent;
  "critic/review": CriticReviewEvent;
  "critic/batch-review": CriticBatchReviewEvent;
  "critic/quick-review": CriticQuickReviewEvent;
  // Tom COS Events
  "tom/briefing": TomBriefingEvent;
  "tom/capture": TomCaptureEvent;
  "tom/knowledge-sync": TomKnowledgeSyncEvent;
  "tom/trend-scan": TomTrendScanEvent;
};

// ─────────────────────────────────────────────────────────────
// INNGEST CLIENT
// ─────────────────────────────────────────────────────────────

/**
 * Create Inngest client with typed events
 */
export const inngest = new Inngest({
  id: "yp-wolf-pack",
  schemas: new EventSchemas().fromRecord<WolfPackEvents>(),
});

// ─────────────────────────────────────────────────────────────
// HELPER: Send Event
// ─────────────────────────────────────────────────────────────

/**
 * Send a memory ingest event
 */
export async function triggerMemoryIngest(data: MemoryIngestEvent["data"]) {
  return inngest.send({
    name: "memory/ingest",
    data,
  });
}

/**
 * Send a content embed event
 */
export async function triggerContentEmbed(data: ContentEmbedEvent["data"]) {
  return inngest.send({
    name: "content/embed",
    data,
  });
}

/**
 * Send a batch embed event
 */
export async function triggerBatchEmbed(data: BatchEmbedEvent["data"]) {
  return inngest.send({
    name: "content/batch-embed",
    data,
  });
}

/**
 * Send a voice audit event
 */
export async function triggerVoiceAudit(data: VoiceAuditEvent["data"]) {
  return inngest.send({
    name: "voice/audit",
    data,
  });
}

/**
 * Send a memory consolidate event
 */
export async function triggerMemoryConsolidate(data: MemoryConsolidateEvent["data"]) {
  return inngest.send({
    name: "memory/consolidate",
    data,
  });
}

/**
 * Send a critic review event
 */
export async function triggerCriticReview(data: CriticReviewEvent["data"]) {
  return inngest.send({
    name: "critic/review",
    data,
  });
}

/**
 * Send a critic batch review event
 */
export async function triggerCriticBatchReview(data: CriticBatchReviewEvent["data"]) {
  return inngest.send({
    name: "critic/batch-review",
    data,
  });
}

/**
 * Send a critic quick review event
 */
export async function triggerCriticQuickReview(data: CriticQuickReviewEvent["data"]) {
  return inngest.send({
    name: "critic/quick-review",
    data,
  });
}

// ─────────────────────────────────────────────────────────────
// TOM COS HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Send a Tom briefing event
 */
export async function triggerTomBriefing(data: TomBriefingEvent["data"]) {
  return inngest.send({
    name: "tom/briefing",
    data,
  });
}

/**
 * Send a Tom capture event
 */
export async function triggerTomCapture(data: TomCaptureEvent["data"]) {
  return inngest.send({
    name: "tom/capture",
    data,
  });
}

/**
 * Send a Tom knowledge sync event
 */
export async function triggerTomKnowledgeSync(data: TomKnowledgeSyncEvent["data"]) {
  return inngest.send({
    name: "tom/knowledge-sync",
    data,
  });
}

/**
 * Send a Tom trend scan event
 */
export async function triggerTomTrendScan(data: TomTrendScanEvent["data"]) {
  return inngest.send({
    name: "tom/trend-scan",
    data,
  });
}
