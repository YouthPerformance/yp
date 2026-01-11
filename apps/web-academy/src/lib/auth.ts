// ===================================================================
// WOLF PACK AUTH CLIENT
// BetterAuth integration for web-academy
// ===================================================================

"use client";

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { DEV_USER, shouldBypassAuthClient } from "./dev-bypass";

// ---------------------------------------------------------------
// AUTH CLIENT
// ---------------------------------------------------------------

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003",
  plugins: [emailOTPClient()],
});

// ---------------------------------------------------------------
// DEV MODE SESSION
// ---------------------------------------------------------------

const DEV_SESSION_DATA = {
  user: DEV_USER,
  session: {
    id: "dev-session",
    token: "dev-token",
    expiresAt: new Date(Date.now() + 86400000),
  },
};

// ---------------------------------------------------------------
// CONVENIENCE EXPORTS
// ---------------------------------------------------------------

export const { signIn, signUp, signOut } = authClient;

// Wrapped useSession that supports dev mode
const originalUseSession = authClient.useSession;

export function useSession() {
  const realSession = originalUseSession();

  // If we're in dev mode (DEV_MODE env or cookie), return mock session
  // Check if real session is loading first
  if (!realSession.isPending && !realSession.data) {
    // No real session - check for dev bypass
    if (shouldBypassAuthClient()) {
      return {
        data: DEV_SESSION_DATA,
        isPending: false,
        error: null,
      };
    }
  }

  return realSession;
}

// ---------------------------------------------------------------
// OTP HELPERS
// ---------------------------------------------------------------

/**
 * Send OTP to email - triggers email via server
 */
export async function sendOTP(email: string) {
  const client = authClient as unknown as {
    emailOtp?: {
      sendVerificationOtp?: (opts: { email: string; type: string }) => Promise<unknown>;
    };
  };
  return client.emailOtp?.sendVerificationOtp?.({ email, type: "sign-in" });
}

/**
 * Verify OTP and sign in
 */
export async function verifyOTP(email: string, otp: string) {
  const client = authClient as unknown as {
    signIn: { emailOtp?: (opts: { email: string; otp: string }) => Promise<unknown> };
  };
  return client.signIn.emailOtp?.({ email, otp });
}

// ---------------------------------------------------------------
// SOCIAL AUTH
// ---------------------------------------------------------------

export async function signInWithGoogle(callbackURL = "/home") {
  return authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}

export async function signInWithApple(callbackURL = "/home") {
  return authClient.signIn.social({
    provider: "apple",
    callbackURL,
  });
}
