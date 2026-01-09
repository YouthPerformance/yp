// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT
// Simple layout for admin pages (no BottomNav)
// ═══════════════════════════════════════════════════════════

import { AdminLayoutClient } from "./layout-client";

// Force dynamic rendering - Convex hooks don't work during SSG
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
