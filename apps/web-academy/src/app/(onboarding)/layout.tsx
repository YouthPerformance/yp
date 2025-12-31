// ═══════════════════════════════════════════════════════════
// ONBOARDING LAYOUT
// Wraps all onboarding routes with OnboardingProvider
// No bottom navigation - focused flow
// ═══════════════════════════════════════════════════════════

'use client';

import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {children}
      </div>
    </OnboardingProvider>
  );
}
