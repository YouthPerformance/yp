"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FAMILY } from "../constants";

export function Family() {
  return (
    <section className="py-20 px-[60px] bg-[var(--bg-secondary)] text-center border-y border-[var(--border-default)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[700px] mx-auto"
      >
        {/* Section Label */}
        <p className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-6">
          {FAMILY.label}
        </p>

        {/* Heart Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-[var(--accent-primary)] opacity-50 mx-auto mb-6 flex items-center justify-center">
          <Heart className="w-7 h-7 text-[var(--accent-primary)]" />
        </div>

        {/* Family Text */}
        <p className="text-[17px] leading-[1.9] text-[var(--text-secondary)]">
          {FAMILY.text}
        </p>
      </motion.div>
    </section>
  );
}
