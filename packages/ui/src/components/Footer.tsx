"use client";

/**
 * YP Entity Anchor Footer - "Ghost in the Machine"
 * ================================================
 * The 2026 AI-native footer. Minimal human layer, dense machine layer.
 * Pure OLED black + Wolf Cyan energy line + Entity attribution.
 *
 * Design: Pure #000000 background, single 1px cyan glow line, monospace credits.
 */

import { FooterSchema } from "./FooterSchema";

// YP Design Tokens
const YP_CYAN = "#00F6E0";
const YP_CYAN_GLOW = "rgba(0, 246, 224, 0.4)";
const YP_CYAN_BORDER = "rgba(0, 246, 224, 0.5)";

export interface FooterProps {
  /** Path to llms.txt file (default: /llms.txt) */
  llmsTxtPath?: string;
  /** Show social media links (default: true) */
  showSocials?: boolean;
  /** Override mission statement */
  missionText?: string;
}

// Social Icons
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TRUST_LINKS = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

// CCPA opt-out handler
function handleOptOut(e: React.MouseEvent) {
  e.preventDefault();
  if (typeof window !== "undefined") {
    localStorage.setItem("yp_opted_out", "true");
    // Disable PostHog if loaded
    if ((window as any).posthog) {
      (window as any).posthog.opt_out_capturing();
    }
    alert("You have been opted out of analytics tracking. Reload the page to apply.");
  }
}

export function Footer({
  llmsTxtPath = "/llms.txt",
  showSocials = true,
  missionText = "Pro-level youth sports training for every kid. Science-backed. AI-powered. Family-first.",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "64px",
        paddingBottom: "32px",
        overflow: "hidden",
      }}
    >
      {/* JSON-LD Schema (Invisible Anchor) */}
      <FooterSchema />

      {/* Wolf Cyan Energy Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          backgroundColor: YP_CYAN,
          boxShadow: `0 0 100px ${YP_CYAN_GLOW}`,
          opacity: 0.6,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
        }}
        className="yp-footer-grid"
      >
        {/* LEFT: Identity & Mission */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Brand Name */}
          <div
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "32px",
              color: "#ffffff",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            YOUTH
            <span style={{ color: YP_CYAN }}>PERFORMANCE</span>
          </div>

          {/* Tagline - LOCK IN. LEVEL UP. */}
          <div
            style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "18px",
              letterSpacing: "0.15em",
              color: YP_CYAN,
              lineHeight: 1.2,
              marginTop: "-8px",
            }}
          >
            LOCK IN. LEVEL UP.
          </div>

          {/* Mission Statement */}
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.6)",
              maxWidth: "400px",
              margin: 0,
            }}
          >
            {missionText}
          </p>

          {/* Social Links */}
          {showSocials && (
            <div style={{ display: "flex", gap: "16px", opacity: 0.8 }}>
              <a
                href="https://instagram.com/youthperformance"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.6)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://tiktok.com/@youthperformance"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.6)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")}
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://x.com/youthperformance"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.6)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")}
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Trust Stack + Attribution */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
          className="yp-footer-right"
        >
          {/* Trust Stack Links */}
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            {TRUST_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
              >
                {link.label}
              </a>
            ))}
            {/* CCPA Do Not Sell Link */}
            <a
              href="#"
              onClick={handleOptOut}
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = YP_CYAN)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
            >
              Do Not Sell My Info
            </a>
          </nav>

          {/* Entity Attribution - Monospace */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            <div>
              CO-FOUNDED BY{" "}
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>JAMES SCOTT</span>
            </div>
            <div style={{ marginTop: "4px" }}>
              GLOBAL HEAD OF BASKETBALL{" "}
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>ADAM HARRINGTON</span>
            </div>
          </div>

          {/* AI Handshake */}
          <a
            href={llmsTxtPath}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "rgba(255, 255, 255, 0.4)",
              textDecoration: "none",
              transition: "all 0.2s",
              width: "fit-content",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = YP_CYAN_BORDER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: YP_CYAN,
                boxShadow: `0 0 8px ${YP_CYAN}`,
              }}
            />
            AI INDEX / LLMS.TXT
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          marginTop: "64px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "32px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.25)",
            margin: 0,
          }}
        >
          © {currentYear} YOUTHPERFORMANCE|YP
        </p>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .yp-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .yp-footer-right {
            align-items: flex-end !important;
            text-align: right !important;
          }
          .yp-footer-right nav {
            justify-content: flex-end !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
