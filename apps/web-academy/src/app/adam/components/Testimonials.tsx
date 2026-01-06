"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { TESTIMONIALS } from "../constants";
import { Quote } from "lucide-react";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1a4a6e]/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#1a4a6e] font-mono text-xs tracking-[0.4em] uppercase mb-4"
          >
            The Deep Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-bebas text-4xl md:text-5xl text-white"
          >
            WHAT THEY SAY
          </motion.h2>
        </div>

        {/* Testimonial cards - stacked */}
        <div className="relative">
          {TESTIMONIALS.map((testimonial, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;

            return (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                onClick={() => setActiveIndex(index)}
                className="cursor-pointer"
                style={{
                  position: index === 0 ? "relative" : "absolute",
                  top: index === 0 ? 0 : `${index * 20}px`,
                  left: 0,
                  right: 0,
                  zIndex: TESTIMONIALS.length - index,
                  transform: `translateY(${offset * 10}px) scale(${1 - Math.abs(offset) * 0.02})`,
                  opacity: isActive ? 1 : 0.7,
                  transition: "all 0.4s ease",
                }}
              >
                <div
                  className={`
                    relative p-8 md:p-12 rounded-2xl border transition-all duration-300
                    ${isActive
                      ? "bg-zinc-900/80 border-[#c9a962]/30"
                      : "bg-zinc-900/50 border-zinc-800"
                    }
                  `}
                >
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-[#c9a962]/30 mb-6" />

                  {/* Quote text */}
                  <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 font-light">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8b7355] flex items-center justify-center text-black font-bebas text-lg">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bebas text-xl text-white">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-zinc-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === activeIndex ? "bg-[#c9a962] w-6" : "bg-zinc-700"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
