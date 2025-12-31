// ═══════════════════════════════════════════════════════════
// ATHLETE READY PAGE
// Final screen before entering the main app
// Creates user in Convex and redirects to dashboard
// ═══════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useUserContext } from '@/contexts/UserContext';
import { AthleteReady } from '@/components/screens/onboarding';

export default function ReadyPage() {
  const router = useRouter();
  const { completeOnboarding, assignFoundationProgram, data } = useOnboarding();
  const { createUser, isSignedIn } = useUserContext();
  const [isCreating, setIsCreating] = useState(false);

  const handleStart = async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      // Ensure Foundation program is assigned
      if (!data.programId) {
        assignFoundationProgram();
      }

      // Create user in Convex if signed in
      if (isSignedIn) {
        console.log('[ReadyPage] Creating user in Convex:', {
          name: data.athleteName,
          role: data.role,
          avatarColor: data.avatarColor,
        });

        const userId = await createUser({
          name: data.athleteName || 'Athlete',
          role: data.role || 'athlete',
          avatarColor: (data.avatarColor as 'cyan' | 'gold' | 'purple' | 'green' | 'red') || 'cyan',
          sport: data.sports?.[0],
          age: data.athleteAge ?? undefined,
          parentCode: data.parentCode ?? undefined,
        });

        if (userId) {
          console.log('[ReadyPage] User created:', userId);
        } else {
          console.warn('[ReadyPage] Failed to create user');
        }
      } else {
        console.log('[ReadyPage] Not signed in, skipping Convex user creation');
      }

      // Complete onboarding (saves to localStorage)
      await completeOnboarding();

      // Navigate to main app
      router.push('/home');
    } catch (error) {
      console.error('[ReadyPage] Error:', error);
      setIsCreating(false);
    }
  };

  return <AthleteReady onStart={handleStart} />;
}
