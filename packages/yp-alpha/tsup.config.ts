import { defineConfig } from "tsup";

export default defineConfig([
  // Core entries with DTS
  {
    entry: [
      "src/index.ts",
      "src/router/index.ts",
      "src/config/models.ts",
      "src/config/wolf-realtime-prompt.ts",
      "src/auth/index.ts",
      "src/auth/client.ts",
      "src/shopify/index.ts",
      "src/voices/index.ts",
    ],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
  },
  // SDK-dependent modules - skip DTS due to non-portable types
  {
    entry: [
      "src/ai/index.ts",
      "src/workflows/index.ts",
      "src/tools/index.ts",
      "src/evals/index.ts",
      "src/critic/index.ts",
      "src/observability/index.ts",
      "src/tom/index.ts",
    ],
    format: ["cjs", "esm"],
    dts: false,
    splitting: false,
    sourcemap: true,
  },
]);
