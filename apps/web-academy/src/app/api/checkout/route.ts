// ===================================================================
// STRIPE CHECKOUT API ROUTE
// Creates a Stripe Checkout Session for the Barefoot Reset program
// ===================================================================

import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUserId } from "@/lib/auth-server";

// Lazy Stripe initialization to avoid build-time errors
let stripe: Stripe | null = null;

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

// Product configuration
const BAREFOOT_RESET_PRODUCT = {
  name: "Barefoot Reset - 42 Day Program",
  description:
    "Complete access to the 42-day barefoot training program with daily guided workouts, gamified progression, and parent dashboard.",
  price: 8800, // $88.00 in cents
  currency: "usd",
};

// -------------------------------------------------------------------
// POST: Create Checkout Session
// -------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const authUserId = await getAuthUserId();

    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { priceId } = body;

    // Get origin for redirect URLs
    const origin = request.headers.get("origin") || "http://localhost:3003";

    // Create Checkout Session
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: BAREFOOT_RESET_PRODUCT.currency,
                product_data: {
                  name: BAREFOOT_RESET_PRODUCT.name,
                  description: BAREFOOT_RESET_PRODUCT.description,
                  images: [`${origin}/og-image.png`],
                },
                unit_amount: BAREFOOT_RESET_PRODUCT.price,
              },
              quantity: 1,
            },
          ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/home?canceled=true`,
      metadata: {
        authUserId, // BetterAuth user ID (replaces clerkId)
        product: "barefoot-reset-42",
      },
      // Customer email from Clerk if available
      customer_email: undefined, // Will be filled by Stripe Checkout
      // Allow promotion codes
      allow_promotion_codes: true,
      // Billing address collection
      billing_address_collection: "auto",
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[Checkout] Error creating session:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// -------------------------------------------------------------------
// GET: Retrieve Session Status (for success page)
// -------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error("[Checkout] Error retrieving session:", error);

    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
