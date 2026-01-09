# Feature Specification: Clerk → BetterAuth Migration

**Version:** 1.0.0
**Created:** 2026-01-08
**Status:** Draft - Awaiting Approval
**Supersedes:** Spec 002 (Auth & Email Unification) - Clerk assumption invalidated

---

## Executive Summary

### The Crossroads Decision

We're at a "Founder Crossroads" moment. The choice:

| Path | Cost Now | Cost at 1M MAUs | Data Ownership |
|------|----------|-----------------|----------------|
| **Clerk (Stay)** | $25/mo (SMS) | $20k-$50k/mo | External (webhook sync) |
| **BetterAuth (Migrate)** | 2-3 days eng | ~$0 (infra only) | **Native (Convex)** |

### The Strategic Case for BetterAuth

1. **Cost at Scale**: Zero per-user auth fees. You pay only for Convex compute/storage.
2. **AI-Native Architecture**: User data lives IN Convex. AskWolf can query user context in the same transaction - no webhook lag.
3. **Data Sovereignty**: You own the identity graph. Critical for a company building an AI ecosystem.
4. **SMS Reality**: Kids have iPads, not phone numbers. Email OTP is actually better for our demographic.

### The Risk Assessment

| Risk | Mitigation |
|------|------------|
| Security parity | BetterAuth uses bcrypt/argon2 + industry-standard session management - same as Clerk |
| Engineering time | 2-3 days focused work, but one-time cost vs perpetual $$ |
| COPPA compliance | We build parental consent anyway - auth tool doesn't solve this |

**Recommendation:** **MIGRATE TO BETTERAUTH**

---

## Current State Audit

### Clerk Integration Depth

**Total Touchpoints:** 57 files across 2 apps

#### Package Dependencies

| App | Package | Version |
|-----|---------|---------|
| web-academy | `@clerk/nextjs` | ^6.36.5 |
| marketing | `@clerk/clerk-react` | ^5.59.2 |
| shop | None (Shopify auth) | - |

#### Environment Variables (6 total)

**Server-side:**
- `CLERK_SECRET_KEY`
- `CLERK_JWT_ISSUER_DOMAIN` (optional)

**Client-side:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

**Marketing (Vite):**
- `VITE_CLERK_PUBLISHABLE_KEY`

#### Hook Usage Inventory

| Hook/Component | Location | Count |
|----------------|----------|-------|
| `useAuth()` | UserContext.tsx, API routes | 5 |
| `useUser()` | UserContext.tsx, Header.jsx, pages | 8 |
| `ClerkProvider` | ConvexClientProvider.tsx, main.jsx | 2 |
| `ConvexProviderWithClerk` | ConvexClientProvider.tsx | 1 |
| `SignIn` component | sign-in/page.tsx | 1 |
| `SignUp` component | sign-up/page.tsx | 1 |
| `UserButton` | Header.jsx | 1 |
| `auth()` server | checkout/route.ts, webhooks | 2 |

#### Database Integration

**Schema (`packages/yp-alpha/convex/schema.ts`):**
```typescript
users: defineTable({
  clerkId: v.string(),  // ← THIS CHANGES TO betterAuthId or sessionId
  email: v.string(),
  // ... rest of fields
})
  .index("by_clerk_id", ["clerkId"])  // ← RENAME INDEX
```

**Queries (`packages/yp-alpha/convex/users.ts`):**
- `getByClerkId(clerkId)` → Lines 16-24
- `create(clerkId, email, ...)` → Lines 83-149

**Progress queries:**
- `convex/progress.ts:299` - `clerkUserId` parameter

#### Auth Flow (Current)

```
User → Clerk SignIn/SignUp → Clerk Session → ConvexProviderWithClerk
                                                      ↓
                                              useAuth() → clerkId
                                                      ↓
                                              Query Convex: getByClerkId
                                                      ↓
                                              Return/Create User
```

#### API Routes Using Clerk

| Route | Usage |
|-------|-------|
| `/api/checkout` | `auth()` for clerkId in Stripe metadata |
| `/api/webhooks/stripe` | Retrieves clerkId from session metadata |

#### Protected Routes (11 total)

All routes in `(main)/*` and `(onboarding)/*` use `useUserContext()` which depends on Clerk auth state.

---

## BetterAuth + Convex Architecture

### Official Integration Pattern

Based on BetterAuth Convex docs:

