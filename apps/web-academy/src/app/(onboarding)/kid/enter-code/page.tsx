// ═══════════════════════════════════════════════════════════
// KID CODE ENTRY PAGE
// Kid enters the code their parent gave them
// Links them to their parent's account
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function KidEnterCodePage() {
  const router = useRouter();
  const { validateParentCode } = useOnboarding();

  const [code, setCode] = useState(["", "", "", "", "", "", "", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Format: WOLF-XXXX-XX (4 + 4 + 2 = 10 chars, displayed with dashes)
  const handleInputChange = (index: number, value: string) => {
    // Only allow alphanumeric
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!cleaned) {
      // Clear this input
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    // Set value
    const newCode = [...code];
    newCode[index] = cleaned[0];
    setCode(newCode);
    setError("");

    // Move to next input
    if (index < 11 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    const fullCode = newCode.join("");
    if (fullCode.length === 12) {
      handleSubmit(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const chars = pasted.slice(0, 12).split("");

    const newCode = [...code];
    chars.forEach((char, i) => {
      if (i < 12) newCode[i] = char;
    });
    setCode(newCode);

    // Focus appropriate input
    const nextEmpty = newCode.findIndex((c) => !c);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      // All filled, submit
      handleSubmit(newCode.join(""));
    }
  };

  const handleSubmit = async (fullCode?: string) => {
    const codeToValidate = fullCode || code.join("");

    // Format check: should be 12 chars (WOLF + 4 + 2, no dashes stored)
    if (codeToValidate.length < 10) {
      setError("Please enter the full code");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      // Validate with server
      const result = await validateParentCode(codeToValidate);

      if (result.valid) {
        // Success! Go to Meet Wolf
        router.push("/kid/meet-wolf");
      } else {
        setError("Invalid code. Please check and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  // Display format: WOLF - XXXX - XX
  const renderInputs = () => {
    const groups = [
      { start: 0, end: 4, label: "WOLF" }, // First 4 chars
      { start: 4, end: 8, label: "" }, // Middle 4 chars
      { start: 8, end: 10, label: "" }, // Last 2 chars
    ];

    return (
      <div className="flex items-center justify-center gap-2">
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-1">
            {gi > 0 && (
              <span className="text-2xl font-bebas mx-1" style={{ color: "var(--text-tertiary)" }}>
                -
              </span>
            )}
            {Array.from({ length: group.end - group.start }, (_, i) => {
              const idx = group.start + i;
              return (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={code[idx]}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-9 h-12 rounded-lg text-center font-bebas text-xl uppercase outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--accent-primary)",
                    border: `2px solid ${
                      code[idx] ? "var(--accent-primary)" : "var(--border-default)"
                    }`,
                  }}
                  disabled={isValidating}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

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
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          WELCOME TO WOLF PACK!
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Got a code from your parent?
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Code Input */}
        <motion.div
          className="w-full rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-center mb-4" style={{ color: "var(--text-secondary)" }}>
            Enter your pack code
          </p>

          {renderInputs()}

          {/* Error Message */}
          {error && (
            <motion.p
              className="text-sm text-center mt-4"
              style={{ color: "#EF4444" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* QR Option */}
        <motion.button
          onClick={() => {
            // TODO: Implement QR scanner
            alert("QR Scanner coming soon!");
          }}
          className="flex items-center gap-2 py-3 px-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-tertiary)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span>📷</span>
          <span className="text-sm">Scan QR Code</span>
        </motion.button>
      </div>

      {/* Submit Button */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => handleSubmit()}
          disabled={isValidating || code.filter(Boolean).length < 10}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {isValidating ? "CHECKING..." : "JOIN THE PACK"}
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
