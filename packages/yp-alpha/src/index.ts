/**
 * @yp/alpha - The Intelligence Layer
 *
 * The "Brain" of the YP ecosystem.
 * Provides AI routing, model execution, and voice interfaces.
 */

// Auth exports
export * from "./auth";
export * from "./auth/client";
// Re-export types
export type { ModelTier, RouteDecision } from "./config/models";
// Config exports
export * from "./config/models";
export { default as wolfRealtimeConfig } from "./config/wolf-realtime-prompt";
// Router exports
export * from "./router";
// Shopify exports
export * from "./shopify";
// Voice exports
export * from "./voices";
// Analytics exports
export * from "./analytics";
