import { useEffect, useState } from "react";
import { Badge, Button, Card } from "../components/ui";
import analytics, { EVENTS } from "../lib/analytics";

// Lightning bolt icon
const LightningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

function Offer() {
  const [isLoading, setIsLoading] = useState(false);

  // Track page view
  useEffect(() => {
    analytics.trackPageView("offer_barefoot_reset");
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);

    // Track checkout start
    analytics.track(EVENTS.CHECKOUT_START, {
      product: "barefoot_reset",
      price: 88,
      currency: "USD",
    });

    // TODO: Implement Stripe checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // For now, just simulate
    alert("Stripe checkout would open here");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Wolf Coach - Protocol Master */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/30 rounded-full scale-90" />
            <img
              src="/logo/wolffront.png"
              alt="Coach Wolf"
              className="relative w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(0,246,224,0.4)]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <LightningIcon className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400 text-xs uppercase tracking-wider font-medium">
              Lifetime Protocol Access
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-yp-display uppercase tracking-wide text-white mb-4">
            Barefoot Reset
          </h1>
          <p className="text-xl text-dark-text-secondary">
            The complete foundation protocol after Bulletproof Ankles — built for lasting results.
          </p>
        </div>

        {/* Price Card */}
        <Card className="mb-8 text-center border-cyan-500/20 bg-gradient-to-b from-black-200/80 to-black-100/50">
          <div className="mb-6">
            <p className="text-dark-text-tertiary line-through mb-1">$29/month Academy</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-yp-display text-white">$88</span>
              <span className="text-dark-text-secondary">one-time</span>
            </div>
            <p className="text-cyan-400 text-sm mt-2 uppercase tracking-wider">Lifetime Access</p>
          </div>

          <Button
            size="xl"
            fullWidth
            onClick={handleCheckout}
            loading={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,246,224,0.3)] mb-4"
          >
            <LightningIcon className="w-5 h-5 mr-2" />
            Unlock Barefoot Reset
          </Button>

          <div className="flex items-center justify-center gap-4 text-dark-text-tertiary text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure checkout
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              30-day guarantee
            </span>
          </div>
        </Card>

        {/* What's Included - Protocol Contents */}
        <Card className="mb-8 border border-cyan-500/10">
          <h2 className="text-sm font-medium text-cyan-400/70 uppercase tracking-wider mb-6 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Protocol Contents
          </h2>
          <ul className="space-y-4">
            {[
              { title: "4-Week Program", desc: "Complete video-guided protocol" },
              { title: "Daily Sessions", desc: "10-15 minute focused training" },
              { title: "Progress Tracking", desc: "See your improvement over time" },
              { title: "Coaching Cues", desc: "Clear explanations for every drill" },
              { title: "Lifetime Access", desc: "Return anytime, forever" },
              { title: "Future Updates", desc: "New content as we add it" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <LightningIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-dark-text-tertiary">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Social Proof - Pack Stats */}
        <Card className="mb-8 border border-cyan-500/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-black-300 border-2 border-black-100 flex items-center justify-center text-cyan-400 text-sm font-medium"
                >
                  {["JT", "MK", "AS", "RB"][i - 1]}
                </div>
              ))}
            </div>
            <div>
              <p className="font-medium text-white">2,400+ athletes</p>
              <p className="text-sm text-dark-text-tertiary">activated this month</p>
            </div>
          </div>
          <blockquote className="text-dark-text-secondary italic border-l-2 border-cyan-500/30 pl-4">
            "The sessions are short, but you can feel the difference in movement and balance."
          </blockquote>
          <p className="text-dark-text-tertiary text-sm mt-2 pl-4">
            — Parent of a youth basketball player
          </p>
        </Card>

        {/* FAQ - Intel Briefing */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-cyan-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Intel Briefing
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "How long are the sessions?",
                a: "Most sessions are 10-15 minutes. Designed to fit before school, after practice, or on weekends.",
              },
              {
                q: "What equipment do I need?",
                a: "Just resistance bands and a flat surface. No heavy equipment or gym required.",
              },
              {
                q: "Is this safe for kids?",
                a: "Yes. The protocol uses bands and bodyweight only. It's designed for youth athletes 8+.",
              },
              {
                q: "What if it doesn't work for me?",
                a: "Full refund within 30 days, no questions asked.",
              },
            ].map((item, i) => (
              <Card key={i} padding="sm" className="bg-black-200/50 border border-black-400/30">
                <p className="font-medium text-white mb-1">{item.q}</p>
                <p className="text-dark-text-secondary text-sm">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="text-center border-cyan-500/20 bg-gradient-to-b from-black-200/80 to-black-100/50">
          <h2 className="text-2xl font-yp-display uppercase text-white mb-4">
            Build Your Foundation Today
          </h2>
          <Button
            size="xl"
            fullWidth
            onClick={handleCheckout}
            loading={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,246,224,0.3)]"
          >
            <LightningIcon className="w-5 h-5 mr-2" />
            Unlock Barefoot Reset — $88
          </Button>
          <p className="text-dark-text-tertiary text-sm mt-3">
            One-time payment. Lifetime access. 30-day guarantee.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Offer;
