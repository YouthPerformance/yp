/**
 * AuthBackground - Aurora/gradient background for auth pages
 *
 * Can integrate with Unicorn Studio or use CSS gradient fallback
 */

import * as React from "react";

export interface AuthBackgroundProps {
  children: React.ReactNode;
  /** Unicorn Studio project ID for animated background */
  unicornProjectId?: string;
}

export function AuthBackground({ children, unicornProjectId }: AuthBackgroundProps) {
  // Load Unicorn Studio script if project ID provided
  React.useEffect(() => {
    if (!unicornProjectId) return;

    // @ts-expect-error - UnicornStudio is a global from CDN
    if (!window.UnicornStudio && !document.querySelector('script[src*="unicornStudio.umd.js"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        // @ts-expect-error - UnicornStudio is a global from CDN
        if (window.UnicornStudio?.init) {
          // @ts-expect-error - UnicornStudio is a global from CDN
          window.UnicornStudio.init();
        }
      };
      document.head.appendChild(script);
    } else {
      const checkAndInit = () => {
        // @ts-expect-error - UnicornStudio is a global from CDN
        if (window.UnicornStudio?.init) {
          // @ts-expect-error - UnicornStudio is a global from CDN
          window.UnicornStudio.init();
        }
      };
      checkAndInit();
      const interval = setInterval(checkAndInit, 500);
      setTimeout(() => clearInterval(interval), 3000);
    }
  }, [unicornProjectId]);

  return (
    <div className="min-h-screen antialiased flex items-center justify-center text-neutral-100 bg-transparent px-4 overflow-hidden relative">
      {/* Animated or gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
        }}
      >
        {unicornProjectId ? (
          <div data-us-project={unicornProjectId} className="absolute inset-0" />
        ) : (
          /* CSS gradient fallback */
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f6e0]/20 via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* Circuit-style decorative nodes (desktop only) */}
      <CircuitDecorations />

      <div className="w-full max-w-5xl mx-auto my-8 relative">
        {children}
      </div>
    </div>
  );
}

function CircuitDecorations() {
  return (
    <div className="pointer-events-none hidden md:block fixed inset-0">
      {/* Left upper node */}
      <div className="absolute left-4 top-1/4 flex items-center gap-2 text-neutral-700">
        <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
        <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="h-1 w-10 rounded-full bg-neutral-700" />
          <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px w-12 bg-neutral-800" />
      </div>

      {/* Left bottom node */}
      <div className="absolute left-10 bottom-10 flex items-center gap-2 text-neutral-700">
        <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
        <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="flex gap-1">
            <span className="h-1 w-2 rounded bg-neutral-700" />
            <span className="h-1 w-2 rounded bg-neutral-700/60" />
            <span className="h-1 w-2 rounded bg-neutral-700/40" />
          </div>
          <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px w-16 bg-neutral-800" />
      </div>

      {/* Right upper node */}
      <div className="absolute right-4 top-[20%] flex items-center gap-2 text-neutral-700">
        <div className="h-px w-16 bg-neutral-800" />
        <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <span className="h-1 w-6 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0]" />
          <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
      </div>

      {/* Right bottom node */}
      <div className="absolute right-8 bottom-16 flex items-center gap-2 text-neutral-700">
        <div className="h-px w-10 bg-neutral-800" />
        <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="h-1 w-8 rounded-full bg-neutral-700" />
          <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
      </div>
    </div>
  );
}
