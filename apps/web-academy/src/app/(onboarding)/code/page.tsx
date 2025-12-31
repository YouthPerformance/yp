// ═══════════════════════════════════════════════════════════
// PARENT CODE ENTRY PAGE
// 6-digit code from parent account (COPPA compliance)
// ═══════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { ParentCodeEntry } from '@/components/screens/onboarding';

export default function CodePage() {
  const router = useRouter();

  return (
    <ParentCodeEntry
      onSuccess={() => router.push('/avatar')}
      onBack={() => router.push('/athlete-info')}
      onNoCode={() => {
        // Redirect to parent signup flow
        router.push('/role');
      }}
    />
  );
}
