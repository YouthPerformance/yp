import { useState, useEffect, useRef } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@shopify/remix-oxygen";

export const meta: MetaFunction = () => {
  return [
    { title: "NeoBall Affiliates | Earn Promoting Silent Training" },
    {
      name: "description",
      content:
        "Join the NeoBall affiliate program. Earn 20% commission promoting the silent training ball. Perfect for content creators, coaches, and basketball lovers.",
    },
    { property: "og:title", content: "NeoBall Affiliate Program" },
    {
      property: "og:description",
      content: "Earn 20% commission on every NeoBall sale. Join 500+ affiliates.",
    },
  ];
};

// Affiliate tiers - simple structure
const AFFILIATE_TIERS = [
  {
    name: "Starter",
    commission: "15%",
    requirement: "Sign up",
    perks: ["Personal affiliate link", "Real-time dashboard", "Marketing assets"],
  },
  {
    name: "Creator",
    commission: "20%",
    requirement: "10+ sales",
    perks: ["Everything in Starter", "Free NeoBall for content", "Early access to new products"],
    popular: true,
  },
  {
    name: "Partner",
    commission: "25%",
    requirement: "50+ sales",
    perks: ["Everything in Creator", "Custom discount codes", "Co-branded content", "Dedicated support"],
  },
];

// Stats
const STATS = {
  affiliates: "500+",
  paid: "$45K+",
  avgOrder: "$89",
  conversionRate: "8.2%",
};

// Content ideas
const CONTENT_IDEAS = [
  { icon: "🏀", title: "Unboxing", desc: "First impressions get views" },
  { icon: "🌙", title: "Late Night Drills", desc: "Show the silence in action" },
  { icon: "🏠", title: "Apartment Training", desc: "No gym? No problem." },
  { icon: "📊", title: "Before/After", desc: "Document the improvement" },
];

// FAQ
const FAQ = [
  { q: "How do I get paid?", a: "PayPal or bank transfer. Payouts every Friday, no minimum." },
  { q: "Do I need a big following?", a: "No. Many top affiliates have under 1,000 followers. Authenticity wins." },
  { q: "Can I use my own discount code?", a: "Yes! Partner tier affiliates get custom codes for their audience." },
  { q: "How long do cookies last?", a: "30 days. If someone clicks your link, you get credit for 30 days." },
];

