// ===================================================================
// VITEST CONFIGURATION - Academy App
// Critical path testing for auth, payments, and data integrity
// ===================================================================

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Global test setup
    setupFiles: ["./src/__tests__/setup.ts"],

    // Include patterns
    include: ["src/__tests__/**/*.test.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      include: [
        "src/app/api/**/*.ts", // API routes (auth, checkout, webhooks)
        "src/lib/auth*.ts", // Auth utilities
      ],
      exclude: ["src/__tests__/**", "node_modules/**"],
      thresholds: {
        // Critical paths must have coverage
        "src/app/api/checkout/": { statements: 80 },
        "src/app/api/webhooks/stripe/": { statements: 80 },
      },
    },

    // Timeout for async tests
    testTimeout: 10000,

    // Globals (describe, it, expect)
    globals: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@yp/alpha": path.resolve(__dirname, "../../packages/yp-alpha/src"),
    },
  },
});
