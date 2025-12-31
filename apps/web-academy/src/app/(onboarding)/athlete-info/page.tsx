// ═══════════════════════════════════════════════════════════
// ATHLETE PROFILE PAGE
// Collect name, age, and favorite sports
// ═══════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AthleteProfile } from '@/components/screens/onboarding';

export default function ProfilePage() {
  const router = useRouter();
  const { data } = useOnboarding();

  return (
    <AthleteProfile
      onContinue={() => {
        if (data.role === 'athlete') {
          router.push('/code');
        } else {
          router.push('/avatar');
        }
      }}
      onBack={() => router.push('/role')}
    />
  );
}
