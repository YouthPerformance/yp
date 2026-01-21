import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BetaBadge } from "@yp/ui";
import "./Partnerships.css";

// Partner track configurations
const PARTNER_TRACKS = {
  parent: {
    id: "parent",
    icon: "👪",
    title: "Sports Parent",
    subtitle: "Individual parents promoting to their network",
    tiers: [
      { name: "Starter", requirements: "0-5 referrals", commission: "15%", perks: ["Personal discount code (15% off)", "Live referral dashboard", "Brand asset access"] },
      { name: "Builder", requirements: "6-20 referrals", commission: "18%", perks: ["Everything in Starter", "Early product access", "Exclusive YP swag"] },
      { name: "Champion", requirements: "21+ referrals", commission: "22%", perks: ["Everything in Builder", "Co-branded content", "Dedicated support", "Sponsored status"] },
    ],
  },
  coach: {
    id: "coach",
    icon: "🏀",
    title: "Coach / Trainer",
    subtitle: "Professional coaches with team access",
    tiers: [
      { name: "Rookie", requirements: "0-10 referrals", commission: "18%", perks: ["Personal discount code (15% off)", "Live referral dashboard", "Brand asset portal", "Team giveaway products"] },
      { name: "Pro", requirements: "11-30 referrals", commission: "22%", perks: ["Everything in Rookie", "Co-branded content", "Featured coach spotlight", "Early product access"] },
      { name: "Elite", requirements: "31+ referrals", commission: "25%", perks: ["Everything in Pro", "Dedicated account manager", "Sponsored coach status", "Custom program development"] },
    ],
  },
  team: {
    id: "team",
    icon: "🏆",
    title: "Team / Organization",
    subtitle: "Clubs, leagues, and youth organizations",
    tiers: [
      { name: "Club", requirements: "Team signup", commission: "15%", perks: ["Bulk team discount", "Group dashboard", "Brand asset access", "Fundraising tools"] },
      { name: "League", requirements: "5+ teams", commission: "20%", perks: ["Everything in Club", "League-wide pricing", "Co-branded materials", "Dedicated rep"] },
      { name: "Elite Org", requirements: "Custom", commission: "25%+", perks: ["Everything in League", "White-label options", "Custom integrations", "Revenue share program"] },
    ],
  },
};

// Stats for social proof
const PARTNER_STATS = {
  activePartners: 847,
  countriesReached: 23,
  totalEarnings: "$127K+",
  avgCommission: "$215/mo",
};

// How it works steps
const HOW_IT_WORKS = [
  { step: 1, title: "Apply", description: "Quick 2-minute application. Tell us about yourself and your reach.", time: "2 min" },
  { step: 2, title: "Get Approved", description: "Our team reviews and approves partners within 24-48 hours.", time: "24-48 hrs" },
  { step: 3, title: "Start Earning", description: "Access your dashboard, grab assets, share your link, earn commissions.", time: "Instant" },
];

// Asset categories preview
const ASSET_CATEGORIES = [
  { icon: "📱", name: "Social Media", count: "50+ templates", description: "Instagram, TikTok, Facebook ready" },
  { icon: "📧", name: "Email", count: "12 sequences", description: "Pre-written campaigns" },
  { icon: "🎬", name: "Video", count: "B-roll & demos", description: "Pro clips you can use" },
  { icon: "🎨", name: "Graphics", count: "100+ assets", description: "Logos, banners, images" },
];

// Testimonials
const TESTIMONIALS = [
  {
    name: "Coach Marcus",
    role: "Youth Basketball Coach",
    location: "Texas",
    quote: "My players' parents love YP. I've helped 40+ families and earned over $3,200 in commissions.",
    avatar: "🏀",
    earnings: "$3,200+",
  },
  {
    name: "Sarah M.",
    role: "Sports Mom",
    location: "California",
    quote: "Started sharing with my soccer mom group. Now earning enough to cover my son's travel ball fees.",
    avatar: "⚽",
    earnings: "$1,400+",
  },
  {
    name: "Peak Athletics",
    role: "Training Facility",
    location: "Florida",
    quote: "We integrated YP into our athlete development program. Game changer for our business.",
    avatar: "🏋️",
    earnings: "$8,500+",
  },
];

