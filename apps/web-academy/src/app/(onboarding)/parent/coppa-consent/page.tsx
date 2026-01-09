// ═══════════════════════════════════════════════════════════
// COPPA CONSENT SCREEN (Under-13)
// Verifiable parental consent for child data collection
// Required by FTC COPPA regulations
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function CoppaConsentPage() {
  const router = useRouter();
  const { data, setCoppaConsent } = useOnboarding();
  const [isChecked, setIsChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleContinue = () => {
    if (!isChecked) return;
    setCoppaConsent(true);
    router.push("/parent/athlete-profile");
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
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          PARENTAL CONSENT REQUIRED
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Because your athlete is under 13, we need your permission
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full">
        {/* Age Badge */}
        <motion.div
          className="rounded-xl p-4 mb-4 text-center"
          style={{
            backgroundColor: "var(--accent-primary)15",
            border: "1px solid var(--accent-primary)40",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-bebas text-lg" style={{ color: "var(--accent-primary)" }}>
            ATHLETE AGE: {data.athleteAge} YEARS OLD
          </span>
        </motion.div>

        {/* What We Collect */}
        <motion.div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2
            className="font-bebas text-lg tracking-wider mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            WHAT WE COLLECT
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <ListItem>Training activity and workout completion</ListItem>
            <ListItem>Conversations with the Wolf AI coach</ListItem>
            <ListItem>Progress metrics and achievements</ListItem>
          </ul>
        </motion.div>

        {/* What We DON'T Do */}
        <motion.div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className="font-bebas text-lg tracking-wider mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            WHAT WE DON'T DO
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <ListItem icon="x">No behavioral advertising</ListItem>
            <ListItem icon="x">No selling data to third parties</ListItem>
            <ListItem icon="x">No sharing personal information</ListItem>
          </ul>
        </motion.div>

        {/* Your Rights */}
        <motion.div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: "var(--bg-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2
            className="font-bebas text-lg tracking-wider mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            YOUR RIGHTS
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <ListItem>View all collected data anytime</ListItem>
            <ListItem>Delete your child's data on request</ListItem>
            <ListItem>Revoke consent and close account anytime</ListItem>
            <ListItem>Access full conversation logs with Wolf</ListItem>
          </ul>
        </motion.div>

        {/* Expandable Privacy Policy */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left rounded-xl p-4 mb-4"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-tertiary)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">Full Privacy Policy</span>
            <span className="text-lg">{showDetails ? "−" : "+"}</span>
          </div>
          {showDetails && (
            <div
              className="mt-3 pt-3 border-t text-xs"
              style={{ borderColor: "var(--border-default)" }}
            >
              <p className="mb-2">
                Wolf Pack Youth Performance complies with the Children's Online Privacy Protection
                Act (COPPA). We collect only the minimum data necessary to provide training
                services.
              </p>
              <p className="mb-2">
                All data is encrypted at rest and in transit. We do not use children's data for
                advertising purposes.
              </p>
              <p>For questions, contact: privacy@youthperformance.com</p>
            </div>
          )}
        </motion.button>
      </div>

      {/* Consent Checkbox & Continue */}
      <motion.div
        className="max-w-md mx-auto w-full pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Checkbox */}
        <label
          className="flex items-start gap-3 mb-4 cursor-pointer"
          onClick={() => setIsChecked(!isChecked)}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{
              backgroundColor: isChecked ? "var(--accent-primary)" : "var(--bg-tertiary)",
              border: isChecked ? "none" : "1px solid var(--border-default)",
            }}
          >
            {isChecked && (
              <svg className="w-4 h-4" fill="none" stroke="var(--bg-primary)" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            I am the parent or legal guardian and I consent to Wolf Pack collecting and processing
            my child's data as described above.
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!isChecked}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          I AGREE & CONTINUE
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

// Helper component for list items
function ListItem({
  children,
  icon = "check",
}: {
  children: React.ReactNode;
  icon?: "check" | "x";
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="flex-shrink-0 mt-0.5"
        style={{ color: icon === "check" ? "var(--accent-primary)" : "var(--text-tertiary)" }}
      >
        {icon === "check" ? "✓" : "✗"}
      </span>
      <span>{children}</span>
    </li>
  );
}
