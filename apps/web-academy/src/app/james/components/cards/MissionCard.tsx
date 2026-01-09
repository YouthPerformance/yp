"use client";

import { motion } from "framer-motion";
import { MISSION } from "../../constants";

export function MissionCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,246,224,0.05)_0%,transparent_50%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#00f6e0]"
        >
          {MISSION.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-3xl font-bold leading-tight text-white"
        >
          {MISSION.headline}
        </motion.h2>

        {/* Body paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 space-y-4"
        >
          {MISSION.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-white/60">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Price stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full rounded-2xl border border-[#00f6e0]/20 bg-[#00f6e0]/5 p-6"
        >
          <div className="mb-2 text-5xl font-bold text-[#00f6e0]">{MISSION.stat.number}</div>
          <div className="mb-1 text-sm font-medium text-white">{MISSION.stat.label}</div>
          <div className="text-xs text-white/40">{MISSION.stat.comparison}</div>
        </motion.div>
      </div>
    </div>
  );
}
