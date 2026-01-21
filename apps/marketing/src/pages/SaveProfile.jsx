import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button, Card, Input } from "../components/ui";
import { generateWolfPrompt } from "../config/interestPills";
import { useOnboarding } from "../context/OnboardingContext";
import analytics, { EVENTS } from "../lib/analytics";

// Lightning bolt icon for trust items
const LightningIcon = () => (
  <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// Luxury success animation component
const SuccessAnimation = () => (
  <div className="relative">
    {/* Outer pulse ring */}
    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }} />
    {/* Inner glow */}
    <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-600/10 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_40px_rgba(0,246,224,0.3)]">
      {/* Check with draw animation */}
      <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" className="animate-[draw_0.5s_ease-out_0.3s_forwards]" style={{ strokeDasharray: 24, strokeDashoffset: 24 }} />
      </svg>
    </div>
  </div>
);

function SaveProfile() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { data, updateField, getLaneOutput } = useOnboarding();
  const _laneOutput = getLaneOutput();

  // Convex mutation
  const saveProfileFromEmail = useMutation(api.users.saveProfileFromEmail);

  const [email, setEmail] = useState("");
  const [childNickname, setChildNickname] = useState(data.childNickname || "");
  const [isGuardian, setIsGuardian] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Pre-fill email if signed in
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [isSignedIn, user]);

  // Track page view
  useEffect(() => {
    analytics.trackPageView("save_profile");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!isGuardian) {
      setError("Please confirm you are a parent/guardian.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate Wolf prompt from data
      const wolfPrompt = generateWolfPrompt({
        ...data,
        childNickname: childNickname || "your athlete",
      });

      // Update context with child nickname
      updateField("childNickname", childNickname);

      // Track email submission
      analytics.track(EVENTS.EMAIL_SUBMITTED, {
        email,
        source: "save_profile",
        has_nickname: !!childNickname,
        lane: data.lane,
        goals: data.goals?.map((g) => g.tag) || [],
      });
      analytics.identify(email, {
        role: data.role,
        child_nickname: childNickname,
        child_age_band: data.ageBand,
        sport: data.sport,
        lane: data.lane,
      });

      // Save to Convex
      await saveProfileFromEmail({
        email,
        childNickname: childNickname || undefined,
        role: data.role,
        ageBand: data.ageBand,
        sport: data.sport,
        space: data.space,
        painFlag: data.painFlag,
        goals: data.goals,
        lane: data.lane,
        wolfPrompt,
      });

      setIsSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/offer/barefoot-reset");
      }, 2500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Save profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - Luxury minimal animation
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <SuccessAnimation />
          <h1 className="text-3xl font-yp-display uppercase text-white mt-8 mb-3 tracking-wide">
            Protocol Activated
          </h1>
          <p className="text-cyan-400/80 mb-2">
            Check your inbox for access credentials.
          </p>
          <p className="text-dark-text-tertiary text-sm animate-pulse">
            Initializing dashboard...
          </p>
        </div>

        {/* CSS for draw animation */}
        <style>{`
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full relative">

        {/* Wolf Coach - Peering over the card */}
        <div className="relative flex justify-center mb-[-60px] z-10">
          <div className="relative">
            {/* Cyan glow behind wolf */}
            <div className="absolute inset-0 blur-2xl bg-cyan-500/20 rounded-full scale-75" />
            <img
              src="/logo/wolffront.png"
              alt="Coach Wolf"
              className="relative w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(0,246,224,0.4)]"
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="relative pt-16 border border-cyan-500/10 bg-gradient-to-b from-black-200/80 to-black-100/50 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-yp-display uppercase text-white mb-2 tracking-wider">
              Secure Your Roster Spot
            </h1>
            <p className="text-dark-text-secondary text-sm">
              Your custom protocol is ready. Tell Coach Wolf where to send it.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-cyan-400/70 uppercase tracking-wider mb-2">
                Parent Email
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${focusedField === 'email' ? 'ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(0,246,224,0.15)]' : ''}`}>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isSubmitting}
                  className="bg-black-300/50 border-black-400/50 focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Child nickname */}
            <div>
              <label className="block text-xs font-medium text-cyan-400/70 uppercase tracking-wider mb-2">
                Athlete Callsign <span className="text-dark-text-tertiary">(optional)</span>
              </label>
              <div className={`relative rounded-lg transition-all duration-300 ${focusedField === 'nickname' ? 'ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(0,246,224,0.15)]' : ''}`}>
                <Input
                  type="text"
                  placeholder="e.g., 'The Jet' or First Name"
                  value={childNickname}
                  onChange={(e) => setChildNickname(e.target.value)}
                  onFocus={() => setFocusedField('nickname')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isSubmitting}
                  className="bg-black-300/50 border-black-400/50 focus:border-cyan-500/50"
                />
              </div>
              <p className="text-dark-text-tertiary text-xs mt-1.5 opacity-70">
                Coach Wolf uses this to personalize training
              </p>
            </div>

            {/* Guardian checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isGuardian ? 'bg-cyan-500 border-cyan-500' : 'border-black-400 bg-black-300/50 group-hover:border-cyan-500/50'}`}>
                {isGuardian && (
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={isGuardian}
                onChange={(e) => setIsGuardian(e.target.checked)}
                className="sr-only"
                disabled={isSubmitting}
              />
              <span className="text-sm text-dark-text-secondary">
                I'm a parent/guardian authorizing this athlete profile.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit - Pulsing CTA */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              className={`relative overflow-hidden bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold uppercase tracking-wider ${!isSubmitting ? 'animate-pulse' : ''}`}
              style={{ animationDuration: '2s' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  "Activating..."
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Activate Protocol
                  </>
                )}
              </span>
            </Button>
          </form>
        </Card>

        {/* What you'll get - Upgraded trust section */}
        <Card className="mt-4 bg-black-200/30 border border-cyan-500/5">
          <h3 className="text-xs font-medium text-cyan-400/60 uppercase tracking-widest mb-4">
            Protocol Includes
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-dark-text-secondary">
              <LightningIcon />
              <span>7-day custom training protocol</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-dark-text-secondary">
              <LightningIcon />
              <span>24/7 Access to AskYP Engine</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-dark-text-secondary">
              <LightningIcon />
              <span>Progress synced across all devices</span>
            </li>
          </ul>
        </Card>

        {/* Skip link */}
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

export default SaveProfile;
