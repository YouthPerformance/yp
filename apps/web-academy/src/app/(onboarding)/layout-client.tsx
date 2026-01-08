// ═══════════════════════════════════════════════════════════
// ONBOARDING LAYOUT - CLIENT COMPONENT
// Client-side logic for onboarding routes
// Includes all providers (Clerk, Convex, Theme)
// ═══════════════════════════════════════════════════════════

"use client";

import { ConvexClientProvider } from "@/components/providers";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

interface OnboardingLayoutClientProps {
  children: React.ReactNode;
}

export function OnboardingLayoutClient({ children }: OnboardingLayoutClientProps) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
              {children}
            </div>
          </OnboardingProvider>
        </ThemeProvider>
      </UserProvider>
    </ConvexClientProvider>
  );
}
