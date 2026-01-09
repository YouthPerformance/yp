"use client";

import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import { CREDENTIALS, RECEIPTS, TESTIMONIALS } from "../constants";

export function Receipts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get featured quotes for highlight
  const featuredQuotes = TESTIMONIALS.filter((t) => t.featured);
  const otherQuotes = TESTIMONIALS.filter((t) => !t.featured);

  return (
    <section
      ref={sectionRef}
      id="receipts"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-elevated/20 via-bg-secondary to-bg-secondary" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
            Social Proof
          </span>
          <h2
            className="font-bebas text-text-primary mt-4 leading-[0.95]"
            style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
          >
            {RECEIPTS.headline.split(" ").map((word, i) => (
              <span key={i}>
                {word === "RECEIPTS" ? (
                  <span className="text-accent-primary">{word}</span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </h2>
          <p className="text-text-tertiary mt-4 text-lg">{RECEIPTS.subheadline}</p>
        </motion.div>

        {/* Credentials bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-20"
        >
          {CREDENTIALS.map((cred, i) => (
            <div
              key={i}
              className="px-6 py-3 border border-border-default hover:border-accent-primary/30 transition-colors bg-text-primary/[0.02]"
            >
              <p className="font-bebas text-lg lg:text-xl text-text-primary">{cred.org}</p>
              <p className="text-[10px] tracking-[2px] text-accent-primary/60 uppercase">
                {cred.years}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Featured quotes (large) */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredQuotes.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="relative p-8 lg:p-10 border border-accent-primary/20 bg-gradient-to-br from-accent-primary/5 to-transparent"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-accent-primary/30 mb-4" />

              {/* Quote text */}
              <blockquote className="font-bebas text-2xl lg:text-3xl text-text-primary leading-tight mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="font-bebas text-accent-primary text-lg">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-text-primary">{testimonial.author}</p>
                  <p className="text-sm text-text-tertiary">{testimonial.title}</p>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent-primary/30" />
            </motion.div>
          ))}
        </div>

        {/* Other testimonials (smaller, scrolling) */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {otherQuotes.map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[350px] p-6 border border-border-default hover:border-accent-primary/20 transition-colors bg-text-primary/[0.02]"
              >
                <Quote className="w-5 h-5 text-text-muted mb-3" />
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-text-primary/5 flex items-center justify-center">
                    <span className="text-xs text-text-secondary">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{testimonial.author}</p>
                    <p className="text-xs text-text-tertiary">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-bg-secondary to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-bg-secondary to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
