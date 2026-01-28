/**
 * AI Module Exports
 * =================
 *
 * AI SDK primitives for Wolf Pack.
 * Provides streaming, structured output, and embeddings.
 */

// Providers
export {
  anthropic,
  openai,
  embeddingModel,
  getModel,
  MODEL_MAP,
  TOKEN_LIMITS,
  LATENCY_TARGETS,
  COST_PER_MILLION,
} from "./providers";

// Streaming
export {
  streamWolfResponse,
  streamText_,
  transformWithVoice,
  collectStream,
  type StreamContext,
  type StreamResult,
} from "./stream";

// Structured Output
export {
  // Schemas
  RouteSchema,
  MemoryExtractionSchema,
  ContentClassificationSchema,
  ReadinessSchema,
  CriticReviewSchema,
  // Types
  type RouteDecisionStructured,
  type MemoryExtraction,
  type ContentClassification,
  type ReadinessAssessment,
  type CriticReview,
  // Functions
  generateStructured,
  generateRouteDecision,
  extractMemories,
  classifyContent,
  assessReadiness,
  reviewWithCritic,
} from "./structured";

// Embeddings
export {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
  findMostSimilar,
  prepareAthleteNodeForEmbedding,
  prepareMemoryForEmbedding,
  prepareTrainingContentForEmbedding,
  type EmbeddingResult,
  type BatchEmbeddingResult,
} from "./embeddings";
