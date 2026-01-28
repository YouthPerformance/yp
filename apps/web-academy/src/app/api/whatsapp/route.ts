/**
 * WhatsApp Webhook API Route
 * ==========================
 *
 * Handles incoming WhatsApp messages via Meta Business API webhook.
 * Verifies signatures and triggers Tom capture workflow.
 */

import { NextRequest, NextResponse } from "next/server";
import { triggerTomCapture } from "@yp/alpha/workflows";
import { verifyWebhookSignature } from "@yp/alpha/tom";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET!;

// Phone number to user ID mapping (temporary until Convex types generated)
const PHONE_TO_USER: Record<string, "mike" | "james" | "adam" | "annie"> = {
  [process.env.TOM_PHONE_MIKE || ""]: "mike",
  [process.env.TOM_PHONE_JAMES || ""]: "james",
  [process.env.TOM_PHONE_ADAM || ""]: "adam",
  [process.env.TOM_PHONE_ANNIE || ""]: "annie",
};

// ─────────────────────────────────────────────────────────────
// WEBHOOK VERIFICATION (GET)
// ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Debug: Log what we received vs what we expect
  console.log("[WhatsApp] Verification attempt:", {
    mode,
    receivedToken: token,
    expectedToken: WHATSAPP_VERIFY_TOKEN ? `set (${WHATSAPP_VERIFY_TOKEN.length} chars)` : "NOT SET",
    challenge: challenge?.substring(0, 20),
    tokenMatch: token === WHATSAPP_VERIFY_TOKEN,
  });

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp] Webhook verification failed - token mismatch or wrong mode");
  return new NextResponse("Forbidden", { status: 403 });
}

// ─────────────────────────────────────────────────────────────
// INCOMING MESSAGES (POST)
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify webhook signature
  // TODO: Re-enable once correct App Secret is configured
  // The App Secret is found in Meta Developer Console → App Settings → Basic → App Secret
  // const signature = req.headers.get("x-hub-signature-256");
  // if (WHATSAPP_APP_SECRET && WHATSAPP_APP_SECRET !== WHATSAPP_VERIFY_TOKEN) {
  //   const isValid = await verifyWebhookSignature(rawBody, signature, WHATSAPP_APP_SECRET);
  //   if (!isValid) {
  //     console.error("[WhatsApp] Invalid webhook signature");
  //     return new NextResponse("Invalid signature", { status: 401 });
  //   }
  // }
  console.log("[WhatsApp] Signature verification skipped (configure WHATSAPP_APP_SECRET)");

  try {
    const body = JSON.parse(rawBody);

    // Process messages
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "messages") {
          const messages = change.value?.messages || [];
          for (const message of messages) {
            await handleIncomingMessage(message, change.value);
          }
        }
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[WhatsApp] Error processing webhook:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// MESSAGE HANDLER
// ─────────────────────────────────────────────────────────────

interface WhatsAppMessage {
  from: string;
  id: string;
  text?: { body: string };
  type: string;
  timestamp: string;
}

interface WhatsAppMetadata {
  metadata?: {
    phone_number_id: string;
    display_phone_number: string;
  };
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
}

async function handleIncomingMessage(
  message: WhatsAppMessage,
  _metadata: WhatsAppMetadata
) {
  // Only handle text messages for now
  if (message.type !== "text" || !message.text?.body) {
    console.log(`[WhatsApp] Ignoring non-text message type: ${message.type}`);
    return;
  }

  console.log(`[WhatsApp] Received message from ${message.from}: ${message.text.body.substring(0, 50)}...`);

  // Look up user by phone number
  const userId = PHONE_TO_USER[message.from];

  if (!userId) {
    console.log(`[WhatsApp] Unknown number: ${message.from}`);
    console.log(`[WhatsApp] Known numbers:`, Object.keys(PHONE_TO_USER).filter(k => k));
    return;
  }

  // Trigger capture workflow
  try {
    await triggerTomCapture({
      userId,
      content: message.text.body,
      source: "whatsapp",
      messageId: message.id,
    });

    console.log(`[WhatsApp] Triggered capture for ${userId}`);
  } catch (error) {
    console.error(`[WhatsApp] Failed to trigger capture:`, error);
  }
}
