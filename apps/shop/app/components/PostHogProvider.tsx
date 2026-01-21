/**
 * PostHog Provider for Hydrogen/Remix
 * Client-side only initialization with route tracking
 */
import { useEffect } from "react";
import { useLocation } from "@remix-run/react";
import { initPostHog, posthog } from "~/lib/posthog.client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [location.pathname]);

  return <>{children}</>;
}
