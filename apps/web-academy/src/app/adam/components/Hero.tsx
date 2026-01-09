"use client";

import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HERO } from "../constants";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-bg-secondary overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/50 to-bg-secondary z-10" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 246, 224, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 246, 224, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content container */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full py-24 lg:py-0">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-bebas text-text-primary leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(56px, 8vw, 100px)" }}
            >
              {HERO.headline.split(" ")[0]}
              <br />
              <span className="text-accent-primary">{HERO.headline.split(" ")[1]}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl lg:text-2xl text-text-secondary font-light mt-6 max-w-lg"
            >
              {HERO.subheadline}
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base lg:text-lg text-text-tertiary mt-4 max-w-md leading-relaxed"
            >
              {HERO.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10"
            >
              <Link
                href={HERO.primaryCTA.href}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent-primary text-bg-secondary font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1"
              >
                {HERO.primaryCTA.label}
                <span className="w-2 h-2 bg-bg-secondary rounded-full group-hover:scale-125 transition-transform" />
              </Link>

              <Link
                href={HERO.secondaryCTA.href}
                className="group flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors"
              >
                <span className="w-12 h-12 rounded-full border border-border-default group-hover:border-accent-primary flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </span>
                <span className="text-sm uppercase tracking-wider">{HERO.secondaryCTA.label}</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-10 mt-14 pt-8 border-t border-border-subtle"
            >
              {HERO.stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-bebas text-4xl lg:text-5xl text-accent-primary leading-none">
                    {stat.number}
                  </p>
                  <p className="text-xs tracking-[2px] text-text-tertiary uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Hero Media (Video-first, image fallback) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-accent-primary/20 -z-10" />
            <div className="absolute -inset-8 border border-accent-primary/10 -z-10" />

            {/* Media container - Video first, image fallback */}
            <div className="relative aspect-[3/4] lg:aspect-[4/5] bg-gradient-to-br from-bg-elevated to-bg-secondary overflow-hidden">
              {/* Video (primary - CEO mandate: kinetic energy) */}
              {HERO.heroVideo && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%] contrast-[1.1]"
                  poster={HERO.heroImage}
                >
                  <source src={HERO.heroVideo} type="video/mp4" />
                </video>
              )}

              {/* Image fallback (only if no video) */}
              {!HERO.heroVideo && (
                <Image
                  src={HERO.heroImage}
                  alt="Adam Harrington - NBA Shooting Coach"
                  fill
                  className="object-cover object-center grayscale-[30%] contrast-[1.1]"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-60" />

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent-primary/60" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent-primary/60" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent-primary/60" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent-primary/60" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <Link
          href="#origin"
          className="flex flex-col items-center gap-2 text-text-muted hover:text-accent-primary transition-colors"
        >
          <span className="text-[10px] tracking-[3px] uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  );
}
