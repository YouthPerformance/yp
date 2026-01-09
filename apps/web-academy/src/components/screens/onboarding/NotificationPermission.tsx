// ═══════════════════════════════════════════════════════════
// NOTIFICATION PERMISSION SCREEN
// Request push notifications to maintain streak
// "Maybe later" skips without penalty
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface NotificationPermissionProps {
  onContinue: () => void;
  onBack: () => void;
}

export function NotificationPermission({ onContinue, onBack }: NotificationPermissionProps) {
  const { updateAthleteData } = useOnboarding();
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);

    try {
      // Check if notifications are supported
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        updateAthleteData({ notificationsEnabled: permission === "granted" });
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }

    setIsRequesting(false);
    onContinue();
  };

  const skipNotifications = () => {
    updateAthleteData({ notificationsEnabled: false });
    onContinue();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm self-start"
        style={{ color: "var(--text-tertiary)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: "var(--text-primary)" }}
      >
        ← Back
      </motion.button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Bell Icon */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-primary)20" }}
            animate={{
              boxShadow: ["0 0 0 0 rgba(0, 246, 224, 0.4)", "0 0 0 20px rgba(0, 246, 224, 0)"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            <span className="text-5xl">🔔</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-bebas text-3xl tracking-wider mb-4"
          style={{ color: "var(--text-primary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          STAY ON YOUR STREAK
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base mb-8 max-w-xs"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Get daily reminders to keep your streak alive and never miss a workout
        </motion.p>

        {/* Benefits */}
        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: "🔥", text: "Streak reminders" },
            { icon: "🏆", text: "Achievement alerts" },
            { icon: "⚡", text: "XP bonus notifications" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 justify-center">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <motion.button
          onClick={requestPermission}
          disabled={isRequesting}
          className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRequesting ? "ENABLING..." : "ENABLE NOTIFICATIONS"}
        </motion.button>

        <motion.button
          onClick={skipNotifications}
          className="w-full py-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ color: "var(--text-secondary)" }}
        >
          Maybe later
        </motion.button>
      </div>
    </motion.div>
  );
}

export default NotificationPermission;
