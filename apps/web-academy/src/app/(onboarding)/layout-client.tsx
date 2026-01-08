// ═══════════════════════════════════════════════════════════
// ONBOARDING LAYOUT - CLIENT COMPONENT
// Client-side logic for onboarding routes
// ═══════════════════════════════════════════════════════════

'use client';

import { OnboardingProvider } from '@/contexts/OnboardingContext';

interface OnboardingLayoutClientProps {
  children: React.ReactNode;
}

export function OnboardingLayoutClient({ children }: OnboardingLayoutClientProps) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {children}
      </div>
    </OnboardingProvider>
  );
}
