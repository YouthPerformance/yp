import { defineConfig } from "tsup";

export default defineConfig({
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
});
