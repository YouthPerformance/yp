"use client";

import { motion } from "framer-motion";
import { VENTURES } from "../constants";

export function VenturesGrid() {
  return (
    <section className="py-24 px-[60px] bg-[var(--bg-primary)]">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-4">
            Current Ventures
          </p>
          <h2 className="font-bebas text-[var(--text-primary)] text-[38px]">
            Where I&apos;m Building
          </h2>
        </motion.div>

        {/* Ventures Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENTURES.map((venture, i) => (
            <motion.div
              key={venture.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="card hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3 className="font-bebas text-[20px] text-[var(--text-primary)] mb-1.5">
                {venture.title}
              </h3>
              <p className="text-[11px] tracking-[1px] text-[var(--accent-primary)] uppercase mb-3.5">
                {venture.subtitle}
              </p>
              <p className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                {venture.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
