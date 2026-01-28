/**
 * Critic Module Exports
 * =====================
 *
 * Loop-Against-Critic pattern for content quality gates.
 * Uses Opus as critic to review and improve content.
 */

// Types
export {
  CriticIssueSchema,
  CriticReviewSchema,
  CRITIC_PROMPTS,
  DEFAULT_CRITIC_CONFIG,
  type CriticIssue,
  type CriticReview,
  type CriticConfig,
  type CriticIteration,
  type CriticLoopResult,
  type RevisionRequest,
} from "./types";

// Runner
export {
  runCriticLoop,
  quickReview,
  reviewBatch,
} from "./runner";
