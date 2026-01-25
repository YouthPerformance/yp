/**
 * James Scott - Celebrity Trainer Profile Page
 *
 * Design: Celebrity trainer landing page with social proof
 * Vibe: "As seen training..." with receipts
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import AskJamesWidget from "../components/AskJamesWidget";

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const JAMES = {
  name: "JAMES SCOTT",
  tagline: "Weak Feet Don't Eat",
  title: "Master's in Sports Science & Biomechanics | Professional Athletes Performance Coach",
  heroImage: "/images/james/jamesmug.webp",
  bio: `I've spent 15+ years training some of the world's best athletes. NBA All-Stars. NFL Pro Bowlers. Global icons. The pattern was always the same—weak feet creating problems upstream.

So I built the R3 Method: Release, Restore, Re-Engineer. The same system I use with pros, now accessible to every athlete.`,
  social: {
    instagram: "https://instagram.com/weakfeetdonteat",
    twitter: "https://twitter.com/weakfeetdonteat",
  },
};

// Athletes trained - the receipts
const ATHLETES = [
  {
    name: "Jimmy Butler",
    title: "NBA All-Star",
    team: "Miami Heat",
    image: "/images/james/jamesjimmy2.webp",
    years: "6+ Years",
  },
  {
    name: "LeBron James",
    title: "NBA Legend",
    team: "Nike RISE",
    image: "/images/james/jameslebron.webp",
    years: "Nike Tour",
  },
  {
    name: "Kobe Bryant",
    title: "NBA Legend",
    team: "Kobe Academy",
    image: "/images/james/jameskobe.webp",
    years: "Mamba Mentality",
  },
  {
    name: "Kevin Durant",
    title: "NBA MVP",
    team: "Nike Basketball",
    image: "/images/james/jameskd.webp",
    years: "China Tour",
  },
];

// Scrolling credentials ticker
const CREDENTIALS = [
  "NBA All-Stars",
  "NFL Pro Bowlers",
  "Premier League",
  "Global Icons",
  "Olympic Athletes",
  "J Balvin",
  "Jimmy Butler",
  "Josh Oliver",
];

// Featured In logos
const FEATURED_LOGOS = [
  { name: "NBA", src: "/logos/nba.webp", height: "48px" },
  { name: "NFL", src: "/logos/nfl.webp", height: "48px" },
  { name: "MLB", src: "/logos/mlb.webp", height: "44px" },
  { name: "NCAA", src: "/logos/ncaa.webp", height: "40px" },
  { name: "Olympics", src: "/logos/olympics.webp", height: "44px" },
  { name: "FIFA", src: "/logos/fifa.webp", height: "40px" },
];

// Photo gallery - training shots
const GALLERY = [
  { src: "/images/james/jamesjimmyside.webp", caption: "Barefoot training with Jimmy Butler" },
  { src: "/images/james/bpa1.webp", caption: "Bulletproof Ankles protocol" },
  { src: "/images/james/jameschina.webp", caption: "Nike RISE Tour - China" },
  { src: "/images/james/james1.webp", caption: "In the lab" },
  { src: "/images/james/bp3.webp", caption: "Movement assessment" },
  { src: "/images/james/bpa2.webp", caption: "Foot activation work" },
];

// R3 Method phases
const R3_METHOD = [
  {
    phase: "R1",
    name: "RELEASE",
    weeks: "Weeks 1-2",
    description: "Wake up dormant muscles. Restore range of motion.",
    color: "#00f6e0",
  },
  {
    phase: "R2",
    name: "RESTORE",
    weeks: "Weeks 3-4",
    description: "Build steel ankles. Develop load capacity.",
    color: "#fbbf24",
  },
  {
    phase: "R3",
    name: "RE-ENGINEER",
    weeks: "Weeks 5-6",
    description: "Explosive power. Sport-ready performance.",
    color: "#ef4444",
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Featured In logo ticker
function FeaturedInTicker() {
  return (
    <div className="relative py-12 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-[0.3em] text-white/30 mb-8">
          Trusted By
        </p>
      </div>

      {/* Logo scroll container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        <motion.div
          className="flex gap-16 items-center whitespace-nowrap px-8"
          animate={{ x: [0, -600] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...FEATURED_LOGOS, ...FEATURED_LOGOS, ...FEATURED_LOGOS].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{ height: logo.height }}
                className="w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Photo gallery with horizontal scroll
function PhotoGallery() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Gallery scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {GALLERY.map((photo, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-[300px] md:w-[400px] snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden group">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-sm text-white/80 font-medium">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function JamesScott() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end pb-12 md:pb-20">
        {/* Background - will be video later */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
            style={{ backgroundImage: `url(/images/james/jamessideprofile.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Name - Bebas Neue style */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas tracking-tight mb-4">
              {JAMES.name}
            </h1>

            {/* Title */}
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-xl">
              {JAMES.title}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href={JAMES.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <circle cx="12" cy="12" r="3.5"/>
                </svg>
                <span className="text-sm font-medium">@weakfeetdonteat</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured In Logos */}
      <FeaturedInTicker />

      {/* ─────────────────────────────────────────────────────────
          THE RECEIPTS SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bebas">
              The Receipts
            </h2>
          </motion.div>

          {/* Athletes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ATHLETES.map((athlete, i) => (
              <motion.div
                key={athlete.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden"
              >
                <img
                  src={athlete.image}
                  alt={`Training ${athlete.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
                    {athlete.title}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {athlete.name}
                  </h3>
                  <p className="text-sm text-white/50">
                    {athlete.years}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          PHOTO GALLERY
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#111]">
        <div className="max-w-7xl mx-auto mb-8 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">
              In The Lab
            </p>
            <h2 className="text-3xl md:text-5xl font-bold">
              The Work
            </h2>
          </motion.div>
        </div>
        <PhotoGallery />
      </section>

      {/* ─────────────────────────────────────────────────────────
          ORIGIN STORY
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <img
                src="/images/james/jamesfamily.webp"
                alt="James with his family"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-4">
                Why I Built This
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                I Have Two Sons.
              </h2>
              <div className="space-y-4 text-lg text-white/70 leading-relaxed">
                <p>
                  I flew back from NBA training camps to watch them play youth basketball.
                  What I saw made me angry.
                </p>
                <p>
                  The same broken patterns I fix in pros—starting at age 8. Weak feet.
                  Bad mechanics. Coaches who mean well but don't have the science.
                </p>
                <p>
                  So I adapted the same methods I used with Jimmy Butler, LeBron, and Kobe.
                  Not watered down—just smarter, safer, and designed for how kids actually develop.
                </p>
              </div>
              <p className="mt-8 text-cyan-400 font-bold">
                — James Scott, Founder
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          R3 METHOD
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">
              The System
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The R3 Method
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The same system used by NBA and NFL athletes. 42 days to rebuild your foundation.
            </p>
          </motion.div>

          {/* Phases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {R3_METHOD.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
              >
                {/* Phase badge */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-black mb-4"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.phase}
                </div>

                <h3 className="text-xl font-bold mb-1">{phase.name}</h3>
                <p className="text-sm text-white/50 mb-3">{phase.weeks}</p>
                <p className="text-white/70">{phase.description}</p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: phase.color }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="https://playbook.youthperformance.com/barefoot-training/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Learn the full R3 Method
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          QUOTE
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20 blur-[120px]"
          style={{ background: "linear-gradient(90deg, #00f6e0, #0ea5e9)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-medium leading-relaxed mb-8"
          >
            "Weak feet don't eat. That's not just a saying—it's biomechanics.
            If your feet can't stabilize, absorb, and produce force,
            you're leaking power at every step."
          </motion.blockquote>
          <p className="text-cyan-400 font-bold">— James Scott</p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          CTA SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Build Your Foundation?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
              Start the same program used by Jimmy Butler, elite athletes, and thousands of young athletes worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.youthperformance.com/programs/barefoot-reset"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition-colors shadow-[0_0_40px_rgba(0,246,224,0.3)]"
              >
                Start the 42-Day Reset
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="https://playbook.youthperformance.com/barefoot-training/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-colors"
              >
                Read the Free Guide
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} YouthPerformance. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/manifesto" className="text-sm text-white/40 hover:text-white transition-colors">
                Manifesto
              </Link>
              <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Ask James Widget */}
      <AskJamesWidget />
    </div>
  );
}