```
convex/
├── auth.config.ts      # BetterAuth provider config
├── auth.ts             # betterAuth instance + authComponent
├── http.ts             # Mount auth handlers
└── schema.ts           # Auto-managed by authComponent.adapter

src/lib/
├── auth-client.ts      # Client-side auth operations
└── auth-server.ts      # Server-side utilities

app/api/auth/[...all]/
└── route.ts            # Next.js API handler mount
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `authComponent` | Convex component that manages auth tables |
| `authComponent.adapter(ctx)` | Database adapter for auth data |
| `getAuthUser(ctx)` | Get current authenticated user |
| `usePreloadedAuthQuery` | Client-side auth query hook |
| `preloadAuthQuery` | SSR preloading |

### Session Management

BetterAuth uses session cookies (same as Clerk). No JWT management required.

### Supported Auth Methods

| Method | BetterAuth Support | Our Use Case |
|--------|-------------------|--------------|
| Email/Password | Yes | Fallback for existing users |
| Email OTP | Yes (via plugin) | **Primary for parents** |
| Magic Link | Yes | Alternative to OTP |
| Google OAuth | Yes | Social login |
| Apple OAuth | Yes | Required for iOS App Store |
| SMS OTP | Yes (via Twilio) | **Skip for MVP** (kids have iPads, not phones) |

---

## Migration Specification

### User Stories

#### US-1: Existing User Session Continuity
**As an** existing user with a Clerk account
**I want** to be automatically migrated to BetterAuth
**So that** I don't lose access to my account or data

**Acceptance Criteria:**
- [ ] AC-1.1: Existing users can sign in with their email after migration
- [ ] AC-1.2: All user data (XP, crystals, progress) is preserved
- [ ] AC-1.3: No duplicate accounts created during migration
- [ ] AC-1.4: Password users receive reset email to set new password (BetterAuth hashes differ)

#### US-2: Email OTP Sign-In (Primary)
**As a** parent
**I want** to sign in with a 6-digit code sent to my email
**So that** I can access the app without remembering a password

**Acceptance Criteria:**
- [ ] AC-2.1: User enters email, receives 6-digit code within 30 seconds
- [ ] AC-2.2: Code expires after 10 minutes
- [ ] AC-2.3: User enters code, gets authenticated session
- [ ] AC-2.4: Session persists via secure cookie

#### US-3: Social OAuth Sign-In
**As a** parent
**I want** to sign in with Google or Apple
**So that** I can use my existing accounts

**Acceptance Criteria:**
- [ ] AC-3.1: Google OAuth works in ≤3 clicks
- [ ] AC-3.2: Apple OAuth works in ≤3 clicks
- [ ] AC-3.3: OAuth links to existing account if email matches
- [ ] AC-3.4: OAuth creates new account if email is new

#### US-4: Password Fallback
**As an** existing user who prefers passwords
**I want** to sign in with email and password
**So that** I have a familiar authentication method

**Acceptance Criteria:**
- [ ] AC-4.1: Password option available on sign-in page
- [ ] AC-4.2: Password reset flow works via email
- [ ] AC-4.3: Passwords hashed with bcrypt/argon2

#### US-5: Native Convex User Query
**As** the AskWolf AI
**I want** to query user data directly in Convex
**So that** I can personalize responses without webhook lag

**Acceptance Criteria:**
- [ ] AC-5.1: `getAuthUser(ctx)` returns user with all profile data
- [ ] AC-5.2: No external API calls needed to get user identity
- [ ] AC-5.3: User context available in same transaction as AI query

---

## Technical Requirements

### Schema Changes

**Before (Clerk):**
```typescript
users: defineTable({
  clerkId: v.string(),
  email: v.string(),
  // ...
}).index("by_clerk_id", ["clerkId"])
```

**After (BetterAuth):**
```typescript
// BetterAuth manages its own tables via authComponent:
// - betterAuth_users (email, passwordHash, etc.)
// - betterAuth_sessions (sessionId, userId, expiresAt)
// - betterAuth_accounts (OAuth provider links)

