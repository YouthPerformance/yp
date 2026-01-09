// ===================================================================
// BETTERAUTH CONFIGURATION
// Wolf Pack Authentication - Performance Optimized
// ===================================================================
//
// Performance Strategy:
// 1. Session-based auth (no JWT decode overhead)
// 2. Email OTP primary (faster than password hashing)
// 3. Fire-and-forget email sending (no await)
// 4. Native Convex storage (zero external API calls)
//
// ===================================================================

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import Database from "better-sqlite3";

// ---------------------------------------------------------------
// DATABASE INSTANCE
// SQLite for development, can swap for production
// ---------------------------------------------------------------

const db = new Database(process.env.BETTER_AUTH_DB_PATH || "./better-auth.db");

// ---------------------------------------------------------------
// AUTH INSTANCE (not exported as config to avoid type issues)
// ---------------------------------------------------------------

const authConfig = {
  // Base URL for callbacks
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3003",

  // Secret for signing sessions
  secret: process.env.BETTER_AUTH_SECRET,

  // Database for session/user persistence
  database: db,

  // ---------------------------------------------------------------
  // SESSION CONFIGURATION (Performance Optimized)
  // ---------------------------------------------------------------
  session: {
    // 7-day sessions for convenience
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds

    // Refresh session daily (rolling expiration)
    updateAge: 60 * 60 * 24, // 1 day

    // Enable cookie cache to reduce DB hits
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minute cache
    },
  },

  // ---------------------------------------------------------------
  // EMAIL CONFIGURATION
  // ---------------------------------------------------------------
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Don't block sign-in
    autoSignIn: true, // Sign in immediately after signup
  },

  // ---------------------------------------------------------------
  // PLUGINS
  // ---------------------------------------------------------------
  plugins: [
    // Email OTP - Primary auth method for parents
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes

      // Fire-and-forget for performance (recommended by BetterAuth docs)
      async sendVerificationOTP({
        email,
        otp,
        type,
      }: {
        email: string;
        otp: string;
        type: "sign-in" | "email-verification" | "forget-password";
      }) {
        const subject =
          type === "sign-in"
            ? "Your Wolf Pack sign-in code"
            : type === "email-verification"
              ? "Verify your Wolf Pack email"
              : "Reset your Wolf Pack password";

        // Don't await - fire and forget for speed
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3003";
        fetch(`${siteUrl}/api/email/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject,
            otp,
            type,
          }),
        }).catch((err) => {
          console.error("[AUTH] Failed to send OTP email:", err);
        });
      },
    }),
  ],

  // ---------------------------------------------------------------
  // SOCIAL PROVIDERS
  // ---------------------------------------------------------------
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    },
  },

  // ---------------------------------------------------------------
  // ACCOUNT LINKING
  // ---------------------------------------------------------------
  account: {
    accountLinking: {
      enabled: true,
      // Auto-link if email matches and provider confirms verification
      trustedProviders: ["google", "apple"],
    },
  },

  // ---------------------------------------------------------------
  // ADVANCED OPTIONS
  // ---------------------------------------------------------------
  advanced: {
    // Cookie prefix for namespace
    cookiePrefix: "wolfpack",

    // Cross-subdomain support (academy.*, shop.*, etc)
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN || ".youthperformance.com",
    },
  },
};

// ---------------------------------------------------------------
// CREATE AUTH INSTANCE
// ---------------------------------------------------------------

const _auth = betterAuth(authConfig);

// Export with opaque type to avoid leaking Database type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = _auth as any;

// ---------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------

export type Auth = ReturnType<typeof betterAuth>;
