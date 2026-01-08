// ═══════════════════════════════════════════════════════════
// MAIN APP LAYOUT - CLIENT COMPONENT
// Client-side logic for authenticated routes
// ═══════════════════════════════════════════════════════════

'use client';

import { useState, useContext } from 'react';
import { BottomNav } from '@/components/navigation';
import { UpsellModal } from '@/components/modals';
import UserContext from '@/contexts/UserContext';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export function MainLayoutClient({ children }: MainLayoutClientProps) {
  // Use context directly to avoid throwing during SSG (context may be null)
  const context = useContext(UserContext);
  const subscriptionStatus = context?.user?.subscriptionStatus || 'free';
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
