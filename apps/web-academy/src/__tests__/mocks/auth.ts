// ===================================================================
// AUTH MOCKS
// Test utilities for BetterAuth testing
// ===================================================================
//
// AGENT GUIDE:
// BetterAuth uses sessions, not JWTs.
// Tests should verify:
// 1. Session validation works
// 2. Protected routes reject unauthenticated requests
// 3. User creation syncs to Convex
//
// ===================================================================

import { vi } from "vitest";

// ---------------------------------------------------------------
// MOCK SESSION DATA
// ---------------------------------------------------------------

export interface MockSession {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export const createMockSession = (overrides: Partial<MockSession> = {}): MockSession => ({
  user: {
    id: "better-auth-user-id",
    email: "test@example.com",
    name: "Test User",
    emailVerified: true,
    ...overrides.user,
  },
  session: {
    id: "session-id",
    userId: "better-auth-user-id",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    ...overrides.session,
  },
});

export const createExpiredSession = (): MockSession => ({
  user: {
    id: "better-auth-user-id",
    email: "test@example.com",
    name: "Test User",
    emailVerified: true,
  },
  session: {
    id: "session-id",
    userId: "better-auth-user-id",
    expiresAt: new Date(Date.now() - 1000), // Already expired
  },
});

// ---------------------------------------------------------------
// MOCK AUTH UTILITIES
// ---------------------------------------------------------------

export const createMockGetAuthUserId = (userId: string | null = "better-auth-user-id") => {
  return vi.fn().mockResolvedValue(userId);
};

export const createMockGetSession = (session: MockSession | null = createMockSession()) => {
  return vi.fn().mockResolvedValue(session);
};

// ---------------------------------------------------------------
// OTP MOCKS
// ---------------------------------------------------------------

export interface MockOTP {
  code: string;
  email: string;
  expiresAt: Date;
  type: "sign-in" | "email-verification" | "forget-password";
}

export const createMockOTP = (overrides: Partial<MockOTP> = {}): MockOTP => ({
  code: "123456",
  email: "test@example.com",
  expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  type: "sign-in",
  ...overrides,
});

export const createExpiredOTP = (): MockOTP => ({
  code: "123456",
  email: "test@example.com",
  expiresAt: new Date(Date.now() - 1000), // Already expired
  type: "sign-in",
});

// ---------------------------------------------------------------
// COOKIE MOCKS
// ---------------------------------------------------------------

export const createMockCookies = () => ({
  get: vi.fn().mockReturnValue({ value: "mock-session-token" }),
  set: vi.fn(),
  delete: vi.fn(),
});

export const createEmptyCookies = () => ({
  get: vi.fn().mockReturnValue(undefined),
  set: vi.fn(),
  delete: vi.fn(),
});
