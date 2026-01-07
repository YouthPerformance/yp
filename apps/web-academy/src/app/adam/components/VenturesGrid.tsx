"use client";

import { motion } from "framer-motion";
import { VENTURES } from "../constants";

export function VenturesGrid() {
  return (
    <section className="py-24 px-[60px] bg-[#FAF8F5]">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-4">
            Current Ventures
          </p>
          <h2
            className="text-[#1C2B3A] text-[38px]"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontWeight: 400,
            }}
          >
            Where I&apos;m Building
          </h2>
        </motion.div>

        {/* Ventures Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENTURES.map((venture, i) => (
            <motion.div
              key={venture.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="p-7 bg-white border border-[rgba(197,164,126,0.15)] hover:border-[#C5A47E] hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3
                className="text-[20px] text-[#1C2B3A] mb-1.5"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {venture.title}
              </h3>
              <p className="text-[11px] tracking-[1px] text-[#C5A47E] uppercase mb-3.5">
                {venture.subtitle}
              </p>
              <p
                className="text-[14px] leading-[1.6] text-[#6B7280]"
                style={{ fontFamily: "var(--font-body), Georgia, serif" }}
              >
                {venture.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: Single column */}
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
