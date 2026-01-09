import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "../components/ui";
import { useOnboarding } from "../context/OnboardingContext";
import analytics from "../lib/analytics";

// Age band display labels
const AGE_LABELS = {
  under8: "Under 8",
  "8-12": "8-12 years",
  "13+": "13+ years",
};

// Space display labels
const SPACE_LABELS = {
  apartment: "Apartment",
  driveway: "Driveway/Backyard",
  gym: "Gym/Court",
  field: "Field",
};

// Sport display labels
const SPORT_LABELS = {
  basketball: "Basketball",
  barefoot: "Barefoot Reset",
  both: "Both",
  other: "Other Sport",
};

function PlanReady() {
  const navigate = useNavigate();
  const { data, getLaneOutput } = useOnboarding();
  const laneOutput = getLaneOutput();

  // Track page view
  useEffect(() => {
    analytics.trackPageView("plan_ready");
    analytics.track("plan_ready_view", {
      lane: data.lane,
      sport: data.sport,
      goals: data.goals?.map((g) => g.tag) || [],
    });
  }, [data]);

  // If no onboarding data, redirect to start
  useEffect(() => {
    if (!data.completed) {
      navigate("/start");
    }
  }, [data.completed, navigate]);

  const _goalLabels = data.goals?.map((g) => g.label).join(", ") || "General foundation";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <Badge variant="cyan" size="lg" className="mb-4">
            Plan Ready
          </Badge>
          <h1 className="text-3xl md:text-4xl font-yp-display uppercase text-white mb-2">
            Your starter plan is ready
          </h1>
          <p className="text-dark-text-secondary">Built for your specific goals and constraints</p>
        </div>

        {/* Plan Summary Card */}
        <Card className="mb-6 border-cyan-500/30">
          <h2 className="text-sm font-medium text-dark-text-tertiary uppercase tracking-wide mb-4">
            Your Plan Summary
          </h2>

          <div className="space-y-3">
            {/* Age Band */}
            {data.ageBand && (
              <div className="flex items-center justify-between py-2 border-b border-black-400">
                <span className="text-dark-text-secondary">Age Group</span>
                <span className="text-white font-medium">
                  {AGE_LABELS[data.ageBand] || data.ageBand}
                </span>
              </div>
            )}

            {/* Sport */}
            {data.sport && (
              <div className="flex items-center justify-between py-2 border-b border-black-400">
                <span className="text-dark-text-secondary">Sport Focus</span>
                <span className="text-white font-medium">
                  {SPORT_LABELS[data.sport] || data.sport}
                </span>
              </div>
            )}

            {/* Space */}
            {data.space && (
              <div className="flex items-center justify-between py-2 border-b border-black-400">
                <span className="text-dark-text-secondary">Training Space</span>
                <span className="text-white font-medium">
                  {SPACE_LABELS[data.space] || data.space}
                </span>
              </div>
            )}

            {/* Goals */}
            {data.goals?.length > 0 && (
              <div className="py-2">
                <span className="text-dark-text-secondary block mb-2">Your Goals</span>
                <div className="flex flex-wrap gap-2">
                  {data.goals.map((goal) => (
                    <span
                      key={goal.id}
                      className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-500 rounded-full"
                    >
                      {goal.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Lane-specific message */}
        <Card className="mb-6 bg-black-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🐺</span>
            </div>
            <div>
              <p className="text-white font-medium mb-1">{laneOutput.name} Track</p>
              <p className="text-dark-text-secondary text-sm">{laneOutput.tagline}</p>
            </div>
          </div>
        </Card>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate("/bulletproof-ankles")}
            className="shadow-glow-cyan"
          >
            View the Bulletproof Ankles Protocol
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate("/app/stacks/bulletproof-ankles/run")}
          >
            Start the 8-minute stack now
          </Button>
        </div>

        {/* Trust line */}
        <p className="text-center text-dark-text-tertiary text-sm mt-6">
          You'll be able to save your plan after you try the first session.
        </p>
      </div>
    </div>
  );
}

export default PlanReady;
