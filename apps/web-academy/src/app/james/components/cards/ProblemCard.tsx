"use client";

import { motion } from "framer-motion";
import { PROBLEM } from "../../constants";

export function ProblemCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-12">
      {/* Warning gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-red-400/80"
        >
          {PROBLEM.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-2xl font-bold leading-tight text-white"
        >
          {PROBLEM.headline}
        </motion.h2>

        {/* The Story - Narrative Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 space-y-4 text-left"
        >
          {/* Intro */}
          <p className="text-sm leading-relaxed text-white/70">{PROBLEM.intro}</p>

          {/* Symptoms - highlighted */}
          <p className="text-sm font-medium leading-relaxed text-red-400/90">{PROBLEM.symptoms}</p>

          {/* The "Why?" - punchy */}
          <p className="text-center text-xl font-bold text-white">{PROBLEM.why}</p>

          {/* Revelation */}
          <p className="text-sm leading-relaxed text-white/70">{PROBLEM.revelation}</p>
        </motion.div>

        {/* Punchline - the hook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-4"
        >
          <p className="text-sm font-medium leading-relaxed text-white">{PROBLEM.punchline}</p>
        </motion.div>

        {/* Hook line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-xs font-medium uppercase tracking-wider text-[#00f6e0]/80"
        >
          {PROBLEM.hookLine}
        </motion.p>
      </div>
    </div>
  );
}
