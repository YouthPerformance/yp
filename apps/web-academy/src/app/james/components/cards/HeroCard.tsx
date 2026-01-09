"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter } from "lucide-react";
import { HERO } from "../../constants";

export function HeroCard() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] px-6 py-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,246,224,0.03)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="rounded-full border border-[#00f6e0]/30 bg-[#00f6e0]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#00f6e0]">
            {HERO.badge}
          </span>
        </motion.div>

        {/* Avatar placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-[#00f6e0]/30 bg-gradient-to-br from-[#1a1a1a] to-[#111]"
        >
          {/* Placeholder - replace with actual image */}
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#00f6e0]/50">
            JS
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-2 text-4xl font-bold tracking-tight text-white"
        >
          {HERO.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 text-sm text-white/60"
        >
          {HERO.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 text-xl font-medium text-[#00f6e0]"
        >
          {HERO.tagline}
        </motion.p>

        {/* Credentials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8 flex gap-4"
        >
          {HERO.credentials.map((cred, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                {cred.label}
              </span>
              <span className="mt-1 text-sm font-semibold text-white">{cred.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8 max-w-xs text-center text-sm text-white/50"
        >
          {HERO.mission}
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex gap-4"
        >
          <a
            href={HERO.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-[#00f6e0]/30 hover:text-[#00f6e0]"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={HERO.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-[#00f6e0]/30 hover:text-[#00f6e0]"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
