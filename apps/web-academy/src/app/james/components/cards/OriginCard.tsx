"use client";

import { motion } from "framer-motion";
import { ORIGIN } from "../../constants";

export function OriginCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Warm gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.03)_0%,transparent_50%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80"
        >
          {ORIGIN.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-3xl font-bold leading-tight text-white"
        >
          {ORIGIN.headline}
        </motion.h2>

        {/* Story paragraphs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          {ORIGIN.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="text-base leading-relaxed text-white/60"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-white/10 pt-6"
        >
          <p className="text-sm italic text-white/40">{ORIGIN.signature}</p>
        </motion.div>
      </div>
    </div>
  );
}
