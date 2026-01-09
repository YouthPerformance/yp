import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Button, Card, Input } from "../components/ui";
import analytics, { EVENTS } from "../lib/analytics";

const identityContent = {
  "force-leaker": {
    title: "Force Leaker",
    coldReading:
      "You look explosive in the first 10 minutes... then something weird happens. Your first step feels half a beat slower. Cuts feel a little sloppy. You're not gassed—your stabilizers are. The engine is strong. The base isn't sealing the power.",
    explanation:
      "When the foot/ankle system can't hold a clean position under speed, force leaks on every plant. That leak shows up as wobble, slower direction changes, and louder landings.",
    outcomes: [
      "Cuts feel sharper",
      "Stops feel cleaner",
      "Landings get quieter",
      "Confidence goes up because your body feels predictable",
    ],
    fixPlanPreview: [
      "Day 1: Tripod + short-foot activation",
      "Day 2: Single-leg stability under load",
      "Day 3: Lateral holds + band work",
      "Day 4-7: Progressive integration drills",
    ],
  },
  "elasticity-block": {
    title: "Elasticity Block",
    coldReading:
      "You do the work. You grind. But you don't feel bouncy. You feel... stuck to the floor. Like your legs are strong, but your movement doesn't 'snap.' That's not effort—that's elastic timing missing at the base.",
    explanation:
      "Elasticity is the ability to load and return force smoothly. If the foot/ankle chain is stiff or mistimed, you lose spring and feel heavy even when you're strong.",
    outcomes: [
      "Feel lighter on your feet",
      "First step becomes explosive",
      "Jumps feel more effortless",
      "Energy stays high longer",
    ],
    fixPlanPreview: [
      "Day 1: Soft tissue prep + ankle mobility",
      "Day 2: Eccentric loading patterns",
      "Day 3: Plyometric prep sequences",
      "Day 4-7: Elastic rebound training",
    ],
  },
  "absorption-deficit": {
    title: "Absorption Deficit",
    coldReading:
      "Loud. Heavy. Sometimes your knees or shins feel 'worked' even when the session wasn't insane. That's because your body is taking impact the hard way—your feet aren't absorbing cleanly yet.",
    explanation:
      "Absorption is controlled deceleration. If the foot/ankle chain isn't absorbing force, impact travels upward and steals durability.",
    outcomes: [
      "Quiet landings become natural",
      "Smoother stops and decelerations",
      "Less joint stress after training",
      "Stay fresh longer in games",
    ],
    fixPlanPreview: [
      "Day 1: Soft landing progressions",
      "Day 2: Deceleration mechanics",
      "Day 3: Eccentric calf + foot work",
      "Day 4-7: Impact absorption drills",
    ],
  },
  "control-gap": {
    title: "Control Gap",
    coldReading:
      "You have days where you feel smooth... and days where you feel clunky for no reason. Same body. Same effort. Different result. That inconsistency is a control problem—your foot mechanics aren't 'online' every rep yet.",
    explanation:
      "Control is repeatability. If your base position changes rep to rep, your whole chain changes—so performance feels random.",
    outcomes: [
      "Consistent movement every rep",
      "Confidence in any position",
      "Feel 'locked in' more often",
      "Performance becomes predictable",
    ],
    fixPlanPreview: [
      "Day 1: Proprioception drills",
      "Day 2: Closed-eye balance work",
      "Day 3: Position holds under fatigue",
      "Day 4-7: Variable surface training",
    ],
  },
};

function QuizResults() {
  const location = useLocation();
  const { identityType = "force-leaker" } = location.state || {};
  const content = identityContent[identityType];

  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track page view with identity
  useEffect(() => {
    analytics.trackPageView("quiz_results");
    analytics.track("quiz_results_view", {
      identity_type: identityType,
    });
  }, [identityType]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Track email submission
    analytics.track(EVENTS.EMAIL_SUBMITTED, {
      email,
      identity_type: identityType,
      source: "quiz_results",
    });
    analytics.identify(email, {
      identity_type: identityType,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUnlocked(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Result Header */}
        <div className="text-center mb-10">
          <Badge variant="cyan" size="lg" className="mb-4">
            Your Athlete Type
          </Badge>
          <h1 className="text-4xl md:text-5xl font-yp-display uppercase tracking-wide text-white mb-2">
            {content.title}
          </h1>
        </div>

        {/* Cold Reading */}
        <Card className="mb-8 border-cyan-500/30">
          <p className="text-lg text-dark-text-secondary leading-relaxed italic">
            "{content.coldReading}"
          </p>
        </Card>

        {/* Explanation */}
        <div className="mb-8">
          <h2 className="text-xl font-yp-display uppercase text-white mb-3">What This Means</h2>
          <p className="text-dark-text-secondary leading-relaxed">{content.explanation}</p>
        </div>

        {/* Outcomes */}
        <Card className="mb-8">
          <h2 className="text-xl font-yp-display uppercase text-white mb-4">What Changes</h2>
          <ul className="space-y-3">
            {content.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-dark-text-secondary">{outcome}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Plan - Gated */}
        <div className="mb-10">
          <h2 className="text-xl font-yp-display uppercase text-white mb-4">
            Your 7-Day Starter Plan
          </h2>

          {!isUnlocked ? (
            <div className="relative">
              {/* Blurred Preview */}
              <Card className="blur-sm select-none pointer-events-none">
                <ul className="space-y-3">
                  {content.fixPlanPreview.map((item, i) => (
                    <li key={i} className="text-dark-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Gate Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                <Card className="w-full max-w-sm mx-4 text-center">
                  <h3 className="text-xl font-yp-display uppercase text-white mb-2">
                    Get your personalized plan
                  </h3>
                  <p className="text-dark-text-secondary text-sm mb-4">
                    A simple sequence designed for this movement pattern. Safe progressions.
                  </p>
                  <form onSubmit={handleUnlock}>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-3"
                    />
                    <Button type="submit" fullWidth loading={isSubmitting}>
                      Send My Plan
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-cyan-500/30">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-success font-medium">Plan unlocked! Check your email.</span>
              </div>
              <ul className="space-y-3">
                {content.fixPlanPreview.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-cyan-500 font-medium">{i + 1}.</span>
                    <span className="text-dark-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Upsell CTA */}
        <Card className="text-center bg-gradient-to-b from-black-50 to-black border-cyan-500/30">
          <h2 className="text-2xl font-yp-display uppercase text-white mb-2">
            Ready to build the foundation?
          </h2>
          <p className="text-dark-text-secondary mb-6">
            Get the complete Barefoot Reset protocol — video-guided, safe progressions.
          </p>
          <Link to="/offer/barefoot-reset">
            <Button size="lg" className="shadow-glow-cyan">
              Unlock Barefoot Reset — $88
            </Button>
          </Link>
          <p className="text-dark-text-tertiary text-sm mt-3">
            Normally included in the $29/mo Academy
          </p>
        </Card>

        {/* Share */}
        <div className="mt-8 text-center">
          <p className="text-dark-text-tertiary text-sm mb-2">Know someone who needs this?</p>
          <Button variant="ghost" size="sm">
            Share Your Result →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
