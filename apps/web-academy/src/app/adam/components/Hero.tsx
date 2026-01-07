"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";
import { HERO } from "../constants";

export function Hero() {
  return (
    <section
      className="min-h-screen relative"
      style={{
        background: "var(--bg-primary)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        padding: "100px 60px 60px",
        alignItems: "center",
      }}
    >
      {/* Left Column - Content */}
      <div className="max-w-[560px]">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-5"
        >
          {HERO.label}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-bebas text-[var(--text-primary)] mb-0 leading-[1.1]"
          style={{ fontSize: "clamp(48px, 5vw, 68px)" }}
        >
          {HERO.firstName}
          <br />
          <span className="text-[var(--accent-primary)]">{HERO.lastName}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg leading-relaxed text-[var(--text-secondary)] max-w-[460px] mt-8"
        >
          {HERO.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mt-10"
        >
          <Link
            href={HERO.primaryCTA.href}
            className="btn-primary text-sm tracking-wider"
          >
            {HERO.primaryCTA.label}
          </Link>
          <button className="flex items-center gap-2 text-[var(--text-secondary)] text-sm hover:text-[var(--accent-primary)] transition-colors bg-transparent border-none cursor-pointer">
            <span className="w-10 h-10 rounded-full border border-[var(--accent-primary)] flex items-center justify-center">
              <Play className="w-4 h-4 text-[var(--accent-primary)] ml-0.5" />
            </span>
            {HERO.secondaryCTA.label}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-8 mt-12 pt-8 border-t border-[var(--border-default)]"
        >
          {HERO.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-bebas text-[32px] text-[var(--accent-primary)] leading-none">
                {stat.number}
              </p>
              <p className="text-[11px] tracking-[1px] text-[var(--text-tertiary)] uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Column - Image */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative h-[85vh] max-h-[700px] hidden lg:block"
      >
        {/* Decorative Frame with glow */}
        <div
          className="absolute"
          style={{
            top: "20px",
            left: "20px",
            right: "-20px",
            bottom: "-20px",
            border: "1px solid var(--accent-primary)",
            opacity: 0.3,
            boxShadow: "0 0 30px rgba(0, 246, 224, 0.1)",
          }}
        />

        {/* Image Container */}
        <div className="relative w-full h-full bg-[var(--bg-secondary)] overflow-hidden">
          {/* Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] mx-auto mb-4 flex items-center justify-center glow">
                <span className="text-[var(--accent-primary)] text-4xl font-bebas">AH</span>
              </div>
              <p className="text-[var(--text-tertiary)] text-sm">Hero Image</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile: Single column */}
      <style jsx>{`
        @media (max-width: 1023px) {
          section {
            grid-template-columns: 1fr !important;
            padding: 120px 24px 60px !important;
          }
        }
      `}</style>
    </section>
  );
}
