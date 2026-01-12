"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { JOURNEY } from "../constants";

export function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-24 lg:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-elevated/20 via-bg-secondary to-bg-secondary" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 lg:gap-16">
          {/* Left Column - Sticky Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Section label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-accent-primary" />
                <span className="text-[11px] tracking-[4px] text-accent-primary uppercase">
                  {JOURNEY.label}
                </span>
              </div>

              <h2
                className="font-bebas text-text-primary leading-[0.95] mb-6"
                style={{ fontSize: "clamp(40px, 5vw, 56px)" }}
              >
                {JOURNEY.title}
                <br />
                <span className="text-accent-primary">{JOURNEY.titleAccent}</span>
              </h2>

              <p className="text-lg text-text-secondary leading-relaxed max-w-[320px]">
                {JOURNEY.description}
              </p>
            </motion.div>
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-0">
            {JOURNEY.timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="grid gap-6 py-5 border-b border-border-default group hover:bg-text-primary/[0.02] transition-colors"
                style={{ gridTemplateColumns: "90px 1fr" }}
              >
                {/* Year */}
                <p
                  className={`font-bebas text-xl ${
                    item.type === "milestone"
                      ? "text-accent-primary"
                      : "text-text-primary"
                  }`}
                >
                  {item.year}
                </p>

                {/* Event */}
                <p
                  className={`text-base leading-relaxed text-text-secondary pl-5 border-l-2 transition-colors ${
                    item.type === "milestone"
                      ? "border-accent-primary"
                      : item.type === "coaching"
                        ? "border-yellow-500"
                        : item.type === "venture"
                          ? "border-green-500"
                          : "border-border-default group-hover:border-accent-primary/30"
                  }`}
                >
                  {item.event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
