/**
 * Readiness Check Tool
 * ====================
 *
 * Assesses athlete readiness for training based on input factors.
 * Returns recommendation: full_send, moderate, light, or rest.
 *
 * @example
 * ```ts
 * registry.register(readinessCheckTool);
 *
 * // LLM can then use: "Check readiness: slept 6 hours, legs are sore"
 * ```
 */

import { z } from "zod";
import { createWolfTool, type ToolContext } from "./registry";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const ReadinessInputSchema = z.object({
  /** Sleep hours last night (0-12) */
  sleepHours: z.number().min(0).max(12).optional(),
  /** Sleep quality (1-10) */
  sleepQuality: z.number().min(1).max(10).optional(),
  /** Overall energy level (1-10) */
  energyLevel: z.number().min(1).max(10).optional(),
  /** Muscle soreness level (1-10, higher = more sore) */
  sorenessLevel: z.number().min(1).max(10).optional(),
  /** Motivation to train (1-10) */
  motivationLevel: z.number().min(1).max(10).optional(),
  /** Stress level (1-10, higher = more stressed) */
  stressLevel: z.number().min(1).max(10).optional(),
  /** Days since last rest day */
  daysSinceRest: z.number().min(0).optional(),
  /** Free text describing how they feel */
  feelingDescription: z.string().optional(),
});

type ReadinessInput = z.infer<typeof ReadinessInputSchema>;

// ─────────────────────────────────────────────────────────────
// OUTPUT TYPE
// ─────────────────────────────────────────────────────────────

interface ReadinessOutput {
  recommendation: "full_send" | "moderate" | "light" | "rest";
  overallScore: number;
  factors: {
    sleep: number;
    energy: number;
    soreness: number;
    motivation: number;
    stress: number;
    recovery: number;
  };
  reasoning: string;
  warnings: string[];
  suggestions: string[];
}

// ─────────────────────────────────────────────────────────────
// TOOL IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

async function executeReadinessCheck(
  input: ReadinessInput,
  context?: ToolContext,
): Promise<ReadinessOutput> {
  logger.info("Running readiness check", { userId: context?.userId });

  // Default values if not provided
  const sleepHours = input.sleepHours ?? 7;
  const sleepQuality = input.sleepQuality ?? 7;
  const energyLevel = input.energyLevel ?? 7;
  const sorenessLevel = input.sorenessLevel ?? 3;
  const motivationLevel = input.motivationLevel ?? 7;
  const stressLevel = input.stressLevel ?? 3;
  const daysSinceRest = input.daysSinceRest ?? 2;

  // Calculate factor scores (normalized to 1-10)
  const sleepScore = Math.min(10, (sleepHours / 8) * sleepQuality);
  const energyScore = energyLevel;
  const sorenessScore = 11 - sorenessLevel; // Invert (lower soreness = higher score)
  const motivationScore = motivationLevel;
  const stressScore = 11 - stressLevel; // Invert (lower stress = higher score)
  const recoveryScore = Math.max(1, 10 - daysSinceRest * 1.5);

  // Calculate overall score (weighted average)
  const weights = {
    sleep: 0.25,
    energy: 0.20,
    soreness: 0.20,
    motivation: 0.15,
    stress: 0.10,
    recovery: 0.10,
  };

  const overallScore =
    sleepScore * weights.sleep +
    energyScore * weights.energy +
    sorenessScore * weights.soreness +
    motivationScore * weights.motivation +
    stressScore * weights.stress +
    recoveryScore * weights.recovery;

  // Determine recommendation
  let recommendation: ReadinessOutput["recommendation"];
  let reasoning: string;

  if (overallScore >= 8) {
    recommendation = "full_send";
    reasoning = "Your body is primed. Hit it hard today.";
  } else if (overallScore >= 6) {
    recommendation = "moderate";
    reasoning = "Good enough to train, but listen to your body. Don't push through pain.";
  } else if (overallScore >= 4) {
    recommendation = "light";
    reasoning = "Active recovery day. Movement is medicine, but keep intensity low.";
  } else {
    recommendation = "rest";
    reasoning = "Your body needs recovery. Rest today, dominate tomorrow.";
  }

  // Generate warnings
  const warnings: string[] = [];
  if (sleepHours < 6) warnings.push("Sleep debt detected. Prioritize sleep tonight.");
  if (sorenessLevel >= 8) warnings.push("High soreness. Avoid loading sore areas.");
  if (daysSinceRest >= 5) warnings.push("Extended training block. Rest day coming soon.");
  if (stressLevel >= 8) warnings.push("High stress affects recovery. Consider meditation.");

  // Generate suggestions
  const suggestions: string[] = [];
  if (recommendation === "light") {
    suggestions.push("Try mobility work or a light jog");
    suggestions.push("Focus on technique over intensity");
  }
  if (recommendation === "rest") {
    suggestions.push("Sleep, hydrate, eat well");
    suggestions.push("Light stretching if you need to move");
  }
  if (sorenessLevel >= 6) {
    suggestions.push("Foam rolling and contrast showers can help");
  }

  return {
    recommendation,
    overallScore: Math.round(overallScore * 10) / 10,
    factors: {
      sleep: Math.round(sleepScore * 10) / 10,
      energy: Math.round(energyScore * 10) / 10,
      soreness: Math.round(sorenessScore * 10) / 10,
      motivation: Math.round(motivationScore * 10) / 10,
      stress: Math.round(stressScore * 10) / 10,
      recovery: Math.round(recoveryScore * 10) / 10,
    },
    reasoning,
    warnings,
    suggestions,
  };
}

// ─────────────────────────────────────────────────────────────
// EXPORT TOOL
// ─────────────────────────────────────────────────────────────

export const readinessCheckTool = createWolfTool({
  name: "readiness_check",
  description:
    "Assess athlete readiness for training based on sleep, energy, soreness, motivation, and stress. Returns a recommendation (full_send, moderate, light, or rest) with detailed reasoning.",
  inputSchema: ReadinessInputSchema,
  execute: executeReadinessCheck,
  metadata: {
    category: "assessment",
    sideEffects: false,
  },
});
