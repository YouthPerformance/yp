"use client";

import { motion } from "framer-motion";
import { CLIENTS } from "../constants";

function MarqueeRow({
  items,
  direction = "left",
  speed = 30,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-4 group">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ willChange: "transform" }}
      >
        {duplicatedItems.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex-shrink-0 px-8 md:px-12"
          >
            <span className="font-bebas text-3xl md:text-5xl lg:text-6xl text-zinc-700 hover:text-white transition-colors duration-300 cursor-default">
              {name}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
}

export function Giants() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-16 px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-4"
        >
          The Wall of Giants
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-bebas text-4xl md:text-5xl text-white"
        >
          TRAINED BY <span className="text-[#c9a962]">THE ARCHITECT</span>
        </motion.h2>
      </div>

      {/* Marquee rows */}
      <div className="space-y-2">
        <MarqueeRow items={CLIENTS.nba} direction="left" speed={40} />
        <MarqueeRow items={CLIENTS.wnba} direction="right" speed={35} />
        <MarqueeRow items={[...CLIENTS.legends, ...CLIENTS.nba.slice(0, 4)]} direction="left" speed={45} />
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center gap-16 mt-16 px-6"
      >
        <div className="text-center">
          <p className="font-bebas text-5xl text-white">20+</p>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">Years Experience</p>
        </div>
        <div className="text-center">
          <p className="font-bebas text-5xl text-white">50+</p>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">NBA/WNBA Athletes</p>
        </div>
        <div className="text-center">
          <p className="font-bebas text-5xl text-white">3</p>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">MVP Seasons</p>
        </div>
      </motion.div>
    </section>
  );
}
