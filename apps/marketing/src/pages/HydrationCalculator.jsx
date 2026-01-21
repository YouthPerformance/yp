import { useState, useEffect, useRef } from "react";
import "./HydrationCalculator.css";

// Wolf Algorithm
const calculateHydration = (weight, duration, isHighHeat) => {
  const baseline = weight * 0.75;
  const activityMultiplier = isHighHeat ? 8 : 5;
  const activityAdder = (duration / 15) * activityMultiplier;
  const total = baseline + activityAdder;
  const bottles = Math.ceil(total / 16.9); // Standard bottle size
  const perInterval = activityAdder / (duration / 15);
  const needsElectrolytes = duration > 60;

  return {
    baseline: Math.round(baseline),
    activityAdder: Math.round(activityAdder),
    total: Math.round(total),
    bottles,
    perInterval: Math.round(perInterval),
    needsElectrolytes,
  };
};

// Ripple effect component
const Ripple = ({ x, y }) => (
  <span className="ripple" style={{ left: x, top: y }} />
);

// Water level indicator
const WaterLevel = ({ percentage }) => (
  <div className="water-level-container">
    <div className="water-level" style={{ height: `${Math.min(percentage, 100)}%` }}>
      <div className="water-surface" />
    </div>
  </div>
);

// Animated number display
const AnimatedNumber = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="animated-number">
      {displayValue}
      {suffix && <span className="number-suffix">{suffix}</span>}
    </span>
  );
};

