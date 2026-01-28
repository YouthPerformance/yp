/**
 * Injury Protocol Tool
 * ====================
 *
 * Provides safe guidance for common athletic injuries.
 * Always recommends professional consultation for serious injuries.
 *
 * @example
 * ```ts
 * registry.register(injuryProtocolTool);
 *
 * // LLM can then use: "My ankle hurts after landing from a jump"
 * ```
 */

import { z } from "zod";
import { createWolfTool, type ToolContext } from "./registry";
import { logger } from "../utils/logger";

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const InjuryInputSchema = z.object({
  /** Affected body part */
  bodyPart: z.enum([
    "ankle",
    "knee",
    "hip",
    "back",
    "shoulder",
    "wrist",
    "elbow",
    "calf",
    "hamstring",
    "quad",
    "groin",
    "foot",
    "achilles",
    "neck",
  ]),
  /** Type of pain/injury */
  injuryType: z.enum([
    "soreness",
    "sharp_pain",
    "dull_ache",
    "swelling",
    "stiffness",
    "instability",
    "weakness",
    "numbness",
    "popping",
  ]),
  /** Pain level (1-10) */
  painLevel: z.number().min(1).max(10),
  /** How it happened */
  mechanism: z.string().optional(),
  /** How long ago it started */
  duration: z.enum(["just_now", "today", "few_days", "week_plus"]),
  /** Can they bear weight/use the area? */
  canFunction: z.boolean(),
});

type InjuryInput = z.infer<typeof InjuryInputSchema>;

// ─────────────────────────────────────────────────────────────
// OUTPUT TYPE
// ─────────────────────────────────────────────────────────────

interface InjuryOutput {
  severity: "minor" | "moderate" | "serious" | "emergency";
  immediateAction: string[];
  avoidActions: string[];
  protocol: {
    name: string;
    steps: string[];
    duration: string;
  };
  shouldSeeProfessional: boolean;
  professionalType: string | null;
  safeActivities: string[];
  warnings: string[];
  redFlags: string[];
}

// ─────────────────────────────────────────────────────────────
// PROTOCOL DATABASE
// ─────────────────────────────────────────────────────────────

const PROTOCOLS: Record<string, { name: string; steps: string[]; duration: string }> = {
  rice: {
    name: "RICE Protocol",
    steps: [
      "Rest: Avoid activities that cause pain",
      "Ice: Apply for 15-20 min every 2-3 hours",
      "Compression: Use elastic bandage if swelling",
      "Elevation: Keep area above heart level when possible",
    ],
    duration: "48-72 hours",
  },
  active_recovery: {
    name: "Active Recovery",
    steps: [
      "Light movement to promote blood flow",
      "Gentle stretching within pain-free range",
      "Self-massage or foam rolling nearby areas",
      "Heat application to relax muscles",
    ],
    duration: "1-3 days",
  },
  mobility_focus: {
    name: "Mobility Restoration",
    steps: [
      "Assess range of motion",
      "Controlled articular rotations (CARs)",
      "Progressive stretching",
      "Strengthening at end ranges",
    ],
    duration: "1-2 weeks",
  },
  strength_rehab: {
    name: "Strength Rehabilitation",
    steps: [
      "Isometric holds (no movement, build strength)",
      "Eccentric loading (controlled lowering)",
      "Full range strengthening",
      "Sport-specific movement patterns",
    ],
    duration: "2-6 weeks depending on severity",
  },
};

// ─────────────────────────────────────────────────────────────
// TOOL IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

