// ═══════════════════════════════════════════════════════════
// MAIN APP LAYOUT - CLIENT COMPONENT
// Client-side logic for authenticated routes
// Includes all providers (Clerk, Convex, Theme)
// ═══════════════════════════════════════════════════════════

"use client";

import { Header } from "@yp/ui";
import { useContext, useState } from "react";
import { UpsellModal } from "@/components/modals";
import { BottomNav } from "@/components/navigation";
import { ConvexClientProvider } from "@/components/providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import UserContext, { UserProvider } from "@/contexts/UserContext";

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export function MainLayoutClient({ children }: MainLayoutClientProps) {
  return (
    <ConvexClientProvider>
      <UserProvider>
        <ThemeProvider>
          <Header
            logoHref="/"
            links={[
              { label: "ACADEMY", href: "/" },
              { label: "SHOP", href: "https://shop.youthperformance.com" },
              { label: "NEOBALL", href: "https://neoball.co" },
            ]}
            cartHref="https://shop.youthperformance.com/cart"
            loginHref="https://shop.youthperformance.com/account/login"
          />
          <main style={{ paddingTop: "64px" }}>
            <MainLayoutInner>{children}</MainLayoutInner>
          </main>
        </ThemeProvider>
      </UserProvider>
    </ConvexClientProvider>
  );
}

// Inner component that can access UserContext
function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const context = useContext(UserContext);
  const subscriptionStatus = context?.user?.subscriptionStatus || "free";
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "var(--bg-primary)" }}>
      {children}

      <BottomNav
        subscriptionStatus={subscriptionStatus}
        onLockedClick={() => setShowUpsellModal(true)}
      />

      <UpsellModal isOpen={showUpsellModal} onClose={() => setShowUpsellModal(false)} />
    </div>
  );
}
