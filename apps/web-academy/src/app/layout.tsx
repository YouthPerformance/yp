// ═══════════════════════════════════════════════════════════
// ROOT LAYOUT
// Minimal - just html/body/fonts
// Providers are in route group layouts
// ═══════════════════════════════════════════════════════════

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
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
      className={`${inter.variable} ${bebasNeue.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo/blackcyan.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/blackcyan.png" />
      </head>
      <body className="font-inter antialiased bg-black text-white">{children}</body>
    </html>
  );
}
