import { Link } from '@remix-run/react';
import { useState } from 'react';

// ===========================================================================
// GlassMorphicHeader - Premium liquid glass navigation
// Inspired by Shopify Supply's floating nav design
// ===========================================================================

interface GlassMorphicHeaderProps {
  cartCount?: number;
}

export function GlassMorphicHeader({ cartCount = 0 }: GlassMorphicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{
        padding: '12px 16px',
      }}
    >
      {/* Floating glass container */}
      <div
        className="h-14 md:h-16"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(100,150,255,0.04) 50%, rgba(0,0,0,0.15) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <div className="px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left cluster */}
            <div className="grow basis-0 flex items-center gap-6 md:gap-8">
              {/* Mobile: Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 -ml-2 hover:opacity-70 transition-opacity"
                aria-label="Menu"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1h18M1 7h18M1 13h18" />
                </svg>
              </button>

              {/* Desktop: Nav links */}
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  to="/"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/collections/all"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  Collections
                </Link>
                <a
                  href="https://academy.youthperformance.com"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Academy
                </a>
              </nav>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" aria-label="YP Shop" className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-display font-bold tracking-tight">
                  <span className="text-lime">YP</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                  Wolf Pack
                </span>
              </Link>
            </div>

            {/* Right cluster */}
            <div className="grow basis-0 flex items-center justify-end gap-2 sm:gap-4">
              {/* Search */}
              <button
                type="button"
                className="p-2 hover:text-cyan transition-colors"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              {/* Account */}
              <Link
                to="/account"
                className="hidden sm:block p-2 hover:text-cyan transition-colors"
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 hover:text-cyan transition-colors relative"
                aria-label="Cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan text-wolf-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-20 z-40"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="uppercase tracking-[0.2em] font-display hover:text-cyan transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/collections/all"
              onClick={() => setMobileMenuOpen(false)}
              className="uppercase tracking-[0.2em] font-display hover:text-cyan transition-colors"
            >
              Collections
            </Link>
            <a
              href="https://academy.youthperformance.com"
              className="uppercase tracking-[0.2em] font-display hover:text-cyan transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Academy
            </a>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="uppercase tracking-[0.2em] font-display hover:text-cyan transition-colors"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default GlassMorphicHeader;
