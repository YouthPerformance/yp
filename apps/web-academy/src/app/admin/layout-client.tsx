// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT - CLIENT COMPONENT
// Navigation and providers for admin routes
// ═══════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConvexClientProvider } from "@/components/providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

const NAV_ITEMS = [
  { label: "Command Center", href: "/admin/command-center", icon: "🎙️" },
  { label: "Back to Academy", href: "/home", icon: "←" },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();

  return (
    <ConvexClientProvider>
      <UserProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <Link href="/admin/command-center" className="text-lg font-bold tracking-tight">
                    YP <span className="text-cyan-400">ADMIN</span>
                  </Link>
                  <nav className="hidden md:flex items-center gap-4">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">Voice Command Center v1.0</span>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </UserProvider>
    </ConvexClientProvider>
  );
}
