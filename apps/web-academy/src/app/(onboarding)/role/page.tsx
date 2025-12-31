// ═══════════════════════════════════════════════════════════
// ROLE SELECTION PAGE
// Entry point - "Who's joining the pack?"
// ═══════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { RoleSelection } from '@/components/screens/onboarding';

export default function RolePage() {
  const router = useRouter();

  return (
    <RoleSelection
      onSelectRole={(role) => {
        if (role === 'athlete') {
          router.push('/athlete-info'); // Athlete flow
        } else {
          // TODO: Parent flow - for now go to athlete-info
          router.push('/athlete-info');
        }
      }}
      onSignIn={() => {
        // TODO: Implement sign in
        router.push('/home');
      }}
    />
  );
}
