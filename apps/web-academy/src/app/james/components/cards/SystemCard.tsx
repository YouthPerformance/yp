"use client";

import { motion } from "framer-motion";
import { SYSTEM } from "../../constants";

export function SystemCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#0a0a0a] px-6 py-10">
      {/* Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,246,224,0.03)_0%,transparent_50%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#00f6e0]"
        >
          {SYSTEM.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 text-2xl font-bold leading-tight text-white"
        >
          {SYSTEM.headline}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 text-sm italic text-white/60"
        >
          {SYSTEM.subtitle}
        </motion.p>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-sm leading-relaxed text-white/70"
        >
          {SYSTEM.intro}
        </motion.p>

        {/* The Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-6 flex w-full justify-center gap-4"
        >
          {SYSTEM.promise.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="mb-1 text-xl">{item.icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 3-Phase Protocol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full space-y-3"
        >
          {SYSTEM.phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-left"
              style={{
                borderColor: `${phase.color}30`,
                background: `linear-gradient(135deg, ${phase.color}08, transparent)`,
              }}
            >
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold"
                    style={{ background: `${phase.color}20`, color: phase.color }}
                  >
                    {phase.number}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: phase.color }}>
                      {phase.name}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-white/40">{phase.weeks}</span>
              </div>

              {/* Goal */}
              <p className="mb-2 text-xs text-white/60">{phase.goal}</p>

              {/* Drills */}
              <div className="mb-2 flex flex-wrap gap-1">
                {phase.drills.map((drill, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-medium text-white/70"
                  >
                    {drill}
                  </span>
                ))}
              </div>

              {/* Result */}
              <p className="text-[10px] font-medium italic text-white/80">
                &quot;{phase.result}&quot;
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-5 text-xs text-white/50"
        >
          {SYSTEM.cta}
        </motion.p>
      </div>
    </div>
  );
}
