// MeetWolf - Elite Wolf Coach Profile Editor
// E10-7: Create editable AI coach profile based on user inputs

import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button, Card } from "../components/ui";
import { generateWolfPrompt } from "../config/interestPills";
import { useOnboarding } from "../context/OnboardingContext";
import analytics, { EVENTS } from "../lib/analytics";

// Lightning bolt icon
const LightningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

function MeetWolf() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data } = useOnboarding();

  // Convex queries and mutations
  const email = user?.primaryEmailAddress?.emailAddress;
  const profile = useQuery(api.users.getByEmail, email ? { email } : "skip");
  const updateWolfPromptMutation = useMutation(api.users.updateWolfPrompt);

  // Generate initial prompt from onboarding data
  const initialPrompt = generateWolfPrompt({
    ...data,
    childNickname: data.childNickname || "your athlete",
  });

  const [prompt, setPrompt] = useState(initialPrompt);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved prompt from profile if available
  useEffect(() => {
    if (profile?.wolfPrompt) {
      setPrompt(profile.wolfPrompt);
    }
  }, [profile]);

  // Track page view
  useEffect(() => {
    analytics.trackPageView("meet_wolf");
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    // Track prompt customization
    analytics.track(EVENTS.WOLF_PROMPT_SAVED, {
      was_edited: prompt !== initialPrompt,
      prompt_length: prompt.length,
    });

    try {
      // Save to Convex if we have a profile
      if (profile?._id) {
        await updateWolfPromptMutation({
          profileId: profile._id,
          wolfPrompt: prompt,
        });
      }
    } catch (err) {
      console.error("Error saving wolf prompt:", err);
    }

    setIsSaving(false);
    setIsEditing(false);

    // Navigate to chat
    navigate("/wolf-chat");
  };

  const handleReset = () => {
    setPrompt(initialPrompt);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Wolf Coach - Hero */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/30 rounded-full scale-90" />
            <img
              src="/logo/wolffront.png"
              alt="Coach Wolf"
              className="relative w-28 h-28 object-contain drop-shadow-[0_0_40px_rgba(0,246,224,0.4)]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <LightningIcon className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-400 text-xs uppercase tracking-wider font-medium">
              Coach Assignment
            </span>
          </div>
          <h1 className="text-3xl font-yp-display uppercase text-white mb-2">Meet Your Alpha</h1>
          <p className="text-dark-text-secondary">
            Wolf is your AI training commander. Here's what Wolf knows about{" "}
            <span className="text-cyan-400">{data.childNickname || "your athlete"}</span>.
          </p>
        </div>

        {/* Profile Summary - Intel Card */}
        <Card className="mb-6 bg-gradient-to-b from-black-200/80 to-black-100/50 border border-cyan-500/10">
          <h2 className="text-xs font-medium text-cyan-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LightningIcon className="w-3 h-3" />
            Athlete Intel
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-black-400/50">
              <span className="text-dark-text-tertiary">Callsign</span>
              <span className="text-white font-medium">{data.childNickname || "Your Athlete"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black-400/50">
              <span className="text-dark-text-tertiary">Age Band</span>
              <span className="text-white font-medium">{data.ageBand || "Youth"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black-400/50">
              <span className="text-dark-text-tertiary">Sport</span>
              <span className="text-white font-medium capitalize">{data.sport || "Multi-sport"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black-400/50">
              <span className="text-dark-text-tertiary">Training Space</span>
              <span className="text-white font-medium capitalize">{data.space || "Home"}</span>
            </div>
          </div>
          {data.goals?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black-400/50">
              <span className="text-dark-text-tertiary text-xs uppercase tracking-wider">Mission Objectives</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.goals.map((goal, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20"
                  >
                    {goal.label || goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Wolf Prompt Editor - Command Briefing */}
        <Card className="mb-6 border border-cyan-500/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-cyan-400/70 uppercase tracking-wider flex items-center gap-2">
              <LightningIcon className="w-3 h-3" />
              Wolf's Command Briefing
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-cyan-500 text-xs uppercase tracking-wider hover:text-cyan-400 transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Intel"}
            </button>
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
                className="w-full bg-black-300/50 border border-cyan-500/20 rounded-lg p-3 text-dark-text-secondary text-sm resize-none focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,246,224,0.1)] transition-all"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold uppercase tracking-wider"
                >
                  Save Intel
                </Button>
                <Button variant="secondary" size="sm" onClick={handleReset} className="border-cyan-500/20">
                  Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-black-300/30 rounded-lg p-3 text-dark-text-secondary text-sm whitespace-pre-wrap border border-black-400/30">
              {prompt}
            </div>
          )}
        </Card>

        {/* Tip - Protocol Note */}
        <Card className="mb-8 bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-dark-text-secondary text-sm flex items-start gap-3">
            <LightningIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <span className="text-cyan-400 font-medium">Protocol Note:</span> You can update this briefing
              anytime in Settings. Wolf uses this intel to personalize every training response.
            </span>
          </p>
        </Card>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={handleSave}
            loading={isSaving}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(0,246,224,0.3)]"
          >
            <LightningIcon className="w-5 h-5 mr-2" />
            Initiate Wolf Chat
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate("/settings")}
            className="border-cyan-500/20 hover:border-cyan-500/40"
          >
            Configure Later in Settings
          </Button>
        </div>

        {/* Skip */}
        <p className="text-center mt-6">
          <button
            onClick={() => navigate("/bulletproof-ankles")}
            className="text-dark-text-tertiary hover:text-cyan-400/70 text-xs uppercase tracking-wider transition-colors"
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}

export default MeetWolf;
