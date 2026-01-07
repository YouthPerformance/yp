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
    <section className="py-24 px-[60px] bg-[#FAF8F5] relative">
      {/* Large quote mark background */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 text-[180px] text-[rgba(197,164,126,0.1)] leading-none pointer-events-none select-none"
        style={{ fontFamily: "var(--font-display), Georgia, serif" }}
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
          className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase text-center mb-12"
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
              <p
                className="text-[26px] italic leading-[1.6] text-[#1C2B3A] mb-10"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                {/* Avatar with initials */}
                <div className="w-12 h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center">
                  <span
                    className="text-[14px] text-[#1C2B3A]"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    {TESTIMONIALS[activeIndex].author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[14px] tracking-wide text-[#1C2B3A] font-medium">
                    {TESTIMONIALS[activeIndex].author}
                  </p>
                  <p className="text-[12px] text-[#6B7280]">
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
                  ? "w-8 bg-[#C5A47E]"
                  : "w-2 bg-[rgba(197,164,126,0.3)] hover:bg-[rgba(197,164,126,0.5)]"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