// Our users table becomes:
users: defineTable({
  // REMOVE: clerkId: v.string(),
  betterAuthUserId: v.string(),  // Links to betterAuth_users
  email: v.string(),
  // ... rest unchanged
}).index("by_betterauth_id", ["betterAuthUserId"])
```

### File Changes Required

#### Phase 1: Core Infrastructure (Day 1)

| File | Action | Notes |
|------|--------|-------|
| `package.json` (both apps) | Add `better-auth`, `@convex-dev/better-auth`; Remove `@clerk/*` | |
| `convex/convex.config.ts` | NEW - Register betterAuth component | |
| `convex/auth.config.ts` | REPLACE - BetterAuth providers | |
| `convex/auth.ts` | NEW - betterAuth instance | |
| `convex/http.ts` | MODIFY - Mount auth handlers | |
| `convex/schema.ts` | MODIFY - Replace clerkId with betterAuthUserId | |
| `src/lib/auth-client.ts` | NEW - Client auth operations | |
| `src/lib/auth-server.ts` | NEW - Server auth utilities | |
| `app/api/auth/[...all]/route.ts` | NEW - API handler mount | |

#### Phase 2: Provider Replacement (Day 1-2)

| File | Action | Notes |
|------|--------|-------|
| `ConvexClientProvider.tsx` | REPLACE - Remove ClerkProvider, add BetterAuth provider | |
| `UserContext.tsx` | REWRITE - Replace useAuth/useUser with BetterAuth hooks | |
| `sign-in/page.tsx` | REPLACE - Custom sign-in UI with OTP/OAuth | |
| `sign-up/page.tsx` | REPLACE - Custom sign-up UI | |

#### Phase 3: Query/Mutation Updates (Day 2)

| File | Action | Notes |
|------|--------|-------|
| `convex/users.ts` | MODIFY - Replace getByClerkId with getByBetterAuthId | |
| `convex/progress.ts` | MODIFY - Update user ID references | |
| `api/checkout/route.ts` | MODIFY - Use BetterAuth server auth | |
| `api/webhooks/stripe/route.ts` | MODIFY - Update user lookup | |

#### Phase 4: Cleanup (Day 3)

| File | Action | Notes |
|------|--------|-------|
| `sign-in/layout.tsx` | DELETE - No longer needed | |
| `sign-up/layout.tsx` | DELETE - No longer needed | |
| Marketing app auth files | UPDATE - Align with new pattern | |
| Environment variables | UPDATE - Remove Clerk, add BetterAuth | |

### Migration Script

```typescript
// convex/migrations/clerk-to-betterauth.ts
// One-time migration of existing users

export const migrateUsers = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    for (const user of users) {
      // Create BetterAuth user
      const betterAuthUser = await ctx.db.insert("betterAuth_users", {
        email: user.email,
        // No password - they'll need to reset or use OTP
        emailVerified: true, // Trust Clerk's verification
        createdAt: user.createdAt,
      });

      // Link to existing user
      await ctx.db.patch(user._id, {
        betterAuthUserId: betterAuthUser,
        // Keep clerkId temporarily for rollback
      });
    }
  }
});
```

---

## Environment Variables

### Remove (Clerk)

```bash
# DELETE THESE
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
VITE_CLERK_PUBLISHABLE_KEY=
```

### Add (BetterAuth)

```bash
# ADD THESE
BETTER_AUTH_SECRET=          # openssl rand -base64 32
SITE_URL=https://academy.youthperformance.com

# For Email OTP (Postmark already configured)
POSTMARK_API_KEY=            # Already have: 96c9d8ce-...

# For Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# For Apple OAuth
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
```

---

## UI Components

### Sign-In Page (New Design)

```
┌─────────────────────────────────────┐
│                                     │
│      🐺 WOLF PACK ACADEMY           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  📧 Enter your email        │    │
│  └─────────────────────────────┘    │
│                                     │
│  [  SEND CODE  ]                    │
│                                     │
│  ─────────── OR ───────────         │
│                                     │
│  [ 🔵 Continue with Google  ]       │
│  [ 🍎 Continue with Apple   ]       │
│                                     │
│  ─────────────────────────────      │
│                                     │
│  Have a password? [Sign in →]       │
│                                     │
└─────────────────────────────────────┘
```

### OTP Entry Page

```
┌─────────────────────────────────────┐
│                                     │
│      CHECK YOUR EMAIL               │
│                                     │
│  We sent a 6-digit code to          │
│  mike@example.com                   │
│                                     │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐           │
│  │ │ │ │ │ │ │ │ │ │ │ │           │
│  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘           │
│                                     │
│  [  VERIFY  ]                       │
│                                     │
│  Didn't get it? [Resend code]       │
│                                     │
└─────────────────────────────────────┘
```

---

## Risk Mitigation

### Rollback Plan

1. **Keep `clerkId` field** for 30 days after migration
2. **Don't delete Clerk account** until migration verified
3. **Feature flag** to switch between auth providers during testing
4. **Database backup** before running migration script

### Testing Checklist

- [ ] New user sign-up with Email OTP
- [ ] New user sign-up with Google OAuth
- [ ] New user sign-up with Apple OAuth
- [ ] Existing user migration (data preserved)
- [ ] Password reset flow
- [ ] Session persistence across tabs
- [ ] Session persistence across days
- [ ] Checkout flow with new auth
- [ ] Stripe webhook with new user lookup
- [ ] AskWolf AI queries user context
- [ ] Parent-child linking still works
- [ ] Marketing app auth works

---

## Timeline

| Day | Tasks |
|-----|-------|
| **Day 1 AM** | Install packages, set up Convex auth component, create auth handlers |
| **Day 1 PM** | Replace providers, create sign-in/sign-up UI |
| **Day 2 AM** | Update all queries/mutations, test flows |
| **Day 2 PM** | Run migration script, test existing users |
| **Day 3** | Marketing app alignment, cleanup, production deploy |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Migration completion | 100% of existing users accessible |
| Sign-in success rate | >95% |
| OTP delivery time | <30 seconds |
| Session validity | 7 days |
| Zero Clerk dependencies | All `@clerk/*` removed |

---

## Out of Scope

- SMS OTP (kids have iPads, not phones)
- Passkeys (future enhancement)
- Multi-factor authentication (future)
- Custom email templates (use Postmark defaults)
- Marketing app full rewrite (minimal changes only)

---

## Approval Required

> **This is a breaking architectural change.** Before proceeding:
>
> 1. [ ] Mike approves cost/benefit analysis
> 2. [ ] Backup of production Convex database taken
> 3. [ ] Clerk account NOT deleted (rollback insurance)
> 4. [ ] Testing environment validated

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-08 | MAI | Initial specification with full audit |
