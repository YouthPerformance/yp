// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT
// Simple layout for admin pages (no BottomNav)
// ═══════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/campaigns', label: 'Campaigns', icon: '📝' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 px-4 py-3 border-b"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-2xl">🐺</span>
              <span
                className="font-bebas text-xl tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                YP ADMIN
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-2 ml-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: pathname.startsWith(item.href)
                      ? 'var(--accent-primary)'
                      : 'transparent',
                    color: pathname.startsWith(item.href)
                      ? 'var(--bg-primary)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/home"
            className="text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            ← Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
