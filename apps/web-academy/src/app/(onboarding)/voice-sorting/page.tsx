// ═══════════════════════════════════════════════════════════
// VOICE SORTING PAGE
// R3 Wolf Pack sorting via voice interaction
// ═══════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { VoiceSorting } from '@/components/onboarding/VoiceSorting';

export default function VoiceSortingPage() {
  const router = useRouter();
  const { updateAthleteData } = useOnboarding();

  const handleComplete = async (result: {
    trainingPath: 'glass' | 'grinder' | 'prospect';
    wolfIdentity: 'speed' | 'tank' | 'air';
    coachComment: string;
    firstMissionId: string;
  }) => {
    // Save to onboarding context
    updateAthleteData({
      // We'll add these fields to the context
      // For now, store in localStorage as backup
    });

    // Store sorting result
    if (typeof window !== 'undefined') {
      localStorage.setItem('yp_sorting_result', JSON.stringify({
        ...result,
        sortedAt: Date.now(),
        sortingMethod: 'voice',
      }));
    }

    // Navigate to ready page (which will save to Convex)
    router.push('/ready');
  };

  return <VoiceSorting onComplete={handleComplete} />;
}
