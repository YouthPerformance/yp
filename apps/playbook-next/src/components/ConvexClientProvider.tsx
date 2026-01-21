'use client';

// =============================================================================
// CONVEX CLIENT PROVIDER
// Wraps the app in Convex provider for real-time subscriptions (client-side only)
// =============================================================================

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode, useMemo } from 'react';

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      console.warn('NEXT_PUBLIC_CONVEX_URL not set - Convex features will not work');
      return null;
    }
    return new ConvexReactClient(url);
  }, []);

  // If no Convex URL, render children without provider
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
