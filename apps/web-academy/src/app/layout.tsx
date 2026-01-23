// ═══════════════════════════════════════════════════════════
// ROOT LAYOUT
// Minimal - just html/body/fonts
// Providers are in route group layouts
// ═══════════════════════════════════════════════════════════

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

// ─────────────────────────────────────────────────────────────
// FONTS
// ─────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bebasNeue = localFont({
  src: "../fonts/BebasNeue-Regular.ttf",
  display: "swap",
  variable: "--font-bebas",
  fallback: ["Bebas Neue", "Impact", "sans-serif"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Barefoot Reset",
    template: "%s | Barefoot Reset",
  },
  description:
    "42-day barefoot training program for youth athletes. Build durability. Earn rewards.",
  applicationName: "Barefoot Reset",
  authors: [{ name: "YouthPerformance", url: "https://youthperformance.com" }],
  keywords: ["barefoot training", "youth athletics", "injury prevention", "durability"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Barefoot Reset",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Barefoot Reset",
    title: "Barefoot Reset",
    description: "42-day barefoot training program for youth athletes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barefoot Reset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barefoot Reset",
    description: "42-day barefoot training program for youth athletes",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

// ─────────────────────────────────────────────────────────────
// ROOT LAYOUT - Minimal, no providers
// ─────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo/blackcyan.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/blackcyan.png" />
      </head>
      <body className="font-inter antialiased bg-black text-white">
        {/* PostHog Analytics - AI-native, privacy-first */}
        <Script id="posthog-analytics" strategy="afterInteractive">
          {`
            // Check for opt-out before initializing
            if (typeof window !== 'undefined' && localStorage.getItem('yp_opted_out') !== 'true') {
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

              posthog.init('phc_lcgYo2g4YNIqVcK1d75227vPTROVvlbVBaj9rBxnfvJ', {
                api_host: 'https://us.i.posthog.com',
                persistence: 'localStorage',
                person_profiles: 'identified_only',
                respect_dnt: true,
                autocapture: true,
                capture_pageview: true,
                capture_pageleave: true,
                disable_session_recording: ${process.env.NODE_ENV !== "production"},
                session_recording: {
                  maskAllInputs: true,
                  maskTextSelector: '[data-mask]'
                }
              });
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
