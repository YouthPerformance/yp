// ═══════════════════════════════════════════════════════════
// ONBOARDING LAYOUT
// Wraps all onboarding routes with OnboardingProvider
// No bottom navigation - focused flow
// ═══════════════════════════════════════════════════════════

import { OnboardingLayoutClient } from "./layout-client";

// Force dynamic rendering - Clerk hooks don't work during SSG
export const dynamic = "force-dynamic";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingLayoutClient>{children}</OnboardingLayoutClient>;
}
