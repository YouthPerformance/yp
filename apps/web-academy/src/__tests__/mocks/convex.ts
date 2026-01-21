// ===================================================================
// CONVEX MOCKS
// Test utilities for Convex database testing
// ===================================================================
//
// AGENT GUIDE:
// Use these mocks when testing mutations and queries.
// Mock the ConvexHttpClient, not the actual database.
// Tests should verify:
// 1. Correct mutations are called
// 2. Correct arguments are passed
// 3. Authorization is enforced (user can only modify own data)
//
// ===================================================================

import { vi } from "vitest";

// ---------------------------------------------------------------
// MOCK USER DATA
// ---------------------------------------------------------------

export interface MockUser {
  _id: string;
  authUserId: string;
  email: string;
  name: string;
  role: "athlete" | "parent";
  subscriptionStatus: "free" | "pro";
  xpTotal: number;
  crystals: number;
  createdAt: number;
  updatedAt: number;
}

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  _id: "user_test_id",
  authUserId: "test-auth-user-id",
  email: "test@example.com",
  name: "Test User",
  role: "athlete",
  subscriptionStatus: "free",
  xpTotal: 0,
  crystals: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

// ---------------------------------------------------------------
// MOCK CONVEX HTTP CLIENT
// ---------------------------------------------------------------

export const createMockConvexClient = () => {
  const mockUser = createMockUser();

  return {
    query: vi.fn().mockImplementation((queryFn, args) => {
      // Mock getByAuthUserId query
      if (args?.authUserId === mockUser.authUserId) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),

    mutation: vi.fn().mockImplementation((mutationFn, args) => {
      // Mock updateSubscription mutation
      if (args?.userId && args?.status) {
        return Promise.resolve({
          ...mockUser,
          subscriptionStatus: args.status,
          updatedAt: Date.now(),
        });
      }
      return Promise.resolve(null);
    }),

    // Expose mock user for test assertions
    _mockUser: mockUser,
  };
};

// ---------------------------------------------------------------
// MOCK ENTITLEMENT DATA
// ---------------------------------------------------------------

export interface MockEntitlement {
  _id: string;
  userId: string;
  productSlug: string;
  productType: "program" | "content" | "feature";
  source: "purchase" | "promo" | "admin";
  status: "active" | "expired" | "revoked";
  grantedAt: number;
}

export const createMockEntitlement = (
  overrides: Partial<MockEntitlement> = {}
): MockEntitlement => ({
  _id: "entitlement_test_id",
  userId: "user_test_id",
  productSlug: "barefoot-reset-42",
  productType: "program",
  source: "purchase",
  status: "active",
  grantedAt: Date.now(),
  ...overrides,
});

// ---------------------------------------------------------------
// AUTHORIZATION TEST HELPERS
// ---------------------------------------------------------------

/**
 * Test that a mutation enforces authorization
 * User should only be able to modify their own data
 */
export const assertAuthorizationEnforced = async (
  mutationFn: (userId: string) => Promise<unknown>,
  currentUserId: string,
  targetUserId: string
) => {
  if (currentUserId !== targetUserId) {
    await expect(mutationFn(targetUserId)).rejects.toThrow(/unauthorized|forbidden/i);
  }
};
