import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";

// ===========================================================================
// GlassMorphicHeader - Premium liquid glass navigation
// Inspired by Shopify Supply's floating nav design
// ===========================================================================

interface GlassMorphicHeaderProps {
  cartCount?: number;
}

export function GlassMorphicHeader({ cartCount = 0 }: GlassMorphicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);

  // Handle menu open/close with animation
  const toggleMenu = () => {
    if (mobileMenuOpen) {
      setMenuAnimating(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setMenuAnimating(false);
      }, 300);
    } else {
      setMobileMenuOpen(true);
    }
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{
        padding: "12px 16px",
      }}
    >
      {/* Floating glass container */}
      <div
        className="h-14 md:h-16"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(100,150,255,0.04) 50%, rgba(0,0,0,0.15) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="px-4 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left cluster */}
            <div className="grow basis-0 flex items-center gap-4 md:gap-6">
              {/* Mobile: Hamburger */}
              <button
                type="button"
                onClick={toggleMenu}
                className="md:hidden p-2 -ml-2 hover:opacity-70 transition-all duration-300"
                aria-label="Menu"
              >
                <div className="relative w-5 h-3.5">
                  <span
                    className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
                  />
                  <span
                    className={`absolute left-0 top-1.5 h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`}
                  />
                  <span
                    className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
                  />
                </div>
              </button>

              {/* Beta Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-orange-400 font-medium">Beta</span>
              </div>

              {/* Desktop: Nav links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/products/neoball"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  NeoBall
                </Link>
                <Link
                  to="/products/footbag"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  Footbag
                </Link>
                <Link
                  to="/products/neo-mask"
                  className="text-[13px] uppercase tracking-[0.15em] font-medium hover:text-cyan transition-colors"
                >
                  Neo Mask
                </Link>
              </nav>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" aria-label="YP Shop">
                <img src="/images/yp-logo.png" alt="YP" className="h-8 md:h-10 w-auto" />
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
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
          className={`fixed inset-0 top-0 z-40 transition-all duration-300 ${menuAnimating ? 'opacity-0' : 'opacity-100'}`}
          style={{
            background: "linear-gradient(180deg, rgba(8,8,12,0.98) 0%, rgba(4,4,8,0.99) 100%)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
          }}
        >
          {/* Subtle gradient accent */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(0,235,247,0.15) 0%, transparent 50%)",
            }}
          />

          {/* Beta badge - mobile */}
          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 sm:hidden">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-orange-400 font-medium">Beta</span>
          </div>

          <nav className="flex flex-col items-center justify-center h-full gap-6 px-8">
            {[
              { to: "/", label: "Shop", delay: "0ms" },
              { to: "/products/neoball", label: "NeoBall", delay: "50ms" },
              { to: "/products/footbag", label: "Footbag", delay: "100ms" },
              { to: "/products/neo-mask", label: "Neo Mask", delay: "150ms" },
              { to: "/account", label: "Account", delay: "200ms" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={toggleMenu}
                className={`group relative text-3xl uppercase tracking-[0.25em] font-display transition-all duration-500 ${menuAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                style={{ transitionDelay: menuAnimating ? "0ms" : item.delay }}
              >
                <span className="relative z-10 text-white/90 group-hover:text-cyan transition-colors duration-300">
                  {item.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Divider */}
            <div className={`w-16 h-[1px] bg-white/10 my-4 transition-all duration-500 ${menuAnimating ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} style={{ transitionDelay: "250ms" }} />

            {/* External link */}
            <a
              href="https://app.youthperformance.com"
              className={`flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/50 hover:text-cyan transition-all duration-500 ${menuAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
              style={{ transitionDelay: "300ms" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              YP Academy
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        </div>
      )}
    </header>
  );
}

export default GlassMorphicHeader;
