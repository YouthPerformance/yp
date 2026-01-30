// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT - CLIENT COMPONENT
// Minimal provider wrapper for admin routes
// ═══════════════════════════════════════════════════════════

"use client";

import { ConvexClientProvider } from "@/components/providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
    </ConvexClientProvider>
  );
}
