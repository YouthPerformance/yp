import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../components/ui";
import { useOnboarding } from "../context/OnboardingContext";
import analytics from "../lib/analytics";

// Lightning bolt icon
const LightningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Animation - Protocol Generated */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer pulse ring */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            {/* Inner glow */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-600/10 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_40px_rgba(0,246,224,0.3)]">
              <LightningIcon className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <LightningIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400 text-xs uppercase tracking-wider font-medium">
              Protocol Generated
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-yp-display uppercase text-white mb-2">
            Your Starter Protocol is Ready
          </h1>
          <p className="text-dark-text-secondary">Built for your specific goals and constraints</p>
        </div>

        {/* Plan Summary Card - Mission Briefing */}
        <Card className="mb-6 border-cyan-500/20 bg-gradient-to-b from-black-200/80 to-black-100/50">
          <h2 className="text-xs font-medium text-cyan-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Mission Briefing
          </h2>

          <div className="space-y-3">
            {/* Age Band */}
            {data.ageBand && (
              <div className="flex items-center justify-between py-2 border-b border-black-400/50">
                <span className="text-dark-text-secondary">Age Group</span>
                <span className="text-white font-medium">
                  {AGE_LABELS[data.ageBand] || data.ageBand}
                </span>
              </div>
            )}

            {/* Sport */}
            {data.sport && (
              <div className="flex items-center justify-between py-2 border-b border-black-400/50">
                <span className="text-dark-text-secondary">Sport Focus</span>
                <span className="text-white font-medium">
                  {SPORT_LABELS[data.sport] || data.sport}
                </span>
              </div>
            )}

            {/* Space */}
            {data.space && (
              <div className="flex items-center justify-between py-2 border-b border-black-400/50">
                <span className="text-dark-text-secondary">Training Space</span>
                <span className="text-white font-medium">
                  {SPACE_LABELS[data.space] || data.space}
                </span>
              </div>
            )}

            {/* Goals */}
            {data.goals?.length > 0 && (
              <div className="py-2">
                <span className="text-dark-text-secondary block mb-2">Mission Objectives</span>
                <div className="flex flex-wrap gap-2">
                  {data.goals.map((goal) => (
                    <span
                      key={goal.id}
                      className="px-3 py-1 text-sm bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20"
                    >
                      {goal.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Lane-specific message - Track Assignment */}
        <Card className="mb-6 bg-black-200/30 border border-cyan-500/10">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 blur-lg bg-cyan-500/20 rounded-full" />
              <img
                src="/logo/wolffront.png"
                alt="Coach Wolf"
                className="relative w-12 h-12 object-contain"
              />
            </div>
            <div>
              <p className="text-white font-medium mb-1 flex items-center gap-2">
                {laneOutput.name} Track
                <LightningIcon className="w-3 h-3 text-cyan-400" />
              </p>
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
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,246,224,0.3)]"
          >
            <LightningIcon className="w-5 h-5 mr-2" />
            View Bulletproof Ankles Protocol
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate("/app/stacks/bulletproof-ankles/run")}
            className="border-cyan-500/20 hover:border-cyan-500/40"
          >
            Start the 8-Minute Stack Now
          </Button>
        </div>

        {/* Trust line */}
        <p className="text-center text-dark-text-tertiary text-sm mt-6 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Save your protocol after you try the first session.
        </p>
      </div>
    </div>
  );
}

export default PlanReady;
