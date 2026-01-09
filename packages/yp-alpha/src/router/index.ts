/**
 * Router Module Exports
 * =====================
 *
 * The complete Wolf Router system:
 * - WolfRouter: Classification and routing
 * - VoiceWrapper: Wolf Pack voice enforcement
 * - ModelExecutor: Execution with the right model
 */

export type { ExecutionContext, ExecutionResult } from "./model-executor.js";
export { ModelExecutor, modelExecutor } from "./model-executor.js";

export {
  enforceWolfPackVoice,
  getWolfPackPrompt,
  VoiceWrapper,
  voiceWrapper,
} from "./voice-wrapper.js";
export type { RouteClassification, UserContext } from "./wolf-router.js";
export { RouteSchema, WolfRouter, wolfRouter } from "./wolf-router.js";

/**
 * Main entry point for routing a request
 *
 * Usage:
 * ```ts
 * import { routeAndExecute } from "./router";
 *
 * const result = await routeAndExecute(
 *   "I feel like quitting",
 *   { userId: "user123", durabilityScore: 45 }
 * );
 * console.log(result.response); // Wolf Pack voice response
 * console.log(result.model);    // "claude-sonnet-4-5-..." (escalated due to sentiment)
 * ```
 */
export async function routeAndExecute(
  query: string,
  userContext: import("./wolf-router.js").UserContext,
  executionContext?: Partial<import("./model-executor.js").ExecutionContext>,
): Promise<import("./model-executor.js").ExecutionResult> {
  const { wolfRouter } = await import("./wolf-router.js");
  const { modelExecutor } = await import("./model-executor.js");

  // 1. Route the request
  const routeDecision = await wolfRouter.route(query, userContext);

  // 2. Check for frustrated loop - proactive intervention
  if (wolfRouter.isFrustratedLoop(userContext.userId)) {
    // Override with coaching even if routed to execution
    routeDecision.selectedModel = "SMART";
    routeDecision.reasoning += " [ESCALATED: Frustrated loop detected]";
  }

  // 3. Check for auto-escalation (previous failures)
  if (wolfRouter.shouldAutoEscalate(userContext.userId, routeDecision)) {
    routeDecision.selectedModel = "SMART";
    routeDecision.reasoning += " [ESCALATED: Previous failures]";
  }

  // 4. Execute with the selected model
  const result = await modelExecutor.executeWithRetry(query, routeDecision, {
    userId: userContext.userId,
    ...executionContext,
  });

  // 5. Reset failure count on success
  wolfRouter.resetFailures(userContext.userId);

  return result;
}
