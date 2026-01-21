// ═══════════════════════════════════════════════════════════
// PAYMENT PAGE
// Stripe checkout for Wolf Contract ($88 USD or equivalent)
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Country {
  code: string;
  name: string;
  flag: string;
  price: number;
  currency: string;
  symbol: string;
}

// What's included in the contract
const BENEFITS = [
  { icon: "📚", text: "42-Day Wolf Pack Blueprint" },
  { icon: "🎯", text: "30 Guided Training Levels" },
  { icon: "🐺", text: "AI Coach Access" },
  { icon: "💰", text: "$88 NeoBall Credit on Completion" },
];

export default function PaymentPage() {
  const router = useRouter();
  const [country, setCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load country from session
  useEffect(() => {
    const stored = sessionStorage.getItem("wolfContract_country");
    if (stored) {
      setCountry(JSON.parse(stored));
    } else {
      // No country selected, redirect back
      router.push("/contract/country");
    }
  }, [router]);

  const handleCheckout = async () => {
    if (!country || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call API to create Stripe checkout session
      const response = await fetch("/api/stripe/create-contract-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: country.code,
          currency: country.currency.toLowerCase(),
          amount: country.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (!country) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="animate-pulse text-center">
          <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
        </div>
      </div>
    );
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
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          WOLF CONTRACT
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Your commitment. Your reward.
        </p>
      </motion.div>

      {/* Price Card */}
      <motion.div
        className="max-w-md mx-auto w-full mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            backgroundColor: "var(--accent-primary)15",
            border: "2px solid var(--accent-primary)",
          }}
        >
          {/* Country Flag */}
          <span className="text-4xl mb-4 block">{country.flag}</span>

          {/* Price */}
          <div className="mb-2">
            <span
              className="font-bebas text-5xl tracking-wide"
              style={{ color: "var(--accent-primary)" }}
            >
              {country.symbol}{country.price}
            </span>
            <span
              className="font-bebas text-xl ml-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              {country.currency}
            </span>
          </div>

          {/* One-time badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            ONE-TIME PAYMENT
          </span>
        </div>
      </motion.div>

      {/* Benefits List */}
      <motion.div
        className="max-w-md mx-auto w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <h3
            className="font-bebas text-lg tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            WHAT'S INCLUDED
          </h3>
          <ul className="space-y-3">
            {BENEFITS.map((benefit, index) => (
              <motion.li
                key={benefit.text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <span className="text-xl">{benefit.icon}</span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {benefit.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* The Deal */}
      <motion.div
        className="max-w-md mx-auto w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <h3
            className="font-bebas text-lg tracking-wider mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            THE DEAL
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Complete <strong style={{ color: "var(--accent-primary)" }}>30 Levels</strong> in{" "}
            <strong style={{ color: "var(--accent-primary)" }}>42 days</strong>.
            <br />
            Each level = 90% video watched + quick note.
            <br />
            <br />
            Finish the contract? Earn{" "}
            <strong style={{ color: "var(--accent-primary)" }}>${88} credit</strong> toward
            NeoBall gear.
            <br />
            <br />
            Don't finish? No credit. But keep the training forever.
          </p>
        </div>
      </motion.div>

      {/* Checkout Button */}
      <motion.div
        className="max-w-md mx-auto w-full mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {error && (
          <div
            className="mb-4 p-3 rounded-xl text-center text-sm"
            style={{
              backgroundColor: "var(--status-error)20",
              color: "var(--status-error)",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {isLoading ? "PROCESSING..." : `PAY ${country.symbol}${country.price} & JOIN THE PACK`}
        </button>

        <p
          className="text-xs text-center mt-3"
          style={{ color: "var(--text-tertiary)" }}
        >
          Secure payment via Stripe
        </p>

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
