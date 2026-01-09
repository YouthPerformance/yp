// ═══════════════════════════════════════════════════════════
// ROLE SELECTION PAGE
// Entry point - "Who's joining the pack?"
// ═══════════════════════════════════════════════════════════

"use client";

import { useRouter } from "next/navigation";
import { RoleSelection } from "@/components/screens/onboarding";

export default function RolePage() {
  const router = useRouter();

  return (
    <RoleSelection
      onSelectRole={(role) => {
        if (role === "athlete") {
          // Solo athlete flow - goes to code entry if they have a parent code
          // or direct sign up
          router.push("/kid/enter-code");
        } else {
          // Parent flow - starts with athlete age selection
          router.push("/parent/athlete-age");
        }
      }}
      onSignIn={() => {
        // Go to sign in
        router.push("/auth");
      }}
    />
  );
}
