/**
 * WhatsApp Webhook API Route
 * ==========================
 *
 * Handles incoming WhatsApp messages via Meta Business API webhook.
 * Verifies signatures and triggers Tom capture workflow.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@yp/alpha/convex/_generated/api";
import { triggerTomCapture } from "@yp/alpha/workflows";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Fallback: Phone number to user ID mapping (used if not in Convex)
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

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp] Webhook verification failed");
  return new NextResponse("Forbidden", { status: 403 });
}

// ─────────────────────────────────────────────────────────────
// INCOMING MESSAGES (POST)
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  console.log("[WhatsApp] POST received, body length:", rawBody.length);

  try {
    const body = JSON.parse(rawBody);
    console.log("[WhatsApp] Parsed body:", JSON.stringify(body, null, 2).substring(0, 500));

    // Process messages
    let messagesProcessed = 0;
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        console.log("[WhatsApp] Change field:", change.field);
        if (change.field === "messages") {
          const messages = change.value?.messages || [];
          console.log("[WhatsApp] Messages count:", messages.length);
          for (const message of messages) {
            await handleIncomingMessage(message, change.value);
            messagesProcessed++;
          }
        }
      }
    }

    console.log("[WhatsApp] Messages processed:", messagesProcessed);
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

  // Look up user by phone number - try Convex first, then fallback to env vars
  let userId: "mike" | "james" | "adam" | "annie" | null = null;

  try {
    const user = await convex.query(api.tom.getUserByWhatsApp, {
      whatsappNumber: message.from,
    });
    if (user) {
      userId = user.userId;
    }
  } catch (error) {
    console.warn(`[WhatsApp] Could not query Convex for user:`, error);
  }

  // Fallback to environment variable mapping
  if (!userId) {
    userId = PHONE_TO_USER[message.from] || null;
  }

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
