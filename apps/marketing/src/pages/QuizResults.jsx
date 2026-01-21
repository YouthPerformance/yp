import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Button, Card, Input } from "../components/ui";
import analytics, { EVENTS } from "../lib/analytics";

// Lightning bolt icon
const LightningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const identityContent = {
  "force-leaker": {
    title: "Force Leaker",
    code: "FL-01",
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
    code: "EB-02",
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
    code: "AD-03",
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
    code: "CG-04",
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
  const [focusedField, setFocusedField] = useState(false);

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
        {/* Wolf Coach - Diagnostic Complete */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full scale-75" />
            <img
              src="/logo/wolffront.png"
              alt="Coach Wolf"
              className="relative w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(0,246,224,0.3)]"
            />
          </div>
        </div>

        {/* Result Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <LightningIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400 text-xs uppercase tracking-wider font-medium">
              Diagnostic Complete • Code {content.code}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-yp-display uppercase tracking-wide text-white mb-2">
            {content.title}
          </h1>
        </div>

        {/* Cold Reading - Intel Report */}
        <Card className="mb-8 border-cyan-500/20 bg-gradient-to-b from-black-200/80 to-black-100/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Intel Report</span>
          </div>
          <p className="text-lg text-dark-text-secondary leading-relaxed italic">
            "{content.coldReading}"
          </p>
        </Card>

        {/* Explanation */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-cyan-400/70 uppercase tracking-wider mb-3 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            What This Means
          </h2>
          <p className="text-dark-text-secondary leading-relaxed">{content.explanation}</p>
        </div>

        {/* Outcomes - What Changes */}
        <Card className="mb-8 border border-cyan-500/10">
          <h2 className="text-sm font-medium text-cyan-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Protocol Outcomes
          </h2>
          <ul className="space-y-3">
            {content.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <LightningIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-dark-text-secondary">{outcome}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Plan - Gated */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-cyan-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Your 7-Day Starter Protocol
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
                <Card className="w-full max-w-sm mx-4 text-center border border-cyan-500/20">
                  <h3 className="text-xl font-yp-display uppercase text-white mb-2">
                    Unlock Your Protocol
                  </h3>
                  <p className="text-dark-text-secondary text-sm mb-4">
                    A custom sequence designed for this chassis type. Safe progressions.
                  </p>
                  <form onSubmit={handleUnlock}>
                    <div className={`relative rounded-lg mb-3 transition-all duration-300 ${focusedField ? 'ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(0,246,224,0.15)]' : ''}`}>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField(true)}
                        onBlur={() => setFocusedField(false)}
                        className="bg-black-300/50 border-black-400/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      fullWidth
                      loading={isSubmitting}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider"
                    >
                      <LightningIcon className="w-4 h-4 mr-2" />
                      Deploy Protocol
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-cyan-500/20 bg-gradient-to-b from-black-200/80 to-black-100/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-cyan-400 font-medium uppercase tracking-wider text-sm">Protocol Deployed • Check Your Inbox</span>
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
        <Card className="text-center bg-gradient-to-b from-black-100/80 to-black-50/50 border-cyan-500/20">
          <h2 className="text-2xl font-yp-display uppercase text-white mb-2">
            Ready to Build the Foundation?
          </h2>
          <p className="text-dark-text-secondary mb-6">
            Get the complete Barefoot Reset protocol — video-guided, safe progressions.
          </p>
          <Link to="/offer/barefoot-reset">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,246,224,0.3)]"
            >
              <LightningIcon className="w-5 h-5 mr-2" />
              Unlock Barefoot Reset — $88
            </Button>
          </Link>
          <p className="text-dark-text-tertiary text-sm mt-3">
            Normally included in the $29/mo Academy
          </p>
        </Card>

        {/* Share */}
        <div className="mt-8 text-center">
          <p className="text-dark-text-tertiary text-sm mb-2">Know an athlete who needs this?</p>
          <Button variant="ghost" size="sm" className="text-cyan-400/70 hover:text-cyan-400">
            Share Diagnostic →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
