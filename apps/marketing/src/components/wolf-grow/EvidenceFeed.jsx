/**
 * EvidenceFeed - "The Proof" Testimonials
 *
 * Military/High-Tech "Incoming Transmission" style
 * Two-row infinite marquee with video thumbnail cards
 * PARENT (green) vs ATHLETE (cyan) badges
 */

import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Testimonial data
const PARENT_TESTIMONIALS = [
  {
    quote: "Worth every penny. The doctor bills stopped after week 3.",
    name: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "His confidence is back. He isn't scared to sprint anymore.",
    name: "David M.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "Finally, a program that actually explains the 'why' to parents.",
    name: "Michelle R.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "We tried 3 other programs. This is the only one that stuck.",
    name: "James K.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "The 8-minute sessions fit our crazy schedule perfectly.",
    name: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=600&fit=crop",
  },
];

const ATHLETE_TESTIMONIALS = [
  {
    quote: "Added 4 inches to my vert. The Wolf Protocol is a cheat code.",
    name: "Marcus T. (14)",
    image: "https://images.unsplash.com/photo-1519766304800-c9519df914ce?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "My heels stopped hurting in 3 days. Level 12 Hunter now.",
    name: "Jake S. (12)",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "I can actually feel my feet now. Cuts are way sharper.",
    name: "Aiden P. (15)",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "Coach noticed the difference in my first step. No cap.",
    name: "Tyler W. (13)",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=600&fit=crop",
  },
  {
    quote: "The ankle exercises are fire. Never rolling my ankle again.",
    name: "Jordan M. (11)",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&h=600&fit=crop",
  },
];

// Single testimonial card
function TestimonialCard({ testimonial, type }) {
  const isAthlete = type === "athlete";

  return (
    <article className="group relative shrink-0 w-[240px] h-[380px] rounded-lg overflow-hidden border border-white/10 hover:border-cyan-500 transition-all duration-300 cursor-pointer">
      {/* Background Image */}
      <img
        src={testimonial.image}
        alt={`${type} testimonial`}
        className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-105 group-hover:brightness-[0.8] transition-all duration-500"
        loading="lazy"
      />

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center backdrop-blur-md">
          <svg className="w-5 h-5 text-cyan-400 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
        {/* Badge */}
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold w-fit mb-2 backdrop-blur-md ${
            isAthlete
              ? "bg-cyan-900/80 text-cyan-400 border border-cyan-500/30"
              : "bg-emerald-900/80 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {isAthlete ? "ATHLETE" : "PARENT"}
        </span>

        {/* Quote */}
        <p className="text-white font-medium text-sm leading-snug mb-2">"{testimonial.quote}"</p>

        {/* Name */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">{testimonial.name}</span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_30px_rgba(0,255,255,0.1)]" />
    </article>
  );
}

// Marquee row component
function MarqueeRow({ testimonials, type, direction = "left", speed = 60 }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div
      className="relative py-4 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={containerRef}
        className="flex gap-4"
        animate={{
          x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
            type={type}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function EvidenceFeed() {
  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
                Incoming Transmission
              </p>
            </div>

            {/* Title */}
            <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl tracking-wide text-white">
              THE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                PROOF
              </span>
            </h2>
          </div>

          {/* Status panel */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-neutral-500 font-mono text-[10px]">
            <span>STATUS: VERIFIED</span>
            <span>SOURCE: GLOBAL NODE</span>
            <div className="w-24 h-[1px] bg-gradient-to-l from-cyan-500 to-transparent" />
          </div>
        </div>

        {/* Testimonial Feed */}
        <div className="relative rounded-xl border-y border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-20" />

          {/* Row 1: Parents - Left to Right */}
          <MarqueeRow
            testimonials={PARENT_TESTIMONIALS}
            type="parent"
            direction="right"
            speed={50}
          />

          {/* Row 2: Athletes - Right to Left */}
          <MarqueeRow
            testimonials={ATHLETE_TESTIMONIALS}
            type="athlete"
            direction="left"
            speed={45}
          />
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="font-bebas text-3xl md:text-4xl text-cyan-400">2,847+</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Active Wolves</p>
          </div>
          <div>
            <p className="font-bebas text-3xl md:text-4xl text-cyan-400">94%</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Report Results</p>
          </div>
          <div>
            <p className="font-bebas text-3xl md:text-4xl text-cyan-400">12</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Countries</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
