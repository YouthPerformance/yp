// ===================================================================
// TEST SETUP
// Global configuration and mocks for all tests
// ===================================================================

import { vi } from "vitest";

// ---------------------------------------------------------------
// ENVIRONMENT VARIABLES (Test Defaults)
// ---------------------------------------------------------------

process.env.STRIPE_SECRET_KEY = "sk_test_mock_key_for_testing";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_mock_webhook_secret";
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.BETTER_AUTH_SECRET = "test-auth-secret-32-chars-long!";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3003";

// ---------------------------------------------------------------
// GLOBAL MOCKS
// ---------------------------------------------------------------

// Mock fetch for external API calls
global.fetch = vi.fn();

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
