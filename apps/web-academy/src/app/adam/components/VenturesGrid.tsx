"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { VENTURES } from "../constants";

export function VenturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="ventures"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
            Current Ventures
          </span>
          <h2
            className="font-bebas text-text-primary mt-4 leading-[0.95]"
            style={{ fontSize: "clamp(40px, 5vw, 56px)" }}
          >
            Where I&apos;m <span className="text-accent-primary">Building</span>
          </h2>
        </motion.div>

        {/* Ventures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {VENTURES.map((venture, i) => (
            <motion.div
              key={venture.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="group p-6 border border-border-default bg-text-primary/[0.02] hover:border-accent-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-bebas text-xl text-text-primary mb-1">
                {venture.title}
              </h3>
              <p className="text-[11px] tracking-[2px] text-accent-primary uppercase mb-3">
                {venture.subtitle}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {venture.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
