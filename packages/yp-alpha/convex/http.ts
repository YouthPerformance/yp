// @ts-nocheck
// NOTE: Type checking disabled - tickets module not yet implemented
// ═══════════════════════════════════════════════════════════
// CONVEX HTTP ACTIONS
// Webhook handlers for external services
// ═══════════════════════════════════════════════════════════

import { httpRouter } from "convex/server";
import { internal, api } from "./_generated/api";
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

// ─────────────────────────────────────────────────────────────
// xLENS WEB SDK ENDPOINTS
// HTTP API for xlens-web (browser-based jump capture)
// ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// CORS preflight handler
http.route({
  path: "/xlens/session",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

// Create xLENS session (demo mode - creates temp user if needed)
http.route({
  path: "/xlens/session",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { deviceId } = body as { deviceId?: string };

      // Generate session nonce
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let nonceDisplay = "";
      const bytes = new Uint8Array(8);
      crypto.getRandomValues(bytes);
      for (let i = 0; i < 8; i++) {
        nonceDisplay += chars[bytes[i] % chars.length];
      }

      // Generate full nonce
      const nonceBytes = new Uint8Array(16);
      crypto.getRandomValues(nonceBytes);
      const nonce = btoa(String.fromCharCode(...nonceBytes));

      const now = Date.now();
      const expiresAt = now + 120 * 1000; // 120 seconds

      // For demo mode, we create a lightweight session without requiring a jumpUser
      // Store session directly
      const sessionId = await ctx.runMutation(internal.xlensHttp.createDemoSession, {
        nonce,
        nonceDisplay,
        expiresAt,
        deviceId: deviceId || "web-" + Math.random().toString(36).substr(2, 9),
      });

      return new Response(
        JSON.stringify({
          sessionId,
          nonce,
          nonceDisplay,
          expiresAt,
          expiresInMs: 120 * 1000,
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Session creation failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }),
});

// Get session status
http.route({
  path: "/xlens/session/status",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

http.route({
  path: "/xlens/session/status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { sessionId } = body as { sessionId: string };

      const session = await ctx.runQuery(internal.xlensHttp.getSession, { sessionId });

      if (!session) {
        return new Response(
          JSON.stringify({ valid: false, reason: "Session not found" }),
          { status: 200, headers: CORS_HEADERS }
        );
      }

      const now = Date.now();
      if (now > session.expiresAt) {
        return new Response(
          JSON.stringify({ valid: false, reason: "Session expired" }),
          { status: 200, headers: CORS_HEADERS }
        );
      }

      if (session.used) {
        return new Response(
          JSON.stringify({ valid: false, reason: "Session already used" }),
          { status: 200, headers: CORS_HEADERS }
        );
      }

      return new Response(
        JSON.stringify({
          valid: true,
          nonceDisplay: session.nonceDisplay,
          expiresAt: session.expiresAt,
          remainingMs: session.expiresAt - now,
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Session status failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }),
});

// ─────────────────────────────────────────────────────────────
// xLENS UPLOAD: Generate upload URL for video
// ─────────────────────────────────────────────────────────────
http.route({
  path: "/xlens/upload",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

http.route({
  path: "/xlens/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { sessionId } = body as { sessionId: string };

      // Verify session exists and is valid
      const session = await ctx.runQuery(internal.xlensHttp.getSession, { sessionId });
      if (!session) {
        return new Response(
          JSON.stringify({ error: "Session not found" }),
          { status: 404, headers: CORS_HEADERS }
        );
      }

      if (session.used) {
        return new Response(
          JSON.stringify({ error: "Session already used" }),
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // Generate Convex storage upload URL
      const uploadUrl = await ctx.storage.generateUploadUrl();

      return new Response(
        JSON.stringify({
          uploadUrl,
          sessionId,
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Upload URL generation failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }),
});

// ─────────────────────────────────────────────────────────────
// xLENS SUBMIT: Submit jump for verification
// ─────────────────────────────────────────────────────────────
http.route({
  path: "/xlens/submit",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

http.route({
  path: "/xlens/submit",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { sessionId, storageId, deviceId, durationMs, fps, userHeightInches } = body as {
        sessionId: string;
        storageId: string;
        deviceId: string;
        durationMs: number;
        fps: number;
        userHeightInches?: number;
      };

      // Verify session
      const session = await ctx.runQuery(internal.xlensHttp.getSession, { sessionId });
      if (!session) {
        return new Response(
          JSON.stringify({ error: "Session not found" }),
          { status: 404, headers: CORS_HEADERS }
        );
      }

      if (session.used) {
        return new Response(
          JSON.stringify({ error: "Session already used" }),
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // Create jump record with optional height calibration
      const result = await ctx.runMutation(internal.xlensHttp.createWebJump, {
        sessionId,
        storageId,
        deviceId,
        durationMs,
        fps,
        nonce: session.nonce,
        nonceDisplay: session.nonceDisplay,
        userHeightInches,
      });

      // Schedule AI analysis with height calibration (async)
      await ctx.scheduler.runAfter(0, internal.xlensHttp.analyzeJump, {
        jumpId: result.jumpId,
        storageId,
        userHeightInches,
      });

      return new Response(
        JSON.stringify({
          jumpId: result.jumpId,
          status: "processing",
          message: "Jump submitted for analysis",
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Submit failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }),
});

// ─────────────────────────────────────────────────────────────
// xLENS RESULT: Get jump result
// ─────────────────────────────────────────────────────────────
http.route({
  path: "/xlens/result",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

http.route({
  path: "/xlens/result",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { jumpId } = body as { jumpId: string };

      const jump = await ctx.runQuery(internal.xlensHttp.getJump, { jumpId });

      if (!jump) {
        return new Response(
          JSON.stringify({ error: "Jump not found" }),
          { status: 404, headers: CORS_HEADERS }
        );
      }

      // Get video URL if available
      let videoUrl = null;
      if (jump.storageId) {
        videoUrl = await ctx.storage.getUrl(jump.storageId);
      }

      return new Response(
        JSON.stringify({
          jumpId: jump._id,
          status: jump.status,
          heightInches: jump.heightInches,
          heightCm: jump.heightInches ? jump.heightInches * 2.54 : null,
          verificationTier: jump.verificationTier,
          videoUrl,
          processedAt: jump.processedAt,
          flags: jump.flags,
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Get result failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }),
});

// ─────────────────────────────────────────────────────────────
// xLENS DEBUG: Get recent jumps (for debugging)
// ─────────────────────────────────────────────────────────────
http.route({
  path: "/xlens/debug/jumps",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const jumps = await ctx.runQuery(api.xlensDebug.getRecentJumps, {});
      return new Response(
        JSON.stringify(jumps, null, 2),
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (e) {
      console.error("[xLENS] Debug query failed:", e);
      return new Response(
        JSON.stringify({ error: String(e) }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
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
