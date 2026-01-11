// ===================================================================
// DEV BYPASS SYSTEM
// Three-layer auth bypass for testing and demos
// Layer A: DEV_MODE=true (local dev)
// Layer B: /demo/* routes (shareable prototypes)
// Layer C: yp-bypass cookie (personal access anywhere)
//
// NOTE: This file is imported by both server and client components.
// Server-only functions that need cookies are in dev-bypass-server.ts
// ===================================================================

// ---------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------

export const DEV_USER = {
  id: "dev_user_001",
  email: "dev@youthperformance.com",
  name: "Dev Athlete",
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
// SERVER-SIDE BYPASS CHECK
// ---------------------------------------------------------------

/**
 * Check if auth should be bypassed (server-side) - SYNC version
 * Just checks DEV_MODE env var (no cookie check - that requires async)
 */
export function shouldBypassAuth(): boolean {
  // Layer A: Local dev mode - this is sync and always works
  if (process.env.DEV_MODE === "true") {
    return true;
  }

  return false;
}


// ---------------------------------------------------------------
// CLIENT-SIDE BYPASS CHECK
// ---------------------------------------------------------------

/**
 * Check if auth should be bypassed (client-side)
 * Checks for NEXT_PUBLIC_DEV_MODE or yp-bypass cookie
 */
export function shouldBypassAuthClient(): boolean {
  if (typeof window === "undefined") {
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

  // Check for bypass cookie
  return document.cookie.includes("yp-bypass=");
}

/**
 * Check if current user is dev user
 */
export function isDevUser(userId: string | null | undefined): boolean {
  return userId === DEV_USER.id;
}
