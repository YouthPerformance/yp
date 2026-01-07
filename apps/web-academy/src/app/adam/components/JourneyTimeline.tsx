"use client";

import { motion } from "framer-motion";
import { JOURNEY } from "../constants";

export function JourneyTimeline() {
  return (
    <section
      id="journey"
      className="py-24 px-[60px] bg-[var(--bg-primary)]"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-16">
        {/* Left Column - Sticky */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-4">
              {JOURNEY.label}
            </p>
            <h2 className="font-bebas text-[var(--text-primary)] text-[38px] leading-[1.2] mb-6">
              {JOURNEY.title}
              <br />
              <span className="text-[var(--accent-primary)]">{JOURNEY.titleAccent}</span>
            </h2>
            <p className="text-[17px] leading-[1.8] text-[var(--text-secondary)] max-w-[320px]">
              {JOURNEY.description}
            </p>

            {/* Photo placeholder */}
            <div className="mt-8 aspect-[4/3] bg-[var(--bg-secondary)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--border-default)]">
              <p className="text-[var(--text-tertiary)] text-sm">Coaching Photo</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-0">
          {JOURNEY.timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-6 py-6 border-b border-[var(--border-default)]"
              style={{ gridTemplateColumns: "80px 1fr" }}
            >
              {/* Year */}
              <p
                className={`font-bebas text-[18px] ${
                  item.type === "milestone" ? "text-[var(--accent-primary)] font-semibold" : "text-[var(--text-primary)]"
                }`}
              >
                {item.year}
              </p>

              {/* Event */}
              <p
                className={`text-[15px] leading-[1.6] text-[var(--text-secondary)] pl-5 border-l-[3px] ${
                  item.type === "milestone"
                    ? "border-[var(--accent-primary)]"
                    : item.type === "coaching"
                    ? "border-[var(--accent-gold)]"
                    : item.type === "venture"
                    ? "border-[#39FF14]"
                    : "border-[var(--border-default)]"
                }`}
              >
                {item.event}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
