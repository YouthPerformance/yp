"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PHILOSOPHY } from "../constants";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="py-24 px-[60px] bg-[var(--bg-secondary)] border-y border-[var(--border-default)]"
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: NeoBall Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square bg-[var(--bg-tertiary)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--border-default)]">
            {/* Placeholder for NeoBall image */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a] mx-auto flex items-center justify-center shadow-2xl glow">
                <div className="text-center">
                  <p className="font-bebas text-[28px] text-[var(--accent-primary)]">NEOBALL</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] tracking-[2px] mt-1">
                    FOUNDERS EDITION
                  </p>
                </div>
              </div>
              <p className="text-[var(--text-tertiary)] text-sm mt-6">NeoBall Product Image</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Philosophy Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-4">
            {PHILOSOPHY.label}
          </p>

          <h2 className="font-bebas text-[var(--text-primary)] text-[38px] leading-[1.2] mb-6">
            {PHILOSOPHY.title}
            <br />
            <span className="text-[var(--accent-primary)]">{PHILOSOPHY.titleAccent}</span>
          </h2>

          <p className="text-[18px] italic leading-[1.7] text-[var(--text-secondary)] mb-6">
            &ldquo;{PHILOSOPHY.quote}&rdquo;
          </p>

          <p className="text-[16px] leading-[1.8] text-[var(--text-secondary)] mb-10">
            {PHILOSOPHY.body}
          </p>

          <Link href={PHILOSOPHY.cta.href} className="btn-primary text-sm tracking-wider">
            {PHILOSOPHY.cta.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
