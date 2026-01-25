// ═══════════════════════════════════════════════════════════
// MARKETING HEADER - PUBLIC ONLY
// No auth state - login CTA redirects to app.youthperformance.com
// ═══════════════════════════════════════════════════════════

import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";
import BetaBadge from "./BetaBadge";
import CardNav from "./CardNav";

// App URL for login redirect
const APP_URL = import.meta.env.VITE_APP_URL || "https://app.youthperformance.com";

export default function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUI();
  const _location = useLocation();

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: "var(--top-nav-height-mobile)",
          padding: "8px 16px",
        }}
      >
        {/* Floating glass container */}
        <div
          className="h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,246,224,0.03) 50%, rgba(0,0,0,0.15) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div className="px-4 md:px-6 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Left cluster */}
              <div className="grow basis-0 flex items-center gap-4">
                {/* Hamburger Menu Button */}
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className="p-2 -ml-2 text-dark-text-primary hover:text-cyan-500 transition-colors duration-fast"
                  aria-label="Menu"
                >
                  <div className="relative w-5 h-3.5 flex flex-col justify-between">
                    <span
                      className={`
                        block h-0.5 bg-current rounded-full transform transition-all duration-300 origin-center
                        ${isMobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""}
                      `}
                    />
                    <span
                      className={`
                        block h-0.5 bg-current rounded-full transition-all duration-200
                        ${isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"}
                      `}
                    />
                    <span
                      className={`
                        block h-0.5 bg-current rounded-full transform transition-all duration-300 origin-center
                        ${isMobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}
                      `}
                    />
                  </div>
                </button>
              </div>

              {/* Center: Logo + Beta Badge */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Link to="/" aria-label="YouthPerformance" className="flex items-center">
                  {/* Mobile: authyp.webp (optimized) */}
                  <img
                    src="/images/authyp.webp"
                    alt="YP"
                    className="md:hidden h-6 w-auto"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                  />
                  {/* Desktop: youthperformancewhite.webp */}
                  <img
                    src="/images/youthperformancewhite.webp"
                    alt="Youth Performance"
                    className="hidden md:block h-7 w-auto"
                  />
                </Link>
                <BetaBadge variant="glow" />
              </div>

              {/* Right cluster */}
              <div className="grow basis-0 flex items-center justify-end gap-3 sm:gap-4">
                {/* Search */}
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="hidden sm:flex p-2 text-dark-text-secondary hover:text-cyan-500 transition-colors duration-fast"
                  aria-label="Search (Cmd+K)"
                  title="Search (Cmd+K)"
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

                {/* Login CTA - Redirects to app.youthperformance.com */}
                <a
                  href={`${APP_URL}/auth`}
                  className="p-2 text-dark-text-secondary hover:text-cyan-500 transition-colors duration-fast"
                  aria-label="Sign In"
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
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            header[style] { height: calc(var(--top-nav-height) + 16px); }
          }
        `}</style>
      </header>

      {/* Premium Card Nav */}
      <CardNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
