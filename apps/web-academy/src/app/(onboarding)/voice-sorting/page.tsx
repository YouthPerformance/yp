// ═══════════════════════════════════════════════════════════
// VOICE SORTING PAGE
// R3 Wolf Pack sorting via voice interaction
// A/B tests: OpenAI Realtime API vs Modular Pipeline
// ═══════════════════════════════════════════════════════════

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { VoiceSorting, VoiceSortingRealtime } from "@/components/onboarding/VoiceSorting";
import { useOnboarding } from "@/contexts/OnboardingContext";

type Implementation = "realtime" | "modular" | null;

export default function VoiceSortingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateAthleteData } = useOnboarding();
  const [implementation, setImplementation] = useState<Implementation>(null);
  const [forceModular, setForceModular] = useState(false);

  // Determine implementation on mount
  useEffect(() => {
    // Check for override query param (?voice=realtime or ?voice=modular)
    const voiceParam = searchParams.get("voice");
    if (voiceParam === "realtime" || voiceParam === "modular") {
      setImplementation(voiceParam);
      return;
    }

    // Check for stored assignment (sticky cohort)
    const stored = localStorage.getItem("yp_voice_implementation");
    if (stored === "realtime" || stored === "modular") {
      setImplementation(stored);
      return;
    }

    // Fetch from feature flags (async)
    import("@/lib/flags").then(({ getVoiceImplementation }) => {
      // Use localStorage to generate a pseudo user ID for bucketing
      const userId = localStorage.getItem("yp_user_id") || crypto.randomUUID();
      if (!localStorage.getItem("yp_user_id")) {
        localStorage.setItem("yp_user_id", userId);
      }

      getVoiceImplementation(userId).then((impl) => {
        // Store assignment for sticky cohort
        localStorage.setItem("yp_voice_implementation", impl);
        setImplementation(impl);
      });
    });
  }, [searchParams]);

  const handleComplete = useCallback(
    async (result: {
      trainingPath: "glass" | "grinder" | "prospect";
      wolfIdentity: "speed" | "tank" | "air";
      coachComment: string;
      firstMissionId: string;
    }) => {
      // Save to onboarding context
      updateAthleteData({
        // We'll add these fields to the context
        // For now, store in localStorage as backup
      });

      // Store sorting result with implementation info
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "yp_sorting_result",
          JSON.stringify({
            ...result,
            sortedAt: Date.now(),
            sortingMethod: "voice",
            implementation: forceModular ? "modular" : implementation,
          }),
        );
      }

      // Navigate to ready page (which will save to Convex)
      router.push("/ready");
    },
    [updateAthleteData, router, implementation, forceModular],
  );

  // Fallback handler for Realtime API failures
  const handleFallbackToModular = useCallback(() => {
    console.log("[voice-sorting] Falling back to modular pipeline");
    setForceModular(true);
  }, []);

  // Loading state
  if (!implementation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: "#00f6e0", borderTopColor: "transparent" }}
          />
          <p className="text-gray-500 text-sm">Initializing Wolf...</p>
        </div>
      </div>
    );
  }

  // Use Realtime if assigned and not forced to modular
  if (implementation === "realtime" && !forceModular) {
    return (
      <VoiceSortingRealtime
        onComplete={handleComplete}
        onFallbackToModular={handleFallbackToModular}
      />
    );
  }

  // Default: Modular pipeline
  return <VoiceSorting onComplete={handleComplete} />;
}
