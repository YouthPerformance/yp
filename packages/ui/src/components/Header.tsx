"use client";

import { useState } from "react";
import { BetaBadge, type BetaBadgeVariant } from "./BetaBadge";

/**
 * YP Unified Header - "Wolf Pack Glass"
 * ====================================
 * Glass morphism header matching YP design system
 * Works across: Next.js (Academy), Hydrogen/Remix (Shop), Astro (NeoBall)
 *
 * Design: Floating glass container + Cyan (#00F6E0) accents + Beta Badge
 */

// YP Design Tokens
const YP_CYAN = "#00F6E0";
const YP_CYAN_HOVER = "rgba(0, 246, 224, 0.1)";
const YP_CYAN_BORDER = "rgba(0, 246, 224, 0.2)";
const YP_CYAN_GLOW = "rgba(0, 246, 224, 0.4)";

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
  /** Logo link destination */
  logoHref?: string;
  /** Logo image source (optional - falls back to text if not provided) */
  logoSrc?: string;
  /** Cart page URL */
  cartHref?: string;
  /** Login page URL */
  loginHref?: string;
  /** Show login button */
  showLogin?: boolean;
  /** Show cart icon (default: true) - set false for content/app pages */
  showCart?: boolean;
  /** Hide "WOLF PACK" subtitle next to logo */
  hideSubtitle?: boolean;
  /** Show Beta badge next to logo (default: true) */
  showBetaBadge?: boolean;
  /** Beta badge variant */
  betaBadgeVariant?: BetaBadgeVariant;
}

const defaultLinks: NavLink[] = [
  { label: "ACADEMY", href: "https://academy.youthperformance.com" },
  { label: "SHOP", href: "https://shop.youthperformance.com" },
  { label: "NEOBALL", href: "https://neoball.co" },
];

export function Header({
  cartCount = 0,
  userAvatar = null,
  links = defaultLinks,
  activePath,
  logoHref = "/",
  logoSrc,
  cartHref = "https://shop.youthperformance.com/cart",
  loginHref = "https://shop.youthperformance.com/account/login",
  showLogin = false,
  showCart = true,
  hideSubtitle = false,
  showBetaBadge = true,
  betaBadgeVariant = "glow",
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
        padding: "12px 16px",
      }}
    >
      {/* Floating Glass Container */}
      <div
        style={{
          height: "56px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(100,150,255,0.04) 50%, rgba(0,0,0,0.4) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <nav
          style={{
            height: "100%",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Logo + Brand */}
          <a
            href={logoHref}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: "12px",
            }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="YP"
                style={{
                  height: "32px",
                  width: "auto",
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: YP_CYAN,
                  lineHeight: 1,
                }}
              >
                YP
              </span>
            )}
            {!hideSubtitle && (
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                }}
              >
                WOLF PACK
              </span>
            )}
          </a>
          {showBetaBadge && <BetaBadge variant={betaBadgeVariant} />}

          {/* Center: Desktop Navigation */}
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
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  color: activePath === link.href ? YP_CYAN : "rgba(255, 255, 255, 0.7)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    activePath === link.href ? YP_CYAN : "rgba(255, 255, 255, 0.7)")
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Cart Icon - only shown on ecommerce pages */}
            {showCart && (
              <a
                href={cartHref}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = YP_CYAN_HOVER;
                  e.currentTarget.style.borderColor = YP_CYAN_BORDER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
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
                      backgroundColor: YP_CYAN,
                      color: "#0f0f0f",
                      fontSize: "10px",
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
            )}

            {/* User Avatar / Login Button */}
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="Profile"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: `2px solid ${YP_CYAN_BORDER}`,
                  objectFit: "cover",
                }}
              />
            ) : showLogin ? (
              <a
                href={loginHref}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  backgroundColor: YP_CYAN,
                  color: "#0f0f0f",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "system-ui, sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${YP_CYAN_GLOW}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                className="yp-header-login"
              >
                LOGIN
              </a>
            ) : null}

            {/* Mobile Menu Toggle (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              className="yp-header-mobile-toggle"
              aria-label="Toggle menu"
            >
              <svg
                width="22"
                height="14"
                viewBox="0 0 22 14"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="2" x2="4" y2="12" />
                    <line x1="4" y1="2" x2="18" y2="12" />
                  </>
                ) : (
                  <>
                    <line x1="1" y1="1" x2="21" y2="1" />
                    <line x1="1" y1="7" x2="21" y2="7" />
                    <line x1="1" y1="13" x2="21" y2="13" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: "16px",
            right: "16px",
            bottom: "16px",
            background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            zIndex: 9998,
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
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "28px",
                letterSpacing: "0.15em",
                textDecoration: "none",
                textTransform: "uppercase",
                color: activePath === link.href ? YP_CYAN : "rgba(255, 255, 255, 0.8)",
                transition: "color 0.2s ease",
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activePath === link.href ? YP_CYAN : "rgba(255, 255, 255, 0.8)")
              }
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Login */}
          {!userAvatar && (
            <a
              href={loginHref}
              style={{
                marginTop: "16px",
                padding: "14px 32px",
                borderRadius: "12px",
                backgroundColor: YP_CYAN,
                color: "#0f0f0f",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              LOGIN
            </a>
          )}
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
