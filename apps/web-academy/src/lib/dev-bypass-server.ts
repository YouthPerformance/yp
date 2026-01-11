// ===================================================================
// DEV BYPASS SYSTEM - SERVER ONLY
// Functions that require server-only imports (cookies, headers)
// ===================================================================

import "server-only";
import { cookies } from "next/headers";
import { DEV_USER } from "./dev-bypass";

/**
 * Check if auth should be bypassed (server-side) - ASYNC version
 * Layer A: DEV_MODE env var
 * Layer C: yp-bypass cookie
 */
export async function shouldBypassAuthAsync(): Promise<boolean> {
  // Layer A: Local dev mode
  if (process.env.DEV_MODE === "true") {
    return true;
  }

  // Layer C: Personal bypass cookie (requires async in Next.js 15)
  try {
    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get("yp-bypass");
    const secret = process.env.YP_BYPASS_SECRET;

    if (secret && bypassCookie?.value === secret) {
      return true;
    }
  } catch {
    // cookies() not available in some contexts (e.g., static generation)
  }

  return false;
}

// Re-export DEV_USER for convenience in server components
export { DEV_USER };
