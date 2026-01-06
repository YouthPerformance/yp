"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { TIMELINE } from "../constants";
import { ChevronDown, Trophy, Briefcase, Rocket } from "lucide-react";

const TYPE_ICONS = {
  player: Trophy,
  coach: Briefcase,
  founder: Rocket,
};

export function Timeline() {
  const containerRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26, 74, 110, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 74, 110, 1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-4"
          >
            The Resume
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-bebas text-4xl md:text-5xl text-white"
          >
            THE JOURNEY
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2" />

          {/* Vertical line - animated progress */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-px bg-[#c9a962] -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          {/* Timeline items */}
          <div className="space-y-12">
            {TIMELINE.map((item, index) => {
              const Icon = TYPE_ICONS[item.type];
              const isExpanded = expandedIndex === index;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`
                    relative flex items-start gap-8
                    ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
                  `}
                >
                  {/* Year marker */}
                  <div
                    className={`
                      absolute left-8 md:left-1/2 -translate-x-1/2
                      w-4 h-4 rounded-full border-2 z-10
                      ${item.highlight
                        ? "bg-[#c9a962] border-[#c9a962]"
                        : "bg-black border-zinc-600"
                      }
                    `}
                  />

                  {/* Content card */}
                  <div
                    className={`
                      ml-16 md:ml-0 md:w-[calc(50%-2rem)]
                      ${isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}
                    `}
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className={`
                        w-full p-6 rounded-xl border text-left transition-all duration-300
                        ${item.highlight
                          ? "bg-zinc-900/80 border-[#c9a962]/30 hover:border-[#c9a962]/50"
                          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        }
                      `}
                    >
                      <div className={`flex items-start gap-4 ${isEven ? "md:flex-row-reverse" : ""}`}>
                        <div
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${item.highlight ? "bg-[#c9a962]/20" : "bg-zinc-800"}
                          `}
                        >
                          <Icon className={`w-5 h-5 ${item.highlight ? "text-[#c9a962]" : "text-zinc-500"}`} />
                        </div>

                        <div className="flex-1">
                          <div className={`flex items-center gap-2 ${isEven ? "md:justify-end" : ""}`}>
                            <span className="font-mono text-sm text-[#1a4a6e]">{item.year}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <h3 className="font-bebas text-2xl text-white mt-1">{item.title}</h3>
                          <p className="text-sm text-zinc-500">{item.subtitle}</p>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? "auto" : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className={`text-zinc-400 mt-4 pt-4 border-t border-zinc-800 ${isEven ? "md:text-right" : ""}`}>
                          {item.description}
                        </p>
                      </motion.div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
