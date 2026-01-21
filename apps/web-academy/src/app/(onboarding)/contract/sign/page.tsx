// ═══════════════════════════════════════════════════════════
// CONTRACT SIGN PAGE
// The commitment ceremony: 3 checkboxes + signature pad
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useSession } from "@/lib/auth";

interface Checkboxes {
  showUp: boolean;
  trustBlueprint: boolean;
  earnGear: boolean;
}

const CHECKBOXES = [
  {
    id: "showUp" as const,
    text: "I will show up 30 times in the next 42 days.",
    wolfReaction: "That's the minimum. You'll do more.",
  },
  {
    id: "trustBlueprint" as const,
    text: "I will trust the blueprint and complete each level fully.",
    wolfReaction: "90% video. Real notes. No shortcuts.",
  },
  {
    id: "earnGear" as const,
    text: "I will earn my $88 NeoBall credit through work, not luck.",
    wolfReaction: "The Pack respects grinders.",
  },
];

export default function ContractSignPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const signContract = useMutation(api.contracts.signContract);

  const [checkboxes, setCheckboxes] = useState<Checkboxes>({
    showUp: false,
    trustBlueprint: false,
    earnGear: false,
  });
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>("");
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const allChecked = checkboxes.showUp && checkboxes.trustBlueprint && checkboxes.earnGear;
  const canSubmit = allChecked && hasDrawn && !isSubmitting;

  // Handle checkbox toggle
  const handleCheckbox = (id: keyof Checkboxes) => {
    const newValue = !checkboxes[id];
    setCheckboxes((prev) => ({ ...prev, [id]: newValue }));

    if (newValue) {
      const checkbox = CHECKBOXES.find((c) => c.id === id);
      if (checkbox) {
        setCurrentReaction(checkbox.wolfReaction);
        setTimeout(() => setCurrentReaction(null), 2000);
      }
    }
  };

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Style
    ctx.strokeStyle = "#00E5FF"; // Cyan
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // Get position from mouse/touch event
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Drawing handlers
  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getPosition(e);
      if (!pos) return;

      setIsDrawing(true);
      lastPosRef.current = pos;
    },
    [getPosition]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const pos = getPosition(e);
      const lastPos = lastPosRef.current;

      if (!ctx || !pos || !lastPos) return;

      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPosRef.current = pos;
      setHasDrawn(true);
    },
    [isDrawing, getPosition]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;

    // Save signature data
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      setSignatureData(canvas.toDataURL("image/png"));
    }
  }, [hasDrawn]);

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignatureData("");
  };

  // Submit contract
  const handleSubmit = async () => {
    if (!canSubmit || !session?.user?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // We need the Convex user ID, not the auth user ID
      // For now, store signature in session and navigate
      sessionStorage.setItem(
        "wolfContract_signature",
        JSON.stringify({
          signatureData,
          checkboxes,
        })
      );

      // Navigate to stamp ceremony
      router.push("/contract/stamp");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-2xl tracking-wider mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          THE WOLF CONTRACT
        </h1>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Read each commitment. Check the box. Sign below.
        </p>
      </motion.div>

      {/* Wolf Reaction Bubble */}
      <AnimatePresence>
        {currentReaction && (
          <motion.div
            className="max-w-sm mx-auto mb-4 p-3 rounded-xl text-center"
            style={{
              backgroundColor: "var(--accent-primary)20",
              border: "1px solid var(--accent-primary)50",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--accent-primary)" }}
            >
              {currentReaction}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkboxes */}
      <div className="max-w-md mx-auto w-full space-y-3 mb-6">
        {CHECKBOXES.map((checkbox, index) => (
          <motion.button
            key={checkbox.id}
            onClick={() => handleCheckbox(checkbox.id)}
            className="w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all"
            style={{
              backgroundColor: checkboxes[checkbox.id]
                ? "var(--accent-primary)15"
                : "var(--bg-secondary)",
              border: checkboxes[checkbox.id]
                ? "1px solid var(--accent-primary)50"
                : "1px solid transparent",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
          >
            {/* Checkbox */}
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
              style={{
                backgroundColor: checkboxes[checkbox.id]
                  ? "var(--accent-primary)"
                  : "var(--bg-tertiary)",
                border: checkboxes[checkbox.id]
                  ? "none"
                  : "1px solid var(--border-default)",
              }}
            >
              {checkboxes[checkbox.id] && (
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="var(--bg-primary)"
                  viewBox="0 0 24 24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </div>

            {/* Text */}
            <span
              className="text-sm leading-relaxed"
              style={{
                color: checkboxes[checkbox.id]
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              {checkbox.text}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Signature Pad */}
      <motion.div
        className="max-w-md mx-auto w-full mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className="font-bebas text-sm tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            YOUR SIGNATURE
          </span>
          {hasDrawn && (
            <button
              onClick={clearSignature}
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-tertiary)",
              }}
            >
              CLEAR
            </button>
          )}
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: hasDrawn ? "2px solid var(--accent-primary)" : "2px solid var(--bg-tertiary)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full touch-none"
            style={{ height: "120px" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {!hasDrawn && (
          <p
            className="text-xs text-center mt-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Draw your signature above
          </p>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <div
          className="max-w-md mx-auto w-full mb-4 p-3 rounded-xl text-center text-sm"
          style={{
            backgroundColor: "var(--status-error)20",
            color: "var(--status-error)",
          }}
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <motion.div
        className="max-w-md mx-auto w-full mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: canSubmit ? "var(--accent-primary)" : "var(--bg-tertiary)",
            color: canSubmit ? "var(--bg-primary)" : "var(--text-tertiary)",
          }}
        >
          {isSubmitting ? "PROCESSING..." : "SIGN THE CONTRACT"}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-3 mt-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
