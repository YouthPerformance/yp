// ═══════════════════════════════════════════════════════════
// EMAIL CAPTURE MODAL
// Lead capture for teaser module completion
// Unlocks free drill stack preview in exchange for email
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
  source: string; // e.g., "bpa-teaser-completion"
  rewardSlug?: string; // e.g., "bpa-drill-stack-preview"
  rewardName?: string; // e.g., "BPA Drill Stack Preview"
  headline?: string;
  subheadline?: string;
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  source,
  rewardSlug,
  rewardName = "Free Drill Stack",
  headline = "Unlock Your Free Drill Stack",
  subheadline = "Get instant access to the exercises that build bulletproof ankles.",
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const captureEmail = useMutation(api.leads.captureEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate email client-side
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Capture email in Convex
      await captureEmail({
        email: email.toLowerCase().trim(),
        source,
        rewardSlug,
        metadata: {
          capturedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
      });

      setSuccess(true);
      onSuccess?.(email);

      // Auto-close after success animation
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("[EmailCaptureModal] Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Header gradient */}
              <div
                className="h-3"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-gold) 100%)",
                }}
              />

              <div className="p-6 space-y-6">
                {/* Icon */}
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      border: "2px solid var(--accent-cyan)",
                    }}
                  >
                    {success ? "✅" : "📧"}
                  </div>
                </motion.div>

                {/* Content */}
                {success ? (
                  <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      You're In!
                    </h2>
                    <p style={{ color: "var(--text-secondary)" }}>
                      Check your inbox for the {rewardName}.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        {headline}
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {subheadline}
                      </p>
                    </div>

                    {/* What you get */}
                    <div
                      className="p-4 rounded-xl space-y-3"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        What you'll get:
                      </p>
                      <ul className="space-y-2">
                        {[
                          "7 foundational ankle drills",
                          "Step-by-step instructions",
                          "Image guides for each exercise",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            <span style={{ color: "var(--accent-cyan)" }}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            border: error
                              ? "2px solid var(--accent-red)"
                              : "1px solid var(--border-default)",
                            color: "var(--text-primary)",
                          }}
                          disabled={isLoading}
                          autoFocus
                        />
                        {error && (
                          <p className="mt-2 text-xs" style={{ color: "var(--accent-red)" }}>
                            {error}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-gold) 100%)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            GET FREE ACCESS
                            <span className="text-lg">→</span>
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Privacy note */}
                    <p className="text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                      No spam. Unsubscribe anytime.
                    </p>
                  </>
                )}

                {/* Close button (if not success) */}
                {!success && (
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: "var(--text-secondary)",
                      backgroundColor: "transparent",
                    }}
                  >
                    Maybe Later
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
