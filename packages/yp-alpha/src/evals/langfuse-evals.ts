/**
 * Langfuse Evaluations
 * ====================
 *
 * Push evaluation scores to Langfuse for tracking and analysis.
 * Integrates with voice compliance and other eval frameworks.
 *
 * @example
 * ```ts
 * await submitEvaluation(traceId, "voice_compliance", result.score / 100);
 * await submitVoiceEvaluation(traceId, voiceComplianceResult);
 * ```
 */

import { submitScore, submitVoiceScore } from "../observability/langfuse";
import {
  evaluateVoiceCompliance,
  type VoiceComplianceResult,
} from "./voice-compliance";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface EvaluationResult {
  name: string;
  score: number;
  passed: boolean;
  details?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// VOICE EVALUATION
// ─────────────────────────────────────────────────────────────

/**
 * Evaluate and submit voice compliance score to Langfuse
 *
 * @param traceId - Langfuse trace ID
 * @param observationId - Optional observation ID for generation-level scoring
 * @param text - Text to evaluate
 * @returns Evaluation result
 */
export async function evaluateAndSubmitVoice(
  traceId: string,
  observationId: string | undefined,
  text: string,
): Promise<EvaluationResult> {
  // Run voice compliance evaluation
  const result = evaluateVoiceCompliance(text);

  // Submit to Langfuse
  await submitVoiceScore(
    traceId,
    observationId || traceId,
    result.score,
    result.violations.map((v) => v.term),
  );

  logger.info("Voice evaluation submitted", {
    traceId,
    score: result.score,
    passed: result.passed,
  });

  return {
    name: "voice_compliance",
    score: result.score,
    passed: result.passed,
    details: {
      violations: result.violations,
      summary: result.summary,
    },
  };
}

/**
 * Submit a pre-computed voice compliance result to Langfuse
 */
export async function submitVoiceEvaluation(
  traceId: string,
  observationId: string | undefined,
  result: VoiceComplianceResult,
): Promise<void> {
  await submitVoiceScore(
    traceId,
    observationId || traceId,
    result.score,
    result.violations.map((v) => v.term),
  );

  logger.debug("Voice evaluation submitted to Langfuse", {
    traceId,
    score: result.score,
  });
}

// ─────────────────────────────────────────────────────────────
// GENERIC EVALUATION
// ─────────────────────────────────────────────────────────────

/**
 * Submit a generic evaluation score to Langfuse
 *
 * @param traceId - Langfuse trace ID
 * @param name - Evaluation name (e.g., "relevance", "accuracy")
 * @param score - Score (0-1 for Langfuse)
 * @param details - Optional details
 */
export async function submitEvaluation(
  traceId: string,
  name: string,
  score: number,
  details?: Record<string, unknown>,
): Promise<void> {
  await submitScore({
    traceId,
    name,
    value: score,
    comment: details?.comment as string | undefined,
  });

  logger.debug("Evaluation submitted to Langfuse", {
    traceId,
    name,
    score,
  });
}

// ─────────────────────────────────────────────────────────────
// BATCH EVALUATION
// ─────────────────────────────────────────────────────────────

interface BatchEvaluationItem {
  traceId: string;
  observationId?: string;
  text: string;
}

/**
 * Evaluate and submit multiple voice compliance scores
 */
export async function evaluateAndSubmitVoiceBatch(
  items: BatchEvaluationItem[],
): Promise<{
  results: Array<EvaluationResult & { traceId: string }>;
  summary: {
    total: number;
    passed: number;
    averageScore: number;
  };
}> {
  const results: Array<EvaluationResult & { traceId: string }> = [];

  for (const item of items) {
    const result = await evaluateAndSubmitVoice(
      item.traceId,
      item.observationId,
      item.text,
    );
    results.push({ ...result, traceId: item.traceId });
  }

  const passed = results.filter((r) => r.passed).length;
  const averageScore =
    results.reduce((sum, r) => sum + r.score, 0) / results.length;

  return {
    results,
    summary: {
      total: items.length,
      passed,
      averageScore: Math.round(averageScore * 10) / 10,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// QUALITY GATE
// ─────────────────────────────────────────────────────────────

/**
 * Run all evaluations and determine if content passes quality gate
 *
 * @param traceId - Langfuse trace ID
 * @param text - Text to evaluate
 * @param gates - Quality gates to check
 * @returns Whether all gates pass
 */
export async function runQualityGate(
  traceId: string,
  text: string,
  gates: {
    voiceThreshold?: number;
    minLength?: number;
    maxLength?: number;
  } = {},
): Promise<{
  passed: boolean;
  results: EvaluationResult[];
  failedGates: string[];
}> {
  const results: EvaluationResult[] = [];
  const failedGates: string[] = [];

  const voiceThreshold = gates.voiceThreshold ?? 70;
  const minLength = gates.minLength ?? 10;
  const maxLength = gates.maxLength ?? 10000;

  // Voice compliance
  const voiceResult = evaluateVoiceCompliance(text, voiceThreshold);
  results.push({
    name: "voice_compliance",
    score: voiceResult.score,
    passed: voiceResult.passed,
    details: { summary: voiceResult.summary },
  });
  if (!voiceResult.passed) {
    failedGates.push("voice_compliance");
  }

  // Length check
  const lengthPassed = text.length >= minLength && text.length <= maxLength;
  results.push({
    name: "length_check",
    score: lengthPassed ? 100 : 0,
    passed: lengthPassed,
    details: { length: text.length, minLength, maxLength },
  });
  if (!lengthPassed) {
    failedGates.push("length_check");
  }

  // Submit scores to Langfuse
  await submitVoiceScore(traceId, traceId, voiceResult.score, []);

  const passed = failedGates.length === 0;

  logger.info("Quality gate evaluated", {
    traceId,
    passed,
    failedGates,
  });

  return {
    passed,
    results,
    failedGates,
  };
}
