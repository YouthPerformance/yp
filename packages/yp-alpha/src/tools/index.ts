/**
 * Tools Module Exports
 * ====================
 *
 * AI SDK compatible tools for Wolf Pack.
 * Use with generateText({ tools: registry.getTools() })
 */

// Registry
export {
  ToolRegistry,
  createToolRegistry,
  createWolfTool,
  type WolfTool,
  type ToolContext,
} from "./registry";

// Built-in Tools
export { readinessCheckTool } from "./readiness-check";
export { injuryProtocolTool } from "./injury-protocol";

// ─────────────────────────────────────────────────────────────
// PRE-CONFIGURED REGISTRY
// ─────────────────────────────────────────────────────────────

import { ToolRegistry } from "./registry";
import { readinessCheckTool } from "./readiness-check";
import { injuryProtocolTool } from "./injury-protocol";

/**
 * Get a pre-configured registry with all Wolf Pack tools
 */
export function getWolfPackTools(): ToolRegistry {
  const registry = new ToolRegistry();
  registry.register(readinessCheckTool);
  registry.register(injuryProtocolTool);
  return registry;
}

/**
 * Default Wolf Pack tool registry
 */
export const wolfPackTools = getWolfPackTools();
