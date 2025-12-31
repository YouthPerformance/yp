// ═══════════════════════════════════════════════════════════
// CONVEX CLIENT PROVIDER
// Wraps app with Clerk + Convex authentication
// ═══════════════════════════════════════════════════════════

'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

// Initialize Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─────────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        // Match our dark theme
        variables: {
          colorPrimary: '#00F6E0',
          colorBackground: '#0A0A0A',
          colorInputBackground: '#1A1A1A',
          colorInputText: '#FFFFFF',
          colorText: '#FFFFFF',
          colorTextSecondary: '#A0A0A0',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: '#00F6E0',
            color: '#000000',
            fontFamily: 'var(--font-bebas)',
            letterSpacing: '0.1em',
            '&:hover': {
              backgroundColor: '#00D4C4',
            },
          },
          card: {
            backgroundColor: '#0A0A0A',
            border: '1px solid #2A2A2A',
          },
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexClientProvider;
