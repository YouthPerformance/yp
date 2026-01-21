/**
 * @yp/alpha Analytics - Shared PostHog Configuration
 *
 * AI-native, privacy-first analytics setup.
 * Zero cookies, CCPA compliant, maximum conversions.
 */

// PostHog API key - safe to expose (client-side analytics)
export const POSTHOG_KEY = "phc_lcgYo2g4YNIqVcK1d75227vPTROVvlbVBaj9rBxnfvJ";
export const POSTHOG_HOST = "https://us.i.posthog.com";

/**
 * Shared PostHog configuration
 * Privacy-first: localStorage only (no cookies = no consent banner needed)
 */
export const POSTHOG_CONFIG = {
  api_host: POSTHOG_HOST,

  // Privacy-first (no cookies = no consent needed for US)
  persistence: "localStorage" as const,
  person_profiles: "identified_only" as const,
  respect_dnt: true,

  // AI-native (let PostHog autocapture do the work)
  autocapture: true,
  capture_pageview: true,
  capture_pageleave: true,

  // Session recording with privacy
  disable_session_recording: false,
  session_recording: {
    maskAllInputs: true, // Mask all form inputs by default
    maskTextSelector: "[data-mask]", // Additional opt-in masking
  },

  // Feature flags
  advanced_disable_decide: false,
  opt_out_capturing_by_default: false,
} as const;

// Browser environment check
const isBrowser = typeof window !== "undefined";

/**
 * Check if user has opted out of tracking
 * (Client-side only)
 */
export function hasOptedOut(): boolean {
  if (!isBrowser) return false;
  try {
    return window.localStorage.getItem("yp_opted_out") === "true";
  } catch {
    return false;
  }
}

/**
 * Opt user out of all tracking (CCPA "Do Not Sell")
 * (Client-side only)
 */
export function optOutTracking(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem("yp_opted_out", "true");
    // PostHog opt-out if loaded
    const ph = (window as unknown as { posthog?: { opt_out_capturing: () => void } }).posthog;
    if (ph) {
      ph.opt_out_capturing();
    }
  } catch {
    // localStorage may be blocked
  }
}

/**
 * Opt user back into tracking
 * (Client-side only)
 */
export function optInTracking(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem("yp_opted_out");
    // PostHog opt-in if loaded
    const ph = (window as unknown as { posthog?: { opt_in_capturing: () => void } }).posthog;
    if (ph) {
      ph.opt_in_capturing();
    }
  } catch {
    // localStorage may be blocked
  }
}

// Re-export events
export * from "./events";
