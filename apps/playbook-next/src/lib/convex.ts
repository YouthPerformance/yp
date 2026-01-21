// =============================================================================
// CONVEX CLIENT SETUP
// Server and client-side Convex integration
// =============================================================================

import { ConvexHttpClient } from 'convex/browser';

// Server-side client for SSR/SSG
export function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
  }
  return new ConvexHttpClient(url);
}

// Reusable fetch with caching options
export async function fetchFromConvex<T>(
  query: any,
  args: Record<string, any> = {},
  options: { revalidate?: number | false; tags?: string[] } = {}
): Promise<T> {
  const client = getConvexClient();
  return client.query(query, args);
}
