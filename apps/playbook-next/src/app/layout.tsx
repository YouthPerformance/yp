// =============================================================================
// ROOT LAYOUT
// YouthPerformance Playbook - Wikipedia of Youth Sports
// =============================================================================

import type { Metadata } from 'next';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | YouthPerformance Playbook',
    default: 'YouthPerformance Playbook - Expert Youth Sports Training',
  },
  description: 'Expert-reviewed drills, training protocols, and guides for youth athletes. Created by certified coaches including NBA skills trainer Adam Harrington.',
  metadataBase: new URL('https://playbook.youthperformance.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'YouthPerformance Playbook',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@youthperformance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
