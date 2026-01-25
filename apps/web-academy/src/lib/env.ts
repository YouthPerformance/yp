import { z } from "zod";

/**
 * Environment variable schema for YP Academy (Next.js)
 * Validates at build/runtime to fail fast on missing/invalid env vars
 */

// ═══════════════════════════════════════════════════════════
// URL Configuration
// ═══════════════════════════════════════════════════════════

/**
 * Main app URL (app.youthperformance.com)
 * Used for auth callbacks, emails, schema.org, sitemaps, etc.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://app.youthperformance.com";

/**
 * Marketing site URL (youthperformance.com)
 * Used for cross-links to marketing pages
 */
export const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL || "https://youthperformance.com";

/**
 * Get the canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_URL}${cleanPath}`;
}

/**
 * Get the marketing site URL for a given path
 */
export function getMarketingUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${MARKETING_URL}${cleanPath}`;
}

// ═══════════════════════════════════════════════════════════
// Environment Validation
// ═══════════════════════════════════════════════════════════

// Server-side only variables
const serverSchema = z.object({
  // Site URLs
  SITE_URL: z.string().url().optional(),

  // Convex deployment
  CONVEX_DEPLOYMENT: z.string().min(1, "CONVEX_DEPLOYMENT is required"),

  // BetterAuth
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  COOKIE_DOMAIN: z.string().default(".youthperformance.com"),

  // Stripe (optional for now)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Mux (optional)
  MUX_TOKEN_ID: z.string().optional(),
  MUX_TOKEN_SECRET: z.string().optional(),

  // Resend (optional)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
});

// Client-side variables (must be prefixed with NEXT_PUBLIC_)
const clientSchema = z.object({
  // Site URLs
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://app.youthperformance.com"),
  NEXT_PUBLIC_MARKETING_URL: z.string().url().default("https://youthperformance.com"),

  // Convex
  NEXT_PUBLIC_CONVEX_URL: z.string().url("NEXT_PUBLIC_CONVEX_URL must be a valid URL"),

  // Stripe (optional)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Mux (optional)
  NEXT_PUBLIC_MUX_ENV_KEY: z.string().optional(),

  // Feature flags
  NEXT_PUBLIC_MAINTENANCE_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  // Dev mode
  NEXT_PUBLIC_DEV_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

export const envSchema = serverSchema.merge(clientSchema);

export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

/**
 * Validate all environment variables
 * Call this at app startup
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    throw new Error(
      `\n❌ Environment validation failed:\n${errors}\n\nCheck your .env.local file.`,
    );
  }

  return result.data;
}

/**
 * Get client-safe environment variables
 * Only returns NEXT_PUBLIC_ prefixed variables
 */
export function getClientEnv(): ClientEnv {
  return clientSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MUX_ENV_KEY: process.env.NEXT_PUBLIC_MUX_ENV_KEY,
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
    NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
  });
}

/**
 * Check if maintenance mode is enabled
 */
export function isMaintenanceMode(): boolean {
  return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
}

/**
 * Check if we're in development mode
 */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Check if we're in production mode
 */
export const isProd = process.env.NODE_ENV === "production";
