console.log("[YP Debug] main.jsx loading...");

import posthog from "posthog-js";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { UIProvider } from "./context/UIContext";
import "./index.css";

console.log("[YP Debug] imports complete");

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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// YouthPerformance Design System - Dark Mode Theme
const clerkAppearance = {
  variables: {
    colorPrimary: "#00F6E0",
    colorBackground: "#0A0A0A",
    colorInputBackground: "#222222",
    colorInputText: "#FFFFFF",
    colorText: "#FFFFFF",
    colorTextSecondary: "#A0A0A0",
    colorDanger: "#EF4444",
    colorSuccess: "#10B981",
    colorWarning: "#FBBF24",
    borderRadius: "12px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  },
  elements: {
    // Modal/Card
    card: "bg-[#0A0A0A] border border-[#2A2A2A] shadow-xl",
    modalContent: "bg-[#0A0A0A]",
    modalBackdrop: "bg-black/80 backdrop-blur-sm",

    // Header
    headerTitle: "text-white font-semibold",
    headerSubtitle: "text-[#A0A0A0]",

    // Form
    formButtonPrimary:
      "bg-[#00F6E0] hover:bg-[#00DCCE] text-black font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(0,246,224,0.3)] hover:shadow-[0_0_32px_rgba(0,246,224,0.5)]",
    formFieldLabel: "text-[#A0A0A0] text-sm",
    formFieldInput:
      "bg-[#222222] border-[#2A2A2A] text-white placeholder:text-[#666666] focus:border-[#00F6E0] focus:ring-[#00F6E0]/40 rounded-lg",
    formFieldInputShowPasswordButton: "text-[#A0A0A0] hover:text-white",

    // Divider
    dividerLine: "bg-[#2A2A2A]",
    dividerText: "text-[#666666]",

    // Social buttons
    socialButtonsBlockButton:
      "bg-[#141414] border-[#2A2A2A] text-white hover:bg-[#1A1A1A] transition-colors",
    socialButtonsBlockButtonText: "text-white",

    // Footer
    footerActionText: "text-[#A0A0A0]",
    footerActionLink: "text-[#00F6E0] hover:text-[#00DCCE]",

    // Identity preview
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-[#00F6E0] hover:text-[#00DCCE]",

    // User button
    userButtonPopoverCard: "bg-[#0A0A0A] border border-[#2A2A2A]",
    userButtonPopoverActionButton: "text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]",
    userButtonPopoverActionButtonText: "text-inherit",
    userButtonPopoverFooter: "border-t border-[#2A2A2A]",

    // Alerts
    alertText: "text-white",

    // Logo
    logoBox: "hidden",
  },
};

// Wrapper component to conditionally include Convex
function AppProviders({ children }) {
  if (convex) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    );
  }
  return children;
}

console.log("[YP Debug] about to render...");
try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
        <AppProviders>
          <BrowserRouter>
            <UIProvider>
              <App />
            </UIProvider>
          </BrowserRouter>
        </AppProviders>
      </ClerkProvider>
    </React.StrictMode>,
  );
  console.log("[YP Debug] render called successfully");
} catch (e) {
  console.error("[YP Debug] render failed:", e);
}
