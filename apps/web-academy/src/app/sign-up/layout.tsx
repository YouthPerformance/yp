// ═══════════════════════════════════════════════════════════
// SIGN UP LAYOUT
// Minimal layout with just ClerkProvider
// ═══════════════════════════════════════════════════════════

"use client";

import { ClerkProvider } from "@clerk/nextjs";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no Clerk key, just render children (build safety)
  if (!clerkKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{
        variables: {
          colorPrimary: "#00F6E0",
          colorBackground: "#0A0A0A",
          colorInputBackground: "#1A1A1A",
          colorInputText: "#FFFFFF",
          colorText: "#FFFFFF",
          colorTextSecondary: "#A0A0A0",
          borderRadius: "12px",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
