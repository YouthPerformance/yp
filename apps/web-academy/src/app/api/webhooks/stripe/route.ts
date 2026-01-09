// ===================================================================
// STRIPE WEBHOOK HANDLER
// Processes Stripe events to update user subscription status in Convex
// ===================================================================

import { api } from "@yp/alpha/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripe: Stripe | null = null;
let convex: ConvexHttpClient | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripe;
}

function getConvex(): ConvexHttpClient {
  if (!convex) {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
    }
    convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return convex;
}

// -------------------------------------------------------------------
// POST: Handle Stripe Webhook Events
// -------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("[Webhook] Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("[Webhook] Received event:", event.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("[Webhook] Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// -------------------------------------------------------------------
// Handle checkout.session.completed event
// -------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout completion:", session.id);

  // Get the authUserId from session metadata (BetterAuth)
  const authUserId = session.metadata?.authUserId;

  if (!authUserId) {
    console.error("[Webhook] No authUserId in session metadata");
    return;
  }

  console.log("[Webhook] Updating subscription for authUserId:", authUserId);

  try {
    const convexClient = getConvex();

    // First, get the user by authUserId
    const user = await convexClient.query(api.users.getByAuthUserId, { authUserId });

    if (!user) {
      console.error("[Webhook] User not found for authUserId:", authUserId);
      return;
    }

    // Update user subscription status to pro
    // For one-time payment, we don't set an expiration
    await convexClient.mutation(api.users.updateSubscription, {
      userId: user._id,
      status: "pro",
      // No expiration for one-time purchase (lifetime access)
    });

    console.log("[Webhook] Successfully updated subscription for user:", user._id);
  } catch (error) {
    console.error("[Webhook] Error updating subscription:", error);
    throw error;
  }
}
