// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT - SERVER COMPONENT
// Wraps admin routes - Voice Command Center, etc.
// Force dynamic to avoid SSG issues with Convex hooks
// ═══════════════════════════════════════════════════════════

import { AdminLayoutClient } from "./layout-client";

// Force dynamic rendering - Convex hooks don't work during SSG
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
