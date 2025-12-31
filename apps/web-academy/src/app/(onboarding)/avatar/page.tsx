// ═══════════════════════════════════════════════════════════
// AVATAR SELECTION PAGE
// Choose wolf color
// ═══════════════════════════════════════════════════════════

'use client';

import { useRouter } from 'next/navigation';
import { AvatarSelect } from '@/components/screens/onboarding';

export default function AvatarPage() {
  const router = useRouter();

  return (
    <AvatarSelect
      onContinue={() => router.push('/ready')}
      onBack={() => router.push('/code')}
    />
  );
}
