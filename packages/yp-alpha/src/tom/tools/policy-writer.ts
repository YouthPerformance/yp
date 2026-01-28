/**
 * Policy Writer Tool (Annie)
 * ==========================
 *
 * Rewrites customer responses and policies in Apple-quality tone.
 * Premium, empathetic, resolution-focused communication.
 */

import { z } from "zod";
import type { TomUserId } from "../types";
import { sendWhatsAppMessage } from "../whatsapp";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface PolicyDraftResult {
  type: "success" | "error";
  draft?: string;
  internalNote?: string;
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────

const PolicyDraftSchema = z.object({
  customerResponse: z.string(),
  internalNote: z.string().optional(),
  tone: z.enum(["empathetic", "professional", "celebratory"]),
});

// ─────────────────────────────────────────────────────────────
// APPLE STYLE GUIDE
// ─────────────────────────────────────────────────────────────

const APPLE_STYLE_PROMPT = `You are an Apple Support writing expert. Rewrite customer communications to sound premium, empathetic, and solution-focused.

RULES:
1. Start with acknowledgment of the customer's situation
2. NEVER use: "unfortunately", "we can't", "policy states", "sorry but"
3. Always offer a path forward, even if it's small
4. End on a positive, forward-looking note
5. Sound human, warm, and genuinely helpful - not corporate
6. Keep responses concise (under 200 words for email, under 100 for chat)
7. Use the customer's name when available
8. Focus on what we CAN do, not what we can't

EXAMPLES OF GOOD VS BAD:
❌ "Unfortunately, our policy doesn't allow refunds after 30 days."
✅ "I completely understand wanting to make sure this works for you. While we're outside our standard window, let me see what options we can explore together."

❌ "Sorry, that feature isn't available."
✅ "Great question! That feature is on our roadmap. In the meantime, here's how you can achieve something similar..."

❌ "Your request has been received and will be processed."
✅ "I'm on it! You'll hear back from me personally within 24 hours."`;

// ─────────────────────────────────────────────────────────────
// REWRITING
// ─────────────────────────────────────────────────────────────

/**
 * Rewrite text in Apple Support style
 */
export async function rewriteAsAppleStyle(
  text: string,
  context?: string
): Promise<{ response: string; internalNote?: string }> {
  try {
    const { generateStructured } = await import("../../ai/structured");

    const result = await generateStructured(
      "SMART",
      PolicyDraftSchema,
      APPLE_STYLE_PROMPT,
      `${context ? `Context: ${context}\n\n` : ""}Rewrite this in Apple Support style:

${text}`
    );

    return {
      response: result.customerResponse,
      internalNote: result.internalNote,
    };
  } catch (error) {
    console.error("[PolicyWriter] Error:", error);
    throw error;
  }
}

/**
 * Draft a new response from scratch
 */
export async function draftResponse(
  situation: string,
  desiredOutcome?: string
): Promise<{ response: string; internalNote?: string }> {
  try {
    const { generateStructured } = await import("../../ai/structured");

    const result = await generateStructured(
      "SMART",
      PolicyDraftSchema,
      APPLE_STYLE_PROMPT,
      `Draft a customer response for this situation:

Situation: ${situation}
${desiredOutcome ? `Desired outcome: ${desiredOutcome}` : ""}

Create a premium, empathetic response that resolves the situation positively.`
    );

    return {
      response: result.customerResponse,
      internalNote: result.internalNote,
    };
  } catch (error) {
    console.error("[PolicyWriter] Error:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// REQUEST HANDLER
// ─────────────────────────────────────────────────────────────

/**
 * Handle a policy draft request from Annie
 */
export async function handlePolicyDraftRequest(
  userId: TomUserId,
  message: string
): Promise<PolicyDraftResult> {
  try {
    // Detect if this is a rewrite request or a new draft request
    const isRewrite = /rewrite|rephrase|make this better|fix this/i.test(message);

    let result: { response: string; internalNote?: string };

    if (isRewrite) {
      // Extract the text to rewrite (everything after the command)
      const textToRewrite = message
        .replace(/rewrite|rephrase|make this better|fix this/gi, "")
        .trim();

      if (textToRewrite.length < 10) {
        await sendWhatsAppMessage(
          userId,
          `📝 Send me the text you'd like me to rewrite in Apple style.

Just paste the current response and I'll make it premium.`
        );

        return {
          type: "success",
          message: "Waiting for text to rewrite",
        };
      }

      result = await rewriteAsAppleStyle(textToRewrite);
    } else {
      // New draft from situation description
      result = await draftResponse(message);
    }

    // Format response for WhatsApp
    const formattedResponse = `🍎 *APPLE-STYLE DRAFT*

${result.response}

${result.internalNote ? `📋 _Internal note: ${result.internalNote}_` : ""}

_Reply "send" to approve, or describe changes._`;

    await sendWhatsAppMessage(userId, formattedResponse);

    return {
      type: "success",
      draft: result.response,
      internalNote: result.internalNote,
    };
  } catch (error) {
    console.error("[PolicyWriter] Error:", error);

    await sendWhatsAppMessage(
      userId,
      `⚠️ Couldn't draft that response. Try rephrasing or send more context.`
    );

    return {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
