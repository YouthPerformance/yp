// ===================================================================
// BETTERAUTH CLIENT
// Client-side auth utilities for React apps
// ===================================================================

import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

// ---------------------------------------------------------------
// CREATE AUTH CLIENT
// ---------------------------------------------------------------

/**
 * Create auth client with dynamic baseURL
 * Must be called in browser context or with explicit baseURL
 */
export function createWolfAuthClient(baseURL?: string) {
  return createAuthClient({
    baseURL: baseURL || "http://localhost:3003",
    plugins: [emailOTPClient()],
  });
}

// Default client for SSR-safe usage
export const authClient = createWolfAuthClient(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003",
);

// ---------------------------------------------------------------
// RE-EXPORTS FROM CLIENT
// ---------------------------------------------------------------

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
export const getSession = authClient.getSession;

// ---------------------------------------------------------------
// TYPED HELPERS
// ---------------------------------------------------------------

export type Session = Awaited<ReturnType<typeof getSession>>;
export type User = NonNullable<Session>["user"];

// ---------------------------------------------------------------
// OTP HELPERS
// ---------------------------------------------------------------

/**
 * Send OTP to email for sign-in
 * Use emailOtp.sendVerificationOtp from the client
 */
export async function sendSignInOTP(email: string) {
  // Access the emailOtp plugin method
  const client = authClient as unknown as {
    emailOtp?: {
      sendVerificationOtp?: (opts: { email: string; type: string }) => Promise<unknown>;
    };
  };
  return client.emailOtp?.sendVerificationOtp?.({ email, type: "sign-in" });
}

/**
 * Verify OTP and complete sign-in
 */
export async function verifyOTP(email: string, otp: string) {
  // Access the signIn.emailOtp method from plugin
  const client = authClient as unknown as {
    signIn: { emailOtp?: (opts: { email: string; otp: string }) => Promise<unknown> };
  };
  return client.signIn.emailOtp?.({ email, otp });
}

// ---------------------------------------------------------------
// SOCIAL AUTH HELPERS
// ---------------------------------------------------------------

/**
 * Sign in with Google
 */
export async function signInWithGoogle(callbackURL = "/") {
  return authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(callbackURL = "/") {
  return authClient.signIn.social({
    provider: "apple",
    callbackURL,
  });
}
