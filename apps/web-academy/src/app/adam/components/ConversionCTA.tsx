"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CONVERSION, FINAL_CTA } from "../constants";

export function ConversionCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="conversion"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background gradient and glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/40 via-bg-secondary to-bg-secondary" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-primary/10 rounded-full blur-[150px] opacity-30" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 246, 224, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 246, 224, 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-bebas text-text-primary leading-[0.95]"
            style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
          >
            {CONVERSION.headline.split(" ").map((word, i) => (
              <span key={i}>
                {word === "BLUEPRINT" || word === "WAITING." ? (
                  <span className="text-accent-primary">{word} </span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-text-secondary mt-6"
          >
            {CONVERSION.subheadline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            {/* Primary CTA */}
            <Link
              href={CONVERSION.primaryCTA.href}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-accent-primary text-bg-secondary font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-glow-cyan-strong hover:-translate-y-1"
            >
              {CONVERSION.primaryCTA.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              {/* Animated border */}
              <span className="absolute inset-0 border-2 border-accent-primary opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href={CONVERSION.secondaryCTA.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-5 border border-border-default text-text-primary font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:border-accent-primary/50 hover:text-accent-primary"
            >
              {CONVERSION.secondaryCTA.label}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-border-subtle"
          >
            <div className="text-center">
              <p className="font-bebas text-2xl text-accent-primary">50+</p>
              <p className="text-[10px] tracking-[2px] text-text-tertiary uppercase">
                Pro Athletes
              </p>
            </div>
            <div className="w-[1px] h-8 bg-border-subtle" />
            <div className="text-center">
              <p className="font-bebas text-2xl text-accent-primary">20+</p>
              <p className="text-[10px] tracking-[2px] text-text-tertiary uppercase">
                Years Experience
              </p>
            </div>
            <div className="w-[1px] h-8 bg-border-subtle" />
            <div className="text-center">
              <p className="font-bebas text-2xl text-accent-primary">6</p>
              <p className="text-[10px] tracking-[2px] text-text-tertiary uppercase">
                NBA Organizations
              </p>
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            <Link
              href={FINAL_CTA.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors text-sm uppercase tracking-wider"
            >
              Instagram
            </Link>
            <span className="text-border-subtle">|</span>
            <Link
              href={FINAL_CTA.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors text-sm uppercase tracking-wider"
            >
              Twitter
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-accent-primary/10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-accent-primary/10" />
    </section>
  );
}
