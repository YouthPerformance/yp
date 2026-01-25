// ═══════════════════════════════════════════════════════════
// MARKETING SITE - PUBLIC ONLY
// No auth state - all login flows redirect to app.youthperformance.com
// ═══════════════════════════════════════════════════════════

console.log("[YP Debug] main.jsx loading...");

import posthog from "posthog-js";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { UIProvider } from "./context/UIContext";
import "./index.css";

console.log("[YP Debug] imports complete");

// App URL for login redirects
export const APP_URL = import.meta.env.VITE_APP_URL || "https://app.youthperformance.com";

// PostHog Analytics Initialization - Full Funnel Tracking
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Autocapture everything
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    // Session recordings for full user journey
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false, // We want to see email inputs
      maskInputOptions: {
        password: true, // Mask passwords only
      },
    },
    // Heatmaps
    enable_heatmaps: true,
    // Error tracking
    capture_performance: true,
    // Cross-domain tracking
    cross_subdomain_cookie: true,
    // Persistence
    persistence: "localStorage+cookie",
    // Bootstrap for faster loading
    bootstrap: {
      distinctID: localStorage.getItem("yp_user_id") || undefined,
    },
    // Loaded callback
    loaded: (ph) => {
      console.log("[PostHog] Initialized with full tracking");
      // Capture UTM params
      const params = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content"),
        utm_term: params.get("utm_term"),
        referrer: document.referrer,
        landing_page: window.location.pathname,
      };
      if (Object.values(utm).some((v) => v)) {
        ph.register(utm); // Attach to all future events
      }
    },
  });
  // Make globally available for LP and other components
  window.posthog = posthog;
} else {
  console.warn("[PostHog] No API key found - analytics disabled");
}

console.log("[YP Debug] about to render...");
try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <UIProvider>
          <App />
        </UIProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
  console.log("[YP Debug] render called successfully");
} catch (e) {
  console.error("[YP Debug] render failed:", e);
}
