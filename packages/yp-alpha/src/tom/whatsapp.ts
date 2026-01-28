/**
 * WhatsApp Business API Client
 * ============================
 *
 * Client for sending WhatsApp messages via the Meta Business API.
 * Handles message formatting and delivery.
 */

import type { TomUserId, TomBriefing } from "./types";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN!;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

// ─────────────────────────────────────────────────────────────
// PHONE NUMBER MAPPING
// ─────────────────────────────────────────────────────────────

/**
 * Get WhatsApp number for a user from database
 * TODO: Replace with Convex query once types are regenerated
 */
async function getUserWhatsAppNumber(userId: TomUserId): Promise<string | null> {
  // TODO: Use Convex query once api.tom types are generated
  // const { ConvexHttpClient } = await import("convex/browser");
  // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  // const { api } = await import("../../convex/_generated/api");
  // const user = await convex.query(api.tom.getUser, { userId });
  // return user?.whatsappNumber || null;

  // Placeholder: Use environment variables for phone numbers
  const phoneEnvMap: Record<TomUserId, string | undefined> = {
    mike: process.env.TOM_PHONE_MIKE,
    james: process.env.TOM_PHONE_JAMES,
    adam: process.env.TOM_PHONE_ADAM,
    annie: process.env.TOM_PHONE_ANNIE,
  };

  return phoneEnvMap[userId] || null;
}

// ─────────────────────────────────────────────────────────────
// MESSAGE SENDING
// ─────────────────────────────────────────────────────────────

/**
 * Send a text message via WhatsApp
 */
export async function sendWhatsAppMessage(
  userId: TomUserId,
  message: string
): Promise<void> {
  const phoneNumber = await getUserWhatsAppNumber(userId);

  if (!phoneNumber) {
    throw new Error(`No WhatsApp number configured for user ${userId}`);
  }

  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn(`[WhatsApp] API not configured, would send to ${userId}: ${message.substring(0, 50)}...`);
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
}

/**
 * Send an image via WhatsApp
 */
export async function sendWhatsAppImage(
  userId: TomUserId,
  imageUrl: string,
  caption: string
): Promise<void> {
  const phoneNumber = await getUserWhatsAppNumber(userId);

  if (!phoneNumber) {
    throw new Error(`No WhatsApp number configured for user ${userId}`);
  }

  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn(`[WhatsApp] API not configured, would send image to ${userId}`);
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "image",
        image: { link: imageUrl, caption },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${error}`);
  }
}

// ─────────────────────────────────────────────────────────────
// MESSAGE FORMATTING
// ─────────────────────────────────────────────────────────────

/**
 * Format a briefing for WhatsApp delivery
 */
export function formatBriefingForWhatsApp(briefing: TomBriefing): string {
  const dateFormatted = new Date(briefing.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return `🌅 *MORNING BRIEFING*
${dateFormatted}

📋 *PRIORITIES*
${briefing.sections.priorities}

🚧 *BLOCKERS*
${briefing.sections.blockers}

📅 *TODAY*
${briefing.sections.calendar}

💡 *INSIGHTS*
${briefing.sections.insights}

_Reply to capture tasks or ask questions._`.trim();
}

/**
 * Format a task confirmation
 */
export function formatTaskConfirmation(task: string): string {
  return `✅ Got it! Added to your backlog:
• ${task}

_Reply "list" to see your backlog._`;
}

/**
 * Format an idea confirmation
 */
export function formatIdeaConfirmation(idea: string): string {
  return `💡 Great idea! Captured:
• ${idea}

_I'll surface this when relevant._`;
}

/**
 * Format a note confirmation
 */
export function formatNoteConfirmation(note: string): string {
  return `📝 Logged to today's notes.`;
}

// ─────────────────────────────────────────────────────────────
// WEBHOOK VERIFICATION
// ─────────────────────────────────────────────────────────────

/**
 * Verify WhatsApp webhook signature
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  appSecret: string
): Promise<boolean> {
  if (!signature) return false;

  // Use Web Crypto API (works in Node.js and Edge)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return signature === `sha256=${expectedSignature}`;
}
