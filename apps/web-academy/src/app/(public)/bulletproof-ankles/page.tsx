// ═══════════════════════════════════════════════════════════
// BULLETPROOF ANKLES - Lead Magnet Landing Page
// Vibe: Cyberpunk 2077 × Nike Pro Training
// ═══════════════════════════════════════════════════════════

"use client";

import { Activity, ArrowRight, CheckCircle, Lock, Shield, Target, Timer, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function BulletproofAnklesLP() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      // ConvertKit Form ID - Replace with your actual form ID
      const CONVERTKIT_FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID || "YOUR_FORM_ID";

      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY,
            email: email,
            tags: ["bulletproof-ankles", "lead-magnet"],
          }),
        },
      );

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state with terminal animation
  if (isSuccess) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent-primary selection:text-black font-inter noise-overlay">
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION: THE "HOOK"
          ════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Protocol Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-accent-primary/30 rounded-full bg-accent-primary/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span className="text-xs font-mono text-accent-primary tracking-widest uppercase">
              Protocol v2.0 Available
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] leading-[0.9] font-bebas uppercase mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Bulletproof
            </span>
            <br />
            <span className="text-accent-primary drop-shadow-[0_0_25px_rgba(0,246,224,0.4)]">
              Ankles
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-[50ch] mx-auto leading-relaxed">
            The definitive biomechanical protocol to eliminate sprains, increase vertical force, and
            build explosive durability.
          </p>

          {/* ──────────────────────────────────────────────────────
              EMAIL CAPTURE FORM
              ────────────────────────────────────────────────────── */}
          <form ref={formRef} onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                required
                className="w-full h-14 bg-bg-tertiary border border-border-default rounded-lg px-5
                         text-base font-medium tracking-wide uppercase
                         focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary
                         transition-all duration-200 placeholder:text-text-tertiary"
              />
              <div
                className="absolute inset-0 border border-accent-primary/0 rounded-lg
                            group-hover:border-accent-primary/20 pointer-events-none transition-colors duration-300"
              />
            </div>

            {error && <p className="text-accent-error text-sm text-left">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full h-14 bg-accent-primary hover:bg-accent-primary-hover
                       text-black font-bold uppercase tracking-wide text-lg rounded-lg
                       flex items-center justify-center gap-2 transition-all duration-200
                       shadow-[0_0_20px_rgba(0,246,224,0.3)] hover:shadow-[0_0_30px_rgba(0,246,224,0.5)]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <>
                  Get The Protocol <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-text-tertiary text-center pt-2">
              Join 12,000+ Athletes using YP Systems
            </p>
          </form>
        </div>

        {/* Ankle Visual Placeholder */}
        <div className="mt-16 flex justify-center">
          <AnkleWireframe />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SOCIAL PROOF / STATS SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/5 py-16 bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <StatCard
            icon={<Shield className="w-6 h-6 text-accent-primary" />}
            label="Injury Reduction"
            value="87%"
            sub="In tested athletes"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-accent-gold" />}
            label="Force Output"
            value="+14%"
            sub="Avg. increase in plyometrics"
          />
          <StatCard
            icon={<Lock className="w-6 h-6 text-accent-primary" />}
            label="System Access"
            value="Free"
            sub="For a limited time"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHAT'S INSIDE (The "System")
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bebas uppercase mb-4 text-center tracking-wide">
            Inside the <span className="text-accent-primary">System</span>
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Everything you need to build unbreakable lower limbs and unlock explosive athletic
            potential.
          </p>

          <div className="grid gap-4">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                text: "The 'Iso-Hold' framework for tendon stiffness",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                text: "3-Stage Plyometric progression guide",
              },
              {
                icon: <Timer className="w-6 h-6" />,
                text: "Pre-game activation routine (5 minutes)",
              },
              {
                icon: <Activity className="w-6 h-6" />,
                text: "Video library of correct biomechanics",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-6 bg-bg-tertiary border border-border-subtle rounded-xl
                         hover:border-accent-primary/30 transition-all duration-300 group cursor-default"
              >
                <div
                  className="p-3 bg-accent-primary/10 rounded-lg text-accent-primary
                              group-hover:bg-accent-primary/20 transition-colors shrink-0"
                >
                  {item.icon}
                </div>
                <span className="text-lg text-white font-medium group-hover:text-accent-primary transition-colors">
                  {item.text}
                </span>
                <CheckCircle className="w-5 h-5 text-accent-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bebas uppercase mb-4 tracking-wide">
            Ready to <span className="text-accent-primary">Upgrade</span>?
          </h3>
          <p className="text-text-secondary mb-8">
            Get the protocol now. Zero cost. Maximum results.
          </p>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover
                     text-black font-bold uppercase tracking-wide text-lg rounded-lg transition-all duration-200
                     shadow-[0_0_20px_rgba(0,246,224,0.3)] hover:shadow-[0_0_30px_rgba(0,246,224,0.5)]"
          >
            Get The Protocol <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-xs text-text-tertiary">
          © {new Date().getFullYear()} YouthPerformance. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="p-6 bg-black border border-border-subtle rounded-xl hover:border-accent-primary/20 transition-all duration-300 group">
      <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg group-hover:bg-accent-primary/10 transition-colors">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bebas text-white mb-1 leading-none tracking-wide">
        {value}
      </div>
      <div className="text-lg font-semibold text-white/80 mb-1">{label}</div>
      <div className="text-sm text-text-tertiary">{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANKLE WIREFRAME VISUAL
// ─────────────────────────────────────────────────────────────

function AnkleWireframe() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full border border-accent-primary/20 animate-pulse" />
      <div className="absolute inset-4 rounded-full border border-accent-primary/30" />
      <div className="absolute inset-8 rounded-full border border-accent-primary/40" />

      {/* Center ankle visual - stylized wireframe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-40 h-40 md:w-48 md:h-48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Ankle joint wireframe */}
          <g className="text-accent-primary">
            {/* Tibia (lower leg bone) */}
            <line x1="50" y1="10" x2="50" y2="45" className="animate-pulse" />
            <ellipse cx="50" cy="45" rx="12" ry="8" className="opacity-60" />

            {/* Talus (ankle bone) */}
            <ellipse cx="50" cy="55" rx="15" ry="10" className="opacity-80" />

            {/* Calcaneus (heel bone) */}
            <ellipse cx="40" cy="70" rx="12" ry="8" className="opacity-70" />

            {/* Metatarsals (foot bones) */}
            <line x1="55" y1="60" x2="75" y2="75" className="opacity-50" />
            <line x1="52" y1="62" x2="70" y2="80" className="opacity-50" />
            <line x1="48" y1="63" x2="65" y2="82" className="opacity-50" />

            {/* Connection points */}
            <circle cx="50" cy="45" r="3" fill="currentColor" className="animate-pulse" />
            <circle
              cx="50"
              cy="55"
              r="3"
              fill="currentColor"
              className="animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <circle
              cx="40"
              cy="70"
              r="2"
              fill="currentColor"
              className="animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </g>

          {/* Scan lines */}
          <g className="text-accent-primary/30">
            <line x1="20" y1="50" x2="80" y2="50" strokeDasharray="2 4" />
            <line x1="50" y1="20" x2="50" y2="90" strokeDasharray="2 4" />
          </g>
        </svg>
      </div>

      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-primary/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-primary/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent-primary/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-accent-primary/50" />

      {/* Status indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-accent-primary/60 tracking-wider">
        SCAN_COMPLETE
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING SPINNER
// ─────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SUCCESS SCREEN - Terminal "System Unlocked" Animation
// ─────────────────────────────────────────────────────────────

function SuccessScreen() {
  const [lines, setLines] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [complete, setComplete] = useState(false);

  const terminalLines = [
    "> Initializing Protocol Transfer...",
    "> Verifying credentials: ████████ OK",
    "> Decrypting biomechanical data...",
    "> Downloading: iso-hold-framework.pdf",
    "> Downloading: plyometric-progression.mp4",
    "> Downloading: activation-routine.pdf",
    "> Syncing video library...",
    "",
    "═══════════════════════════════════════",
    "  ✓ SYSTEM UNLOCKED",
    "  ✓ CHECK YOUR EMAIL",
    "═══════════════════════════════════════",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setLines((prev) => [...prev, terminalLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setShowConfetti(true);
        setTimeout(() => setComplete(true), 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 noise-overlay relative overflow-hidden">
      {/* Confetti particles */}
      {showConfetti && <ConfettiExplosion />}

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Terminal window */}
        <div className="bg-bg-tertiary border border-border-default rounded-xl overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border-b border-border-subtle">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs font-mono text-text-tertiary">
              yp-protocol-transfer.exe
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm leading-relaxed min-h-[300px]">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`${
                  line.includes("✓")
                    ? "text-accent-primary font-bold"
                    : line.includes("═")
                      ? "text-accent-gold"
                      : "text-text-secondary"
                } animate-fadeIn`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {line || "\u00A0"}
              </div>
            ))}
            {!complete && <span className="inline-block w-2 h-4 bg-accent-primary animate-pulse" />}
          </div>
        </div>

        {/* Success message below terminal */}
        {complete && (
          <div className="mt-8 text-center animate-fadeIn">
            <h2 className="text-3xl font-bebas uppercase text-accent-primary mb-2 tracking-wide">
              Protocol Unlocked
            </h2>
            <p className="text-text-secondary mb-6">Check your inbox. The upgrade is waiting.</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent-primary/30 rounded-lg
                       text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Return to Base
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONFETTI EXPLOSION (Gold particles)
// ─────────────────────────────────────────────────────────────

function ConfettiExplosion() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 2,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: Math.random() > 0.5 ? "var(--accent-gold)" : "var(--accent-primary)",
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
