// ═══════════════════════════════════════════════════════════
// PARENT SIGNUP SCREEN
// Account creation with email/password or OAuth
// Light "Sponsor Report" theme
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PARENT_FLOW_ENABLED, useOnboarding } from "@/contexts/OnboardingContext";

interface ParentSignupProps {
  onContinue: () => void;
  onBack: () => void;
}

export function ParentSignup({ onContinue, onBack }: ParentSignupProps) {
  const { updateParentData } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Feature flag guard - redirect back if parent flow is disabled
  useEffect(() => {
    if (!PARENT_FLOW_ENABLED) {
      // If someone navigates here directly, send them back
      onBack();
    }
  }, [onBack]);

  // Show nothing while redirecting if flow is disabled
  if (!PARENT_FLOW_ENABLED) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "#F6F7F9" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-4xl mb-4">👤</div>
        <h1 className="font-bebas text-2xl tracking-wider mb-2" style={{ color: "#1A1A1A" }}>
          COMING SOON
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "#666" }}>
          The parent portal is not yet available.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bebas text-lg tracking-wider"
          style={{
            backgroundColor: "#00BFB0",
            color: "white",
          }}
        >
          GO BACK
        </button>
      </motion.div>
    );
  }

  const validate = () => {
    const newErrors: typeof errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);

    // TODO: Actual signup with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateParentData({ email });
    setIsLoading(false);
    onContinue();
  };

  const handleOAuth = async (_provider: "google" | "apple") => {
    // TODO: Implement OAuth when parent flow is enabled
    onContinue();
  };

  const isValid =
    email && password && confirmPassword && password === confirmPassword && password.length >= 8;

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "#F6F7F9" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm self-start"
        style={{ color: "#666" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: "#333" }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.h1
        className="font-bebas text-2xl tracking-wider mb-8 text-center"
        style={{ color: "#1A1A1A" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CREATE YOUR ACCOUNT
      </motion.h1>

      {/* Form */}
      <motion.div
        className="space-y-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="Email"
            className="w-full px-4 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              backgroundColor: "white",
              border: `2px solid ${errors.email ? "#FF4444" : "#E5E5E5"}`,
              color: "#1A1A1A",
            }}
          />
          {errors.email && (
            <p className="text-sm mt-1" style={{ color: "#FF4444" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Password"
            className="w-full px-4 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              backgroundColor: "white",
              border: `2px solid ${errors.password ? "#FF4444" : "#E5E5E5"}`,
              color: "#1A1A1A",
            }}
          />
          {errors.password && (
            <p className="text-sm mt-1" style={{ color: "#FF4444" }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirm: undefined }));
            }}
            placeholder="Confirm Password"
            className="w-full px-4 py-4 rounded-xl text-base outline-none transition-all"
            style={{
              backgroundColor: "white",
              border: `2px solid ${errors.confirm ? "#FF4444" : "#E5E5E5"}`,
              color: "#1A1A1A",
            }}
          />
          {errors.confirm && (
            <p className="text-sm mt-1" style={{ color: "#FF4444" }}>
              {errors.confirm}
            </p>
          )}
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider mb-6"
        style={{
          backgroundColor: isValid ? "#00BFB0" : "#CCC",
          color: "white",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
      >
        {isLoading ? "CREATING ACCOUNT..." : "CONTINUE →"}
      </motion.button>

      {/* Divider */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E5" }} />
        <span className="text-sm" style={{ color: "#999" }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E5" }} />
      </motion.div>

      {/* OAuth Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => handleOAuth("google")}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-3"
          style={{
            backgroundColor: "white",
            border: "2px solid #E5E5E5",
            color: "#333",
          }}
        >
          <span className="text-xl">G</span>
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => handleOAuth("apple")}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-3"
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
          }}
        >
          <span className="text-xl"></span>
          <span>Continue with Apple</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default ParentSignup;
