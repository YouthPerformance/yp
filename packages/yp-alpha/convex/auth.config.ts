// ═══════════════════════════════════════════════════════════
// CONVEX AUTH CONFIG
// ═══════════════════════════════════════════════════════════
//
// AUTH ARCHITECTURE (January 2026):
// ─────────────────────────────────
// We use BetterAuth for authentication (sessions, OTP, OAuth).
// Convex queries/mutations receive `authUserId` as an argument
// rather than using Convex's built-in auth system (ctx.auth).
//
// This approach was chosen because:
// 1. BetterAuth sessions are validated server-side in Next.js
// 2. The validated authUserId is passed to Convex calls
// 3. No OIDC provider setup required
// 4. Works with serverless (Vercel) without SQLite issues
//
// Auth Flow:
// ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
// │  BetterAuth     │───>│  Next.js API    │───>│  Convex Query   │
// │  Session Cookie │    │  Validates      │    │  (authUserId)   │
// └─────────────────┘    └─────────────────┘    └─────────────────┘
//
// Key Files:
// - packages/yp-alpha/src/auth/index.ts     (BetterAuth config)
// - apps/web-academy/src/lib/auth-server.ts (Session validation)
// - packages/yp-alpha/convex/users.ts       (getByAuthUserId, etc)
//
// MIGRATION STATUS: Complete - Clerk is deprecated
// ═══════════════════════════════════════════════════════════

// Empty config - Convex built-in auth is not used
// Auth is handled by BetterAuth with authUserId passed to queries
export default {
  providers: [],
};
