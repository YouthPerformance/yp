// ===================================================================
// DEMO LAYOUT
// Layer B: Shareable prototype routes with watermark
// ===================================================================

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "YP Academy - Demo",
  robots: "noindex, nofollow", // Don't index prototypes
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Prototype watermark banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center text-sm py-1.5 font-medium shadow-lg">
        <span className="animate-pulse mr-2">⚡</span>
        PROTOTYPE - Demo Mode
        <span className="animate-pulse ml-2">⚡</span>
      </div>
      {/* Content with top padding for banner */}
      <div className="pt-10">{children}</div>
    </div>
  );
}