async function executeInjuryProtocol(
  input: InjuryInput,
  context?: ToolContext,
): Promise<InjuryOutput> {
  logger.info("Running injury protocol", {
    userId: context?.userId,
    bodyPart: input.bodyPart,
    injuryType: input.injuryType,
  });

  // Calculate severity
  let severity: InjuryOutput["severity"];
  const severityScore =
    input.painLevel +
    (input.canFunction ? 0 : 3) +
    (input.injuryType === "numbness" ? 3 : 0) +
    (input.injuryType === "instability" ? 2 : 0) +
    (input.injuryType === "popping" ? 2 : 0) +
    (input.duration === "week_plus" && input.painLevel > 5 ? 2 : 0);

  if (severityScore >= 12 || input.injuryType === "numbness") {
    severity = "emergency";
  } else if (severityScore >= 8 || !input.canFunction) {
    severity = "serious";
  } else if (severityScore >= 5) {
    severity = "moderate";
  } else {
    severity = "minor";
  }

  // Determine protocol
  let protocol = PROTOCOLS.active_recovery;
  if (severity === "serious" || severity === "emergency") {
    protocol = PROTOCOLS.rice;
  } else if (input.injuryType === "stiffness") {
    protocol = PROTOCOLS.mobility_focus;
  } else if (input.injuryType === "weakness" && input.duration === "week_plus") {
    protocol = PROTOCOLS.strength_rehab;
  } else if (input.injuryType === "swelling" || input.injuryType === "sharp_pain") {
    protocol = PROTOCOLS.rice;
  }

  // Immediate actions
  const immediateAction: string[] = [];
  if (severity === "emergency") {
    immediateAction.push("STOP ALL ACTIVITY IMMEDIATELY");
    immediateAction.push("Seek emergency medical care");
  } else if (severity === "serious") {
    immediateAction.push("Stop the current activity");
    immediateAction.push("Apply ice if swelling present");
    immediateAction.push("Schedule appointment with sports medicine");
  } else {
    immediateAction.push("Reduce activity intensity");
    immediateAction.push("Monitor symptoms over next 24 hours");
  }

  // Activities to avoid
  const avoidActions: string[] = [];
  const bodyPartAvoidance: Record<string, string[]> = {
    ankle: ["jumping", "cutting movements", "running on uneven surfaces"],
    knee: ["deep squats", "high-impact landing", "sudden direction changes"],
    hip: ["heavy leg press", "deep lunges", "wide stance movements"],
    back: ["heavy deadlifts", "twisting under load", "high-impact activities"],
    shoulder: ["overhead pressing", "throwing", "bench press"],
    hamstring: ["sprinting", "explosive hip hinge", "overstretching"],
    achilles: ["jumping", "calf raises", "uphill running"],
  };
  avoidActions.push(...(bodyPartAvoidance[input.bodyPart] || ["high-intensity activities"]));

  // Safe activities
  const safeActivities: string[] = [];
  if (severity === "minor" || severity === "moderate") {
    safeActivities.push("Upper body work (if lower body injury)");
    safeActivities.push("Swimming or pool exercises");
    safeActivities.push("Stationary bike (low resistance)");
    safeActivities.push("Mobility work for unaffected areas");
  } else {
    safeActivities.push("Complete rest recommended");
    safeActivities.push("Light walking if tolerable");
  }

  // Warnings
  const warnings: string[] = [];
  if (input.painLevel >= 7) {
    warnings.push("Pain level indicates potential tissue damage");
  }
  if (input.duration === "week_plus") {
    warnings.push("Chronic pain requires professional evaluation");
  }
  if (input.injuryType === "instability") {
    warnings.push("Joint instability may indicate ligament damage");
  }

  // Red flags that require immediate attention
  const redFlags: string[] = [];
  if (input.injuryType === "numbness") {
    redFlags.push("Numbness may indicate nerve involvement - seek care immediately");
  }
  if (input.injuryType === "popping" && input.painLevel >= 7) {
    redFlags.push("Popping with severe pain may indicate ligament rupture");
  }
  if (!input.canFunction && input.painLevel >= 8) {
    redFlags.push("Inability to bear weight with severe pain requires evaluation");
  }

  // Professional recommendation
  const shouldSeeProfessional = severity === "serious" || severity === "emergency" || redFlags.length > 0;
  let professionalType: string | null = null;
  if (shouldSeeProfessional) {
    if (severity === "emergency") {
      professionalType = "Emergency room or urgent care";
    } else if (input.bodyPart === "back" || input.injuryType === "numbness") {
      professionalType = "Orthopedic specialist or sports medicine doctor";
    } else {
      professionalType = "Physical therapist or sports medicine professional";
    }
  }

  return {
    severity,
    immediateAction,
    avoidActions,
    protocol,
    shouldSeeProfessional,
    professionalType,
    safeActivities,
    warnings,
    redFlags,
  };
}

// ─────────────────────────────────────────────────────────────
// EXPORT TOOL
// ─────────────────────────────────────────────────────────────

export const injuryProtocolTool = createWolfTool({
  name: "injury_protocol",
  description:
    "Provide safe guidance for athletic injuries. Assesses severity, recommends protocols (RICE, active recovery, etc.), identifies red flags, and advises when to see a professional. Always prioritizes safety.",
  inputSchema: InjuryInputSchema,
  execute: executeInjuryProtocol,
  metadata: {
    category: "protocol",
    sideEffects: false,
  },
});
