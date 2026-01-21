import { useEffect, useState, useRef, useCallback } from "react";
import { track } from "../lib/analytics";
import "./LP3.css";

// ═══════════════════════════════════════════════════════════
// LP3 - "The Editorial" Landing Page
// Typography: Bebas Neue (headlines) + Crimson Pro (body) + JetBrains Mono (labels)
// Colors: Black (#000) background + Cyan (#00f6e0) accent
// Style: Editorial magazine aesthetic with noise texture
// ═══════════════════════════════════════════════════════════

// Q&A Data for Featured Cards
const FEATURED_QA = [
  {
    question: "How do I train my feet for explosive first step?",
    answer: "Your feet contain 200,000 nerve endings and 33 joints. Most athletes train everything except their foundation. Start with toe yoga: 3 minutes daily, spread and grip independently.",
    expert: "James Scott",
    tag: "Barefoot Training",
  },
  {
    question: "What's the secret to a pure shooting form?",
    answer: "The shot starts from the ground. Your base determines your balance, your balance determines your consistency. We call it 'shooting from the floor up.'",
    expert: "Adam Harrington",
    tag: "Basketball",
  },
];

// Coach Profiles
const COACHES = [
  {
    name: "James Scott",
    role: "Barefoot Performance",
    stat: "10,000+",
    statLabel: "Athletes Trained",
    image: "/images/james/portrait.webp",
  },
  {
    name: "Adam Harrington",
    role: "Shooting & Skill Development",
    stat: "50+",
    statLabel: "NBA Players Trained",
    image: "/images/adam/portrait.webp",
  },
];

// James Scott's 9 Hubs
const JAMES_HUBS = [
  { title: "Foot Strength", icon: "🦶", questions: 12 },
  { title: "Ankle Mobility", icon: "⚡", questions: 8 },
  { title: "Arch Activation", icon: "🔥", questions: 10 },
  { title: "Toe Control", icon: "🎯", questions: 7 },
  { title: "Balance Systems", icon: "⚖️", questions: 9 },
  { title: "Ground Force", icon: "💪", questions: 11 },
  { title: "Sensory Training", icon: "👁️", questions: 6 },
  { title: "Recovery", icon: "🔄", questions: 8 },
  { title: "Pain Science", icon: "🧠", questions: 14 },
];

// Adam Harrington's 4 Systems
const ADAM_SYSTEMS = [
  { title: "The Pure Shot", icon: "🏀", questions: 18 },
  { title: "Balance Architecture", icon: "⚖️", questions: 12 },
  { title: "Handle Mastery", icon: "✋", questions: 15 },
  { title: "Game Intelligence", icon: "🧠", questions: 9 },
];

// Trust Stats
const TRUST_STATS = [
  { value: "10,000+", label: "Athletes Trained" },
  { value: "50+", label: "NBA Players" },
  { value: "12", label: "Countries" },
  { value: "42", label: "Day Program" },
];

// Citation Sources
const CITATIONS = ["ACSM", "IOC", "BJSM", "NSCA", "Harvard Sports Medicine"];

