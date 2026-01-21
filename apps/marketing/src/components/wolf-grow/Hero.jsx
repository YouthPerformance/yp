// Hero - The Initiation
// E14-2: Cinematic hero with clip-path text reveal + 3D Obsidian Wolf
// Optimized: Delayed load, timeout fallback, reduced motion support

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { clipReveal, fadeUp, scaleUp, staggerContainer } from "./motion";

// Spline URL - centralized for easy updates (original wolf with built-in cyan eyes)
const SPLINE_URL = "https://my.spline.design/untitled-4UQX0QNH8WggRoUO03X7u6CL/";
const LOAD_TIMEOUT_MS = 10000; // 10s timeout before showing fallback
const INITIAL_DELAY_MS = 150; // Let text paint first

export function Hero() {
  const navigate = useNavigate();
  const [wolfLoaded, setWolfLoaded] = useState(false);
  const [shouldLoadWolf, setShouldLoadWolf] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Delayed load - let critical content paint first
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadWolf(true);
    }, INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Timeout fallback - if Spline doesn't load in time
  useEffect(() => {
    if (!shouldLoadWolf || wolfLoaded) return;

    const timeout = setTimeout(() => {
      if (!wolfLoaded) {
        setLoadTimedOut(true);
        console.warn('3D Wolf load timed out, showing fallback');
      }
    }, LOAD_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [shouldLoadWolf, wolfLoaded]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background with rim lighting effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        {/* Pure black base for transparent wolf */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Cyan rim light glow - bottom right (smaller on mobile) */}
        <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-400/20 blur-[100px] md:blur-[150px] rounded-full translate-x-1/4 translate-y-1/4" />

        {/* Subtle top left glow (hidden on mobile for performance) */}
        <div className="hidden md:block absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* 3D Obsidian Wolf - Spline Embed (Optimized) */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: wolfLoaded ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Responsive cage for the wolf */}
          <div
            className="relative w-full max-w-[90vw] md:max-w-[800px] h-[50vh] md:h-[60vh] lg:h-[600px]"
            style={{
              background: 'transparent',
              touchAction: 'pan-y',
              willChange: 'transform',
            }}
          >
            {/* Loading state - wolf silhouette pulse */}
            {!wolfLoaded && !loadTimedOut && (
              <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center gap-4">
                {/* Pulsing wolf icon placeholder */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/10 animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyan-400/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L8 6H4v4l-2 2 2 2v4h4l4 4 4-4h4v-4l2-2-2-2V6h-4l-4-4zm0 4a6 6 0 110 12 6 6 0 010-12z"/>
                    </svg>
                  </div>
                </div>
                <span className="text-cyan-400/50 text-sm font-light tracking-wider">INITIALIZING</span>
              </div>
            )}

            {/* Timeout fallback - static glow effect */}
            {loadTimedOut && !wolfLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
              </div>
            )}

            {/* Spline iframe - only render when ready */}
            {shouldLoadWolf && !loadTimedOut && (
              <iframe
                src={SPLINE_URL}
                frameBorder="0"
                width="100%"
                height="100%"
                title="3D Obsidian Wolf"
                loading="lazy"
                onLoad={() => setWolfLoaded(true)}
                style={{
                  background: 'transparent',
                  pointerEvents: 'auto',
                  opacity: wolfLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-out',
                }}
                allow="autoplay"
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Reduced motion fallback - static glow */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-cyan-400/15 blur-3xl" />
        </div>
      )}

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center flex flex-col items-center px-4"
      >
        {/* Masked Text Reveal - Line 1 */}
        <div className="overflow-hidden">
          <motion.h1
            variants={clipReveal}
            transition={{ delay: 0.2 }}
            className="text-[60px] md:text-[100px] lg:text-[140px] font-bebas leading-[0.9] tracking-[-0.02em] text-white"
          >
            THE PRO ACADEMY
          </motion.h1>
        </div>

        {/* Masked Text Reveal - Line 2 */}
        <div className="overflow-hidden">
          <motion.h1
            variants={clipReveal}
            transition={{ delay: 0.35 }}
            className="text-[60px] md:text-[100px] lg:text-[140px] font-bebas leading-[0.9] tracking-[-0.02em] text-white"
          >
            IN YOUR POCKET<span className="text-cyan-400">.</span>
          </motion.h1>
        </div>

        {/* Subhead */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.6 }}
          className="mt-6 md:mt-8 text-lg md:text-xl text-gray-300 max-w-xl font-light leading-relaxed"
        >
          The world's first AI-native training system. Master the 15-minute daily habits used by
          pros to build speed, durability, and elite movement.
        </motion.p>

        {/* Velvet Rope */}
        <motion.p
          variants={fadeUp}
          transition={{ delay: 0.7 }}
          className="mt-4 text-sm text-[#A0A0A0] italic"
        >
          Entry to the Academy requires completion of the 6 Weeks Challenge.
        </motion.p>

        {/* CTA Button with Sheen Effect - YP Design Tokens */}
        <motion.button
          variants={scaleUp}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/start")}
          className="mt-8 md:mt-10 px-8 md:px-10 py-4 md:py-5 bg-[#00F6E0] hover:bg-[#00DCCE] active:bg-[#00BFB0] text-[#000000] font-semibold text-base md:text-lg rounded-full relative overflow-hidden group shadow-[0_0_24px_rgba(0,246,224,0.5)] hover:shadow-[0_0_40px_rgba(0,246,224,0.6)] transition-all duration-200"
        >
          <span className="relative z-10 tracking-wide">START THE 6 WEEKS CHALLENGE</span>
          {/* Sheen Effect on Hover */}
          <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
        </motion.button>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
