"use client";

import { motion } from "framer-motion";
import { TRIFECTA } from "../../constants";

export function TrifectaCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,246,224,0.03)_0%,transparent_60%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#00f6e0]"
        >
          {TRIFECTA.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 text-3xl font-bold leading-tight text-white"
        >
          {TRIFECTA.headline}
        </motion.h2>

        {/* Athletes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid w-full grid-cols-3 gap-3"
        >
          {TRIFECTA.athletes.map((athlete, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-4"
            >
              {/* Avatar placeholder */}
              <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/30">
                  {athlete.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>

              {/* Sport badge */}
              <span
                className={`mb-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  athlete.sport === "NBA"
                    ? "bg-orange-500/20 text-orange-400"
                    : athlete.sport === "NFL"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {athlete.sport}
              </span>

              {/* Name */}
              <span className="text-xs font-semibold text-white">{athlete.name}</span>

              {/* Team */}
              <span className="mt-0.5 text-[10px] text-white/40">{athlete.team}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-white/50"
        >
          {TRIFECTA.footnote}
        </motion.p>
      </div>
    </div>
  );
}