export default function Partnerships() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Mouse tracking for spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate submission - replace with actual API
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] relative overflow-hidden">
      {/* Ambient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0, 246, 224, 0.06), transparent 40%)`,
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-wider">
            NEOBALL
          </Link>
          <Link
            to="/products/neoball"
            className="text-xs font-mono tracking-widest text-[var(--c-text-dim)] hover:text-[var(--c-cyan)] transition-colors"
          >
            SHOP →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--c-border)] bg-[var(--c-panel)] mb-8">
            <span className="w-2 h-2 bg-[var(--c-cyan)] rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-[var(--c-text-dim)]">
              AFFILIATE PROGRAM
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
            EARN WITH
            <br />
            <span className="text-[var(--c-cyan)]">NEOBALL</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--c-text-muted)] max-w-xl mx-auto mb-10">
            Promote the silent training ball. Earn up to{" "}
            <span className="text-[var(--c-cyan)] font-semibold">25% commission</span> on every sale.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {Object.entries(STATS).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-[var(--c-cyan)]">{value}</div>
                <div className="text-xs font-mono tracking-wider text-[var(--c-text-dim)] mt-1">
                  {key === "affiliates" && "AFFILIATES"}
                  {key === "paid" && "PAID OUT"}
                  {key === "avgOrder" && "AVG ORDER"}
                  {key === "conversionRate" && "CONVERSION"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">COMMISSION TIERS</h2>
          <p className="text-center text-[var(--c-text-dim)] mb-12">
            Earn more as you grow
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {AFFILIATE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  tier.popular
                    ? "border-[var(--c-cyan)] bg-[var(--c-cyan)]/5"
                    : "border-[var(--c-border)] bg-[var(--c-panel)] hover:border-[var(--c-cyan)]/30"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--c-cyan)] text-[var(--c-bg)] text-[10px] font-mono tracking-wider rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-xs font-mono tracking-wider text-[var(--c-text-dim)] mb-2">
                  {tier.requirement}
                </div>
                <div className="font-display text-2xl mb-1">{tier.name}</div>
                <div className="font-display text-4xl text-[var(--c-cyan)] mb-6">
                  {tier.commission}
                </div>

                <ul className="space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--c-text-muted)]">
                      <svg
                        className="w-4 h-4 text-[var(--c-cyan)] mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Ideas */}
      <section className="py-20 px-6 bg-[var(--c-surface)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">CONTENT THAT CONVERTS</h2>
          <p className="text-center text-[var(--c-text-dim)] mb-12">
            Ideas from our top-earning affiliates
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTENT_IDEAS.map((idea) => (
              <div
                key={idea.title}
                className="p-5 rounded-xl border border-[var(--c-border)] bg-[var(--c-panel)] hover:border-[var(--c-cyan)]/30 transition-colors text-center"
              >
                <div className="text-3xl mb-3">{idea.icon}</div>
                <div className="font-display text-lg mb-1">{idea.title}</div>
                <div className="text-xs text-[var(--c-text-dim)]">{idea.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">HOW IT WORKS</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Apply", desc: "Takes 2 minutes. Instant approval for most applicants." },
              { num: "02", title: "Share", desc: "Get your link + assets. Post content. Share with your audience." },
              { num: "03", title: "Earn", desc: "Track sales in real-time. Get paid every Friday." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="font-mono text-[var(--c-cyan)] text-sm mb-2">{step.num}</div>
                <div className="font-display text-2xl mb-2">{step.title}</div>
                <div className="text-sm text-[var(--c-text-dim)]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[var(--c-surface)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">FAQ</h2>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border border-[var(--c-border)] rounded-xl overflow-hidden bg-[var(--c-panel)]"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-[var(--c-text-dim)] transition-transform ${
                      expandedFaq === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ${
                    expandedFaq === i ? "pb-4 max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-[var(--c-text-muted)]">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">READY TO EARN?</h2>
          <p className="text-[var(--c-text-dim)] mb-8">
            Join {STATS.affiliates} affiliates promoting NeoBall
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-4 rounded-xl bg-[var(--c-panel)] border border-[var(--c-border)] text-[var(--c-text)] placeholder:text-[var(--c-text-dim)] focus:outline-none focus:border-[var(--c-cyan)] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl bg-[var(--c-cyan)] text-[var(--c-bg)] font-display text-lg tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "APPLYING..."
                ) : (
                  <>
                    APPLY NOW
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-xl border border-[var(--c-cyan)] bg-[var(--c-cyan)]/10">
              <svg
                className="w-12 h-12 text-[var(--c-cyan)] mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 className="font-display text-2xl mb-2">APPLICATION RECEIVED</h3>
              <p className="text-sm text-[var(--c-text-muted)]">
                Check your email for next steps. Most applications approved within 24 hours.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-[var(--c-text-dim)]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[var(--c-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free to join
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[var(--c-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Weekly payouts
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[var(--c-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              30-day cookies
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--c-border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[var(--c-text-dim)]">© 2026 NeoBall</span>
          <div className="flex items-center gap-6 text-xs text-[var(--c-text-dim)]">
            <Link to="/legal/terms" className="hover:text-[var(--c-cyan)] transition-colors">
              Terms
            </Link>
            <Link to="/legal/privacy" className="hover:text-[var(--c-cyan)] transition-colors">
              Privacy
            </Link>
            <Link to="/" className="hover:text-[var(--c-cyan)] transition-colors">
              Shop
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
