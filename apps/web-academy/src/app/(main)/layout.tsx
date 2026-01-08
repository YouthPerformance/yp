// ═══════════════════════════════════════════════════════════
// MAIN APP LAYOUT
// Wraps all authenticated routes with BottomNav
// Force dynamic to avoid SSG issues with Clerk hooks
// ═══════════════════════════════════════════════════════════

import { MainLayoutClient } from './layout-client';

// Force dynamic rendering - Clerk hooks don't work during SSG
export const dynamic = 'force-dynamic';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
