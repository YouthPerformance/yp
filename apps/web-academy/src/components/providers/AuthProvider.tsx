// ===================================================================
// BETTERAUTH PROVIDER
// Wraps app with BetterAuth session context
// Performance: Uses session cookies, no JWT overhead
// ===================================================================

"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------
// CONVEX CLIENT (Singleton)
// ---------------------------------------------------------------

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Guard against missing URL during build
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// ---------------------------------------------------------------
// PROVIDER PROPS
// ---------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------
// AUTH PROVIDER COMPONENT
// ---------------------------------------------------------------

export function AuthProvider({ children }: AuthProviderProps) {
  // During build/SSG when env vars are missing, render without providers
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default AuthProvider;
