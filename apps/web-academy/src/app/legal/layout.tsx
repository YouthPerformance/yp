// ═══════════════════════════════════════════════════════════
// LEGAL PAGES LAYOUT
// Shared layout for Terms of Service and Privacy Policy
// ═══════════════════════════════════════════════════════════

import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary, #0a0a0a)" }}>
      {/* Legal Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/legal/terms"
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/privacy"
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-white transition-colors">
                Back to App
              </Link>
              <span className="text-gray-700">|</span>
              <a
                href="mailto:legal@youthperformance.com"
                className="hover:text-cyan-400 transition-colors"
              >
                legal@youthperformance.com
              </a>
            </div>
            <p className="text-gray-600">Youth Performance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
