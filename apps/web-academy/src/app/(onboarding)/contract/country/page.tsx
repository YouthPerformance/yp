// ═══════════════════════════════════════════════════════════
// COUNTRY SELECTOR PAGE
// First step of Wolf Contract: Select your region for pricing
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Supported countries with pricing
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", price: 88, currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", price: 69, currency: "GBP", symbol: "£" },
  { code: "EU", name: "Europe", flag: "🇪🇺", price: 79, currency: "EUR", symbol: "€" },
  { code: "CN", name: "China", flag: "🇨🇳", price: 588, currency: "CNY", symbol: "¥" },
  { code: "CA", name: "Canada", flag: "🇨🇦", price: 88, currency: "CAD", symbol: "$" },
  { code: "AU", name: "Australia", flag: "🇦🇺", price: 88, currency: "AUD", symbol: "$" },
] as const;

type Country = (typeof COUNTRIES)[number];

export default function CountrySelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Country | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (country: Country) => {
    setSelected(country);
    // Store in sessionStorage for next steps
    sessionStorage.setItem("wolfContract_country", JSON.stringify(country));
  };

  const handleContinue = () => {
    if (!selected || isAnimating) return;
    setIsAnimating(true);

    // Short delay for wolf reaction
    setTimeout(() => {
      router.push("/contract/check");
    }, 300);
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
          BUILD BULLETPROOF ANKLES
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Select your region for local pricing
        </p>
      </motion.div>

      {/* Country Grid */}
      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((country, index) => (
            <motion.button
              key={country.code}
              onClick={() => handleSelect(country)}
              className="relative p-4 rounded-xl text-left transition-all"
              style={{
                backgroundColor:
                  selected?.code === country.code
                    ? "var(--accent-primary)20"
                    : "var(--bg-secondary)",
                border:
                  selected?.code === country.code
                    ? "2px solid var(--accent-primary)"
                    : "2px solid transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Flag */}
              <span className="text-3xl mb-2 block">{country.flag}</span>

              {/* Country Name */}
              <span
                className="font-bebas text-lg tracking-wide block mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {country.name}
              </span>

              {/* Price */}
              <span
                className="text-sm font-medium"
                style={{ color: "var(--accent-primary)" }}
              >
                {country.symbol}{country.price} {country.currency}
              </span>

              {/* Selected Check */}
              {selected?.code === country.code && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <svg
                    className="w-4 h-4"
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
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Wolf Reaction */}
        {selected && (
          <motion.div
            className="mt-6 p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="text-lg mr-2">{selected.flag}</span>
              Pack territory confirmed.
            </p>
          </motion.div>
        )}
      </div>

      {/* Continue Button */}
      <motion.div
        className="max-w-md mx-auto w-full pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleContinue}
          disabled={!selected || isAnimating}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {isAnimating ? "..." : "CONTINUE"}
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
