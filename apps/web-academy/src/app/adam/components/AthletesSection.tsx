"use client";

import { motion } from "framer-motion";
import { ATHLETES } from "../constants";

export function AthletesSection() {
  return (
    <section id="athletes" className="bg-[#1C2B3A] py-24 px-[60px]">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-4">
            {ATHLETES.label}
          </p>
          <h2
            className="text-[#FAF8F5] text-[38px]"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 }}
          >
            {ATHLETES.title}
          </h2>
        </motion.div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {ATHLETES.groups.map((group, i) => (
            <motion.div
              key={group.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-[18px] text-[#FAF8F5] pb-3 mb-3 border-b-2 border-[#C5A47E]"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {group.level}
              </h3>
              <p
                className="text-[14px] leading-[1.8] text-[rgba(250,248,245,0.7)]"
                style={{ fontFamily: "var(--font-body), Georgia, serif" }}
              >
                {group.athletes}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
