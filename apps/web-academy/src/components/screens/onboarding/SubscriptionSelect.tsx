// ═══════════════════════════════════════════════════════════
// SUBSCRIPTION SELECTION SCREEN
// Monthly vs Annual plan selection
// Light "Sponsor Report" theme
// Intensity Budget: 5 points
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { type Subscription, useOnboarding } from "@/contexts/OnboardingContext";

interface SubscriptionSelectProps {
  onContinue: () => void;
  onBack: () => void;
}

interface Plan {
  id: Subscription;
  name: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  savings?: string;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    features: ["1 athlete slot", "Full program access", "Weekly reports", "Cancel anytime"],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$79.99",
    period: "/year",
    features: ["3 athlete slots", "Full program access", "Weekly reports", "Priority support"],
    badge: "BEST VALUE",
    savings: "Save 33%",
  },
];

export function SubscriptionSelect({ onContinue, onBack }: SubscriptionSelectProps) {
  const { updateParentData } = useOnboarding();
  const [selected, setSelected] = useState<Subscription>("annual");

  const handleContinue = () => {
    updateParentData({ subscription: selected });
    onContinue();
  };

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
        className="font-bebas text-2xl tracking-wider mb-2 text-center"
        style={{ color: "#1A1A1A" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CHOOSE YOUR PLAN
      </motion.h1>

      <motion.p
        className="text-sm text-center mb-8"
        style={{ color: "#666" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        7-day free trial included
      </motion.p>

      {/* Plans */}
      <div className="space-y-4 flex-1">
        {PLANS.map((plan, index) => (
          <motion.button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className="w-full text-left rounded-2xl p-5 transition-all relative"
            style={{
              backgroundColor: "white",
              border: `2px solid ${selected === plan.id ? "#00BFB0" : "#E5E5E5"}`,
              boxShadow: selected === plan.id ? "0 4px 20px rgba(0, 191, 176, 0.2)" : "none",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Badge */}
            {plan.badge && (
              <div
                className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#FFD700", color: "#1A1A1A" }}
              >
                {plan.badge}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bebas text-xl tracking-wider" style={{ color: "#1A1A1A" }}>
                  {plan.name.toUpperCase()}
                </h3>
                {plan.savings && (
                  <span className="text-sm" style={{ color: "#00BFB0" }}>
                    {plan.savings}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-bebas text-2xl" style={{ color: "#1A1A1A" }}>
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: "#666" }}>
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ color: "#00BFB0" }}>✓</span>
                  <span className="text-sm" style={{ color: "#666" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Selection indicator */}
            <div
              className="absolute top-5 left-5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: selected === plan.id ? "#00BFB0" : "#CCC",
              }}
            >
              {selected === plan.id && (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00BFB0" }} />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-bebas text-xl tracking-wider mt-6"
        style={{
          backgroundColor: "#00BFB0",
          color: "white",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        START FREE TRIAL →
      </motion.button>

      {/* Terms */}
      <motion.p
        className="text-xs text-center mt-4"
        style={{ color: "#999" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Cancel anytime during trial. By continuing, you agree to our Terms of Service.
      </motion.p>
    </motion.div>
  );
}

export default SubscriptionSelect;
