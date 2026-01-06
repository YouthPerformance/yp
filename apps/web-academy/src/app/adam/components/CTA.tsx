"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";
import { CTA as CTAData } from "../constants";

export function CTA() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9a962]/5 rounded-full blur-[200px]" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201, 169, 98, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 169, 98, 1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-6"
        >
          The Invitation
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-bebas text-5xl md:text-7xl text-white mb-4"
        >
          {CTAData.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-zinc-400 mb-12"
        >
          {CTAData.subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <Link
            href={CTAData.buttons.primary.href}
            className="group relative flex items-center gap-3 px-8 py-4 bg-[#c9a962] text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(201,169,98,0.3)]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{CTAData.buttons.primary.label}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 whitespace-nowrap">
              {CTAData.buttons.primary.sublabel}
            </span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href={CTAData.buttons.secondary.href}
            className="group flex items-center gap-3 px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg transition-all duration-300 hover:border-[#c9a962] hover:text-[#c9a962]"
          >
            <Zap className="w-5 h-5" />
            <span>{CTAData.buttons.secondary.label}</span>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-zinc-900"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-zinc-600 text-sm">
            <span>Youth Performance</span>
            <span className="hidden sm:block">|</span>
            <span>Austin, TX</span>
            <span className="hidden sm:block">|</span>
            <span>2024</span>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-8 text-xs text-zinc-700 hover:text-zinc-500 transition-colors uppercase tracking-widest"
          >
            Back to Top
          </button>
        </motion.div>
      </div>
    </section>
  );
}
