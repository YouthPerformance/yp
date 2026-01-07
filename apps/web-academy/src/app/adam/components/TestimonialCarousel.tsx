"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "../constants";

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-[60px] bg-[var(--bg-primary)] relative">
      {/* Large quote mark background */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 text-[180px] text-[var(--accent-primary)] opacity-10 leading-none pointer-events-none select-none font-bebas"
      >
        &ldquo;
      </div>

      <div className="max-w-[900px] mx-auto">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase text-center mb-12"
        >
          What They Say
        </motion.p>

        {/* Testimonial Container */}
        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center px-10"
            >
              {/* Quote */}
              <p className="text-[22px] italic leading-[1.6] text-[var(--text-primary)] mb-10">
                &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                {/* Avatar with initials */}
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--accent-primary)] flex items-center justify-center glow">
                  <span className="font-bebas text-[14px] text-[var(--accent-primary)]">
                    {TESTIMONIALS[activeIndex].author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[14px] tracking-wide text-[var(--text-primary)] font-medium">
                    {TESTIMONIALS[activeIndex].author}
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    {TESTIMONIALS[activeIndex].title}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex gap-2.5 justify-center mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-[var(--accent-primary)]"
                  : "w-2 bg-[var(--accent-primary)] opacity-30 hover:opacity-50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
