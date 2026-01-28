/**
 * Tool Registry
 * =============
 *
 * Unified tool management for Wolf Pack AI.
 * Bridges Wolf Pack tools with AI SDK tool format.
 *
 * @example
 * ```ts
 * const registry = new ToolRegistry();
 * registry.register(readinessCheckTool);
 * registry.register(injuryProtocolTool);
 *
 * const result = await generateText({
 *   model,
 *   tools: registry.getTools(),
 *   prompt: "Check my readiness for today's workout",
 * });
 * ```
 */

import { tool, type CoreTool } from "ai";
import { z } from "zod";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

/**
 * Wolf Pack tool definition
 */
export interface WolfTool<TInput extends z.ZodType, TOutput> {
  /** Unique tool name */
  name: string;
  /** Description for the LLM */
  description: string;
  /** Zod schema for input validation */
  inputSchema: TInput;
  /** Tool execution function */
  execute: (input: z.infer<TInput>, context?: ToolContext) => Promise<TOutput>;
  /** Optional metadata */
  metadata?: {
    /** Tool category */
    category?: "assessment" | "protocol" | "search" | "action";
    /** Required user permissions */
    requiredPermissions?: string[];
    /** Whether tool can modify state */
    sideEffects?: boolean;
  };
}

/**
 * Context passed to tool execution
 */
export interface ToolContext {
  userId?: string;
  conversationId?: string;
  athleteContext?: string;
}

// ─────────────────────────────────────────────────────────────
// TOOL REGISTRY
// ─────────────────────────────────────────────────────────────

/**
 * Registry for Wolf Pack tools
 *
 * Manages tool registration and converts to AI SDK format
 */
export class ToolRegistry {
  private tools: Map<string, WolfTool<z.ZodType, unknown>> = new Map();
  private aiSdkTools: Map<string, CoreTool> = new Map();
  private context: ToolContext = {};

  /**
   * Register a Wolf Pack tool
   */
  register<TInput extends z.ZodType, TOutput>(
    wolfTool: WolfTool<TInput, TOutput>,
  ): void {
    if (this.tools.has(wolfTool.name)) {
      logger.warn("Tool already registered, overwriting", {
        toolName: wolfTool.name,
      });
    }

    // Store the Wolf Pack tool
    this.tools.set(wolfTool.name, wolfTool as WolfTool<z.ZodType, unknown>);

    // Create AI SDK compatible tool
    const aiSdkTool = tool({
      description: wolfTool.description,
      parameters: wolfTool.inputSchema,
      execute: async (input) => {
        logger.info("Executing tool", {
          toolName: wolfTool.name,
          userId: this.context.userId,
        });

        const startTime = Date.now();

        try {
          const result = await wolfTool.execute(input, this.context);
          const latencyMs = Date.now() - startTime;

          logger.info("Tool execution complete", {
            toolName: wolfTool.name,
            latencyMs,
          });

          return result;
        } catch (error) {
          logger.error("Tool execution failed", {
            toolName: wolfTool.name,
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      },
    });

    this.aiSdkTools.set(wolfTool.name, aiSdkTool);

    logger.debug("Tool registered", {
      toolName: wolfTool.name,
      category: wolfTool.metadata?.category,
    });
  }

  /**
   * Unregister a tool
   */
  unregister(name: string): boolean {
    const deleted = this.tools.delete(name);
    this.aiSdkTools.delete(name);
    return deleted;
  }

  /**
   * Get a specific tool
   */
  getTool(name: string): CoreTool | undefined {
    return this.aiSdkTools.get(name);
  }

  /**
   * Get all tools as AI SDK compatible format
   */
  getTools(): Record<string, CoreTool> {
    return Object.fromEntries(this.aiSdkTools);
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(
    category: "assessment" | "protocol" | "search" | "action",
  ): Record<string, CoreTool> {
    const filtered = new Map<string, CoreTool>();

    for (const [name, wolfTool] of this.tools) {
      if (wolfTool.metadata?.category === category) {
        const aiTool = this.aiSdkTools.get(name);
        if (aiTool) {
          filtered.set(name, aiTool);
        }
      }
    }

    return Object.fromEntries(filtered);
  }

  /**
   * Set execution context
   * Call this before using tools to provide user context
   */
  setContext(context: ToolContext): void {
    this.context = context;
  }

  /**
   * Get tool names
   */
  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Check if tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Get tool count
   */
  get size(): number {
    return this.tools.size;
  }

  /**
   * Clear all tools
   */
  clear(): void {
    this.tools.clear();
    this.aiSdkTools.clear();
  }
}

// ─────────────────────────────────────────────────────────────
// FACTORY FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Create a new tool registry with optional initial tools
 */
export function createToolRegistry(
  initialTools?: Array<WolfTool<z.ZodType, unknown>>,
): ToolRegistry {
  const registry = new ToolRegistry();

  if (initialTools) {
    for (const tool of initialTools) {
      registry.register(tool);
    }
  }

  return registry;
}

// ─────────────────────────────────────────────────────────────
// HELPER: Create Wolf Tool
// ─────────────────────────────────────────────────────────────

/**
 * Helper to create a properly typed Wolf Tool
 */
export function createWolfTool<TInput extends z.ZodType, TOutput>(
  config: WolfTool<TInput, TOutput>,
): WolfTool<TInput, TOutput> {
  return config;
}
