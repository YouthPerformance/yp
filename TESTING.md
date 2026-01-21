# Testing Guide

> **For Agents & Developers:** How to run and write tests in the YP monorepo.

---

## Quick Start

```bash
# Run all tests
pnpm test

# Run critical tests only (auth, payments, data)
pnpm test:critical

# Run tests for a specific app
pnpm turbo run test --filter=@yp/web-academy

# Watch mode for development
pnpm turbo run test:watch --filter=@yp/web-academy
```

---

## What We Test

We follow a **"test what matters"** philosophy. Not everything needs tests.

### ✅ Always Test (Critical Paths)

| Area | Why | Location |
|------|-----|----------|
| **Auth** | Login breaks = everything breaks | `apps/web-academy/src/__tests__/auth.test.ts` |
| **Stripe Webhooks** | Money = trust | `apps/web-academy/src/__tests__/stripe-webhook.test.ts` |
| **Convex Mutations** | Data corruption = disaster | `apps/web-academy/src/__tests__/convex-mutations.test.ts` |

### ❌ Don't Test (Manual OK)

- UI components (manual QA)
- Styling/CSS (visual inspection)
- Static content (build errors catch issues)

---

## Test Structure

```
apps/web-academy/
├── src/__tests__/
│   ├── setup.ts                    # Global test setup
│   ├── auth.test.ts                # Auth flow tests
│   ├── stripe-webhook.test.ts      # Payment tests
│   ├── convex-mutations.test.ts    # Database tests
│   └── mocks/
│       ├── auth.ts                 # BetterAuth mocks
│       ├── stripe.ts               # Stripe mocks
│       └── convex.ts               # Convex mocks
└── vitest.config.ts                # Vitest configuration
```

---

## Writing Tests

### Rule 1: Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
it("should call stripe.webhooks.constructEvent", () => {
  // This breaks when we refactor
});

// ✅ Good: Testing behavior
it("should reject requests without valid signature", () => {
  // This tests what users experience
});
```

### Rule 2: Use Mocks, Not Real Services

```typescript
// ❌ Bad: Calling real Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Good: Using mock
import { createMockStripe } from "./mocks/stripe";
const stripe = createMockStripe();
```

### Rule 3: Name Tests Like Requirements

```typescript
// ❌ Bad: Vague test name
it("works", () => {});

// ✅ Good: Describes requirement
it("should update user subscription to pro after successful payment", () => {});
```

---

## Available Mocks

### Stripe (`./mocks/stripe.ts`)

```typescript
import { createMockSession, createMockStripe, createMockSignature } from "./mocks/stripe";

// Create a mock checkout session
const session = createMockSession({
  metadata: { authUserId: "test-user" },
});

// Create mock Stripe instance
const stripe = createMockStripe();

// Create mock webhook signature
const signature = createMockSignature();
```

### Auth (`./mocks/auth.ts`)

```typescript
import { createMockSession, createMockOTP, createMockGetAuthUserId } from "./mocks/auth";

// Mock authenticated user
const getAuthUserId = createMockGetAuthUserId("test-user-id");

// Mock session
const session = createMockSession();

// Mock OTP
const otp = createMockOTP({ code: "123456" });
```

### Convex (`./mocks/convex.ts`)

```typescript
import { createMockUser, createMockConvexClient, createMockEntitlement } from "./mocks/convex";

// Mock user
const user = createMockUser({ subscriptionStatus: "pro" });

// Mock Convex client
const convex = createMockConvexClient();

// Mock entitlement
const entitlement = createMockEntitlement({ productSlug: "barefoot-reset-42" });
```

---

## Environment Variables

Tests use mock values defined in `setup.ts`:

```typescript
// These are TEST values, not production
process.env.STRIPE_SECRET_KEY = "sk_test_mock_key_for_testing";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_mock_webhook_secret";
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.BETTER_AUTH_SECRET = "test-auth-secret-32-chars-long!";
```

**Never use real credentials in tests.**

---

## Adding New Tests

### When to Add Tests

Add tests when you touch:
1. Auth logic (sessions, tokens, OTP)
2. Payment logic (checkout, webhooks, subscriptions)
3. Database mutations (user updates, entitlements)

### Template

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Feature Name", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Sub-feature", () => {
    it("should do expected behavior", () => {
      // Arrange
      const input = "test";

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe("expected");
    });
  });
});
```

---

## CI Integration

Tests run automatically on:
- Every push to any branch
- Every PR to `main`/`master`

**PRs are blocked if critical tests fail.**

---

## Troubleshooting

### "Module not found" errors

```bash
# Rebuild dependencies
pnpm install
pnpm turbo run build --filter=@yp/alpha
```

### Tests timing out

```typescript
// Increase timeout for slow tests
it("slow test", async () => {
  // ...
}, 30000); // 30 second timeout
```

### Mock not working

```typescript
// Make sure to clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## For Onboarding Agents

### Before Making Changes

1. Run `pnpm test:critical` - must pass
2. Read relevant test file to understand expected behavior
3. Check mocks for available utilities

### When Adding Features

1. If it touches auth/payments/data → add tests
2. Use existing mocks, don't create new ones unless necessary
3. Follow the naming convention: `feature-name.test.ts`

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting to mock external services | Use `./mocks/` utilities |
| Testing implementation, not behavior | Focus on user outcomes |
| Not clearing mocks between tests | Add `beforeEach(() => vi.clearAllMocks())` |
| Using real API keys | Use mock values from setup.ts |

---

*Last updated: January 2026*
