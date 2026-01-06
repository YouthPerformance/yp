"use client";

import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

export function Family() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
              {/* Placeholder for family photo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-16 h-16 text-[#c9a962]/30 mx-auto mb-4" />
                  <p className="text-zinc-600 text-sm">Family Photo</p>
                  <p className="text-zinc-700 text-xs mt-1">Coming Soon</p>
                </div>
              </div>
              {/* Uncomment when image is ready:
              <Image
                src="/images/adam/family.jpg"
                alt="Adam Harrington with family"
                fill
                className="object-cover"
              />
              */}
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#c9a962]/20 rounded-xl -z-10" />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-[#c9a962] font-mono text-xs tracking-[0.4em] uppercase mb-4">
              The Man
            </p>

            <h2 className="font-bebas text-4xl md:text-5xl text-white mb-8">
              BEYOND THE COURT
            </h2>

            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                Before I am a coach, I am a husband and a father.
              </p>
              <p>
                Kearstin and I are raising four kids who remind me every day why
                this work matters. Every rep, every correction, every blueprint—
                it's all about giving the next generation what we didn't have.
              </p>
              <p className="text-white">
                The JEHH Memorial Fund. Intentional360. Youth Performance.
                Everything I build is designed to leave the game—and the world—
                better than I found it.
              </p>
            </div>

            {/* Foundation link */}
            <motion.a
              href="https://intentional360.org"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-300 hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              Intentional360 Foundation
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
