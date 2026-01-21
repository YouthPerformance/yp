/**
 * PostHog Analytics Client - Shop
 *
 * AI-native, privacy-first analytics for Hydrogen/Remix.
 * No cookies = no consent banner needed (CCPA compliant for US).
 */
import posthog from "posthog-js";

const POSTHOG_KEY = "phc_lcgYo2g4YNIqVcK1d75227vPTROVvlbVBaj9rBxnfvJ";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;

  // Check for opt-out before initializing
  if (localStorage.getItem("yp_opted_out") === "true") {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,

    // Privacy-first (no cookies = no consent banner)
    persistence: "localStorage",
    person_profiles: "identified_only",
    respect_dnt: true,

    // AI-native (let autocapture do the work)
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,

    // E-commerce specific
    capture_heatmaps: true,

    // Session recording with privacy
    disable_session_recording: process.env.NODE_ENV !== "production",
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-mask]",
    },

    // Feature flags
    advanced_disable_decide: false,

    loaded: (ph) => {
      if (process.env.NODE_ENV !== "production") {
        ph.debug();
      }
    },
  });

  initialized = true;
}

// ============================================
// E-COMMERCE EVENT HELPERS
// ============================================

export function trackProductViewed(product: {
  id: string;
  title: string;
  price: number;
}) {
  posthog.capture("product_viewed", {
    product_id: product.id,
    product_title: product.title,
    price: product.price,
  });
}

export function trackAddToCart(product: {
  id: string;
  title: string;
  price: number;
  currency?: string;
  quantity?: number;
}) {
  posthog.capture("add_to_cart", {
    product_id: product.id,
    product_title: product.title,
    price: product.price,
    currency: product.currency || "USD",
    quantity: product.quantity || 1,
  });
}

export function trackCheckoutStarted(cart: {
  total: number;
  itemCount: number;
}) {
  posthog.capture("checkout_started", {
    cart_total: cart.total,
    item_count: cart.itemCount,
  });
}

export function trackPurchase(order: {
  orderId: string;
  total: number;
  itemCount: number;
}) {
  posthog.capture("purchase", {
    order_id: order.orderId,
    revenue: order.total,
    item_count: order.itemCount,
  });
}

// ============================================
// OPT-OUT HELPERS (CCPA Compliance)
// ============================================

export function optOutTracking(): void {
  localStorage.setItem("yp_opted_out", "true");
  posthog.opt_out_capturing();
}

export function optInTracking(): void {
  localStorage.removeItem("yp_opted_out");
  posthog.opt_in_capturing();
}

export function hasOptedOut(): boolean {
  return localStorage.getItem("yp_opted_out") === "true";
}

export { posthog };
