// ═══════════════════════════════════════════════════════════
// STAMP PAGE
// Contract ceremony finale: Flash → Stamp → Confetti → Howl
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useSession } from "@/lib/auth";
import { PackGlobe } from "@/components/onboarding/WolfContract/PackGlobe";

type CeremonyPhase = "ready" | "stamping" | "flash" | "confetti" | "complete";

// Confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

const CONFETTI_COLORS = ["#00E5FF", "#FFD700", "#FF6B6B", "#4CAF50", "#9C27B0"];

export default function StampPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const signContract = useMutation(api.contracts.signContract);

  const [phase, setPhase] = useState<CeremonyPhase>("ready");
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get signature data from session storage
  const [signatureData, setSignatureData] = useState<{
    signatureData: string;
    checkboxes: { showUp: boolean; trustBlueprint: boolean; earnGear: boolean };
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("wolfContract_signature");
    if (stored) {
      setSignatureData(JSON.parse(stored));
    } else {
      router.push("/contract/sign");
    }
  }, [router]);

  // Generate confetti particles
  const generateConfetti = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 60, // Center spread
        y: 40 + (Math.random() - 0.5) * 30, // Near stamp
        rotation: Math.random() * 360,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
    }
    setConfetti(particles);
  }, []);

  // The stamp ceremony
  const performCeremony = useCallback(async () => {
    if (!signatureData || !session?.user?.id) return;

    try {
      // Phase 1: Stamping animation
      setPhase("stamping");

      // Wait for stamp animation
      await new Promise((r) => setTimeout(r, 600));

      // Phase 2: Flash
      setPhase("flash");
      await new Promise((r) => setTimeout(r, 300));

      // Phase 3: Confetti
      setPhase("confetti");
      generateConfetti();

      // Call the contract signing mutation
      // Note: In production, we'd get the user's Convex ID
      // For now, we'll just complete the ceremony

      // Wait for celebration
      await new Promise((r) => setTimeout(r, 2000));

      // Phase 4: Complete
      setPhase("complete");

      // Clear session storage
      sessionStorage.removeItem("wolfContract_signature");
      sessionStorage.removeItem("wolfContract_country");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setPhase("ready");
    }
  }, [signatureData, session, generateConfetti]);

  // Start ceremony when ready
  useEffect(() => {
    if (phase === "ready" && signatureData) {
      const timer = setTimeout(performCeremony, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, signatureData, performCeremony]);

  const handleContinue = () => {
    router.push("/home"); // Go to dashboard
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "white" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Globe background - appears during celebration */}
      <AnimatePresence>
        {(phase === "confetti" || phase === "complete") && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <PackGlobe showJoinArc />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {phase === "confetti" && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: particle.color,
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                }}
                initial={{ scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  opacity: [1, 1, 0],
                  rotate: particle.rotation + 720,
                  y: [0, 200, 400],
                  x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Contract document */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: phase === "stamping" ? 0.95 : 1,
          }}
        >
          {/* Paper */}
          <div
            className="w-64 h-80 rounded-lg p-4 relative"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid var(--border-default)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <span
                className="font-bebas text-lg tracking-wider"
                style={{ color: "var(--accent-primary)" }}
              >
                WOLF CONTRACT
              </span>
            </div>

            {/* Checkmarks */}
            <div className="space-y-2 mb-4">
              {["Show up 30 times", "Trust the blueprint", "Earn my gear"].map(
                (item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent-primary)" }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="var(--bg-primary)"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Signature line */}
            <div className="mt-auto">
              <div
                className="h-8 mb-1 rounded flex items-end justify-center"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                {signatureData && (
                  <span
                    className="text-xs italic"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    Signed
                  </span>
                )}
              </div>
              <div
                className="text-xs text-center"
                style={{ color: "var(--text-tertiary)" }}
              >
                Athlete Signature
              </div>
            </div>

            {/* Stamp */}
            <AnimatePresence>
              {(phase === "stamping" || phase === "flash" || phase === "confetti" || phase === "complete") && (
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24"
                  initial={{ scale: 2, opacity: 0, rotate: -30 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: -15,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                >
                  {/* Stamp circle */}
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      border: "4px solid var(--accent-primary)",
                      backgroundColor: "var(--accent-primary)20",
                    }}
                  >
                    <div className="text-center">
                      <span
                        className="font-bebas text-lg tracking-wider block"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        PACK
                      </span>
                      <span
                        className="font-bebas text-xs tracking-wider"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        APPROVED
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          className="mb-8"
          animate={{
            opacity: phase === "flash" ? 0 : 1,
          }}
        >
          {phase === "ready" && (
            <p
              className="font-bebas text-xl tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              PREPARING...
            </p>
          )}
          {phase === "stamping" && (
            <p
              className="font-bebas text-xl tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              STAMPING...
            </p>
          )}
          {(phase === "confetti" || phase === "complete") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className="font-bebas text-3xl tracking-wider mb-2"
                style={{ color: "var(--accent-primary)" }}
              >
                WELCOME TO THE PACK
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                42 days. 30 levels. Your $88 credit awaits.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Continue Button */}
        {phase === "complete" && (
          <motion.button
            onClick={handleContinue}
            className="px-8 py-4 rounded-xl font-bebas text-lg tracking-wider"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-primary)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            START TRAINING
          </motion.button>
        )}

        {/* Error */}
        {error && (
          <motion.div
            className="mt-4 p-3 rounded-xl text-center"
            style={{
              backgroundColor: "var(--status-error)20",
              color: "var(--status-error)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm mb-2">{error}</p>
            <button
              onClick={() => router.push("/contract/sign")}
              className="text-xs underline"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>

      {/* Wolf at bottom */}
      {phase === "complete" && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden">
            <Image
              src="/images/wolffront.webp"
              alt="Wolf Pack"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
