import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../components/ui";
import { useOnboarding } from "../context/OnboardingContext";

function BulletproofAnkles() {
  const { data } = useOnboarding();
  const [safetyOpen, setSafetyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-dark-text-tertiary">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">Bulletproof Ankles</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <Badge variant="cyan" className="mb-4">
            Free Protocol
          </Badge>
          <h1 className="text-4xl md:text-5xl font-yp-display uppercase tracking-wide text-white mb-4">
            Bulletproof Ankles
          </h1>

          {/* Answer-first (AEO) - Parent-friendly */}
          <p className="text-lg text-dark-text-secondary leading-relaxed">
            A short starter protocol to improve ankle stability, balance, and landing control.
            Strong feet unlock better cuts, stops, and first steps. Start here. Build the base.
          </p>
        </header>

        {/* Key Takeaways */}
        <Card className="mb-8">
          <h2 className="text-xl font-yp-display uppercase text-white mb-4">What You'll Build</h2>
          <ul className="space-y-3">
            {[
              "Stronger foot-ankle connection",
              "Better balance under load",
              "Quieter, more controlled landings",
              "Foundation for speed and cutting",
            ].map((item, i) => (
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
                <span className="text-dark-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Age Band Display */}
        {data.ageBand && (
          <Card className="mb-8 border-cyan-500/30">
            <div className="flex items-center gap-3">
              <Badge variant="cyan">
                {data.ageBand === "under8"
                  ? "Under 8"
                  : data.ageBand === "8-12"
                    ? "Ages 8-12"
                    : "13+"}
              </Badge>
              <span className="text-dark-text-secondary text-sm">
                Intensity adjusted for this age group
              </span>
            </div>
          </Card>
        )}

        {/* Safety Accordion */}
        <div className="mb-8">
          <button
            onClick={() => setSafetyOpen(!safetyOpen)}
            className="w-full flex items-center justify-between p-4 bg-black-50 border border-black-400 rounded-xl hover:border-black-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-medium text-white">Safety & Stop Rules</span>
            </div>
            <svg
              className={`w-5 h-5 text-dark-text-secondary transition-transform ${safetyOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {safetyOpen && (
            <div className="mt-2 p-4 bg-black-50 border border-black-400 rounded-xl">
              <h3 className="font-medium text-white mb-3">Stop immediately if:</h3>
              <ul className="space-y-2 text-dark-text-secondary text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  You feel sharp or sudden pain (not just muscle work)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  Pain increases during or after an exercise
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  You feel numbness, tingling, or weakness
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  Your form breaks down and you can't maintain control
                </li>
              </ul>
              <p className="mt-4 text-dark-text-tertiary text-xs">
                This protocol is for general athletic development. It is not medical advice. Consult
                a healthcare provider for injuries.
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <Link to="/app/stacks/bulletproof-ankles/run">
            <Button size="xl" fullWidth className="shadow-glow-cyan">
              Start the 8-Minute Stack
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Save Your Streak (Create Profile)
          </Button>
          <p className="text-center text-dark-text-tertiary text-sm">
            Create a free profile to save progress and unlock your 7-day plan
          </p>
        </div>

        {/* Protocol Overview */}
        <Card className="mt-12">
          <h2 className="text-xl font-yp-display uppercase text-white mb-4">What's in the Stack</h2>
          <div className="space-y-4">
            {[
              { name: "Tripod Foot Activation", duration: "60s", desc: "Wake up the foot muscles" },
              { name: "Short Foot Holds", duration: "45s x 2", desc: "Build arch strength" },
              { name: "Single Leg Balance", duration: "30s each", desc: "Test your stability" },
              { name: "Ankle Circles", duration: "20 each way", desc: "Improve range of motion" },
              { name: "Calf Raises (Slow)", duration: "10 reps", desc: "Controlled loading" },
              { name: "Landing Prep", duration: "5 soft jumps", desc: "Quiet landing practice" },
            ].map((exercise, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-black-400 last:border-0"
              >
                <div>
                  <p className="font-medium text-white">{exercise.name}</p>
                  <p className="text-sm text-dark-text-tertiary">{exercise.desc}</p>
                </div>
                <Badge variant="default">{exercise.duration}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <p className="text-dark-text-secondary mb-4">
            After completing the stack, take our 2-minute quiz to discover your athlete type.
          </p>
          <Link to="/quiz/athlete-type">
            <Button variant="ghost">Take the Athlete Type Quiz →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BulletproofAnkles;
