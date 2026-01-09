"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DUAL_TRACK } from "../constants";

// CEO Fix: Typography-forward, no stock icons
const labelMap = {
  parent: "01",
  athlete: "02",
};

export function DualTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="dual-track"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 246, 224, 0.5) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
            Two Paths, One System
          </span>
          <h2
            className="font-bebas text-text-primary mt-4 leading-[0.95]"
            style={{ fontSize: "clamp(40px, 5vw, 60px)" }}
          >
            WHO IS THIS <span className="text-accent-primary">FOR?</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {DUAL_TRACK.map((card, i) => {
            const numberLabel = labelMap[card.id];
            const isParent = card.id === "parent";

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className={`group relative p-8 lg:p-10 border transition-all duration-500 hover:-translate-y-2 ${
                  isParent
                    ? "border-border-default hover:border-accent-primary/40 bg-gradient-to-br from-bg-elevated/50 to-transparent"
                    : "border-accent-primary/20 hover:border-accent-primary/60 bg-gradient-to-br from-accent-primary/5 to-transparent"
                }`}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isParent ? "bg-text-primary/[0.02]" : "bg-accent-primary/[0.03]"
                  }`}
                />

                {/* Corner accents */}
                <div
                  className={`absolute top-0 left-0 w-6 h-6 border-t border-l transition-colors ${
                    isParent
                      ? "border-border-default group-hover:border-accent-primary/50"
                      : "border-accent-primary/30 group-hover:border-accent-primary"
                  }`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r transition-colors ${
                    isParent
                      ? "border-border-default group-hover:border-accent-primary/50"
                      : "border-accent-primary/30 group-hover:border-accent-primary"
                  }`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Typography Number (CEO: no stock icons) */}
                  <div className="flex items-baseline gap-4 mb-6">
                    <span
                      className={`font-bebas text-6xl lg:text-7xl leading-none transition-colors ${
                        isParent
                          ? "text-text-primary/10 group-hover:text-accent-primary/30"
                          : "text-accent-primary/20 group-hover:text-accent-primary/40"
                      }`}
                    >
                      {numberLabel}
                    </span>
                    <span
                      className={`text-[10px] tracking-[3px] uppercase ${
                        isParent ? "text-text-tertiary" : "text-accent-primary/60"
                      }`}
                    >
                      For the {isParent ? "Parent" : "Athlete"}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    className={`font-bebas text-3xl lg:text-4xl mt-2 mb-4 ${
                      isParent ? "text-text-primary" : "text-accent-primary"
                    }`}
                  >
                    {card.headline}
                  </h3>

                  {/* Copy */}
                  <p className="text-text-secondary leading-relaxed">{card.copy}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
