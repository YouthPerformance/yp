// ═══════════════════════════════════════════════════════════
// UPLINK AUTH - GPT Actions Authentication
// Verifies Bearer tokens for incoming GPT webhook requests
// ═══════════════════════════════════════════════════════════

import { NextRequest } from "next/server";

/**
 * Verify the GPT Actions Bearer token
 * Returns true if valid, false otherwise
 */
export function verifyUplinkToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return false;
  }

  // Expected format: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return false;
  }

  const expectedToken = process.env.GPT_ACTION_SECRET;

  if (!expectedToken) {
    console.error("[Uplink] GPT_ACTION_SECRET not configured");
    return false;
  }

  return token === expectedToken;
}

/**
 * Get the author from the request, with validation
 */
export function validateAuthor(
  author: string | undefined
): "ADAM" | "JAMES" | null {
  if (author === "ADAM" || author === "JAMES") {
    return author;
  }
  return null;
}
