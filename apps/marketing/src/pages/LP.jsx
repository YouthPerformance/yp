import { useEffect, useRef, useState, Suspense, lazy, useCallback } from "react";
import { BetaBadge } from "@yp/ui";
import { track, EVENTS } from "../lib/analytics";
import YPLoader from "../components/YPLoader";
import "./LP.css";

// Lazy load Spline for better initial page load
const Spline = lazy(() => import('@splinetool/react-spline'));

// 3D Obsidian Wolf - Spline scene URL (.splinecode for React component)
const WOLF_SPLINE_URL = "https://prod.spline.design/PGI70x0SHCCIPlZ1/scene.splinecode";

// Convex HTTP API for lead capture (uses yp-alpha backend)
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://wry-cuttlefish-942.convex.cloud";

console.log("[LP] Module loaded - testing full JSX");

// CTA A/B Test Variants (PostHog flag: hero-cta-test)
const CTA_CONFIG = {
  athlete: { text: "FREE ATHLETE ASSESSMENT", subtext: "Personalized evaluation for young athletes" },
  start: { text: "START FREE ASSESSMENT", subtext: "Takes 2 minutes • 100% free" },
  outcome: { text: "GET BULLETPROOF ANKLES", subtext: "Free training plan for injury prevention" },
};

// Hero Text Split Test Variants (PostHog flag: hero-text-variant)
const HERO_VARIANTS = {
  A: { line1: "BUILD", accent: "BULLETPROOF", line3: "ANKLES" },
  B: { line1: "BUILD", accent: "FASTER", line3: "FEET" },
  C: { line1: "BUILD", accent: "ELITE", line3: "FOUNDATIONS" },
};

// Pack 001 Config
const PACK_CONFIG = {
  maxMembers: 88,
  closeDate: "JAN 31",
};

// Default pack status (shown while loading)
const DEFAULT_PACK_STATUS = {
  confirmedMembers: 46,
  memberFlags: ["US", "CN", "BR", "GB", "AU", "CA", "MX", "KR"],
  countryCount: 12,
};

// Country flag helper
const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

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

// Text Scramble Effect - Tech decode animation
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function TextScramble({ text, delay = 0, duration = 1500, trigger = true }) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      setIsComplete(false);
      return;
    }

    const chars = text.split("");
    const iterations = Math.ceil(duration / 30);
    let frame = 0;
    let timeoutId;

    const startTimeout = setTimeout(() => {
      const animate = () => {
        const progress = frame / iterations;
        const revealed = Math.floor(progress * chars.length);

        const scrambled = chars.map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return char;
          if (i === revealed && Math.random() > 0.3) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("");

        setDisplayText(scrambled);
        frame++;

        if (frame <= iterations) {
          timeoutId = setTimeout(animate, 30);
        } else {
          setDisplayText(text);
          setIsComplete(true);
        }
      };
      animate();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, delay, duration, trigger]);

  return (
    <span className={`text-scramble ${isComplete ? 'complete' : ''}`}>
      {displayText || text}
    </span>
  );
}

