"use client";

import { useState, useEffect } from "react";

/**
 * NeoballNav - Visual Sales Navigation
 * =====================================
 * Product-focused mega-menu with images, categories, and CTAs
 * Inspired by conversion-optimized e-commerce navigation patterns
 */

// Design Tokens
const YP_CYAN = "#00F6E0";
const YP_PINK = "#ff1493";
const NEON_GREEN = "#39ff14";

interface NeoballNavProps {
  onJoinWaitlist?: () => void;
}

export function NeoballNav({ onJoinWaitlist }: NeoballNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleJoinWaitlist = () => {
    setMenuOpen(false);
    if (onJoinWaitlist) {
      onJoinWaitlist();
    } else {
      window.dispatchEvent(new CustomEvent("open-waitlist-modal"));
    }
  };

  return (
    <>
      {/* Header Bar */}
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
        <div
          style={{
            height: "56px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(100,150,255,0.04) 50%, rgba(0,0,0,0.4) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
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
            {/* Logo */}
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: YP_CYAN,
                  lineHeight: 1,
                }}
              >
                NEO
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                BALL
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="neoball-desktop-nav" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              <a href="#features" style={navLinkStyle}>FEATURES</a>
              <a href="#leaderboard" style={navLinkStyle}>WAITLIST</a>
              <a href="https://shop.youthperformance.com" style={navLinkStyle}>SHOP</a>
              <a href="https://app.youthperformance.com" style={navLinkStyle}>ACADEMY</a>
            </div>

            {/* Desktop CTA */}
            <button
              onClick={handleJoinWaitlist}
              className="neoball-desktop-cta"
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                backgroundColor: YP_PINK,
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              JOIN WAITLIST
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="neoball-mobile-toggle"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="1" x2="21" y2="1" />
                  <line x1="1" y1="7" x2="21" y2="7" />
                  <line x1="1" y1="13" x2="21" y2="13" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Full-screen Visual Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.98)",
            zIndex: 9998,
            overflowY: "auto",
            padding: "80px 16px 32px",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: NEON_GREEN,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Menu Content */}
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {/* Category Header */}
            <div
              style={{
                backgroundColor: YP_CYAN,
                color: "black",
                padding: "8px 16px",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              CATEGORY
            </div>

            {/* Category Tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {/* Features Tile */}
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 16px",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #333",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={YP_CYAN} strokeWidth="1.5" style={{ marginBottom: "8px" }}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "16px",
                    color: "white",
                    letterSpacing: "0.05em",
                  }}
                >
                  FEATURES
                </span>
              </a>

              {/* Waitlist Tile */}
              <a
                href="#leaderboard"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 16px",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #333",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={YP_PINK} strokeWidth="1.5" style={{ marginBottom: "8px" }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "16px",
                    color: "white",
                    letterSpacing: "0.05em",
                  }}
                >
                  WAITLIST
                </span>
              </a>
            </div>

            {/* Featured Product Header */}
            <div
              style={{
                backgroundColor: YP_PINK,
                color: "white",
                padding: "8px 16px",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              THE PRODUCT
            </div>

            {/* Product Card */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #333",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {/* Product Image */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    backgroundColor: "#0a0a0a",
                    backgroundImage: "url('/images/neoballnaked.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    flexShrink: 0,
                  }}
                />
                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: "24px",
                      color: "white",
                      marginBottom: "4px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    NEOBALL
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      marginBottom: "8px",
                      lineHeight: 1.4,
                    }}
                  >
                    Silent basketball for indoor training
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: YP_PINK,
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    SOLD OUT
                  </span>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <button
              onClick={handleJoinWaitlist}
              style={{
                width: "100%",
                padding: "18px 24px",
                backgroundColor: NEON_GREEN,
                color: "black",
                border: "none",
                borderRadius: "8px",
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "32px",
                boxShadow: `0 0 30px rgba(57, 255, 20, 0.4)`,
              }}
            >
              JOIN WAITLIST
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* Secondary Links */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                borderTop: "1px solid #333",
                paddingTop: "24px",
              }}
            >
              <a href="https://shop.youthperformance.com" style={secondaryLinkStyle}>
                YP SHOP
              </a>
              <a href="https://app.youthperformance.com" style={secondaryLinkStyle}>
                YP ACADEMY
              </a>
              <a href="mailto:hello@neoball.co" style={secondaryLinkStyle}>
                CONTACT
              </a>
              <a href="/terms" onClick={() => setMenuOpen(false)} style={secondaryLinkStyle}>
                TERMS
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        .neoball-desktop-nav,
        .neoball-desktop-cta {
          display: flex;
        }
        .neoball-mobile-toggle {
          display: none !important;
        }
        @media (max-width: 768px) {
          .neoball-desktop-nav,
          .neoball-desktop-cta {
            display: none !important;
          }
          .neoball-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.15em",
  textDecoration: "none",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.7)",
  transition: "color 0.2s ease",
};

const secondaryLinkStyle: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textDecoration: "none",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.5)",
  transition: "color 0.2s ease",
};

export default NeoballNav;
