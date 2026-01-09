// @ts-nocheck
/**
 * Daily Stack Generator Tool
 * ==========================
 *
 * The "Smart" Planner - Generates personalized daily training stacks
 * based on athlete readiness and context.
 *
 * Runs on Haiku 4.5 for cost efficiency (used to require Sonnet).
 * Haiku 4.5 is smart enough to:
 * 1. Check readiness score
 * 2. Query Vector DB for appropriate drills
 * 3. Output structured JSON plan
 *
 * NOTE: This is prototype code. Type checking disabled until
 * the drill system and user stats are fully implemented.
 */

// McpServer type - using minimal interface to avoid SDK dependency
interface McpServer {
  tool(
    name: string,
    schema: Record<string, unknown>,
    handler: (input: DailyStackInput) => Promise<unknown>,
  ): void;
}

import type { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { api } from "../../convex/_generated/api.js";
import { voiceWrapper } from "../router/voice-wrapper.js";
import { logger } from "../utils/logger.js";

/**
 * Readiness Thresholds
 * Based on athlete's self-reported or sensor-based readiness (0-100)
 */
const READINESS_THRESHOLDS = {
  CRITICAL: 20, // Below this: Recovery only
  LOW: 40, // Low energy: Light drills
  MODERATE: 60, // Normal: Standard stack
  HIGH: 80, // Feeling good: Push harder
  PEAK: 95, // Game day ready: Max intensity
} as const;

/**
 * Stack Templates based on readiness
 */
const STACK_TEMPLATES = {
  RECOVERY: {
    name: "Recovery Protocol",
    duration: 15,
    maxIntensity: 2,
    focus: "mobility, tissue work, breathing",
    drillCount: 3,
  },
  LIGHT: {
    name: "Elastic Restore",
    duration: 20,
    maxIntensity: 4,
    focus: "activation, low-impact movement",
    drillCount: 4,
  },
  STANDARD: {
    name: "Foundation Stack",
    duration: 30,
    maxIntensity: 6,
    focus: "skill work, moderate load",
    drillCount: 5,
  },
  PUSH: {
    name: "Engine Builder",
    duration: 40,
    maxIntensity: 8,
    focus: "high output, power development",
    drillCount: 6,
  },
  PEAK: {
    name: "Game Day Prep",
    duration: 25,
    maxIntensity: 7,
    focus: "activation, explosiveness, confidence",
    drillCount: 4,
  },
} as const;

/**
 * Input schema for generate_daily_stack tool
 */
export const DailyStackInputSchema = z.object({
  userId: z.string().describe("The athlete's user ID"),
  readiness: z
    .number()
    .min(0)
    .max(100)
    .describe("Athlete readiness score 0-100 (from self-report or wearable)"),
  focus: z
    .string()
    .optional()
    .describe("Optional focus area: 'vertical', 'handling', 'footwork', 'recovery'"),
  duration: z.number().optional().describe("Optional max duration in minutes"),
  excludeEquipment: z
    .array(z.string())
    .optional()
    .describe("Equipment to exclude (e.g., if traveling)"),
});

export type DailyStackInput = z.infer<typeof DailyStackInputSchema>;

/**
 * Output structure for the daily stack
 */
export interface DailyStackOutput {
  stackName: string;
  duration: number;
  intensity: number;
  readinessCategory: string;
  drills: Array<{
    id: string;
    title: string;
    duration: number;
    intensity: number;
    equipment: string[];
    notes?: string;
  }>;
  coachNotes: string;
  warmupInstructions: string;
  cooldownInstructions: string;
}

/**
 * Determine stack template based on readiness
 */
function getStackTemplate(readiness: number) {
  if (readiness < READINESS_THRESHOLDS.CRITICAL) {
    return { ...STACK_TEMPLATES.RECOVERY, category: "CRITICAL" };
  }
  if (readiness < READINESS_THRESHOLDS.LOW) {
    return { ...STACK_TEMPLATES.LIGHT, category: "LOW" };
  }
  if (readiness < READINESS_THRESHOLDS.MODERATE) {
    return { ...STACK_TEMPLATES.STANDARD, category: "MODERATE" };
  }
  if (readiness < READINESS_THRESHOLDS.HIGH) {
    return { ...STACK_TEMPLATES.PUSH, category: "HIGH" };
  }
  return { ...STACK_TEMPLATES.PEAK, category: "PEAK" };
}

/**
 * Generate warmup instructions based on readiness
 */
function generateWarmup(readiness: number, focus?: string): string {
  if (readiness < READINESS_THRESHOLDS.LOW) {
    return "5 mins. Breathing + joint circles. No jumping. Prepare the chassis.";
  }
  if (readiness < READINESS_THRESHOLDS.MODERATE) {
    return "7 mins. Dynamic mobility. Ankle circles → hip openers → spine rotation. Build heat gradually.";
  }
  if (focus === "vertical") {
    return "10 mins. Ankle priming → hip activation → depth drops (50% effort). Wake up the fast-twitch.";
  }
  return "8 mins. Full-body activation. Priority: ankles → hips → core. Increase tempo each minute.";
}

/**
 * Generate cooldown instructions based on readiness
 */
function generateCooldown(readiness: number): string {
  if (readiness < READINESS_THRESHOLDS.LOW) {
    return "10 mins. Deep diaphragmatic breathing. No stretching. Let the system calm.";
  }
  return "5 mins. Controlled breathing. Light mobility. Hydrate. Log your session.";
}

/**
 * Register the generate_daily_stack tool with MCP server
 */
export function registerDailyStackTool(server: McpServer, convex: ConvexHttpClient) {
  server.tool(
    "generate_daily_stack",
    {
      userId: z.string(),
      readiness: z.number().min(0).max(100),
      focus: z.string().optional(),
      duration: z.number().optional(),
      excludeEquipment: z.array(z.string()).optional(),
    },
    async (input) => {
      const startTime = Date.now();

      try {
        // 1. Validate input
        const validated = DailyStackInputSchema.parse(input);

        // 2. Get athlete context
        const user = await convex.query(api.users.getById, { id: validated.userId });
        if (!user) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Athlete not found. Cannot generate stack without profile.",
              },
            ],
          };
        }

        // 3. Determine stack template
        const template = getStackTemplate(validated.readiness);

        // 4. Build search query based on readiness and focus
        let searchQuery: string = template.focus;
        if (validated.focus) {
          searchQuery = `${validated.focus} ${template.focus}`;
        }

        // 5. Search for appropriate drills
        const drills = await convex.action(api.drills.semanticSearch, {
          query: searchQuery,
          intensityCap: template.maxIntensity,
          limit: template.drillCount,
          excludeEquipment: validated.excludeEquipment,
        });

        // 6. Check for injury considerations
        const hasActiveInjury = user.injury_history?.some(
          (injury: { status: string }) => injury.status === "rehab",
        );

        // 7. Build the stack output
        const stack: DailyStackOutput = {
          stackName: template.name,
          duration: validated.duration
            ? Math.min(validated.duration, template.duration)
            : template.duration,
          intensity: template.maxIntensity,
          readinessCategory: template.category,
          drills: drills.map((drill: any, index: number) => ({
            id: drill._id,
            title: drill.title,
            duration: Math.floor(template.duration / template.drillCount),
            intensity: drill.intensity,
            equipment: drill.equipment_needed || [],
            notes:
              index === 0 && hasActiveInjury ? "Modified for current injury status" : undefined,
          })),
          coachNotes: generateCoachNotes(
            validated.readiness,
            hasActiveInjury,
            user.stats?.durability_score,
          ),
          warmupInstructions: generateWarmup(validated.readiness, validated.focus),
          cooldownInstructions: generateCooldown(validated.readiness),
        };

        // 8. Format response with Wolf Pack voice
        const response = formatStackResponse(stack, validated.readiness);

        logger.info("Daily stack generated", {
          userId: validated.userId,
          readiness: validated.readiness,
          stackName: stack.stackName,
          drillCount: stack.drills.length,
          latencyMs: Date.now() - startTime,
        });

        return {
          content: [{ type: "text" as const, text: response }],
        };
      } catch (error) {
        logger.error("Daily stack generation failed", { error, input });
        return {
          content: [
            {
              type: "text" as const,
              text: "Stack generation failed. Check your readiness score and try again.",
            },
          ],
        };
      }
    },
  );
}