export default function LP() {
  console.log("[LP] Component rendering - full JSX test");

  // Refs
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  // State
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [ctaVariant, setCtaVariant] = useState("outcome");

  // Email signup state
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pack status state (starts with defaults, fetches real data)
  const [packStatus, setPackStatus] = useState(DEFAULT_PACK_STATUS);
  const [packStatusLoaded, setPackStatusLoaded] = useState(false);

  // 3D Wolf state
  const [wolfLoaded, setWolfLoaded] = useState(false);

  // Content reveal state (triggered after loader completes)
  const [showContent, setShowContent] = useState(false);

  // Loader complete callback
  const handleLoadComplete = useCallback(() => {
    // Small delay before starting text scramble
    setTimeout(() => setShowContent(true), 100);
  }, []);

  // Derived values
  const spotsLeft = PACK_CONFIG.maxMembers - packStatus.confirmedMembers;
  const nextMemberNumber = packStatus.confirmedMembers + 1;
  const percentFilled = Math.round((packStatus.confirmedMembers / PACK_CONFIG.maxMembers) * 100);

  // Hero variant state
  const [heroVariant, setHeroVariant] = useState("A");

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
      // Assets loaded - mark ready (no loader)
      setIsLoading(false);
      setIsReady(true);
    };
    document.body.appendChild(script);

    // Fallback: complete loading after timeout if script fails
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsReady(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch real pack status from Convex
  useEffect(() => {
    const fetchPackStatus = async () => {
      try {
        const response = await fetch(`${CONVEX_URL}/api/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "contracts:getPackStatus",
            args: {},
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pack status");
        }

        const result = await response.json();

        if (result.value) {
          // Use real data if we have members, otherwise show demo data
          const hasRealMembers = result.value.confirmedMembers > 0;
          setPackStatus({
            confirmedMembers: hasRealMembers
              ? result.value.confirmedMembers
              : DEFAULT_PACK_STATUS.confirmedMembers,
            memberFlags: hasRealMembers && result.value.memberFlags?.length > 0
              ? result.value.memberFlags
              : DEFAULT_PACK_STATUS.memberFlags,
            countryCount: hasRealMembers
              ? result.value.countryCount
              : DEFAULT_PACK_STATUS.countryCount,
          });
          console.log("[LP] Pack status loaded:", result.value, hasRealMembers ? "(real)" : "(demo)");
        }
      } catch (error) {
        console.warn("[LP] Pack status fetch failed, using defaults:", error.message);
        // Keep using DEFAULT_PACK_STATUS
      } finally {
        setPackStatusLoaded(true);
      }
    };

    fetchPackStatus();
  }, []);

  // Smooth cursor animation with lerp
  useEffect(() => {
    let animationId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      if (cursorRef.current) {
        const dotX = lerp(parseFloat(cursorRef.current.style.left) || 0, mouseTarget.current.x, 0.2);
        const dotY = lerp(parseFloat(cursorRef.current.style.top) || 0, mouseTarget.current.y, 0.2);
        cursorRef.current.style.left = `${dotX}px`;
        cursorRef.current.style.top = `${dotY}px`;
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

      // Update cursor target for lerp animation
      mouseTarget.current = { x: e.clientX, y: e.clientY };
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

  // PostHog A/B test for CTA and Hero
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.posthog !== "undefined") {
      // CTA variant
      const ctaVar = window.posthog.getFeatureFlag("hero-cta-test");
      if (ctaVar && CTA_CONFIG[ctaVar]) {
        setCtaVariant(ctaVar);
      }
      // Hero text variant
      const heroVar = window.posthog.getFeatureFlag("hero-text-variant");
      if (heroVar && HERO_VARIANTS[heroVar]) {
        setHeroVariant(heroVar);
      }
    }
  }, []);

  // Track landing page view with pack status
  useEffect(() => {
    if (isReady) {
      track("landing_viewed", {
        hero_variant: heroVariant,
        cta_variant: ctaVariant,
        spots_left: spotsLeft,
        percent_filled: percentFilled,
        next_member_number: nextMemberNumber,
      });

      // PostHog specific: Identify landing page funnel start
      if (window.posthog) {
        window.posthog.capture("$pageview", {
          $current_url: window.location.href,
          page_type: "landing_page",
          funnel_stage: "awareness",
        });
      }
    }
  }, [isReady, heroVariant, ctaVariant, spotsLeft, percentFilled, nextMemberNumber]);

  // Scroll depth tracking for funnel analysis
  useEffect(() => {
    if (!isReady) return;

    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      Object.keys(scrollMilestones).forEach((milestone) => {
        if (scrollPercent >= parseInt(milestone) && !scrollMilestones[milestone]) {
          scrollMilestones[milestone] = true;
          track("lp_scroll_depth", {
            depth: parseInt(milestone),
            hero_variant: heroVariant,
            cta_variant: ctaVariant,
          });
          // PostHog heatmap enhancement
          if (window.posthog) {
            window.posthog.capture("scroll_milestone", {
              depth_percent: parseInt(milestone),
              funnel_stage: milestone >= 75 ? "consideration" : "awareness",
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isReady, heroVariant, ctaVariant]);

  // Time on page tracking
  useEffect(() => {
    if (!isReady) return;

    const startTime = Date.now();
    const timeIntervals = [10, 30, 60, 120, 300]; // seconds
    const tracked = {};

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timeIntervals.forEach((t) => {
        if (elapsed >= t && !tracked[t]) {
          tracked[t] = true;
          track("lp_time_on_page", { seconds: t });
          if (window.posthog) {
            window.posthog.capture("engagement_time", {
              seconds_on_page: t,
              engagement_level: t >= 60 ? "high" : t >= 30 ? "medium" : "low",
            });
          }
        }
      });
    }, 5000);

    // Track total time when leaving
    const handleBeforeUnload = () => {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      track("lp_exit", {
        total_seconds: totalTime,
        email_submitted: emailSubmitted,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isReady, emailSubmitted]);

  // Confetti explosion - weighted towards cyan
  const triggerConfetti = (x, y, count = 30) => {
    const colors = [
      "#00f6e0", "#00f6e0", "#00f6e0", // Cyan (weighted 3x)
      "#8a2be2", // Purple
      "#00bfff", // Light blue
      "#ffd93d", // Gold
    ];
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

      track(EVENTS.EMAIL_SIGNUP || "email_submitted", {
        email: email,
        source: "lp_hero",
        hero_variant: heroVariant,
        cta_variant: ctaVariant,
        member_number: nextMemberNumber,
        spots_left: spotsLeft,
        isExisting: result.value?.isExisting || false,
      });

      // PostHog: Full conversion tracking
      if (window.posthog) {
        // Identify user with email for cross-session tracking
        window.posthog.identify(email.trim().toLowerCase(), {
          email: email.trim().toLowerCase(),
          signup_source: "lp-bulletproof-ankles",
          member_number: nextMemberNumber,
          signup_date: new Date().toISOString(),
        });

        // Track conversion event
        window.posthog.capture("lead_converted", {
          funnel_stage: "conversion",
          conversion_type: "email_signup",
          hero_variant: heroVariant,
          cta_variant: ctaVariant,
          member_number: nextMemberNumber,
          is_existing_user: result.value?.isExisting || false,
        });

        // Set user property for future analysis
        window.posthog.people.set({
          last_conversion: new Date().toISOString(),
          conversion_count: 1,
        });
      }

      console.log("[LP] Lead captured:", email, result);

      setEmailSubmitted(true);
      triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 30);

      // Redirect to athlete profile setup (no auth required)
      setTimeout(() => {
        window.location.href = "/save-profile";
      }, 1500);
    } catch (error) {
      console.error("[LP] Lead capture error:", error);
      setEmailError("Something went wrong. Try again.");

      // PostHog: Track conversion failure
      if (window.posthog) {
        window.posthog.capture("conversion_failed", {
          funnel_stage: "conversion",
          error_message: error.message,
          email_attempted: email ? "yes" : "no",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cursor handlers
  const handleCursorEnter = () => {
    setIsHovering(true);
  };

  const handleCursorLeave = () => {
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
    <>
      {/* Premium Loading Screen */}
      <YPLoader
        isLoading={isLoading}
        onLoadComplete={handleLoadComplete}
        minDuration={2500}
      />

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

        {/* Ambient Effects - Stripe/Linear style */}
        <div className="lp-gradient-mesh" />
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
        <div className="lp-orb lp-orb-1" style={{ transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px)` }} />
        <div className="lp-orb lp-orb-2" style={{ transform: `translate(${-parallaxX * 1.5}px, ${-parallaxY * 1.5}px)` }} />

        {/* Dithered Gradient - Basedash-inspired */}
        <div className="lp-dithered-gradient" />


        {/* Sphere Background - Unicorn Studio (Full Page, Under Everything) */}
        <div className="lp-sphere-background">
          <div
            data-us-project="vTTCp5g4cVl9nwjlT56Z"
            className="lp-sphere-embed"
          />
        </div>

        {/* Top Logo Bar - Fixed Header */}
        <header className="lp-top-header">
          <div className="lp-header-content">
            <img
              src="/logo/yp-logo.png"
              alt="YP"
              className="lp-header-icon"
            />
            <BetaBadge variant="glow" className="lp-header-badge" />
            <span className="lp-header-spots">{spotsLeft} spots left</span>
          </div>
        </header>

        {/* 3D Obsidian Wolf - Top Layer, Between Logo and Hero */}
        <div
          className="lp-wolf-container"
          style={{
            transform: `translateX(-50%) rotateY(${(mousePos.x - 0.5) * 45}deg) rotateX(${(0.5 - mousePos.y) * 25}deg)`,
          }}
        >
          {/* Loading placeholder */}
          {!wolfLoaded && (
            <div className="lp-wolf-loading">
              <div className="lp-wolf-pulse" />
            </div>
          )}
          {/* Spline React Component - much lighter than iframe */}
          <Suspense fallback={null}>
            <Spline
              scene={WOLF_SPLINE_URL}
              onLoad={() => setWolfLoaded(true)}
              className={`lp-wolf-spline ${wolfLoaded ? 'loaded' : ''}`}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                opacity: wolfLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease-out',
                pointerEvents: 'none', // Disable direct Spline interaction
              }}
            />
          </Suspense>
        </div>

        {/* Main Content */}
        <main className="lp-main">

          {/* FLUX Layout - Single Axis of Attention */}
          <div className="lp-flux-container">

            {/* Hero Headline - The Desire (Split Test) with Scramble Animation */}
            <h1 className="lp-flux-headline">
              <span className="lp-flux-build">
                <TextScramble text={HERO_VARIANTS[heroVariant].line1} trigger={showContent} delay={0} duration={800} />
              </span>
              <span className="lp-flux-bulletproof">
                <span className="lp-chrome-base">
                  <TextScramble text={HERO_VARIANTS[heroVariant].accent} trigger={showContent} delay={300} duration={1200} />
                </span>
                <span className="lp-chrome-shimmer">{HERO_VARIANTS[heroVariant].accent}</span>
              </span>
              <span className="lp-flux-ankles">
                <TextScramble text={HERO_VARIANTS[heroVariant].line3} trigger={showContent} delay={800} duration={800} />
              </span>
            </h1>

            {/* Mobile Bottom Sheet Form Container */}
            <div className="lp-mobile-form-sheet">
              {/* Drag Handle - Mobile Only */}
              <div className="lp-drag-handle" />

              {/* Mobile Hero (duplicated for bottom sheet visibility) */}
              <div className="lp-mobile-hero">
                <BetaBadge variant="glow" className="lp-mobile-badge" />
                <h2 className="lp-mobile-headline">
                  <span className="lp-mobile-build">
                    <TextScramble text={HERO_VARIANTS[heroVariant].line1} trigger={showContent} delay={0} duration={600} />
                  </span>{" "}
                  <span className="lp-mobile-accent">
                    <TextScramble text={HERO_VARIANTS[heroVariant].accent} trigger={showContent} delay={200} duration={1000} />
                  </span>{" "}
                  <span className="lp-mobile-sub">
                    <TextScramble text={HERO_VARIANTS[heroVariant].line3} trigger={showContent} delay={600} duration={600} />
                  </span>
                </h2>
              </div>

              {/* Impact Stats Row - Basedash-inspired */}
              <div className="lp-impact-stats">
                <div className="lp-impact-stat">
                  <span className="lp-impact-number">42</span>
                  <span className="lp-impact-label">Days</span>
                </div>
                <div className="lp-impact-divider" />
                <div className="lp-impact-stat">
                  <span className="lp-impact-number">{spotsLeft}</span>
                  <span className="lp-impact-label">Spots Left</span>
                </div>
                <div className="lp-impact-divider" />
                <div className="lp-impact-stat">
                  <span className="lp-impact-number">{packStatus.countryCount}</span>
                  <span className="lp-impact-label">Countries</span>
                </div>
              </div>

              {/* Pack Status Section */}
              <div className="lp-pack-status">
                <div className="lp-progress-container">
                  <div className="lp-progress-bar">
                    <div
                      className="lp-progress-fill"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                  <span className="lp-progress-percent">{percentFilled}%</span>
                </div>
                <div className="lp-spots-text">
                  <span className="lp-spots-claimed">{packStatus.confirmedMembers}</span>
                  <span className="lp-spots-of"> OF </span>
                  <span className="lp-spots-total">{PACK_CONFIG.maxMembers}</span>
                  <span className="lp-spots-label"> SPOTS CLAIMED</span>
                </div>
              </div>

              {/* Country Flags Row */}
              <div className="lp-flag-row">
                <div className="lp-flags">
                  {packStatus.memberFlags.map((code) => (
                    <span key={code} className="lp-flag">{getFlagEmoji(code)}</span>
                  ))}
                  <span className="lp-flag-more">+ {packStatus.confirmedMembers - packStatus.memberFlags.length} more</span>
                </div>
                <div className="lp-country-count">
                  Athletes from {packStatus.countryCount} countries
                </div>
              </div>

              {/* Clean Input Stack */}
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
                  onFocus={() => {
                    track("email_input_focused", {
                      hero_variant: heroVariant,
                      cta_variant: ctaVariant,
                      spots_left: spotsLeft,
                    });
                  }}
                  disabled={emailSubmitted}
                  onMouseEnter={() => handleCursorEnter()}
                  onMouseLeave={handleCursorLeave}
                />

                {!emailSubmitted ? (
                  <button
                    type="submit"
                    className={`lp-reactor-button ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                    onMouseEnter={() => handleCursorEnter()}
                    onMouseLeave={handleCursorLeave}
                  >
                    <span className="lp-reactor-content">
                      <span className="lp-cta-lock">{isSubmitting ? "⏳" : "🔒"}</span>
                      <span>{isSubmitting ? "RESERVING YOUR SPOT..." : `JOIN AS MEMBER #${nextMemberNumber}`}</span>
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

              {/* Urgency Footer */}
              <div className="lp-urgency-footer">
                <span className="lp-spots-left">{spotsLeft} SPOTS LEFT</span>
                <span className="lp-urgency-divider">•</span>
                <span className="lp-close-date">PACK CLOSES {PACK_CONFIG.closeDate}</span>
              </div>

              {/* Tagline */}
              <p className="lp-flux-tagline">
                EVERY KID DESERVES PRO-LEVEL COACHING.
              </p>
            </div>

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

        {/* Legal Footer */}
        <footer className="lp-legal-footer">
          © 2026 YouthPerformance | YP | Privacy | Terms
        </footer>
      </div>
    </div>
    </>
  );
}
