// ===================================================================
// DEV BYPASS SYSTEM - SERVER ONLY
// Functions that require server-only imports (cookies, headers)
//
// SECURITY: Production guard with emergency escape hatch.
// Emergency bypass requires EMERGENCY_BYPASS_SECRET and is LOGGED.
// ===================================================================

import "server-only";
import { cookies } from "next/headers";
import { DEV_USER } from "./dev-bypass";

/**
 * Check if auth should be bypassed (server-side) - ASYNC version
 *
 * SECURITY LAYERS (evaluated in order):
 * 1. PRODUCTION GUARD - Blocks all bypass in prod (except emergency)
 * 2. Emergency bypass - Only with EMERGENCY_BYPASS_SECRET (logged)
 * 3. DEV_MODE - Local development
 * 4. Cookie bypass - With YP_BYPASS_SECRET (non-prod only)
 */
export async function shouldBypassAuthAsync(): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTION GUARD - Emergency escape hatch only
  // ═══════════════════════════════════════════════════════════════
  if (isProduction) {
    try {
      const cookieStore = await cookies();
      const emergencyCookie = cookieStore.get("yp-emergency");
      const emergencySecret = process.env.EMERGENCY_BYPASS_SECRET;

      if (emergencySecret && emergencyCookie?.value === emergencySecret) {
        // CRITICAL: Log all emergency bypass usage for audit
        console.warn(
          "[AUTH] ⚠️ EMERGENCY BYPASS USED IN PRODUCTION - This should be audited",
          {
            timestamp: new Date().toISOString(),
            env: "production",
          }
        );
        return true;
      }
    } catch {
      // cookies() not available - no bypass
    }

    // No bypass in production without emergency cookie
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  // NON-PRODUCTION CHECKS
  // ═══════════════════════════════════════════════════════════════

  // Layer 1: Local dev mode
  if (process.env.DEV_MODE === "true") {
    console.log("[DEV-BYPASS] Auth bypassed via DEV_MODE=true (server)");
    return true;
  }

  // Layer 2: Personal bypass cookie (staging/preview)
  try {
    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get("yp-bypass");
    const secret = process.env.YP_BYPASS_SECRET;

    if (secret && bypassCookie?.value === secret) {
      console.log("[DEV-BYPASS] Auth bypassed via yp-bypass cookie (server)");
      return true;
    }
  } catch {
    // cookies() not available in some contexts (e.g., static generation)
  }

  return false;
}

/**
 * Get detailed bypass status for debugging (server-side)
 */
export async function getBypassStatusAsync(): Promise<{
  isProduction: boolean;
  devModeEnabled: boolean;
  hasBypassCookie: boolean;
  hasEmergencyCookie: boolean;
  canBypass: boolean;
  bypassReason: string | null;
}> {
  const isProduction = process.env.NODE_ENV === "production";
  const devModeEnabled = process.env.DEV_MODE === "true";

  let hasBypassCookie = false;
  let hasEmergencyCookie = false;

  try {
    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get("yp-bypass");
    const emergencyCookie = cookieStore.get("yp-emergency");

    hasBypassCookie = !!bypassCookie?.value;
    hasEmergencyCookie = !!emergencyCookie?.value;
  } catch {
    // cookies() not available
  }

  let bypassReason: string | null = null;
  let canBypass = false;

  if (isProduction) {
    if (hasEmergencyCookie && process.env.EMERGENCY_BYPASS_SECRET) {
      canBypass = true;
      bypassReason = "emergency_cookie";
    }
  } else {
    if (devModeEnabled) {
      canBypass = true;
      bypassReason = "dev_mode";
    } else if (hasBypassCookie && process.env.YP_BYPASS_SECRET) {
      canBypass = true;
      bypassReason = "bypass_cookie";
    }
  }

  return {
    isProduction,
    devModeEnabled,
    hasBypassCookie,
    hasEmergencyCookie,
    canBypass,
    bypassReason,
  };
}

// Re-export DEV_USER for convenience in server components
export { DEV_USER };
