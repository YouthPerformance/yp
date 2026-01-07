"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FAMILY } from "../constants";

export function Family() {
  return (
    <section className="py-20 px-[60px] bg-[#1C2B3A] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[700px] mx-auto"
      >
        {/* Section Label */}
        <p className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-6">
          {FAMILY.label}
        </p>

        {/* Heart Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-[rgba(197,164,126,0.3)] mx-auto mb-6 flex items-center justify-center">
          <Heart className="w-7 h-7 text-[#C5A47E]" />
        </div>

        {/* Family Text */}
        <p
          className="text-[17px] leading-[1.9] text-[rgba(250,248,245,0.85)]"
          style={{ fontFamily: "var(--font-body), Georgia, serif" }}
        >
          {FAMILY.text}
        </p>
      </motion.div>

      {/* Mobile */}
      <style jsx>{`
        @media (max-width: 767px) {
          section {
            padding: 60px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
