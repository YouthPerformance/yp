"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PHILOSOPHY } from "../constants";

export function Philosophy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative min-h-screen bg-black py-32 overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26, 74, 110, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 74, 110, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D Ball Placeholder */}
          <motion.div style={{ y }} className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#1a4a6e]/20 rounded-full blur-3xl" />

              {/* Ball placeholder - replace with 3D component */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-800 shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-bebas text-4xl text-[#c9a962]">NEOBALL</p>
                    <p className="text-xs text-zinc-500 tracking-widest mt-1">FOUNDERS EDITION</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Philosophy Text */}
          <motion.div style={{ opacity }}>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-4"
            >
              The Philosophy
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-bebas text-5xl md:text-6xl text-white mb-8"
            >
              {PHILOSOPHY.headline}
            </motion.h2>

            <div className="space-y-6">
              {PHILOSOPHY.paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg text-zinc-400 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}

              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-xl text-[#c9a962] italic mt-8 font-light"
              >
                "{PHILOSOPHY.tagline}"
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
