"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PHILOSOPHY } from "../constants";

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="py-24 px-[60px]"
      style={{ background: "#E8E4DF" }}
    >
      <div
        className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
      >
        {/* Left: NeoBall Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square bg-[#FAF8F5] rounded-lg overflow-hidden flex items-center justify-center">
            {/* Placeholder for NeoBall image */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] mx-auto flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <p
                    className="text-[28px] text-[#C5A47E]"
                    style={{ fontFamily: "var(--font-accent), sans-serif" }}
                  >
                    NEOBALL
                  </p>
                  <p className="text-[10px] text-zinc-400 tracking-[2px] mt-1">
                    FOUNDERS EDITION
                  </p>
                </div>
              </div>
              <p className="text-[#6B7280] text-sm mt-6">NeoBall Product Image</p>
            </div>
            {/* Uncomment when image is ready:
            <Image
              src="/images/adam/neoball-product.jpg"
              alt="NeoBall Founders Edition"
              fill
              className="object-cover"
            />
            */}
          </div>
        </motion.div>

        {/* Right: Philosophy Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-4">
            {PHILOSOPHY.label}
          </p>

          <h2
            className="text-[#1C2B3A] text-[38px] leading-[1.2] mb-6"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontWeight: 400,
            }}
          >
            {PHILOSOPHY.title}
            <br />
            <span className="italic">{PHILOSOPHY.titleAccent}</span>
          </h2>

          <p
            className="text-[20px] italic leading-[1.7] text-[#5A5A5A] mb-6"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            &ldquo;{PHILOSOPHY.quote}&rdquo;
          </p>

          <p
            className="text-[16px] leading-[1.8] text-[#5A5A5A] mb-10"
            style={{ fontFamily: "var(--font-body), Georgia, serif" }}
          >
            {PHILOSOPHY.body}
          </p>

          <Link
            href={PHILOSOPHY.cta.href}
            className="inline-block bg-[#C5A47E] text-[#1C2B3A] px-10 py-4 text-[14px] tracking-[1.5px] font-semibold no-underline hover:bg-[#b89468] transition-colors"
          >
            {PHILOSOPHY.cta.label}
          </Link>
        </motion.div>
      </div>

      {/* Mobile: Single column */}
      <style jsx>{`
        @media (max-width: 1023px) {
          section {
            padding: 80px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
