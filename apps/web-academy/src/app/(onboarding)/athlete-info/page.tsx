// ═══════════════════════════════════════════════════════════
// ATHLETE PROFILE PAGE
// Collect name, age, and favorite sports
// ═══════════════════════════════════════════════════════════

"use client";

import { useRouter } from "next/navigation";
import { AthleteProfile } from "@/components/screens/onboarding";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function ProfilePage() {
  const router = useRouter();
  const { data } = useOnboarding();

  return (
    <AthleteProfile
      onContinue={() => {
        if (data.role === "athlete") {
          router.push("/code");
        } else {
          router.push("/avatar");
        }
      }}
      onBack={() => router.push("/role")}
    />
  );
}
