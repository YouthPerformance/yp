"use client";

import { motion } from "framer-motion";
import { Globe, Instagram, Shield, Twitter } from "lucide-react";
import { FINAL_CTA } from "../../constants";

export function FinalCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111] px-6 py-10">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,246,224,0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 text-3xl font-bold leading-tight text-white"
        >
          {FINAL_CTA.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-sm text-white/60"
        >
          {FINAL_CTA.subheadline}
        </motion.p>

        {/* Primary CTA */}
        <motion.a
          href={FINAL_CTA.primaryCTA.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-2 w-full rounded-xl bg-[#00f6e0] py-4 text-center text-base font-bold uppercase tracking-wide text-black transition-all hover:bg-[#00d4c4] hover:shadow-[0_0_30px_rgba(0,246,224,0.3)]"
        >
          {FINAL_CTA.primaryCTA.label}
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-6 text-[10px] text-white/40"
        >
          {FINAL_CTA.primaryCTA.subtext}
        </motion.p>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 flex items-start gap-3 rounded-lg border border-[#00f6e0]/20 bg-[#00f6e0]/5 p-4 text-left"
        >
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00f6e0]" />
          <div>
            <p className="mb-1 text-sm font-semibold text-[#00f6e0]">
              {FINAL_CTA.guarantee.headline}
            </p>
            <p className="text-xs text-white/60">{FINAL_CTA.guarantee.text}</p>
          </div>
        </motion.div>

        {/* The P.S. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6 border-l-2 border-amber-500/50 pl-4 text-left"
        >
          <p className="text-xs font-medium text-amber-400">P.S.</p>
          <p className="mt-1 text-sm italic leading-relaxed text-white/70">{FINAL_CTA.ps}</p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-4 h-px w-16 bg-white/10"
        />

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-3"
        >
          <a
            href={FINAL_CTA.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-[#00f6e0]/30 hover:text-[#00f6e0]"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={FINAL_CTA.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-[#00f6e0]/30 hover:text-[#00f6e0]"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={FINAL_CTA.social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-[#00f6e0]/30 hover:text-[#00f6e0]"
          >
            <Globe className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-[10px] text-white/30"
        >
          YouthPerformance.com • @weakfeetdonteat
        </motion.p>
      </div>
    </div>
  );
}
