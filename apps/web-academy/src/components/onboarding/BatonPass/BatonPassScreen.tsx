// ═══════════════════════════════════════════════════════════
// BATON PASS SCREEN
// Tesla-level handoff: QR Code (two devices) OR "Pass to Athlete" (one device)
// Replaces the friction of typing invite codes
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { HandoffRitual } from "./HandoffRitual";

type Mode = "choose" | "qr" | "handoff" | "ritual";

export function BatonPassScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [mode, setMode] = useState<Mode>("choose");
  const [handoffToken, setHandoffToken] = useState<string>("");

  const athleteName = data.athleteName || "Your athlete";

  // Generate a handoff token on mount
  useEffect(() => {
    // Generate a secure random token
    const token = crypto.randomUUID().slice(0, 8).toUpperCase();
    setHandoffToken(token);
  }, []);

  // QR code URL - links directly to voice sorting with context
  const handoffUrl = `https://academy.youthperformance.com/handoff/${handoffToken}`;
  const qrUrl = handoffToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(handoffUrl)}&bgcolor=0A0F0F&color=00F6E0`
    : "";

  // Handle "Pass to Athlete" button
  const handlePassToAthlete = useCallback(() => {
    setMode("ritual");
  }, []);

  // Handle ritual completion - go to voice sorting
  const handleRitualComplete = useCallback(() => {
    router.push("/voice-sorting?mode=athlete&voice=realtime");
  }, [router]);

  // Render ritual overlay
  if (mode === "ritual") {
    return <HandoffRitual athleteName={athleteName} onComplete={handleRitualComplete} />;
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-2xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          PROTOCOL SET. HANDOFF AUTHORIZED.
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          {athleteName}'s Wolf is ready to meet them
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Choice Screen */}
          {mode === "choose" && (
            <motion.div
              key="choose"
              className="w-full space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Option 1: Pass to Athlete (Same Device) */}
              <motion.button
                onClick={handlePassToAthlete}
                className="w-full rounded-2xl p-6 text-left transition-all"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    👆
                  </div>
                  <div>
                    <p className="font-bebas text-xl tracking-wider">PASS TO ATHLETE</p>
                    <p className="text-sm opacity-80">Hand this device to {athleteName}</p>
                  </div>
                </div>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-default)" }} />
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  OR
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-default)" }} />
              </div>

              {/* Option 2: Show QR (Different Device) */}
              <motion.button
                onClick={() => setMode("qr")}
                className="w-full rounded-2xl p-6 text-left transition-all"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    📱
                  </div>
                  <div>
                    <p
                      className="font-bebas text-xl tracking-wider"
                      style={{ color: "var(--text-primary)" }}
                    >
                      WOLF KEY (QR CODE)
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {athleteName} has their own phone
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Skip option */}
              <button
                onClick={() => router.push("/home")}
                className="w-full py-3 mt-4 text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Skip for now (do this later from dashboard)
              </button>
            </motion.div>
          )}

          {/* QR Code Screen */}
          {mode === "qr" && (
            <motion.div
              key="qr"
              className="w-full text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div
                className="rounded-2xl p-6 mb-6"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <p
                  className="font-bebas text-lg tracking-wider mb-4"
                  style={{ color: "var(--accent-primary)" }}
                >
                  THE WOLF KEY
                </p>

                {/* QR Code */}
                <motion.div
                  className="rounded-xl p-4 inline-block mb-4"
                  style={{ backgroundColor: "#0A0F0F" }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 246, 224, 0.2)",
                      "0 0 40px rgba(0, 246, 224, 0.4)",
                      "0 0 20px rgba(0, 246, 224, 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {qrUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrUrl}
                      alt="Wolf Key QR Code"
                      width={240}
                      height={240}
                      className="w-60 h-60"
                    />
                  )}
                </motion.div>

                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Have {athleteName} scan this to enter the Pack
                </p>
              </motion.div>

              {/* Instructions */}
              <div
                className="rounded-xl p-4 text-left"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <p className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
                  INSTRUCTIONS
                </p>
                <ol
                  className="text-sm space-y-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <li className="flex gap-2">
                    <span style={{ color: "var(--accent-primary)" }}>1.</span>
                    {athleteName} opens camera on their phone
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "var(--accent-primary)" }}>2.</span>
                    Points it at this QR code
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "var(--accent-primary)" }}>3.</span>
                    Wolf instantly recognizes them
                  </li>
                </ol>
              </div>

              {/* Expiry notice */}
              <p
                className="text-xs mt-4"
                style={{ color: "var(--text-tertiary)" }}
              >
                This code expires in 10 minutes
              </p>

              {/* Back button */}
              <button
                onClick={() => setMode("choose")}
                className="w-full py-3 mt-4 text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                ← Back to options
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Parent Dashboard Link */}
      {/* Note: mode can never be "ritual" here due to early return above */}
      <motion.div
          className="max-w-md mx-auto w-full pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => router.push("/home")}
            className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            GO TO PARENT DASHBOARD
          </button>
        </motion.div>
    </motion.div>
  );
}
