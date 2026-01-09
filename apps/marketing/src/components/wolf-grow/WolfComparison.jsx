/**
 * WolfComparison - "The Death of the Private Coach"
 *
 * Interactive comparison table with visual assault design
 * Traditional Coach (dimmed, strikethrough) vs Wolf AI (glowing, highlighted)
 */

import { motion } from "framer-motion";
import { useState } from "react";

const COMPARISON_DATA = [
  {
    label: "Cost",
    traditional: { value: "$600 / Month", subtext: "(1x/week)", strike: true },
    wolf: { value: "$29 / Month", subtext: "(Daily Access)", highlight: true },
  },
  {
    label: "Availability",
    traditional: { value: "1 Hour / Week", subtext: "Schedule conflicts", strike: false },
    wolf: { value: "24/7 / 365", subtext: "Always ready", highlight: true },
  },
  {
    label: "Adaptability",
    traditional: { value: "Generic Plan", subtext: '"One size fits all"', strike: false },
    wolf: { value: "Real-Time Biometrics", subtext: "Adapts to your athlete", highlight: true },
  },
  {
    label: "Community",
    traditional: { value: "Local Kids", subtext: "Limited network", strike: false },
    wolf: { value: "Global Elite Network", subtext: "2,800+ wolves worldwide", highlight: true },
  },
  {
    label: "Safety",
    traditional: { value: '"Push Through Pain"', subtext: "Old-school mentality", strike: false },
    wolf: { value: "Pain-Aware AI", subtext: "Injury prevention built-in", highlight: true },
  },
];

function TraditionalCell({ data, isHovered }) {
  return (
    <div className="relative p-4 md:p-6 text-center">
      {/* Red X on hover */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className="w-16 h-16 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.div>

      <p
        className={`text-neutral-500 text-sm md:text-base ${data.strike ? "line-through decoration-red-500/50" : ""}`}
      >
        {data.value}
      </p>
      {data.subtext && <p className="text-neutral-600 text-xs mt-1">{data.subtext}</p>}
    </div>
  );
}

function WolfCell({ data }) {
  return (
    <div className="p-4 md:p-6 text-center">
      <p
        className={`text-white font-semibold text-sm md:text-base ${data.highlight ? "text-cyan-300" : ""}`}
      >
        {data.value}
      </p>
      {data.subtext && <p className="text-cyan-400/70 text-xs mt-1">{data.subtext}</p>}
    </div>
  );
}

export default function WolfComparison() {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <section className="relative py-20 md:py-32 bg-[#050505]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-red-400/70 uppercase tracking-widest mb-2">
            The Reckoning
          </p>
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white uppercase">
            The Death of the Private Coach
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mt-4 text-neutral-400">
            Stop paying $150/hour for someone to count reps.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden border border-neutral-800">
              {/* Header Row */}
              <div className="bg-neutral-900/50 p-4 md:p-6" />

              {/* Traditional Coach Header */}
              <div className="bg-neutral-900/30 p-4 md:p-6 text-center opacity-50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🐢</span>
                  <h3 className="font-bebas text-xl md:text-2xl text-neutral-400 uppercase tracking-wide">
                    Traditional Coach
                  </h3>
                </div>
                <p className="text-neutral-600 text-xs">The old way</p>
              </div>

              {/* Wolf AI Header - Highlighted */}
              <div className="relative bg-[#0a1a1a] p-4 md:p-6 text-center border-2 border-cyan-500/50 rounded-tr-2xl shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                {/* Best Value Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Best Value
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2 mt-2">
                  <span className="text-2xl">🐺</span>
                  <h3 className="font-bebas text-xl md:text-2xl text-white uppercase tracking-wide">
                    The Wolf AI
                  </h3>
                </div>
                <p className="text-cyan-400/70 text-xs">The future is here</p>
              </div>

              {/* Data Rows */}
              {COMPARISON_DATA.map((row, index) => (
                <div
                  key={row.label}
                  className="contents"
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Label */}
                  <div className="bg-neutral-900/50 p-4 md:p-6 flex items-center">
                    <span className="text-neutral-300 font-medium text-sm md:text-base">
                      {row.label}
                    </span>
                  </div>

                  {/* Traditional */}
                  <div
                    className={`bg-neutral-900/30 opacity-50 transition-all duration-300 ${hoveredRow === index ? "bg-red-900/10" : ""}`}
                  >
                    <TraditionalCell data={row.traditional} isHovered={hoveredRow === index} />
                  </div>

                  {/* Wolf - Highlighted column */}
                  <div
                    className={`bg-[#0a1a1a] border-x-2 border-cyan-500/50 ${index === COMPARISON_DATA.length - 1 ? "border-b-2 rounded-br-2xl" : ""}`}
                  >
                    <WolfCell data={row.wolf} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards - Stacked */}
          <div className="md:hidden space-y-4">
            {/* Wolf Card - Featured */}
            <motion.div
              className="relative bg-[#0a1a1a] rounded-2xl border-2 border-cyan-500/50 p-6 shadow-[0_0_40px_rgba(0,255,255,0.15)]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Best Value
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <span className="text-3xl">🐺</span>
                <div>
                  <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
                    The Wolf AI
                  </h3>
                  <p className="text-cyan-400/70 text-xs">The future is here</p>
                </div>
              </div>

              <div className="space-y-4">
                {COMPARISON_DATA.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2 border-b border-cyan-500/20 last:border-0"
                  >
                    <span className="text-neutral-400 text-sm">{row.label}</span>
                    <div className="text-right">
                      <p className="text-cyan-300 font-semibold text-sm">{row.wolf.value}</p>
                      {row.wolf.subtext && (
                        <p className="text-cyan-400/50 text-xs">{row.wolf.subtext}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Traditional Card - Dimmed */}
            <motion.div
              className="bg-neutral-900/30 rounded-2xl border border-neutral-800 p-6 opacity-50"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 0.5, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🐢</span>
                <div>
                  <h3 className="font-bebas text-2xl text-neutral-400 uppercase tracking-wide">
                    Traditional Coach
                  </h3>
                  <p className="text-neutral-600 text-xs">The old way</p>
                </div>
              </div>

              <div className="space-y-4">
                {COMPARISON_DATA.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2 border-b border-neutral-800 last:border-0"
                  >
                    <span className="text-neutral-500 text-sm">{row.label}</span>
                    <div className="text-right">
                      <p
                        className={`text-neutral-500 text-sm ${row.traditional.strike ? "line-through decoration-red-500/50" : ""}`}
                      >
                        {row.traditional.value}
                      </p>
                      {row.traditional.subtext && (
                        <p className="text-neutral-600 text-xs">{row.traditional.subtext}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-500 text-sm italic mb-6">
            "The math doesn't lie. The results speak for themselves."
          </p>
          <a
            href="#join"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]"
          >
            Join the Pack
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
