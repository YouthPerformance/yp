import { useCallback, useEffect, useRef, useState } from "react";
import { track, EVENTS } from "../lib/analytics";
import "./LP.css";

// Convex HTTP API for lead capture (uses yp-alpha backend)
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://wry-cuttlefish-942.convex.cloud";

console.log("[LP] Module loaded - testing full JSX");

// CTA A/B Test Variants (PostHog flag: hero-cta-test)
const CTA_CONFIG = {
  athlete: { text: "FREE ATHLETE ASSESSMENT", subtext: "Personalized evaluation for young athletes" },
  start: { text: "START FREE ASSESSMENT", subtext: "Takes 2 minutes • 100% free" },
  outcome: { text: "GET BULLETPROOF ANKLES", subtext: "Free training plan for injury prevention" },
};

const PLAYBOOK_URL = "https://playbook.youthperformance.com/barefoot-training/injury-rehab/bulletproof-ankles";

// Text scramble characters
const CHARS = "!<>-_\\/[]{}—=+*^?#________";

// Scramble text effect hook
function useTextScramble(text, trigger) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration / 3) return text[index];
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsComplete(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return { displayText, isComplete };
}

// Counter animation hook
function useCountUp(end, duration = 2000, trigger) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
}

// Confetti particle
function Confetti({ x, y, color, delay }) {
  return (
    <div
      className="confetti-particle"
      style={{
        left: x,
        top: y,
        background: color,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export default function LP() {
  console.log("[LP] Component rendering - full JSX test");

  // Refs
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const ctaRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const ringTarget = useRef({ x: 0, y: 0 });

  // State
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [cursorScale, setCursorScale] = useState(1);
  const [cursorText, setCursorText] = useState("");
  const [ctaVariant, setCtaVariant] = useState("outcome");

  // Email signup state
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Konami code
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  // Load Unicorn Studio script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js';
    script.async = true;
    script.onload = () => {
      if (window.UnicornStudio) {
        window.UnicornStudio.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Smooth cursor animation with lerp (award-winning buttery feel)
  useEffect(() => {
    let animationId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      // Dot follows faster (0.2), ring follows slower (0.08) for trailing effect
      if (cursorRef.current) {
        const dotX = lerp(parseFloat(cursorRef.current.style.left) || 0, mouseTarget.current.x, 0.2);
        const dotY = lerp(parseFloat(cursorRef.current.style.top) || 0, mouseTarget.current.y, 0.2);
        cursorRef.current.style.left = `${dotX}px`;
        cursorRef.current.style.top = `${dotY}px`;
      }

      if (cursorRingRef.current) {
        const ringX = lerp(parseFloat(cursorRingRef.current.style.left) || 0, ringTarget.current.x, 0.08);
        const ringY = lerp(parseFloat(cursorRingRef.current.style.top) || 0, ringTarget.current.y, 0.08);
        cursorRingRef.current.style.left = `${ringX}px`;
        cursorRingRef.current.style.top = `${ringY}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Mouse tracking for parallax and spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Update cursor targets for lerp animation
      mouseTarget.current = { x: e.clientX, y: e.clientY };
      ringTarget.current = { x: e.clientX, y: e.clientY };

      // Magnetic effect for CTA button
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          setMagneticOffset({
            x: distX * force * 0.3,
            y: distY * force * 0.3,
          });
        } else {
          setMagneticOffset({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === konamiCode[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);
        if (newProgress === konamiCode.length) {
          setEasterEggActive(true);
          playSound("success");
          triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
          setTimeout(() => setKonamiProgress(0), 1000);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress]);

  // Random glitch effect
  useEffect(() => {
    if (!isReady) return;
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, [isReady]);

  // PostHog A/B test for CTA
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.posthog !== "undefined") {
      const variant = window.posthog.getFeatureFlag("hero-cta-test");
      if (variant && CTA_CONFIG[variant]) {
        setCtaVariant(variant);
      }
    }
  }, []);

  // Sound effects
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case "hover":
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.05;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
        case "click":
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.1;
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case "success":
          oscillator.frequency.value = 523.25;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        default:
          break;
      }
    },
    [soundEnabled],
  );

  // Confetti explosion
  const triggerConfetti = (x, y, count = 30) => {
    const colors = ["#00f6e0", "#8a2be2", "#00bfff", "#ff6b6b", "#ffd93d"];
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 100,
      });
    }

    setConfetti(particles);
    setTimeout(() => setConfetti([]), 2000);
  };

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Email submit handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store lead in Convex via HTTP API (yp-alpha backend)
      const response = await fetch(`${CONVEX_URL}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "playbook:captureLeadAndSendPDF",
          args: {
            email: email.trim().toLowerCase(),
            source: "lp-bulletproof-ankles",
            metadata: {
              referrer: document.referrer || null,
              utm: Object.fromEntries(new URLSearchParams(window.location.search)),
            },
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to capture lead");
      }

      playSound("success");

      track(EVENTS.EMAIL_SIGNUP || "email_signup", {
        email: email,
        source: "lp_hero",
        isExisting: result.value?.isExisting || false,
      });

      console.log("[LP] Lead captured:", email, result);

      setEmailSubmitted(true);
      triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 30);
    } catch (error) {
      console.error("[LP] Lead capture error:", error);
      setEmailError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CTA click handler
  const handleCTAClick = (e) => {
    e.preventDefault();
    playSound("click");

    track(EVENTS.CTA_CLICK, {
      variant: ctaVariant,
      destination: "playbook_bulletproof_ankles",
    });

    const rect = e.currentTarget.getBoundingClientRect();
    triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    setTimeout(() => {
      window.location.href = PLAYBOOK_URL;
    }, 800);
  };

  // Cursor handlers
  const handleCursorEnter = (text, scale = 1.5) => {
    setCursorText(text);
    setCursorScale(scale);
    setIsHovering(true);
    playSound("hover");
  };

  const handleCursorLeave = () => {
    setCursorText("");
    setCursorScale(1);
    setIsHovering(false);
  };

  // Parallax values
  const parallaxX = (mousePos.x - 0.5) * 30;
  const parallaxY = (mousePos.y - 0.5) * 30;

  // Memoize particles to prevent re-creation on every render
  const particles = useRef(
    [...Array(40)].map((_, i) => ({
      key: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${15 + Math.random() * 20}s`,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  ).current;

  return (
    <div
      ref={containerRef}
      className={`lp-container ${isReady ? "ready" : ""} ${easterEggActive ? "rainbow-mode" : ""}`}
    >
      {/* Silent Luxury Cursor - tiny elegant dot */}
      <div
        ref={cursorRef}
        className={`lp-cursor ${isHovering ? 'hovering' : ''}`}
        style={{ left: 0, top: 0 }}
      >
        <div className="lp-cursor-dot" />
      </div>

      {/* Spotlight Effect */}
      <div
        className="lp-spotlight"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 246, 224, 0.06), transparent 40%)`,
        }}
      />

      {/* Main Content */}
      <div className={`lp-main-wrapper ${isReady ? "visible" : ""}`}>
        {/* Film Grain Noise - Anti-AI Texture */}
        <div className="lp-film-grain" />

        {/* Noise & Effects */}
        <div className="lp-noise" />
        <div className="lp-scanlines" />
        <div className="lp-vignette" />

        {/* Animated Gradient Mesh */}
        <div className="lp-gradient-mesh" />

        {/* Floating Particles - using memoized values */}
        <div className="lp-particles">
          {particles.map((particle) => (
            <div
              key={particle.key}
              className="lp-particle"
              style={{
                left: particle.left,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>

        {/* Ambient Glow Orbs */}
        <div
          className="lp-orb lp-orb-1"
          style={{
            transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px)`,
          }}
        />
        <div
          className="lp-orb lp-orb-2"
          style={{
            transform: `translate(${-parallaxX * 1.5}px, ${-parallaxY * 1.5}px)`,
          }}
        />
        <div
          className="lp-orb lp-orb-3"
          style={{
            transform: `translate(${parallaxX}px, ${-parallaxY}px)`,
          }}
        />

        {/* Sound Toggle */}
        <button
          className={`lp-sound-toggle ${soundEnabled ? "active" : ""}`}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playSound("click");
          }}
          onMouseEnter={() => handleCursorEnter("SOUND", 1.2)}
          onMouseLeave={handleCursorLeave}
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Wolf Aura Background */}
        <div className="aura-background-component">
          <div
            data-us-project="FixNvEwvWwbu3QX9qC3F"
            className="aura-unicorn-embed"
          />
        </div>

        {/* Main Content */}
        <main className="lp-main">
          {/* 3D Logo - Unicorn Studio (LARGE) */}
          <div
            ref={logoRef}
            className={`lp-unicorn-container lp-unicorn-large ${glitchActive ? "glitch" : ""}`}
            onMouseEnter={() => handleCursorEnter("", 2)}
            onMouseLeave={handleCursorLeave}
          >
            <div
              data-us-project="naRSjPpjqWS37meInh9T"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* FLUX Layout - Single Axis of Attention */}
          <div className="lp-flux-container">

            {/* Live Status Badge */}
            <div className="lp-status-badge">
              <span className="lp-status-dot">
                <span className="lp-status-ping" />
                <span className="lp-status-core" />
              </span>
              <span className="lp-status-text">
                {useTextScramble("LOCK IN. LEVEL UP.", isReady).displayText || "\u00A0"}
              </span>
            </div>

            {/* Hero Headline - The Desire */}
            <h1 className="lp-flux-headline">
              <span className="lp-flux-build">BUILD</span>
              <span className="lp-flux-bulletproof">
                <span className="lp-chrome-base">BULLETPROOF</span>
                <span className="lp-chrome-shimmer">BULLETPROOF</span>
              </span>
              <span className="lp-flux-ankles">ANKLES</span>
            </h1>

            {/* Subhead */}
            <p className="lp-flux-subhead">
              Join the limited beta.
            </p>

            {/* Clean Input Stack - No Box-in-Box */}
            <form className={`lp-flux-form ${emailSubmitted ? 'success' : ''}`} onSubmit={handleEmailSubmit}>
              <input
                type="email"
                className={`lp-flux-input ${emailError ? 'error' : ''}`}
                placeholder={emailSubmitted ? "YOU'RE IN" : "Enter your email for access..."}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                disabled={emailSubmitted}
                onMouseEnter={() => handleCursorEnter("", 1.5)}
                onMouseLeave={handleCursorLeave}
              />

              {!emailSubmitted ? (
                <button
                  type="submit"
                  className={`lp-reactor-button ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                  onMouseEnter={() => handleCursorEnter("", 0)}
                  onMouseLeave={handleCursorLeave}
                >
                  <span className="lp-reactor-content">
                    <span>{isSubmitting ? "SENDING..." : "GET ACCESS"}</span>
                    {!isSubmitting && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </span>
                </button>
              ) : (
                <div className="lp-flux-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>YOU'RE IN</span>
                </div>
              )}
            </form>

            {emailError && <span className="lp-flux-error">{emailError}</span>}

            {/* Tagline */}
            <p className="lp-flux-tagline">
              EVERY KID DESERVES PRO-LEVEL COACHING.
            </p>

          </div>

        </main>

        {/* Confetti Container */}
        <div className="lp-confetti-container">
          {confetti.map((particle) => (
            <Confetti key={particle.id} {...particle} />
          ))}
        </div>

        {/* Bottom Fade */}
        <div className="lp-bottom-fade" />
      </div>
    </div>
  );
}
