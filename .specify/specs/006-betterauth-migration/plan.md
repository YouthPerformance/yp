# BetterAuth Migration - Performance-Optimized Implementation Plan

**Created:** 2026-01-08
**Status:** Executing
**Branch:** `feature/betterauth-migration`

---

## Performance Optimization Strategy

### Core Principles

1. **Zero External API Calls** - Auth data lives in Convex, no webhook latency
2. **Session Cookie Strategy** - 7-day sessions with rolling refresh (no JWT decode on every request)
3. **Optimistic UI** - Show authenticated state immediately, verify in background
4. **Edge-Compatible** - All auth logic runs at edge (Convex + Next.js Edge Runtime)
5. **Parallel Loading** - Prefetch user data during auth callback

### Performance Targets

| Metric | Clerk (Current) | BetterAuth (Target) |
|--------|-----------------|---------------------|
| Auth check latency | ~150ms (API call) | <10ms (cookie + DB) |
| User context load | ~200ms (webhook lag) | <50ms (same transaction) |
| Sign-in flow | 3-5s (redirect dance) | <2s (OTP) |
| Session validation | Every request | Cookie-based (cached) |

---

## Phase 1: Core Infrastructure

### 1.1 Package Installation

```bash
# In packages/yp-alpha
pnpm add better-auth @convex-dev/better-auth

# In apps/web-academy
pnpm add better-auth
pnpm remove @clerk/nextjs

# In apps/marketing
pnpm remove @clerk/clerk-react
```

### 1.2 Convex Component Registration

**File:** `packages/yp-alpha/convex/convex.config.ts` (NEW)

```typescript
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();
app.use(betterAuth);

export default app;
```

### 1.3 BetterAuth Instance

**File:** `packages/yp-alpha/convex/auth.ts` (NEW)

```typescript
import { betterAuth } from "better-auth";
import { convexAdapter } from "@convex-dev/better-auth";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  database: convexAdapter,

  // Performance: Use secure cookies, not JWTs
  session: {
    strategy: "database", // Session stored in Convex
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh daily
  },

  // Email OTP as primary (no passwords to hash on every login)
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        // Fire-and-forget for performance (no await)
        // Uses Postmark which is already configured
        fetch(process.env.POSTMARK_WEBHOOK_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, type }),
        });
      },
    }),
  ],

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },

  // Account linking by email
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "apple"],
    },
  },
});
```

### 1.4 HTTP Routes for Auth

**File:** `packages/yp-alpha/convex/http.ts` (MODIFY)

Add auth routes to existing http.ts:

```typescript
import { auth } from "./auth";

// Mount BetterAuth handlers
http.route({
  path: "/api/auth/*",
  method: "ALL",
  handler: auth.handler,
});
```

---

## Phase 2: Schema Migration

### 2.1 Schema Changes

**File:** `packages/yp-alpha/convex/schema.ts` (MODIFY)

```typescript
// BetterAuth creates these tables automatically:
// - betterauth_users
// - betterauth_sessions
// - betterauth_accounts
// - betterauth_verifications

// Modify users table:
users: defineTable({
  // REMOVE: clerkId: v.string(),

  // ADD: Link to BetterAuth user
  authUserId: v.optional(v.string()), // betterauth_users._id

  // Keep email as primary identifier during migration
  email: v.string(),

  // ... rest unchanged
})
  // REMOVE: .index("by_clerk_id", ["clerkId"])
  .index("by_auth_user_id", ["authUserId"])
  .index("by_email", ["email"]), // Email becomes primary lookup
```

### 2.2 Query Updates

**File:** `packages/yp-alpha/convex/users.ts` (MODIFY)

```typescript
// NEW: Get user by BetterAuth ID
export const getByAuthUserId = query({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .first();
  },
});

// KEEP: Get by email (migration fallback)
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// NEW: Get or create user from auth
export const getOrCreateFromAuth = mutation({
  args: {
    authUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try by authUserId first (fastest)
    let user = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .first();

    if (user) return user;

    // Try by email (migration case)
    user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      // Link existing user to new auth
      await ctx.db.patch(user._id, { authUserId: args.authUserId });
      return { ...user, authUserId: args.authUserId };
    }

    // Create new user (redirect to onboarding)
    return null; // Signal: needs onboarding
  },
});
```

