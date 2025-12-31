"use client";

import React, { useState } from "react";

/**
 * YP Unified Header - "The Wolf Skin"
 * ====================================
 * Pure presentational component that works across:
 * - Next.js (Academy)
 * - Hydrogen/Remix (Shop)
 * - Astro (NeoBall LP)
 *
 * Design: Wolf Black (#0f0f0f) + Neon Green (#ccff00)
 */

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface HeaderProps {
  /** Number of items in cart (0 = hide badge) */
  cartCount?: number;
  /** User avatar URL (null = show login) */
  userAvatar?: string | null;
  /** Navigation links */
  links?: NavLink[];
  /** Current active path for highlighting */
  activePath?: string;
  /** Custom logo component (optional) */
  logoHref?: string;
}

const defaultLinks: NavLink[] = [
  { label: "ACADEMY", href: "https://youthperformance.com" },
  { label: "SHOP", href: "https://shop.youthperformance.com" },
  { label: "NEOBALL", href: "https://neoball.co" },
];

export function Header({
  cartCount = 0,
  userAvatar = null,
  links = defaultLinks,
  activePath,
  logoHref = "/",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#0f0f0f",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <nav
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href={logoHref}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ccff00",
            }}
          >
            YP
          </span>
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "rgba(255, 255, 255, 0.5)",
              textTransform: "uppercase",
            }}
          >
            WOLF PACK
          </span>
        </a>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
          className="yp-header-desktop"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textDecoration: "none",
                color: activePath === link.href ? "#ccff00" : "rgba(255, 255, 255, 0.7)",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ccff00")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activePath === link.href ? "#ccff00" : "rgba(255, 255, 255, 0.7)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Cart Icon */}
          <a
            href="/cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transition: "background-color 0.2s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(204, 255, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  minWidth: "18px",
                  height: "18px",
                  padding: "0 5px",
                  borderRadius: "9px",
                  backgroundColor: "#ccff00",
                  color: "#0f0f0f",
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </a>

          {/* User Avatar / Login */}
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Profile"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "2px solid rgba(204, 255, 0, 0.3)",
                objectFit: "cover",
              }}
            />
          ) : (
            <a
              href="/login"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#ccff00",
                color: "#0f0f0f",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.02em",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(204, 255, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              className="yp-header-login"
            >
              LOGIN
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            className="yp-header-mobile-toggle"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            backgroundColor: "#0f0f0f",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "16px 24px",
          }}
          className="yp-header-mobile-menu"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              style={{
                display: "block",
                padding: "12px 0",
                fontFamily: "system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textDecoration: "none",
                color: activePath === link.href ? "#ccff00" : "rgba(255, 255, 255, 0.8)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .yp-header-desktop {
            display: none !important;
          }
          .yp-header-mobile-toggle {
            display: flex !important;
          }
          .yp-header-login {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .yp-header-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
