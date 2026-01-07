"use client";

import { motion } from "framer-motion";
import { JOURNEY } from "../constants";

export function JourneyTimeline() {
  return (
    <section
      id="journey"
      className="py-24 px-[60px] bg-[#FAF8F5]"
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
            <p className="text-[11px] tracking-[4px] text-[#C5A47E] uppercase mb-4">
              {JOURNEY.label}
            </p>
            <h2
              className="text-[#1C2B3A] text-[38px] leading-[1.2] mb-6"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 }}
            >
              {JOURNEY.title}
              <br />
              <span className="italic">{JOURNEY.titleAccent}</span>
            </h2>
            <p
              className="text-[17px] leading-[1.8] text-[#5A5A5A] max-w-[320px]"
              style={{ fontFamily: "var(--font-body), Georgia, serif" }}
            >
              {JOURNEY.description}
            </p>

            {/* Photo placeholder */}
            <div className="mt-8 aspect-[4/3] bg-[#E8E4DF] rounded-lg overflow-hidden flex items-center justify-center">
              <p className="text-[#6B7280] text-sm">Coaching Photo</p>
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
              className="grid gap-6 py-6 border-b border-[rgba(197,164,126,0.15)]"
              style={{ gridTemplateColumns: "80px 1fr" }}
            >
              {/* Year */}
              <p
                className={`text-[18px] ${
                  item.type === "milestone" ? "text-[#C5A47E] font-semibold" : "text-[#1C2B3A]"
                }`}
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {item.year}
              </p>

              {/* Event */}
              <p
                className={`text-[15px] leading-[1.6] text-[#5A5A5A] pl-5 border-l-[3px] ${
                  item.type === "milestone"
                    ? "border-[#C5A47E]"
                    : item.type === "coaching"
                    ? "border-[#1C2B3A]"
                    : item.type === "venture"
                    ? "border-[#D35400]"
                    : "border-[#E8E4DF]"
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
