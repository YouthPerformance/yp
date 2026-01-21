// ===================================================================
// STRIPE MOCKS
// Test utilities for Stripe integration testing
// ===================================================================
//
// AGENT GUIDE:
// Use these mocks when testing checkout and webhook flows.
// NEVER use real Stripe keys in tests - always use test/mock keys.
//
// ===================================================================

import { vi } from "vitest";

// ---------------------------------------------------------------
// MOCK STRIPE SESSION
// ---------------------------------------------------------------

export interface MockStripeSession {
  id: string;
  url: string;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  customer_details?: {
    email: string;
  };
  metadata?: Record<string, string>;
}

export const createMockSession = (overrides: Partial<MockStripeSession> = {}): MockStripeSession => ({
  id: "cs_test_mock_session_id",
  url: "https://checkout.stripe.com/test",
  payment_status: "paid",
  customer_details: {
    email: "test@example.com",
  },
  metadata: {
    authUserId: "test-auth-user-id",
    product: "barefoot-reset-42",
  },
  ...overrides,
});

// ---------------------------------------------------------------
// MOCK STRIPE INSTANCE
// ---------------------------------------------------------------

export const createMockStripe = () => ({
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue(createMockSession()),
      retrieve: vi.fn().mockResolvedValue(createMockSession()),
    },
  },
  webhooks: {
    constructEvent: vi.fn().mockImplementation((body, signature, secret) => {
      // Validate signature exists
      if (!signature) {
        throw new Error("No signature provided");
      }
      // Return mock event based on body
      const parsed = JSON.parse(body);
      return {
        id: "evt_test_mock",
        type: parsed.type || "checkout.session.completed",
        data: {
          object: createMockSession(),
        },
      };
    }),
  },
});

// ---------------------------------------------------------------
// MOCK WEBHOOK EVENT FACTORY
// ---------------------------------------------------------------

export const createMockWebhookEvent = (
  type: string,
  data: Record<string, unknown> = {}
) => ({
  id: `evt_test_${Date.now()}`,
  type,
  data: {
    object: {
      ...createMockSession(),
      ...data,
    },
  },
});

// ---------------------------------------------------------------
// WEBHOOK SIGNATURE GENERATOR (for testing)
// ---------------------------------------------------------------

export const createMockSignature = (timestamp: number = Date.now()) => {
  // In real tests, you'd use Stripe's test signature generation
  // This is a mock for unit testing
  return `t=${Math.floor(timestamp / 1000)},v1=mock_signature_for_testing`;
};

// ---------------------------------------------------------------
// STRIPE ERROR MOCKS
// ---------------------------------------------------------------

export class MockStripeError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "StripeError";
    this.statusCode = statusCode;
    this.type = "StripeInvalidRequestError";
  }
}
