// ═══════════════════════════════════════════════════════════
// PUBLIC LAYOUT
// No auth providers - for landing pages, lead magnets, etc.
// ═══════════════════════════════════════════════════════════

import type React from "react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // Just pass through - uses root layout's html/body
  // but does NOT inherit (main) or (onboarding) layouts with auth
  return <>{children}</>;
}