export default function LP3() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeHub, setActiveHub] = useState(null);
  const mainRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Track page view
  useEffect(() => {
    track("lp3_viewed", { variant: "editorial" });
  }, []);

  // Staggered animation helper
  const getStaggerDelay = useCallback((index) => ({
    animationDelay: `${index * 0.1}s`,
  }), []);

  return (
    <div className={`lp3 ${isVisible ? "lp3--visible" : ""}`} ref={mainRef}>
      {/* Noise Texture Overlay */}
      <div className="lp3-noise" />

      {/* Geometric Gradient Background */}
      <div className="lp3-gradient-bg" />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="lp3-hero">
        <div className="lp3-container">
          {/* Editorial Header */}
          <header className="lp3-header">
            <div className="lp3-logo">
              <img src="/logo/yp-logo.png" alt="YP" className="lp3-logo-img" />
            </div>
            <nav className="lp3-nav">
              <a href="#coaches" className="lp3-nav-link">Coaches</a>
              <a href="#method" className="lp3-nav-link">Method</a>
              <a href="#trust" className="lp3-nav-link">Research</a>
            </nav>
          </header>

          {/* Hero Content */}
          <div className="lp3-hero-content">
            <p className="lp3-hero-eyebrow">Youth Performance Academy</p>
            <h1 className="lp3-hero-headline">
              <span className="lp3-hero-line lp3-fade-up" style={getStaggerDelay(0)}>BUILD THE</span>
              <span className="lp3-hero-line lp3-hero-accent lp3-fade-up" style={getStaggerDelay(1)}>ATHLETE</span>
              <span className="lp3-hero-line lp3-fade-up" style={getStaggerDelay(2)}>FIRST</span>
            </h1>
            <p className="lp3-hero-sub lp3-fade-up" style={getStaggerDelay(3)}>
              Elite training for every kid, everywhere. We build springs, not pistons.
            </p>
          </div>

          {/* Featured Q&A + Coach Cards Row */}
          <div className="lp3-hero-cards">
            {/* Featured Q&A Card */}
            <div className="lp3-qa-card lp3-fade-up" style={getStaggerDelay(4)}>
              <span className="lp3-qa-tag">{FEATURED_QA[0].tag}</span>
              <h3 className="lp3-qa-question">{FEATURED_QA[0].question}</h3>
              <p className="lp3-qa-answer">{FEATURED_QA[0].answer}</p>
              <div className="lp3-qa-expert">
                <span className="lp3-qa-expert-name">— {FEATURED_QA[0].expert}</span>
              </div>
            </div>

            {/* Coach Profile Cards */}
            <div className="lp3-coach-cards">
              {COACHES.map((coach, i) => (
                <div
                  key={coach.name}
                  className="lp3-coach-card lp3-fade-up"
                  style={getStaggerDelay(5 + i)}
                >
                  <div className="lp3-coach-img-wrap">
                    <img src={coach.image} alt={coach.name} className="lp3-coach-img" />
                  </div>
                  <div className="lp3-coach-info">
                    <h4 className="lp3-coach-name">{coach.name}</h4>
                    <p className="lp3-coach-role">{coach.role}</p>
                    <div className="lp3-coach-stat">
                      <span className="lp3-coach-stat-value">{coach.stat}</span>
                      <span className="lp3-coach-stat-label">{coach.statLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          JAMES SCOTT'S 9 HUBS
          ═══════════════════════════════════════════════════════════ */}
      <section className="lp3-section lp3-james" id="coaches">
        <div className="lp3-container">
          <div className="lp3-section-header">
            <span className="lp3-section-eyebrow">Barefoot Performance</span>
            <h2 className="lp3-section-title">James Scott's 9 Hubs</h2>
            <p className="lp3-section-desc">
              The complete foot-to-floor system. Every athletic movement starts here.
            </p>
          </div>

          <div className="lp3-hub-grid">
            {JAMES_HUBS.map((hub, i) => (
              <div
                key={hub.title}
                className={`lp3-hub-card lp3-fade-up ${activeHub === hub.title ? "lp3-hub-card--active" : ""}`}
                style={getStaggerDelay(i)}
                onMouseEnter={() => setActiveHub(hub.title)}
                onMouseLeave={() => setActiveHub(null)}
              >
                <span className="lp3-hub-icon">{hub.icon}</span>
                <h3 className="lp3-hub-title">{hub.title}</h3>
                <span className="lp3-hub-meta">{hub.questions} Q&A</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ADAM HARRINGTON'S 4 SYSTEMS
          ═══════════════════════════════════════════════════════════ */}
      <section className="lp3-section lp3-adam" id="method">
        <div className="lp3-container">
          <div className="lp3-section-header">
            <span className="lp3-section-eyebrow lp3-section-eyebrow--lime">Basketball Mastery</span>
            <h2 className="lp3-section-title">Adam Harrington's 4 Systems</h2>
            <p className="lp3-section-desc">
              The physics of the pure shot. 50+ NBA players trained.
            </p>
          </div>

          <div className="lp3-system-grid">
            {ADAM_SYSTEMS.map((system, i) => (
              <div
                key={system.title}
                className="lp3-system-card lp3-fade-up"
                style={getStaggerDelay(i)}
              >
                <span className="lp3-system-icon">{system.icon}</span>
                <h3 className="lp3-system-title">{system.title}</h3>
                <p className="lp3-system-meta">{system.questions} Q&A deep dives</p>
                <div className="lp3-system-preview">
                  <span className="lp3-system-preview-label">Sample question:</span>
                  <span className="lp3-system-preview-q">
                    {system.title === "The Pure Shot" && "Why does my shot flatten on game day?"}
                    {system.title === "Balance Architecture" && "How do I stop falling off my shot?"}
                    {system.title === "Handle Mastery" && "Why can't I dribble with my weak hand?"}
                    {system.title === "Game Intelligence" && "When should I take the contested shot?"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="lp3-section lp3-trust" id="trust">
        <div className="lp3-container">
          <div className="lp3-section-header">
            <span className="lp3-section-eyebrow">Evidence-Based</span>
            <h2 className="lp3-section-title">The Numbers</h2>
          </div>

          {/* Stats Grid */}
          <div className="lp3-stats-grid">
            {TRUST_STATS.map((stat, i) => (
              <div key={stat.label} className="lp3-stat lp3-fade-up" style={getStaggerDelay(i)}>
                <span className="lp3-stat-value">{stat.value}</span>
                <span className="lp3-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Citation Sources */}
          <div className="lp3-citations">
            <span className="lp3-citations-label">Research backed by:</span>
            <div className="lp3-citations-list">
              {CITATIONS.map((cite) => (
                <span key={cite} className="lp3-citation">{cite}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="lp3-footer">
        <div className="lp3-container">
          <div className="lp3-footer-content">
            <div className="lp3-footer-brand">
              <img src="/logo/yp-logo.png" alt="YP" className="lp3-footer-logo" />
              <p className="lp3-footer-tagline">Elite training for every kid, everywhere.</p>
            </div>
            <div className="lp3-footer-links">
              <a href="/terms" className="lp3-footer-link">Terms</a>
              <a href="/privacy" className="lp3-footer-link">Privacy</a>
            </div>
          </div>
          <div className="lp3-footer-bottom">
            <span className="lp3-footer-copy">© 2026 YouthPerformance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
