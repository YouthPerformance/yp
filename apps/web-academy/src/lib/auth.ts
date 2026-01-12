// ===================================================================
// WOLF PACK AUTH CLIENT
// Stubbed for local development without better-auth
// ===================================================================

"use client";

// ---------------------------------------------------------------
// STUB AUTH CLIENT (for testing without better-auth)
// ---------------------------------------------------------------

export const authClient = {
  signIn: {
    social: async (_opts: { provider: string; callbackURL: string }) => {
      console.log("Auth stub: signIn.social called");
      return { error: null };
    },
  },
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  useSession: () => ({ data: null, isPending: false }),
};

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;

// ---------------------------------------------------------------
// OTP HELPERS (stubs)
// ---------------------------------------------------------------

export async function sendOTP(_email: string) {
  console.log("Auth stub: sendOTP called");
  return { error: null };
}

export async function verifyOTP(_email: string, _otp: string) {
  console.log("Auth stub: verifyOTP called");
  return { error: null };
}

// ---------------------------------------------------------------
// SOCIAL AUTH (stubs)
// ---------------------------------------------------------------

export async function signInWithGoogle(_callbackURL = "/home") {
  console.log("Auth stub: signInWithGoogle called");
  return { error: null };
}

export async function signInWithApple(_callbackURL = "/home") {
  console.log("Auth stub: signInWithApple called");
  return { error: null };
}
