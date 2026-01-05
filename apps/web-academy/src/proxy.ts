// ═══════════════════════════════════════════════════════════
// NEXT.JS MIDDLEWARE
// Route protection with Clerk authentication
// ═══════════════════════════════════════════════════════════

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// ─────────────────────────────────────────────────────────────
// ROUTE MATCHERS
// ─────────────────────────────────────────────────────────────

// Public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  '/',                    // Smart router
  '/sign-in(.*)',         // Clerk sign-in
  '/sign-up(.*)',         // Clerk sign-up
  '/role',                // Onboarding: role selection
  '/athlete-info',        // Onboarding: athlete profile
  '/code',                // Onboarding: parent code
  '/avatar',              // Onboarding: avatar selection
  '/ready',               // Onboarding: final screen
  '/api/uplink(.*)',      // GPT Uplink webhooks (custom auth)
]);

// Onboarding routes (auth required, but no user in Convex yet)
const isOnboardingRoute = createRouteMatcher([
  '/role',
  '/athlete-info',
  '/code',
  '/avatar',
  '/ready',
]);

// Main app routes (auth + user required)
const isMainAppRoute = createRouteMatcher([
  '/home(.*)',
  '/workout(.*)',
  '/playbook(.*)',
  '/ask-wolf(.*)',
  '/shop(.*)',
  '/profile(.*)',
  '/cards(.*)',
]);

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
