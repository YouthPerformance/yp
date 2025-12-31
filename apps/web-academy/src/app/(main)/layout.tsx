// ═══════════════════════════════════════════════════════════
// MAIN APP LAYOUT
// Wraps all authenticated routes with BottomNav
// Includes UserProvider for state management
// ═══════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/navigation';
import { UpsellModal } from '@/components/modals';
import { useUserContext } from '@/contexts/UserContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserContext();
  const subscriptionStatus = user?.subscriptionStatus || 'free';
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {children}

      <BottomNav
        subscriptionStatus={subscriptionStatus}
        onLockedClick={() => setShowUpsellModal(true)}
      />

      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
      />
    </div>
  );
}
