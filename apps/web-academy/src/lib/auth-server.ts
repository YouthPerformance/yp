// ===================================================================
// SERVER-SIDE AUTH UTILITIES
// For use in API routes and server components
// ===================================================================

import { auth } from "@yp/alpha/auth";
import { cookies, headers } from "next/headers";
import { shouldBypassAuthAsync, DEV_USER } from "./dev-bypass-server";

// ---------------------------------------------------------------
// GET SESSION FROM COOKIES
// ---------------------------------------------------------------

interface SessionUser {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: SessionUser;
}

/**
 * Get the current session from cookies
 * Returns null if not authenticated
 * DEV: Returns mock session when DEV_MODE=true or yp-bypass cookie is set
 */
export async function getServerSession(): Promise<Session | null> {
  // Check for dev bypass (Layer A + C)
  if (await shouldBypassAuthAsync()) {
    return {
      user: {
        id: DEV_USER.id,
        email: DEV_USER.email,
        name: DEV_USER.name,
      },
    };
  }

  try {
    // Get headers to pass to BetterAuth for session validation
    const headersList = await headers();
    const cookieStore = await cookies();

    // Build cookie header string from all cookies
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Call BetterAuth API to validate session
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookieHeader,
        // Pass through other relevant headers
        "user-agent": headersList.get("user-agent") || "",
      }),
    });

    if (!session?.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
      },
    };
  } catch (error) {
    console.error("[AuthServer] Failed to get session:", error);
    return null;
  }
}

/**
 * Get the authenticated user ID
 * Returns null if not authenticated
 * DEV: Returns mock user ID when bypass is active
 */
export async function getAuthUserId(): Promise<string | null> {
  // Check for dev bypass (Layer A + C)
  if (await shouldBypassAuthAsync()) {
    return DEV_USER.id;
  }

  const session = await getServerSession();
  return session?.user?.id ?? null;
}

/**
 * Require authentication - throws if not authenticated
 * DEV: Returns mock session when bypass is active
 */
export async function requireAuth(): Promise<Session> {
  // Check for dev bypass (Layer A + C)
  if (await shouldBypassAuthAsync()) {
    return {
      user: {
        id: DEV_USER.id,
        email: DEV_USER.email,
        name: DEV_USER.name,
      },
    };
  }

  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