// Email capture modal
const EmailModal = ({ isOpen, onClose, hydrationData }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Integrate with Resend API
    // For now, simulate success
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");

    setTimeout(() => {
      onClose();
      setStatus("idle");
      setEmail("");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3>Plan Sent!</h3>
            <p>Check your inbox for your personalized hydration plan.</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Get Your Printable Plan</h3>
              <p>
                Includes your personalized hydration schedule + Adam's electrolyte recipes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={status === "loading"}
                />
                <div className="input-glow" />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="loading-spinner" />
                ) : (
                  "Send My Plan"
                )}
              </button>
            </form>

            <p className="modal-disclaimer">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default function HydrationCalculator() {
  const [weight, setWeight] = useState(100);
  const [duration, setDuration] = useState(60);
  const [isHighHeat, setIsHighHeat] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const results = calculateHydration(weight, duration, isHighHeat);

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleInputChange = (setter) => (e) => {
    setHasInteracted(true);
    setter(Number(e.target.value));
  };

  // SEO: Set document title and inject JSON-LD schema
  useEffect(() => {
    document.title = "Youth Athlete Hydration Calculator | YouthPerformance";

    // Inject JSON-LD schema
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Youth Athlete Hydration Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "Calculate optimal hydration for youth athletes based on weight, activity duration, and conditions.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: "YouthPerformance",
        url: "https://youthperformance.com",
      },
    };

    const existingScript = document.getElementById("hydration-schema");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "hydration-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }

    // Load fonts
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      const schema = document.getElementById("hydration-schema");
      if (schema) schema.remove();
    };
  }, []);

  return (
    <>

      <div className="hydration-page">
        {/* Animated background */}
        <div className="background-layer">
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
          <div className="gradient-orb orb-3" />
          <div className="noise-overlay" />
        </div>

        <main className="hydration-main">
          {/* Answer-first SEO content */}
          <header className="answer-header">
            <div className="wolf-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" className="wolf-icon">
                <path d="M12 2C8.5 2 5.5 4.5 4 8c-1 2.5-1 5.5 0 8 1.5 3.5 4.5 6 8 6s6.5-2.5 8-6c1-2.5 1-5.5 0-8-1.5-3.5-4.5-6-8-6zm-2 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-2 7c-2 0-3-1-3-1s1-1 3-1 3 1 3 1-1 1-3 1z" />
              </svg>
              <span>Wolf Hydration Lab</span>
            </div>
            <h1>
              <span className="title-accent">How much water</span>
              <br />
              does your athlete need?
            </h1>
            <p className="answer-text">
              <strong>Youth athletes need 0.5–1 oz per pound of body weight daily</strong>, plus
              5–10 oz every 15 minutes during intense activity. Use this calculator
              for your athlete's exact needs.
            </p>
          </header>

          <div className="calculator-layout">
            {/* Input Section */}
            <section className="input-section">
              <div className="input-card" onClick={createRipple}>
                {ripples.map((ripple) => (
                  <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
                ))}

                <div className="input-group">
                  <label htmlFor="weight">
                    <span className="label-text">Athlete Weight</span>
                    <span className="label-value">
                      <AnimatedNumber value={weight} suffix=" lbs" />
                    </span>
                  </label>
                  <div className="slider-container">
                    <input
                      type="range"
                      id="weight"
                      min="40"
                      max="250"
                      value={weight}
                      onChange={handleInputChange(setWeight)}
                      className="slider"
                    />
                    <div
                      className="slider-fill"
                      style={{ width: `${((weight - 40) / 210) * 100}%` }}
                    />
                    <div className="slider-markers">
                      <span>40</span>
                      <span>100</span>
                      <span>175</span>
                      <span>250</span>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="duration">
                    <span className="label-text">Activity Duration</span>
                    <span className="label-value">
                      <AnimatedNumber value={duration} suffix=" min" />
                    </span>
                  </label>
                  <div className="slider-container">
                    <input
                      type="range"
                      id="duration"
                      min="15"
                      max="240"
                      step="15"
                      value={duration}
                      onChange={handleInputChange(setDuration)}
                      className="slider"
                    />
                    <div
                      className="slider-fill"
                      style={{ width: `${((duration - 15) / 225) * 100}%` }}
                    />
                    <div className="slider-markers">
                      <span>15m</span>
                      <span>1h</span>
                      <span>2h</span>
                      <span>4h</span>
                    </div>
                  </div>
                </div>

                <div className="input-group toggle-group">
                  <span className="label-text">Conditions</span>
                  <div className="toggle-container">
                    <button
                      className={`toggle-option ${!isHighHeat ? "active" : ""}`}
                      onClick={() => {
                        setIsHighHeat(false);
                        setHasInteracted(true);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                      Standard
                    </button>
                    <button
                      className={`toggle-option heat ${isHighHeat ? "active" : ""}`}
                      onClick={() => {
                        setIsHighHeat(true);
                        setHasInteracted(true);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
                      </svg>
                      High Heat
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Results Section */}
            <section className={`results-section ${hasInteracted ? "visible" : ""}`}>
              <div className="results-card">
                <div className="results-header">
                  <WaterLevel percentage={(results.total / 200) * 100} />
                  <div className="results-title">
                    <span className="results-label">Your Hydration Target</span>
                    <div className="results-total">
                      <AnimatedNumber value={results.total} />
                      <span className="unit">oz</span>
                    </div>
                    <span className="results-bottles">
                      ~{results.bottles} bottles
                    </span>
                  </div>
                </div>

                <div className="results-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-icon pre-game">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <div className="breakdown-content">
                      <span className="breakdown-label">Pre-Game</span>
                      <span className="breakdown-time">2 hours before</span>
                    </div>
                    <div className="breakdown-value">16 oz</div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-icon during">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div className="breakdown-content">
                      <span className="breakdown-label">During Activity</span>
                      <span className="breakdown-time">Every 15 minutes</span>
                    </div>
                    <div className="breakdown-value">
                      <AnimatedNumber value={results.perInterval} suffix=" oz" />
                    </div>
                  </div>

                  <div className="breakdown-item">
                    <div className="breakdown-icon post-game">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <div className="breakdown-content">
                      <span className="breakdown-label">Post-Game</span>
                      <span className="breakdown-time">Recovery window</span>
                    </div>
                    <div className="breakdown-value">20 oz + protein</div>
                  </div>
                </div>

                {/* Wolf Alert */}
                {results.needsElectrolytes && (
                  <div className="wolf-alert">
                    <div className="alert-pulse" />
                    <div className="alert-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <path d="M12 9v4M12 17h.01" />
                      </svg>
                    </div>
                    <div className="alert-content">
                      <span className="alert-title">Wolf Alert: Electrolytes Needed</span>
                      <span className="alert-text">
                        Activities over 60 minutes deplete sodium and potassium.
                        Add a sports drink or electrolyte tablets to prevent cramping.
                      </span>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="results-ctas">
                  <button
                    className="cta-primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                    Get Printable Plan
                  </button>
                  <a
                    href="https://shop.youthperformance.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-secondary"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Shop YP Bottle
                  </a>
                </div>
              </div>

              {/* Electrolyte Recipes Teaser */}
              <div className="recipes-teaser">
                <h3>DIY Electrolyte Recipes</h3>
                <div className="recipe-cards">
                  <div className="recipe-card">
                    <span className="recipe-name">Citrus Splash</span>
                    <span className="recipe-desc">Orange juice + pinch of salt + honey</span>
                  </div>
                  <div className="recipe-card">
                    <span className="recipe-name">Coconut Restore</span>
                    <span className="recipe-desc">Coconut water + lime + sea salt</span>
                  </div>
                  <div className="recipe-card locked">
                    <span className="recipe-name">Wolf's Secret Mix</span>
                    <span className="recipe-desc">
                      <button onClick={() => setIsModalOpen(true)}>
                        Unlock with email
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Science Section */}
          <section className="science-section">
            <h2>The Science Behind the Numbers</h2>
            <div className="science-grid">
              <div className="science-card">
                <div className="science-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3>Galpin Equation</h3>
                <p>
                  Based on Dr. Andy Galpin's research on high-performance hydration,
                  adapted for youth athletes with appropriate safety margins.
                </p>
              </div>
              <div className="science-card">
                <div className="science-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3>NATA Guidelines</h3>
                <p>
                  Aligned with National Athletic Trainers' Association youth
                  hydration standards for safe, effective fluid replacement.
                </p>
              </div>
              <div className="science-card">
                <div className="science-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3>Heat Adjustment</h3>
                <p>
                  High heat mode increases fluid intake by 60% to account for
                  elevated sweat rates during hot weather or tournament conditions.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="hydration-footer">
          <p>
            <strong>Disclaimer:</strong> This calculator provides general hydration
            guidelines. Individual needs vary. Consult a sports medicine professional
            for personalized advice.
          </p>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </footer>

        <EmailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hydrationData={results}
        />
      </div>
    </>
  );
}
