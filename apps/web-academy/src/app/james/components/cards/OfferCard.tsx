"use client";

import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
import { OFFER } from "../../constants";

export function OfferCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#0a0a0a] px-6 py-8">
      {/* Highlight gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,246,224,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 flex items-center gap-2"
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
          className="mb-2 text-2xl font-bold leading-tight text-white"
        >
          {OFFER.headline}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 text-sm text-[#00f6e0]/80"
        >
          {OFFER.tagline}
        </motion.p>

        {/* Value Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
            What you get:
          </div>
          <div className="space-y-2">
            {OFFER.valueStack.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                className="flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-[#00f6e0]" />
                  <span className="text-xs text-white/70">{item.item}</span>
                </div>
                <span className="text-xs font-medium text-white/40 line-through">{item.value}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 text-right">
            <span className="text-xs text-white/40">Total Value: </span>
            <span className="text-sm font-bold text-white/60 line-through">{OFFER.totalValue}</span>
          </div>
        </motion.div>

        {/* Pricing Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4 w-full rounded-xl border border-[#00f6e0]/30 bg-[#00f6e0]/5 p-4"
        >
          <div className="mb-1 text-xs uppercase tracking-wider text-white/50">Your Price</div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-[#00f6e0]">{OFFER.pricing.price}</span>
            <span className="text-sm text-white/40">({OFFER.pricing.perDay})</span>
          </div>
          <div className="mt-1 text-xs text-white/50">{OFFER.pricing.comparison}</div>
        </motion.div>

        {/* The Filter - Why So Cheap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-4 w-full rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left"
        >
          <div className="mb-2 text-sm font-bold text-amber-400">{OFFER.filter.headline}</div>
          <p className="mb-2 text-xs text-white/60">{OFFER.filter.text}</p>
          <ul className="mb-2 space-y-1 text-xs text-white/60">
            {OFFER.filter.points.map((point, i) => (
              <li key={i}>• {point}</li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-amber-400">{OFFER.filter.punchline}</p>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href={OFFER.cta.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-2 w-full rounded-xl bg-[#00f6e0] py-4 text-center text-base font-bold uppercase tracking-wide text-black transition-all hover:bg-[#00d4c4] hover:shadow-[0_0_30px_rgba(0,246,224,0.3)]"
        >
          {OFFER.cta.label}
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mb-4 text-[10px] text-white/40"
        >
          {OFFER.cta.subtext}
        </motion.p>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-2 text-white/50"
        >
          <Shield className="h-4 w-4" />
          <span className="text-[10px]">{OFFER.guarantee.headline}</span>
        </motion.div>
      </div>
    </div>
  );
}
