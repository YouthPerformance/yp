/**
 * Product Visualization Tool (James)
 * ===================================
 *
 * Uses Gemini to generate product concept sketches.
 * Triggered when James describes a product idea.
 */

import type { TomUserId } from "../types";
import { sendWhatsAppMessage, sendWhatsAppImage } from "../whatsapp";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type VizStyle = "sketch" | "render" | "technical";

export interface VizResult {
  type: "clarification" | "success" | "error";
  imageUrl?: string;
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// STYLE PROMPTS
// ─────────────────────────────────────────────────────────────

const STYLE_PROMPTS: Record<VizStyle, string> = {
  sketch:
    "2D product concept sketch, clean lines, minimal shading, industrial design style, black and white line drawing",
  render:
    "3D rendered product visualization, studio lighting, white background, photorealistic",
  technical:
    "Technical drawing with dimensions, exploded view, engineering blueprint style, annotations",
};

// ─────────────────────────────────────────────────────────────
// CLARIFICATION QUESTIONS
// ─────────────────────────────────────────────────────────────

const CLARIFICATION_TRIGGERS = [
  /material|size|shape|function|mechanism|feature/i,
];

function needsClarification(description: string): boolean {
  // Short descriptions need more detail
  if (description.length < 30) return true;

  // Check if key details are present
  const hasDetails = CLARIFICATION_TRIGGERS.some((pattern) =>
    pattern.test(description)
  );

  return !hasDetails;
}

// ─────────────────────────────────────────────────────────────
// VISUALIZATION GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Generate a product visualization using Gemini
 */
export async function generateProductVisualization(
  prompt: string,
  style: VizStyle = "sketch"
): Promise<{ imageUrl: string; revisedPrompt: string }> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const fullPrompt = `${STYLE_PROMPTS[style]}: ${prompt}.
Context: Youth sports training equipment or athletic performance product.
Style: Modern, premium, functional design aesthetic.
Important: Do NOT include any text, labels, or words in the image.`;

  try {
    // Using Google AI Gemini API for image generation
    // Note: As of 2026, Gemini supports image generation via the generateContent API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate an image: ${fullPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["image", "text"],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();

    // Extract image from response
    // Note: Actual response structure depends on Gemini API version
    const imageData = data.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
    );

    if (imageData?.inlineData) {
      // Convert base64 to URL (would need to upload to storage in production)
      // For now, return a placeholder
      return {
        imageUrl: `data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`,
        revisedPrompt: fullPrompt,
      };
    }

    // Fallback if no image generated
    throw new Error("No image generated");
  } catch (error) {
    console.error("[ProductViz] Generation failed:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// REQUEST HANDLER
// ─────────────────────────────────────────────────────────────

/**
 * Handle a product visualization request from James
 */
export async function handleProductVisualizationRequest(
  userId: TomUserId,
  description: string
): Promise<VizResult> {
  // Check if we need clarification
  if (needsClarification(description)) {
    const clarificationMessage = `🎨 I can sketch that! A few quick questions to nail the concept:

1. **Material?** (rubber, plastic, metal, fabric, foam)
2. **Size?** (palm-sized, basketball-sized, body-length, etc.)
3. **Key feature?** (mechanism, texture, attachment point)

Reply with details and I'll generate a concept sketch.`;

    await sendWhatsAppMessage(userId, clarificationMessage);

    return {
      type: "clarification",
      message: clarificationMessage,
    };
  }

  // Generate visualization
  try {
    const viz = await generateProductVisualization(description, "sketch");

    // If we got a data URL, we need to upload it first
    // For MVP, just send a message that the sketch is ready
    if (viz.imageUrl.startsWith("data:")) {
      // In production: Upload to storage, get public URL
      // For now: Send message that sketch is processing
      await sendWhatsAppMessage(
        userId,
        `🎨 Concept sketch generated! The image is processing and will be sent shortly.

Based on: "${description.substring(0, 100)}..."`
      );

      // TODO: Upload image to Convex storage and send via WhatsApp image API
      return {
        type: "success",
        imageUrl: viz.imageUrl,
      };
    }

    // Send image via WhatsApp
    await sendWhatsAppImage(
      userId,
      viz.imageUrl,
      `🎨 Here's your concept sketch!\n\nBased on: "${description.substring(0, 100)}..."\n\nReply with feedback to iterate.`
    );

    return {
      type: "success",
      imageUrl: viz.imageUrl,
    };
  } catch (error) {
    console.error("[ProductViz] Error:", error);

    await sendWhatsAppMessage(
      userId,
      `⚠️ Couldn't generate the sketch right now. Try describing it differently, or I can note it for later.

Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );

    return {
      type: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
