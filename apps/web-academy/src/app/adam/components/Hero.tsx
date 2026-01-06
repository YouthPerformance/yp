"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const scrollToContent = () => {
    const element = document.getElementById("philosophy");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black z-10" />
        {/* Placeholder gradient until video is added */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
        {/* Uncomment when video is ready:
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale"
          poster="/images/adam/hero-poster.jpg"
        >
          <source src="/videos/adam-hero.mp4" type="video/mp4" />
        </video>
        */}
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-6"
        >
          Youth Performance Presents
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-bebas text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tight text-white"
        >
          THE
          <br />
          <span className="text-[#c9a962]">ARCHITECT</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed"
        >
          From the hardwood to the front office.
          <br />
          <span className="text-white">Building people, not just players.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={scrollToContent}
          className="mt-12 group flex items-center gap-2 px-8 py-3 border border-zinc-700 rounded-full text-sm tracking-wider uppercase text-zinc-300 hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
        >
          Explore the Resume
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border border-zinc-700 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-zinc-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
