"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { SYSTEM } from "../../constants";

export function SystemCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,246,224,0.03)_0%,transparent_50%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#00f6e0]"
        >
          {SYSTEM.eyebrow}
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 text-3xl font-bold leading-tight text-white"
        >
          {SYSTEM.headline}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8 text-sm text-white/50"
        >
          {SYSTEM.subtitle}
        </motion.p>

        {/* Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 w-full space-y-3"
        >
          {SYSTEM.modules.map((module, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className={`relative overflow-hidden rounded-xl border p-4 text-left ${
                module.status === "available"
                  ? "border-[#00f6e0]/30 bg-[#00f6e0]/5"
                  : "border-white/10 bg-white/5 opacity-60"
              }`}
            >
              {/* Module number badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                      module.status === "available"
                        ? "bg-[#00f6e0]/20 text-[#00f6e0]"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {String(module.number).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                      {module.name}
                    </div>
                    <div className="text-base font-semibold text-white">{module.title}</div>
                  </div>
                </div>

                {/* Status indicator */}
                {module.status === "available" ? (
                  <div className="flex items-center gap-1 rounded-full bg-[#00f6e0]/20 px-2 py-1">
                    <Check className="h-3 w-3 text-[#00f6e0]" />
                    <span className="text-[10px] font-medium text-[#00f6e0]">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                    <Lock className="h-3 w-3 text-white/40" />
                    <span className="text-[10px] font-medium text-white/40">Soon</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-white/50">{module.description}</p>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-xs text-white/40">{module.duration}</span>
                <span
                  className={`text-sm font-semibold ${
                    module.status === "available" ? "text-[#00f6e0]" : "text-white/40"
                  }`}
                >
                  {module.price}
                </span>
              </div>

              {/* "Start Here" indicator for Module 1 */}
              {module.status === "available" && (
                <div className="absolute -right-8 top-4 rotate-45 bg-[#00f6e0] px-10 py-0.5 text-[9px] font-bold uppercase text-black">
                  Start
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm font-medium text-white/70"
        >
          {SYSTEM.cta}
        </motion.p>
      </div>
    </div>
  );
}
