import { z } from "zod";

/**
 * Environment variable schema for YP Shop (Hydrogen/Oxygen)
 * Validates at runtime to fail fast on missing/invalid env vars
 */
export const envSchema = z.object({
  // Required - Shopify Storefront
  PUBLIC_STORE_DOMAIN: z.string().min(1, "PUBLIC_STORE_DOMAIN is required"),
  PUBLIC_STOREFRONT_API_TOKEN: z.string().min(1, "PUBLIC_STOREFRONT_API_TOKEN is required"),
  PUBLIC_STOREFRONT_API_VERSION: z.string().default("2024-10"),

  // Required - Session
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),

  // Optional - Private tokens
  PRIVATE_STOREFRONT_API_TOKEN: z.string().optional(),
  PRIVATE_ADMIN_API_TOKEN: z.string().optional(),

  // Optional - Oxygen auto-provided
  PUBLIC_STOREFRONT_ID: z.string().optional(),
  SHOPIFY_STOREFRONT_ID: z.string().optional(),

  // Optional - Feature flags
  MAINTENANCE_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this at server startup to fail fast
 */
export function validateEnv(env: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    throw new Error(
      `\n❌ Environment validation failed:\n${errors}\n\nCheck your .env file or Oxygen environment variables.`,
    );
  }

  return result.data;
}
