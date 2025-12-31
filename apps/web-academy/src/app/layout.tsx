// ═══════════════════════════════════════════════════════════
// ROOT LAYOUT
// Barefoot Reset PWA
// ═══════════════════════════════════════════════════════════

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ConvexClientProvider } from '@/components/providers';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import './globals.css';

// ─────────────────────────────────────────────────────────────
// FONTS
// ─────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const bebasNeue = localFont({
  src: '../fonts/BebasNeue-Regular.ttf',
  display: 'swap',
  variable: '--font-bebas',
  fallback: ['Bebas Neue', 'Impact', 'sans-serif'],
});

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'Barefoot Reset',
    template: '%s | Barefoot Reset',
  },
  description: '42-day barefoot training program for youth athletes. Build durability. Earn rewards.',
  applicationName: 'Barefoot Reset',
  authors: [{ name: 'YouthPerformance', url: 'https://youthperformance.com' }],
  keywords: ['barefoot training', 'youth athletics', 'injury prevention', 'durability'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Barefoot Reset',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Barefoot Reset',
    title: 'Barefoot Reset',
    description: '42-day barefoot training program for youth athletes',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Barefoot Reset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barefoot Reset',
    description: '42-day barefoot training program for youth athletes',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
};

// ─────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to font origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-inter antialiased">
        <ConvexClientProvider>
          <UserProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </UserProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
