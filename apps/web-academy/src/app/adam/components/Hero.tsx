"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";
import { HERO } from "../constants";

export function Hero() {
  return (
    <section
      className="min-h-screen bg-[#FAF8F5] relative"
      style={{
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
          className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-5"
        >
          {HERO.label}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#1C2B3A] mb-0 leading-[1.1]"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "clamp(48px, 5vw, 68px)",
            fontWeight: 400,
          }}
        >
          {HERO.firstName}
          <br />
          <span className="italic text-[#C5A47E]">{HERO.lastName}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[19px] leading-[1.8] text-[#5A5A5A] max-w-[460px] mt-8"
          style={{ fontFamily: "var(--font-body), Georgia, serif" }}
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
            className="bg-[#1C2B3A] text-[#FAF8F5] px-8 py-4 text-[14px] tracking-[1.5px] font-semibold no-underline hover:bg-[#2a3d4f] transition-colors"
          >
            {HERO.primaryCTA.label}
          </Link>
          <button className="flex items-center gap-2 text-[#5A5A5A] text-[14px] hover:text-[#1C2B3A] transition-colors bg-transparent border-none cursor-pointer">
            <span className="w-10 h-10 rounded-full border border-[#C5A47E] flex items-center justify-center">
              <Play className="w-4 h-4 text-[#C5A47E] ml-0.5" />
            </span>
            {HERO.secondaryCTA.label}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-8 mt-12 pt-8 border-t border-[rgba(197,164,126,0.15)]"
        >
          {HERO.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-[32px] text-[#1C2B3A] leading-none"
                style={{ fontFamily: "var(--font-accent), sans-serif" }}
              >
                {stat.number}
              </p>
              <p className="text-[11px] tracking-[1px] text-[#6B7280] uppercase mt-1">
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
        {/* Decorative Frame */}
        <div
          className="absolute opacity-40"
          style={{
            top: "20px",
            left: "20px",
            right: "-20px",
            bottom: "-20px",
            border: "1px solid #C5A47E",
          }}
        />

        {/* Image Container */}
        <div className="relative w-full h-full bg-[#E8E4DF] overflow-hidden">
          {/* Placeholder - replace with actual image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#C5A47E]/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#C5A47E] text-4xl font-bold">AH</span>
              </div>
              <p className="text-[#6B7280] text-sm">Hero Image</p>
              <p className="text-[#9CA3AF] text-xs mt-1">adam-hero.jpg</p>
            </div>
          </div>
          {/* Uncomment when image is ready:
          <Image
            src="/images/adam/adam-hero.jpg"
            alt="Adam Harrington"
            fill
            className="object-cover object-top"
            priority
          />
          */}
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