// FAQ items
const FAQ_ITEMS = [
  { q: "How do I get paid?", a: "Weekly PayPal payouts every Friday. No minimum threshold." },
  { q: "Can I be both a parent and a coach?", a: "Yes! You can choose the track that best fits your primary audience." },
  { q: "What if I don't have a large following?", a: "No follower minimums. Many of our top partners started with just their personal network." },
  { q: "Are there any fees to join?", a: "Absolutely not. The program is 100% free to join." },
  { q: "How do I track my referrals?", a: "Your dashboard shows real-time clicks, signups, and earnings." },
];

export default function Partnerships() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const containerRef = useRef(null);

  // Mouse tracking for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle application submit
  const handleApply = async (e) => {
    e.preventDefault();
    if (!email || !selectedTrack) return;

    setIsSubmitting(true);
    // Simulate API call - replace with actual Convex mutation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div ref={containerRef} className="partnerships-container">
      {/* Ambient Effects */}
      <div className="partnerships-noise" />
      <div className="partnerships-gradient-mesh" />
      <div
        className="partnerships-spotlight"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0, 246, 224, 0.08), transparent 40%)`,
        }}
      />

      {/* Hero Section */}
      <section className="partnerships-hero">
        <div className="partnerships-hero-content">
          <div className="partnerships-hero-badge">
            <span className="partnerships-badge-dot" />
            <span>Partner Program</span>
          </div>

          <h1 className="partnerships-hero-title">
            <span className="partnerships-title-line">PARTNER WITH</span>
            <span className="partnerships-title-accent">YOUTH PERFORMANCE</span>
          </h1>

          <p className="partnerships-hero-subtitle">
            Help families unlock elite training for their kids.
            <br />
            Earn up to <span className="partnerships-highlight">25% commission</span> on every referral.
          </p>

          {/* Stats Row */}
          <div className="partnerships-stats-row">
            <div className="partnerships-stat">
              <span className="partnerships-stat-value">{PARTNER_STATS.activePartners}</span>
              <span className="partnerships-stat-label">Active Partners</span>
            </div>
            <div className="partnerships-stat-divider" />
            <div className="partnerships-stat">
              <span className="partnerships-stat-value">{PARTNER_STATS.countriesReached}</span>
              <span className="partnerships-stat-label">Countries</span>
            </div>
            <div className="partnerships-stat-divider" />
            <div className="partnerships-stat">
              <span className="partnerships-stat-value">{PARTNER_STATS.totalEarnings}</span>
              <span className="partnerships-stat-label">Paid to Partners</span>
            </div>
            <div className="partnerships-stat-divider" />
            <div className="partnerships-stat">
              <span className="partnerships-stat-value">{PARTNER_STATS.avgCommission}</span>
              <span className="partnerships-stat-label">Avg. Monthly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Track Selection */}
      <section className="partnerships-tracks">
        <div className="partnerships-section-header">
          <h2 className="partnerships-section-title">Choose Your Track</h2>
          <p className="partnerships-section-subtitle">Select the path that matches your audience</p>
        </div>

        <div className="partnerships-track-grid">
          {Object.values(PARTNER_TRACKS).map((track) => (
            <button
              key={track.id}
              className={`partnerships-track-card ${selectedTrack === track.id ? "selected" : ""}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <div className="partnerships-track-icon">{track.icon}</div>
              <h3 className="partnerships-track-title">{track.title}</h3>
              <p className="partnerships-track-subtitle">{track.subtitle}</p>
              <div className="partnerships-track-commission">
                Up to <span>{track.tiers[track.tiers.length - 1].commission}</span>
              </div>
              {selectedTrack === track.id && (
                <div className="partnerships-track-selected">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Tier Details (shown when track selected) */}
      {selectedTrack && (
        <section className="partnerships-tiers">
          <div className="partnerships-section-header">
            <h2 className="partnerships-section-title">
              {PARTNER_TRACKS[selectedTrack].title} Tiers
            </h2>
            <p className="partnerships-section-subtitle">
              Unlock higher commissions and perks as you grow
            </p>
          </div>

          <div className="partnerships-tier-grid">
            {PARTNER_TRACKS[selectedTrack].tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`partnerships-tier-card ${hoveredTier === index ? "hovered" : ""}`}
                onMouseEnter={() => setHoveredTier(index)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                <div className="partnerships-tier-header">
                  <span className="partnerships-tier-badge">{tier.name}</span>
                  <span className="partnerships-tier-commission">{tier.commission}</span>
                </div>
                <div className="partnerships-tier-requirements">{tier.requirements}</div>
                <ul className="partnerships-tier-perks">
                  {tier.perks.map((perk, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
                {index === PARTNER_TRACKS[selectedTrack].tiers.length - 1 && (
                  <div className="partnerships-tier-popular">Most Popular</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="partnerships-how-it-works">
        <div className="partnerships-section-header">
          <h2 className="partnerships-section-title">How It Works</h2>
          <p className="partnerships-section-subtitle">Start earning in three simple steps</p>
        </div>

        <div className="partnerships-steps">
          {HOW_IT_WORKS.map((item, index) => (
            <div key={item.step} className="partnerships-step">
              <div className="partnerships-step-number">{item.step}</div>
              <div className="partnerships-step-content">
                <h3 className="partnerships-step-title">{item.title}</h3>
                <p className="partnerships-step-description">{item.description}</p>
                <span className="partnerships-step-time">{item.time}</span>
              </div>
              {index < HOW_IT_WORKS.length - 1 && <div className="partnerships-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* Brand Assets Preview */}
      <section className="partnerships-assets">
        <div className="partnerships-section-header">
          <h2 className="partnerships-section-title">Brand Asset Portal</h2>
          <p className="partnerships-section-subtitle">
            Everything you need to create on-brand content
          </p>
        </div>

        <div className="partnerships-assets-grid">
          {ASSET_CATEGORIES.map((category) => (
            <div key={category.name} className="partnerships-asset-card">
              <div className="partnerships-asset-icon">{category.icon}</div>
              <h3 className="partnerships-asset-name">{category.name}</h3>
              <span className="partnerships-asset-count">{category.count}</span>
              <p className="partnerships-asset-description">{category.description}</p>
            </div>
          ))}
        </div>

        <p className="partnerships-assets-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Full access unlocked after approval
        </p>
      </section>

      {/* Testimonials */}
      <section className="partnerships-testimonials">
        <div className="partnerships-section-header">
          <h2 className="partnerships-section-title">Partner Success Stories</h2>
          <p className="partnerships-section-subtitle">
            Real partners, real earnings
          </p>
        </div>

        <div className="partnerships-testimonials-grid">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="partnerships-testimonial-card">
              <div className="partnerships-testimonial-header">
                <div className="partnerships-testimonial-avatar">{testimonial.avatar}</div>
                <div className="partnerships-testimonial-info">
                  <h4 className="partnerships-testimonial-name">{testimonial.name}</h4>
                  <span className="partnerships-testimonial-role">{testimonial.role}</span>
                  <span className="partnerships-testimonial-location">{testimonial.location}</span>
                </div>
                <div className="partnerships-testimonial-earnings">{testimonial.earnings}</div>
              </div>
              <blockquote className="partnerships-testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="partnerships-faq">
        <div className="partnerships-section-header">
          <h2 className="partnerships-section-title">Frequently Asked Questions</h2>
        </div>

        <div className="partnerships-faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`partnerships-faq-item ${expandedFaq === index ? "expanded" : ""}`}
            >
              <button
                className="partnerships-faq-question"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span>{item.q}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={expandedFaq === index ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                </svg>
              </button>
              <div className="partnerships-faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="partnerships-cta">
        <div className="partnerships-cta-content">
          <h2 className="partnerships-cta-title">Ready to Partner?</h2>
          <p className="partnerships-cta-subtitle">
            Join {PARTNER_STATS.activePartners}+ partners earning with YP
          </p>

          {!submitted ? (
            <form className="partnerships-cta-form" onSubmit={handleApply}>
              <div className="partnerships-form-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="partnerships-input"
                  required
                />
                <button
                  type="submit"
                  className={`partnerships-submit ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting || !selectedTrack}
                >
                  {isSubmitting ? (
                    <span className="partnerships-submit-loading">Applying...</span>
                  ) : (
                    <>
                      <span>Apply Now</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              {!selectedTrack && (
                <p className="partnerships-form-hint">
                  ↑ Select a partner track above to continue
                </p>
              )}
            </form>
          ) : (
            <div className="partnerships-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3>Application Received!</h3>
              <p>We'll review your application and get back to you within 24-48 hours.</p>
            </div>
          )}

          <div className="partnerships-cta-benefits">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free to join
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Weekly payouts
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              No minimums
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="partnerships-footer">
        <p>© 2026 YouthPerformance</p>
        <div className="partnerships-footer-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </footer>
    </div>
  );
}
