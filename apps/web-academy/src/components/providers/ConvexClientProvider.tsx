// ===================================================================
// CONVEX CLIENT PROVIDER
// Wraps app with Convex for real-time data
// Auth: BetterAuth (replaced Clerk for performance)
// ===================================================================

"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------
// CONVEX CLIENT (Singleton)
// ---------------------------------------------------------------

// Initialize Convex client - guard against undefined URL during build
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// ---------------------------------------------------------------
// PROVIDER COMPONENT
// ---------------------------------------------------------------

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  // During build/SSG when env vars are missing, return children without providers
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default ConvexClientProvider;
