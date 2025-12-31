/**
 * @yp/alpha - The Intelligence Layer
 *
 * The "Brain" of the YP ecosystem.
 * Provides AI routing, model execution, and voice interfaces.
 */

// Router exports
export * from "./router";

// Config exports
export * from "./config/models";

// Re-export types
export type { ModelConfig, ModelProvider } from "./config/models";
