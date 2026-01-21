// ═══════════════════════════════════════════════════════════
// ROOT PAGE - SMART ROUTER
// Premium WolfLoader + onboarding status check
// ═══════════════════════════════════════════════════════════

"use client";

import { WolfLoader } from "@yp/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "barefoot_onboarding_state";

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  // Check onboarding status on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.onboardingComplete) {
          setTargetRoute("/home");
        } else {
          setTargetRoute("/role");
        }
      } catch {
        setTargetRoute("/role");
      }
    } else {
      setTargetRoute("/role");
    }

    // Mark content as "ready" - loader handles min duration
    setIsLoading(false);
  }, []);

  // Navigate after loader completes
  const handleLoadComplete = useCallback(() => {
    if (targetRoute) {
      router.replace(targetRoute);
    }
  }, [router, targetRoute]);

  return (
    <WolfLoader
      isLoading={isLoading}
      onLoadComplete={handleLoadComplete}
      minDuration={2500}
      videoSources={{}} // Unicorn WebGL only (no video assets in Academy)
    />
  );
}
