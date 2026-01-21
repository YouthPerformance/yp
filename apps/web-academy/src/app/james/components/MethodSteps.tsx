"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════
// METHOD STEPS SECTION
// James's 4-step methodology
// ═══════════════════════════════════════════════════════════

const METHOD_STEPS = [
  {
    number: "01",
    title: "ASSESS",
    description:
      "I can tell an athlete's potential by looking at their feet.",
  },
  {
    number: "02",
    title: "REBUILD",
    description:
      "Break it down to build it up. Starting with the foundation.",
  },
  {
    number: "03",
    title: "INTEGRATE",
    description:
      "Train the feet until they're unconscious. Then your mind is free.",
  },
  {
    number: "04",
    title: "TRANSFER",
    description: "Every drill ties back to game performance.",
  },
];

export function MethodSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#FF4500]">
            The Method
          </span>
          <h2 className="mt-4 font-bebas text-5xl uppercase tracking-tight text-white md:text-7xl">
            The R3 Protocol
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/50">
            Release. Restore. Re-Engineer.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {METHOD_STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative border-l-2 border-white/10 py-4 pl-8 transition-colors hover:border-[#FF4500]/50"
            >
              {/* Step Number */}
              <span className="absolute -left-[1px] top-0 -translate-x-1/2 bg-[#0a0a0a] px-1 font-mono text-xs text-[#FF4500]">
                {step.number}
              </span>

              {/* Step Title */}
              <h3 className="mb-2 font-bebas text-2xl uppercase tracking-wide text-white group-hover:text-[#FF4500] transition-colors">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
