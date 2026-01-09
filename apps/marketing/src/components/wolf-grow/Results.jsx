// Results - The Comparison Slider
// E14-6: Before/after drag slider with heavy physics

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "./motion";

export function Results() {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0.5); // 0 to 1, starts at middle

  // Calculate label opacities based on slider position
  const leftOpacity = useTransform(x, [0, 0.5, 1], [1, 0.3, 0.1]);
  const rightOpacity = useTransform(x, [0, 0.5, 1], [0.1, 0.3, 1]);
  const clipPath = useTransform(x, (val) => `inset(0 ${(1 - val) * 100}% 0 0)`);

  const handleDrag = (_e, info) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(1, (info.point.x - rect.left) / rect.width));

    // Add resistance - makes it feel "heavy"
    const dampened = x.get() + (newX - x.get()) * 0.3;
    x.set(dampened);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to nearest third with spring
    const current = x.get();
    const snapPoints = [0.25, 0.5, 0.75];
    const nearest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev,
    );
    animate(x, nearest, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <section className="relative py-32 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bebas tracking-[-0.02em] text-white mb-4">
            DON'T GUESS. <span className="text-cyan-400">MEASURE.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Most training is invisible. Ours is undeniable.
          </p>
        </motion.div>

        {/* Comparison Slider */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none"
          onPointerDown={() => setIsDragging(true)}
          onPointerMove={isDragging ? handleDrag : undefined}
          onPointerUp={handleDragEnd}
          onPointerLeave={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          {/* Day 30 (Right) - Background layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-green-900/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl md:text-8xl mb-2 md:mb-4 block">🦶</span>
                <p className="text-2xl md:text-3xl font-bebas text-cyan-400">IRON ANKLES</p>
                <p className="text-gray-400 text-xs md:text-sm">Stuck landing. Zero wobble.</p>
              </div>
            </div>
          </div>

          {/* Day 1 (Left) - Clipped foreground layer */}
          <motion.div
            style={{ clipPath }}
            className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-orange-900/40"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl md:text-8xl mb-2 md:mb-4 block opacity-50">🦶</span>
                <p className="text-2xl md:text-3xl font-bebas text-red-400">FORCE LEAKER</p>
                <p className="text-gray-400 text-xs md:text-sm">Wobbly landing. Energy lost.</p>
              </div>
            </div>
          </motion.div>

          {/* Slider handle */}
          <motion.div
            style={{ left: useTransform(x, (val) => `${val * 100}%`) }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          >
            {/* Handle grip - larger on mobile for touch */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center touch-manipulation">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-gray-400 rounded" />
                <div className="w-0.5 h-4 bg-gray-400 rounded" />
                <div className="w-0.5 h-4 bg-gray-400 rounded" />
              </div>
            </div>
          </motion.div>

          {/* Labels */}
          <motion.div
            style={{ opacity: leftOpacity }}
            className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full"
          >
            <span className="text-red-400 font-bebas text-lg">DAY 1</span>
          </motion.div>

          <motion.div
            style={{ opacity: rightOpacity }}
            className="absolute top-4 right-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full"
          >
            <span className="text-cyan-400 font-bebas text-lg">DAY 30</span>
          </motion.div>
        </motion.div>

        {/* Testimonial */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="mt-10 md:mt-16 text-center px-4"
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white italic max-w-3xl mx-auto leading-relaxed">
            "I used to hold my breath every time she jumped. Now, she lands like a cat.
            <span className="text-cyan-400"> YP gave us our confidence back.</span>"
          </p>
          <cite className="block mt-4 text-gray-400 not-italic text-sm md:text-base">
            — Sarah J., Basketball Mom
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}

export default Results;
