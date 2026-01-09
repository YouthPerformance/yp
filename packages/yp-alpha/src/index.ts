/**
 * @yp/alpha - The Intelligence Layer
 *
 * The "Brain" of the YP ecosystem.
 * Provides AI routing, model execution, and voice interfaces.
 */

// Re-export types
export type { ModelTier, RouteDecision } from "./config/models";

// Config exports
export * from "./config/models";
// Router exports
export * from "./router";
// Shopify exports
export * from "./shopify";
// Auth exports
export * from "./auth";
export * from "./auth/client";
// Voice exports
export * from "./voices";