---

## Phase 3: Client Integration

### 3.1 Auth Client

**File:** `apps/web-academy/src/lib/auth-client.ts` (NEW)

```typescript
import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  plugins: [emailOTPClient()],
});

// Typed exports for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
```

### 3.2 Provider Replacement

**File:** `apps/web-academy/src/components/providers/ConvexClientProvider.tsx` (REWRITE)

```typescript
"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { SessionProvider } from "better-auth/react";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </SessionProvider>
  );
}
```

### 3.3 User Context Rewrite

**File:** `apps/web-academy/src/contexts/UserContext.tsx` (REWRITE)

```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";

// ... context definition ...

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  // PERFORMANCE: Single query gets user + links auth if needed
  const user = useQuery(
    api.users.getOrCreateFromAuth,
    session?.user
      ? { authUserId: session.user.id, email: session.user.email }
      : "skip"
  );

  // Derive auth state
  const authState = isPending
    ? "loading"
    : !session
      ? "signed-out"
      : user === null
        ? "needs-onboarding"
        : user
          ? "signed-in"
          : "loading";

  // ... rest of provider
}
```

---

## Phase 4: Auth UI Components

### 4.1 Sign-In Page

**File:** `apps/web-academy/src/app/sign-in/page.tsx` (REWRITE)

Performance-optimized OTP flow:
- Instant feedback on button press
- Fire-and-forget OTP send (no await)
- Auto-focus on OTP input
- Keyboard navigation

### 4.2 OTP Input Component

Custom 6-digit input with:
- Auto-advance on digit entry
- Paste support
- Auto-submit on complete
- Loading state

---

## Phase 5: Migration Script

### 5.1 Batch Migration

**File:** `packages/yp-alpha/convex/migrations/clerkToBetterAuth.ts` (NEW)

```typescript
import { internalMutation } from "../_generated/server";

// Run once to migrate existing users
export const migrateUsers = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let migrated = 0;

    for (const user of users) {
      if (user.clerkId && !user.authUserId) {
        // Create BetterAuth user entry
        const authUser = await ctx.db.insert("betterauth_users", {
          email: user.email,
          emailVerified: true, // Trust Clerk's verification
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Link to our user
        await ctx.db.patch(user._id, {
          authUserId: authUser,
        });

        migrated++;
      }
    }

    return { migrated, total: users.length };
  },
});
```

---

## Phase 6: Cleanup

### 6.1 Remove Clerk Dependencies

```bash
# web-academy
pnpm remove @clerk/nextjs

# marketing
pnpm remove @clerk/clerk-react

# Delete Clerk-specific files
rm apps/web-academy/src/app/sign-in/layout.tsx
rm apps/web-academy/src/app/sign-up/layout.tsx
```

### 6.2 Update Environment Variables

**Remove:**
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- All `CLERK_*` variables

**Add:**
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APPLE_CLIENT_ID`
- `APPLE_CLIENT_SECRET`

---

## Rollback Plan

1. Keep `clerkId` field in schema for 30 days
2. Feature flag: `USE_BETTER_AUTH=true|false`
3. Don't delete Clerk dashboard account
4. Database snapshot before migration

---

## Testing Checklist

- [ ] New user OTP sign-up
- [ ] New user Google OAuth
- [ ] Existing user migration (auto-link by email)
- [ ] Session persistence (7 days)
- [ ] Sign out
- [ ] Protected route access
- [ ] AskWolf AI user context
- [ ] Checkout flow
- [ ] Stripe webhook user lookup

---

## Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Auth check latency | 150ms | - | <10ms |
| Sign-in time | 3-5s | - | <2s |
| User context query | 200ms | - | <50ms |
| Monthly auth cost | $25+ | $0 | $0 |
