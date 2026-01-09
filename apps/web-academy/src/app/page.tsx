// ═══════════════════════════════════════════════════════════
// ROOT PAGE - SMART ROUTER
// Checks onboarding status and redirects appropriately
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "barefoot_onboarding_state";

export default function RootPage() {
  const router = useRouter();
  const [_isChecking, _setIsChecking] = useState(true);

  useEffect(() => {
    // Check if onboarding is complete
    const checkOnboarding = () => {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.onboardingComplete) {
            // Onboarding complete - go to main app
            router.replace("/home");
          } else {
            // Onboarding in progress - resume
            router.replace("/role");
          }
        } catch {
          // Invalid data - start fresh
          router.replace("/role");
        }
      } else {
        // No saved state - start onboarding
        router.replace("/role");
      }
    };

    // Small delay to show loading state
    const timer = setTimeout(checkOnboarding, 500);
    return () => clearTimeout(timer);
  }, [router]);

  // Loading state while checking
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.span
          className="text-6xl block mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🐺
        </motion.span>
        <h1 className="font-bebas text-2xl tracking-wider" style={{ color: "var(--text-primary)" }}>
          BAREFOOT RESET
        </h1>
        <motion.div
          className="mt-4 w-8 h-1 mx-auto rounded-full"
          style={{ backgroundColor: "var(--accent-primary)" }}
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
