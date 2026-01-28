/**
 * Workflows Module Exports
 * ========================
 *
 * Inngest durable workflows for async operations.
 */

// Inngest client and event types
export {
  inngest,
  type MemoryIngestEvent,
  type ContentEmbedEvent,
  type BatchEmbedEvent,
  type VoiceAuditEvent,
  type MemoryConsolidateEvent,
  type CriticReviewEvent,
  type CriticBatchReviewEvent,
  type CriticQuickReviewEvent,
  type WolfPackEvents,
  // Tom COS event types
  type TomUserId,
  type TomBriefingEvent,
  type TomCaptureEvent,
  type TomKnowledgeSyncEvent,
  type TomTrendScanEvent,
  // Helper functions
  triggerMemoryIngest,
  triggerContentEmbed,
  triggerBatchEmbed,
  triggerVoiceAudit,
  triggerMemoryConsolidate,
  triggerCriticReview,
  triggerCriticBatchReview,
  triggerCriticQuickReview,
  // Tom COS helpers
  triggerTomBriefing,
  triggerTomCapture,
  triggerTomKnowledgeSync,
  triggerTomTrendScan,
} from "./inngest";

// Workflow functions
export {
  memoryIngestWorkflow,
  memoryConsolidateWorkflow,
} from "./memory-ingest";

export {
  contentEmbedWorkflow,
  batchEmbedWorkflow,
  voiceAuditWorkflow,
} from "./content-embed";

export {
  criticReviewWorkflow,
  criticBatchReviewWorkflow,
  quickReviewWorkflow,
} from "./critic-review";

// Tom COS workflows
export { tomBriefingWorkflow } from "./tom-briefing";
export { tomCaptureWorkflow } from "./tom-capture";

// All workflows for Inngest serve
import { memoryIngestWorkflow, memoryConsolidateWorkflow } from "./memory-ingest";
import { contentEmbedWorkflow, batchEmbedWorkflow, voiceAuditWorkflow } from "./content-embed";
import { criticReviewWorkflow, criticBatchReviewWorkflow, quickReviewWorkflow } from "./critic-review";
import { tomBriefingWorkflow } from "./tom-briefing";
import { tomCaptureWorkflow } from "./tom-capture";

export const allWorkflows = [
  memoryIngestWorkflow,
  memoryConsolidateWorkflow,
  contentEmbedWorkflow,
  batchEmbedWorkflow,
  voiceAuditWorkflow,
  criticReviewWorkflow,
  criticBatchReviewWorkflow,
  quickReviewWorkflow,
  // Tom COS workflows
  tomBriefingWorkflow,
  tomCaptureWorkflow,
];
