// ═══════════════════════════════════════════════════════════
// NEXT.JS MIDDLEWARE
// Route protection with BetterAuth session validation
// ═══════════════════════════════════════════════════════════

import { type NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// ROUTE MATCHERS
// ─────────────────────────────────────────────────────────────

// Public routes (no auth required)
const PUBLIC_ROUTES = new Set([
  "/",
  "/auth",
  "/sign-in",
  "/sign-up",
  "/role",
  "/athlete-info",
  "/code",
  "/avatar",
  "/ready",
  "/voice-sorting",
  "/bulletproof-ankles",
  "/adam",
  "/james", // James Scott founder page
]);

// Public route prefixes
const PUBLIC_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/api/uplink",
  "/api/voice",
  "/api/auth", // BetterAuth API routes
  "/api/email", // OTP email sending
  "/api/content", // Content iteration API
  "/api/whatsapp", // WhatsApp webhook - Tom COS
  "/api/webhooks", // Stripe and other webhooks
  "/legal",
  "/admin", // Admin dashboard (temporary - add proper admin auth later)
  "/dev", // Dev test routes (remove before production)
  "/demo", // Demo routes - no auth required
  "/playbook", // Playbook modules - public content
  "/parent", // Parent onboarding flow - no auth required
  "/handoff", // Baton pass handoff routes
  "/basketball", // SEO content pages - public
];

function isPublicRoute(pathname: string): boolean {
  // Check exact matches
  if (PUBLIC_ROUTES.has(pathname)) {
    return true;
  }

  // Check prefixes
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEV MODE - bypass all auth (set DEV_MODE=true in .env.local)
  if (process.env.DEV_MODE === "true") {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for BetterAuth session cookie
  const sessionToken =
    request.cookies.get("wolfpack.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  // No session - redirect to sign-in
  if (!sessionToken) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Session exists - allow request
  // Note: Full session validation happens in API routes/server components
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
