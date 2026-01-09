// ═══════════════════════════════════════════════════════════
// INVITE CODE GENERATION
// Shows the code for the kid to use on their device
// Includes QR code and share options
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function InviteCodePage() {
  const router = useRouter();
  const { data, generateInviteCode } = useOnboarding();

  const [code, setCode] = useState(data.inviteCode || "");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const athleteName = data.athleteName || "Your athlete";

  // Generate code on mount if not already set
  useEffect(() => {
    if (!code) {
      const newCode = generateInviteCode();
      setCode(newCode);
    }
  }, [code, generateInviteCode]);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!code) return;

    const shareData = {
      title: "Wolf Pack Training",
      text: `Join me on Wolf Pack! Use code: ${code}`,
      url: `https://academy.youthperformance.com/code?c=${code}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleContinue = () => {
    // Parent flow complete - go to parent dashboard or home
    router.push("/home");
  };

  // Generate QR code URL (using a free QR API)
  const qrUrl = code
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `https://academy.youthperformance.com/code?c=${code}`,
      )}`
    : "";

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
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
          {athleteName.toUpperCase()}'S ACCOUNT IS READY!
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Share this code with {athleteName} to connect their device
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Code Display */}
        <motion.div
          className="w-full rounded-2xl p-6 mb-6 text-center"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p
            className="text-xs mb-3 uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Pack Code
          </p>

          <div
            className="font-bebas text-4xl tracking-[0.3em] py-4 px-6 rounded-xl mb-4"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--accent-primary)",
              border: "2px dashed var(--accent-primary)40",
            }}
          >
            {code || "..."}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="py-3 rounded-xl text-sm transition-all"
              style={{
                backgroundColor: copied ? "var(--accent-primary)20" : "var(--bg-tertiary)",
                color: copied ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={handleShare}
              className="py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              Share
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="py-3 rounded-xl text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              QR Code
            </button>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="w-full space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center font-bebas text-sm flex-shrink-0"
              style={{
                backgroundColor: "var(--accent-primary)20",
                color: "var(--accent-primary)",
              }}
            >
              1
            </span>
            <div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                Have {athleteName} open Wolf Pack on their device
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center font-bebas text-sm flex-shrink-0"
              style={{
                backgroundColor: "var(--accent-primary)20",
                color: "var(--accent-primary)",
              }}
            >
              2
            </span>
            <div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                They enter this code or scan the QR
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center font-bebas text-sm flex-shrink-0"
              style={{
                backgroundColor: "var(--accent-primary)20",
                color: "var(--accent-primary)",
              }}
            >
              3
            </span>
            <div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                Wolf will greet them and they can start training!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60" onClick={() => setShowQR(false)} />
          <motion.div
            className="relative z-10 w-full max-w-xs rounded-2xl p-6 text-center"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3
              className="font-bebas text-xl tracking-wider mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              SCAN TO JOIN
            </h3>

            {/* QR Code */}
            <div className="rounded-xl p-4 mb-4 inline-block" style={{ backgroundColor: "white" }}>
              {qrUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrUrl} alt="QR Code" width={200} height={200} className="w-48 h-48" />
              )}
            </div>

            <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
              Or enter code manually: <br />
              <span style={{ color: "var(--accent-primary)" }}>{code}</span>
            </p>

            <button
              onClick={() => setShowQR(false)}
              className="w-full py-3 rounded-xl font-bebas tracking-wider"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              CLOSE
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          GO TO PARENT DASHBOARD
        </button>

        <p className="text-xs text-center mt-4" style={{ color: "var(--text-tertiary)" }}>
          You can always find this code in your parent dashboard
        </p>
      </motion.div>
    </motion.div>
  );
}
