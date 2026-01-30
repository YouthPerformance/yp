// ===================================================================
// DEV BYPASS SYSTEM - UNIFIED
// Consolidated auth bypass with PRODUCTION GUARD
//
// SECURITY: Production bypass is BLOCKED by default.
// Only emergency bypass with correct secret can override in prod.
//
// Layers (evaluated in order):
// 1. PRODUCTION GUARD - Always first, blocks bypass in prod
// 2. DEV_MODE=true - Local development
// 3. Cookie bypass - For staging/demo with YP_BYPASS_SECRET
//
// NOTE: This file is imported by both server and client components.
// Server-only functions that need cookies are in dev-bypass-server.ts
// ===================================================================

// ---------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------

export const DEV_USER = {
  id: "mike_admin_001",
  email: "mike@youthperformance.com",
  name: "Mike",
  image: "/avatars/wolf-default.png",
};

export const DEV_SESSION = {
  user: DEV_USER,
  session: {
    id: "dev-session",
    token: "dev-token",
    expiresAt: new Date(Date.now() + 86400000), // 24h from now
  },
};

export const DEV_CONVEX_USER = {
  _id: "dev_convex_user_001" as any,
  authUserId: DEV_USER.id,
  email: DEV_USER.email,
  name: DEV_USER.name,
  role: "athlete" as const,
  avatarColor: "cyan" as const,
  sport: "basketball",
  age: 14,
  xpTotal: 2500,
  crystals: 5,
  rank: "hunter" as const,
  streakCurrent: 7,
  streakBest: 14,
  subscriptionStatus: "pro" as const,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const DEV_ENROLLMENT = {
  _id: "dev_enrollment_001" as any,
  userId: DEV_CONVEX_USER._id,
  programSlug: "build-your-chassis",
  currentDay: 15,
  isActive: true,
  startedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
  totalWorkoutsCompleted: 10,
  totalXpEarned: 2500,
};

// ---------------------------------------------------------------
// UNIFIED BYPASS CHECK (SYNC - no cookie check)
// ---------------------------------------------------------------

/**
 * Check if auth should be bypassed (server-side) - SYNC version
 *
 * SECURITY: Production guard ALWAYS runs first.
 * This function cannot be bypassed in production.
 */
export function shouldBypassAuth(): boolean {
  // ═══════════════════════════════════════════════════════════════
  // PRODUCTION GUARD - NEVER bypass in production
  // ═══════════════════════════════════════════════════════════════
  if (process.env.NODE_ENV === "production") {
    // No sync bypass available in production
    // Emergency bypass requires async cookie check (see dev-bypass-server.ts)
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  // LOCAL DEV MODE
  // ═══════════════════════════════════════════════════════════════
  if (process.env.DEV_MODE === "true") {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV-BYPASS] Auth bypassed via DEV_MODE=true");
    }
    return true;
  }

  return false;
}

// ---------------------------------------------------------------
// CLIENT-SIDE BYPASS CHECK
// ---------------------------------------------------------------

/**
 * Check if auth should be bypassed (client-side)
 *
 * SECURITY: Production guard ALWAYS runs first.
 */
export function shouldBypassAuthClient(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTION GUARD - NEVER bypass in production client
  // ═══════════════════════════════════════════════════════════════
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // Check for public dev mode env var
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    return true;
  }

  // Check for dev mode flag in window (set by server)
  if ((window as any).__DEV_MODE__ === true) {
    return true;
  }

  // Check for bypass cookie (only in non-production)
  return document.cookie.includes("yp-bypass=");
}

/**
 * Check if current user is dev user
 */
export function isDevUser(userId: string | null | undefined): boolean {
  return userId === DEV_USER.id;
}

/**
 * Get bypass status for debugging
 */
export function getBypassStatus(): {
  isProduction: boolean;
  devModeEnabled: boolean;
  canBypass: boolean;
} {
  const isProduction = process.env.NODE_ENV === "production";
  const devModeEnabled = process.env.DEV_MODE === "true";

  return {
    isProduction,
    devModeEnabled,
    canBypass: !isProduction && devModeEnabled,
  };
}
