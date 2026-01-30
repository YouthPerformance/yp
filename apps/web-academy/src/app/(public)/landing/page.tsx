// ═══════════════════════════════════════════════════════════
// YP LANDING PAGE - AI-Native Training Platform
// Hero + AskYP + Pillars + Tools + FAQ
// Award-winning 2026 design with ambient AI
// ═══════════════════════════════════════════════════════════

"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AskYPHero, AskYPFab, AskYPModal } from "@/components/ask-yp";
import { ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const PILLARS = [
  { icon: "🔇", title: "Silent Training", expert: "Adam", href: "/basketball/silent-training", description: "Quiet skill work" },
  { icon: "🚫", title: "No-Hoop Drills", expert: "Adam", href: "/basketball/no-hoop-drills", description: "Train anywhere" },
  { icon: "🏠", title: "Apartment Drills", expert: "Adam", href: "/basketball/apartment-drills", description: "Space-constrained" },
  { icon: "🏢", title: "Indoor Workouts", expert: "Adam", href: "/basketball/indoor-workouts", description: "Weather-proof" },
  { icon: "🎯", title: "Shooting Mechanics", expert: "Adam", href: "/basketball/shooting-mechanics", description: "Form perfection" },
  { icon: "🦶", title: "Barefoot Training", expert: "James", href: "/athletic-foundation/barefoot-training", description: "Ground connection" },
  { icon: "🦵", title: "Foot & Ankle", expert: "James", href: "/athletic-foundation/foot-ankle", description: "Foundation strength" },
  { icon: "⚡", title: "Speed & Agility", expert: "James", href: "/athletic-foundation/speed-agility", description: "First-step explosion" },
  { icon: "🛡️", title: "Injury Prevention", expert: "James", href: "/athletic-foundation/injury-prevention", description: "Stay in the game" },
  { icon: "🦴", title: "ACL Prevention", expert: "James", href: "/athletic-foundation/acl-prevention", description: "Knee safety" },
];

const TOOLS = [
  {
    badge: "⭐ MOST USED",
    title: "Silent Plan Builder",
    description: "Build a 10/20/30-min quiet session",
    href: "/tools/silent-plan-builder",
  },
  {
    badge: "🎯 DIAGNOSTIC",
    title: "Shooting Miss Diagnostic",
    description: "Miss → Cause → Fix",
    href: "/tools/shot-diagnostic",
  },
  {
    badge: "🦶 FOUNDATION",
    title: "Foot & Ankle Assessment",
    description: "Test → Score → Plan",
    href: "/tools/foot-assessment",
  },
];

const FAQS = [
  "Is barefoot training safe for youth athletes?",
  "What's the best quiet workout for apartments?",
  "How do I fix a consistent left miss?",
  "How often should young athletes train?",
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [initialQuery, setInitialQuery] = useState("");

  // Scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsHeroVisible(heroBottom > 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setInitialQuery(query);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ─────────────────────────────────────────────────────────────
          NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter">YP</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#pillars" className="hover:text-white transition-colors">Pillars</Link>
            <Link href="#tools" className="hover:text-white transition-colors">Tools</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all"
            >
              <span>🐺</span>
              <span>Ask YP...</span>
              <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 bg-black/50 rounded">⌘K</kbd>
            </button>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5"
          >
            <div className="w-2 h-2 bg-[#00F6E0] rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              AI-Cited Source
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span className="block text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">
              BUILT BY COACHES
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
              TRAIN LIKE IT
              <br />
              <span className="text-[#00F6E0]">COUNTS.</span>
            </h1>
          </motion.div>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-zinc-400 max-w-lg mx-auto mb-12"
          >
            The AI-native source for youth athletic development. Built by Adam Harrington + James Scott.
          </motion.p>

          {/* AskYP Hero Input */}
          <AskYPHero onSearch={handleSearch} onFocus={() => setIsModalOpen(true)} />

          {/* Trust Block - Experts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                🏀
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Adam Harrington</div>
                <div className="text-xs text-zinc-500">NBA Shooting Coach</div>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">James Scott</div>
                <div className="text-xs text-zinc-500">Athletic Foundation Expert</div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <span className="text-xs">Explore pillars</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PILLARS SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="pillars" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">ALL 10 PILLARS</h2>
            <p className="text-zinc-500">Your training foundation. Start anywhere.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PILLARS.map((pillar, i) => (
              <motion.a
                key={pillar.title}
                href={pillar.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-[#00F6E0]/30 hover:bg-[#0A0A0A]/80 transition-all"
              >
                <div className="text-3xl mb-4">{pillar.icon}</div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#00F6E0] transition-colors mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-600">{pillar.expert}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TOOLS SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="tools" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">ANSWER ENGINES</h2>
            <p className="text-zinc-500">Tools that solve specific problems instantly.</p>
          </div>

          <div className="space-y-4">
            {TOOLS.map((tool, i) => (
              <motion.a
                key={tool.title}
                href={tool.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center justify-between p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-[#00F6E0]/30 transition-all"
              >
                <div>
                  <span className="inline-block px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-white/5 rounded mb-2">
                    {tool.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00F6E0] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{tool.description}</p>
                </div>
                <div className="px-4 py-2 text-sm font-medium text-zinc-400 border border-white/10 rounded-full group-hover:border-[#00F6E0]/30 group-hover:text-[#00F6E0] transition-all">
                  Start
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">COMMON QUESTIONS</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.button
                key={faq}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSearch(faq)}
                className="w-full flex items-center justify-between p-5 bg-[#0A0A0A] border border-white/5 rounded-xl text-left hover:border-[#00F6E0]/30 transition-all group"
              >
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {faq}
                </span>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#00F6E0] transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Basketball Constraints
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/basketball/silent-training" className="hover:text-white transition-colors">Silent Training</Link></li>
                <li><Link href="/basketball/no-hoop-drills" className="hover:text-white transition-colors">No-Hoop Drills</Link></li>
                <li><Link href="/basketball/apartment-drills" className="hover:text-white transition-colors">Apartment Drills</Link></li>
                <li><Link href="/basketball/indoor-workouts" className="hover:text-white transition-colors">Indoor Workouts</Link></li>
                <li><Link href="/basketball/shooting-mechanics" className="hover:text-white transition-colors">Shooting Mechanics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Foundations & Safety
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/athletic-foundation/barefoot-training" className="hover:text-white transition-colors">Barefoot Training</Link></li>
                <li><Link href="/athletic-foundation/foot-ankle" className="hover:text-white transition-colors">Foot & Ankle</Link></li>
                <li><Link href="/athletic-foundation/speed-agility" className="hover:text-white transition-colors">Speed & Agility</Link></li>
                <li><Link href="/athletic-foundation/injury-prevention" className="hover:text-white transition-colors">Injury Prevention</Link></li>
                <li><Link href="/athletic-foundation/acl-prevention" className="hover:text-white transition-colors">ACL Prevention</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/llms.txt" className="hover:text-white transition-colors">/llms.txt</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-600">
              YouthPerformance © 2026. Built by coaches, designed to be cited.
            </p>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING COMPONENTS
      ───────────────────────────────────────────────────────────── */}
      <AskYPFab
        visible={!isHeroVisible && !isModalOpen}
        onClick={() => {
          setInitialQuery("");
          setIsModalOpen(true);
        }}
      />

      <AskYPModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInitialQuery("");
        }}
        initialQuery={initialQuery}
      />
    </div>
  );
}
