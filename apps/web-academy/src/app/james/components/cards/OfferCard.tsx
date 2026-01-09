"use client";

import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
import { OFFER } from "../../constants";

export function OfferCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Highlight gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,246,224,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#00f6e0]">
            {OFFER.eyebrow}
          </span>
          <span className="rounded-full bg-[#00f6e0] px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            {OFFER.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 text-3xl font-bold leading-tight text-white"
        >
          {OFFER.headline}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6 text-lg text-[#00f6e0]"
        >
          {OFFER.tagline}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-sm leading-relaxed text-white/60"
        >
          {OFFER.description}
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-6 w-full space-y-2"
        >
          {OFFER.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#00f6e0]/20">
                <Check className="h-3 w-3 text-[#00f6e0]" />
              </div>
              <span className="text-sm text-white/70">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 w-full rounded-xl border border-[#00f6e0]/30 bg-[#00f6e0]/5 p-5"
        >
          <div className="mb-1 text-4xl font-bold text-[#00f6e0]">{OFFER.pricing.price}</div>
          <div className="mb-2 text-sm text-white/70">{OFFER.pricing.comparison}</div>
          <div className="text-xs text-white/40">{OFFER.pricing.value}</div>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href={OFFER.cta.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-4 w-full rounded-xl bg-[#00f6e0] py-4 text-center text-base font-bold uppercase tracking-wide text-black transition-all hover:bg-[#00d4c4] hover:shadow-[0_0_30px_rgba(0,246,224,0.3)]"
        >
          {OFFER.cta.label} — {OFFER.pricing.price}
        </motion.a>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-2 text-white/50"
        >
          <Shield className="h-4 w-4" />
          <span className="text-xs">{OFFER.guarantee.text}</span>
        </motion.div>
      </div>
    </div>
  );
}
