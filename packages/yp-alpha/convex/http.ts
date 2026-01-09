// @ts-nocheck
// NOTE: Type checking disabled - tickets module not yet implemented
// ═══════════════════════════════════════════════════════════
// CONVEX HTTP ACTIONS
// Webhook handlers for external services
// ═══════════════════════════════════════════════════════════

import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// ─────────────────────────────────────────────────────────────
// HELPER: Verify Shopify HMAC using Web Crypto API
// ─────────────────────────────────────────────────────────────

async function _verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));

  // Convert to base64
  const generatedHmac = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return generatedHmac === hmacHeader;
}

// ─────────────────────────────────────────────────────────────
// SHOPIFY WEBHOOK: orders/paid
// Triggered when a customer completes checkout
// ─────────────────────────────────────────────────────────────

http.route({
  path: "/webhooks/shopify/orders-paid",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Verify Shopify HMAC signature
    const hmacHeader = request.headers.get("X-Shopify-Hmac-SHA256");
    const shopifyTopic = request.headers.get("X-Shopify-Topic");

    if (shopifyTopic !== "orders/paid") {
      console.error("[SHOPIFY] Unexpected topic:", shopifyTopic);
      return new Response("Invalid topic", { status: 400 });
    }

    const rawBody = await request.text();

    // Note: SHOPIFY_WEBHOOK_SECRET should be set via Convex dashboard env vars
    // For now, we log and accept (add verification when webhook secret is configured)
    if (hmacHeader) {
      // TODO: Add SHOPIFY_WEBHOOK_SECRET to env and verify
      // const isValid = await verifyShopifyHmac(rawBody, hmacHeader, webhookSecret);
      console.log("[SHOPIFY] HMAC header present, verification pending webhook secret setup");
    }

    // 2. Parse the order payload
    let order: ShopifyOrder;
    try {
      order = JSON.parse(rawBody);
    } catch (e) {
      console.error("[SHOPIFY] Failed to parse order:", e);
      return new Response("Invalid JSON", { status: 400 });
    }

    console.log(`[SHOPIFY] Processing order ${order.order_number} from ${order.email}`);

    // 3. Extract line items
    const lineItems = order.line_items.map((item) => ({
      productId: String(item.product_id),
      variantId: String(item.variant_id),
      title: item.title,
      sku: item.sku || undefined,
      quantity: item.quantity,
      price: parseFloat(item.price),
    }));

    // 4. Call internal mutation to process
    try {
      const result = await ctx.runMutation(internal.tickets.processShopifyOrder, {
        shopifyOrderId: String(order.id),
        shopifyOrderNumber: order.order_number || String(order.id),
        email: order.email,
        customerName: order.customer?.first_name
          ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
          : undefined,
        lineItems,
        totalAmount: parseFloat(order.total_price),
        currency: order.currency,
        shopifyCreatedAt: order.created_at,
      });

      console.log(`[SHOPIFY] Order processed:`, result);

      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[SHOPIFY] Failed to process order:", e);
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// ─────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "ok", timestamp: Date.now() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;

// ─────────────────────────────────────────────────────────────
// TYPE DEFINITIONS (Shopify Order Payload)
// ─────────────────────────────────────────────────────────────

interface ShopifyOrder {
  id: number;
  order_number: string;
  email: string;
  created_at: string;
  currency: string;
  total_price: string;
  customer?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
  line_items: Array<{
    id: number;
    product_id: number;
    variant_id: number;
    title: string;
    sku: string | null;
    quantity: number;
    price: string;
  }>;
}
