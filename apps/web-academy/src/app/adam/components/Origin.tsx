"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ORIGIN } from "../constants";

export function Origin() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="origin"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-bg-elevated/30 to-bg-secondary" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-accent-primary" />
            <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
              The Origin
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bebas text-text-primary leading-[0.95] mb-12"
            style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
          >
            {ORIGIN.headline.split(" ").map((word, i) => (
              <span key={i}>
                {i === ORIGIN.headline.split(" ").length - 1 ? (
                  <span className="text-accent-primary">{word}</span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </motion.h2>

          {/* Story paragraphs */}
          <div className="space-y-8">
            {ORIGIN.paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="text-lg lg:text-xl text-text-secondary leading-relaxed"
              >
                {/* Highlight key phrases */}
                {paragraph.split("**").map((part, j) =>
                  j % 2 === 1 ? (
                    <span key={j} className="text-accent-primary font-medium">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </motion.p>
            ))}
          </div>

          {/* Decorative quote mark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.05 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-10 -left-10 font-bebas text-[300px] text-text-primary pointer-events-none select-none hidden lg:block"
          >
            "
          </motion.div>

          {/* Timeline marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent-primary rounded-full" />
              <span className="font-bebas text-3xl text-text-primary">2010</span>
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-accent-primary/50 to-transparent" />
            <span className="text-sm text-text-tertiary uppercase tracking-wider">
              The Turning Point
            </span>
          </motion.div>
        </div>
      </div>

      {/* Side accent lines */}
      <div className="absolute left-0 top-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-accent-primary/30 to-transparent" />
      <div className="absolute right-0 bottom-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-accent-primary/30 to-transparent" />
    </section>
  );
}
