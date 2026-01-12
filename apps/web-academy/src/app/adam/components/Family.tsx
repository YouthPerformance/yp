"use client";

import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import { useRef } from "react";
import { FAMILY } from "../constants";

export function Family() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-24 bg-bg-elevated border-y border-border-default overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/[0.02] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto px-6 lg:px-12 text-center"
      >
        <div className="max-w-2xl mx-auto">
          {/* Section Label */}
          <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
            {FAMILY.label}
          </span>

          {/* Heart Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 rounded-full border border-accent-primary/30 mx-auto my-6 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-accent-primary/60" />
          </motion.div>

          {/* Family Text */}
          <p className="text-lg lg:text-xl leading-relaxed text-text-secondary">
            {FAMILY.text}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