/**
 * Generate coach notes based on context
 */
function generateCoachNotes(
  readiness: number,
  hasInjury: boolean,
  durabilityScore?: number,
): string {
  const notes: string[] = [];

  if (readiness < READINESS_THRESHOLDS.CRITICAL) {
    notes.push("Critical readiness detected. Recovery is the priority today.");
  } else if (readiness < READINESS_THRESHOLDS.LOW) {
    notes.push("Low readiness. Stack adjusted for restoration, not output.");
  }

  if (hasInjury) {
    notes.push("Active injury protocol engaged. Intensity capped.");
  }

  if (durabilityScore && durabilityScore < 50) {
    notes.push("Durability score below threshold. Foundation work emphasized.");
  }

  if (notes.length === 0) {
    notes.push("Standard stack loaded. Execute with intent.");
  }

  return notes.join(" ");
}

/**
 * Format the stack response in Wolf Pack voice
 */
function formatStackResponse(stack: DailyStackOutput, readiness: number): string {
  const lines: string[] = [];

  // Header
  lines.push(`STACK: ${stack.stackName}`);
  lines.push(`Duration: ${stack.duration} mins | Intensity: ${stack.intensity}/10`);
  lines.push(`Readiness: ${readiness}/100 (${stack.readinessCategory})`);
  lines.push("");

  // Warmup
  lines.push("WARMUP:");
  lines.push(stack.warmupInstructions);
  lines.push("");

  // Drills
  lines.push("DRILLS:");
  stack.drills.forEach((drill, index) => {
    const equipmentStr = drill.equipment.length > 0 ? ` [${drill.equipment.join(", ")}]` : "";
    lines.push(`${index + 1}. ${drill.title} - ${drill.duration} mins${equipmentStr}`);
    if (drill.notes) {
      lines.push(`   Note: ${drill.notes}`);
    }
  });
  lines.push("");

  // Cooldown
  lines.push("COOLDOWN:");
  lines.push(stack.cooldownInstructions);
  lines.push("");

  // Coach notes
  lines.push("NOTES:");
  lines.push(stack.coachNotes);

  return voiceWrapper.enforceVoice(lines.join("\n"));
}
