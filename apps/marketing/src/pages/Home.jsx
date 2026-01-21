import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ElectricBorder from "../components/ElectricBorder";
import EvidenceFeed from "../components/wolf-grow/EvidenceFeed";
import FinalCTA from "../components/wolf-grow/FinalCTA";
import MascotReveal from "../components/wolf-grow/MascotReveal";
import ProblemSection from "../components/wolf-grow/ProblemSection";
import WolfComparison from "../components/wolf-grow/WolfComparison";
import { useOnboarding } from "../context/OnboardingContext";

const API_URL = "http://localhost:3010/api";

function Home() {
  const [_courses, setCourses] = useState([]);
  const [_loading, setLoading] = useState(true);
  const { openModal } = useOnboarding();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/courses?limit=6`);
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const r3Stages = [
    {
      title: "Release",
      blurb:
        "Short routines to loosen tight muscles and restore range of motion. Athletes feel the difference right away.",
    },
    {
      title: "Restore",
      blurb:
        "Build the base: feet, balance, posture, and control. This is where confidence starts.",
    },
    {
      title: "Re-Engineer",
      blurb:
        "Turn clean movement into game speed: sprint, cut, jump, land—with control and confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/newspin.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-display-hero md:text-[72px] font-yp-display uppercase tracking-wide text-white mb-6 leading-tight">
            The Pro Youth Sports Academy
            <span className="block text-cyan-500">in Your Pocket.</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-text-secondary mb-8 max-w-2xl mx-auto font-yp-body">
            A short starter protocol to improve balance, landing control, and ankle-foot stability —
            adjusted by age and training space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={openModal}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-glow-cyan"
            >
              Get Bulletproof Ankles (Free)
            </button>
            <Link
              to="/pricing"
              className="border border-white/30 text-white px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors"
            >
              Join the Pack
            </Link>
          </div>
          <p className="text-dark-text-tertiary text-sm mb-12">
            8 minutes. Age-adjusted. Safe progressions. Built for busy families.
          </p>

          {/* Trust Line */}
          <p className="text-dark-text-tertiary text-sm">
            Short sessions • Clear coaching • Built for youth athletes • Train at home or on court
          </p>
        </div>
      </section>

      {/* Problem Bento Grid */}
      <ProblemSection />

      {/* R3 Method Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-yp-display uppercase tracking-wide text-white mb-4">
              The R3 Method: simple steps that build real athletes.
            </h2>
            <p className="text-dark-text-secondary max-w-2xl mx-auto">
              We don't guess. We build your base first—then we add speed and power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {r3Stages.map((stage, index) => (
              <ElectricBorder
                key={stage.title}
                color="#00f6e0"
                thickness={1}
                speed={0.8}
                chaos={0.6}
                className="rounded-xl"
              >
                <div className="bg-black-50 rounded-xl p-8">
                  <div className="text-cyan-500 text-6xl font-yp-display mb-4">{index + 1}</div>
                  <h3 className="text-2xl font-yp-display uppercase text-white mb-3">
                    {stage.title}
                  </h3>
                  <p className="text-dark-text-secondary">{stage.blurb}</p>
                </div>
              </ElectricBorder>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/r3"
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Start R3
            </Link>
            <Link
              to="/sample-week"
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              See a Sample Week →
            </Link>
          </div>
        </div>
      </section>

      {/* Wolf Comparison Table */}
      <WolfComparison />

      {/* Meet YP - Mascot Reveal */}
      <MascotReveal />

      {/* Evidence Feed - Testimonials */}
      <EvidenceFeed />

      {/* Final CTA - Pack ID Gate */}
      <FinalCTA />

      {/* Newsletter Signup - Wolf Dispatch */}
      <section className="relative py-16 bg-[#000000] border-t border-neutral-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
              Intel Drop
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-bebas text-2xl md:text-3xl tracking-wide text-white uppercase mb-2">
            The Wolf <span className="text-cyan-400">Dispatch</span>
          </h3>
          <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
            Weekly training intel, protocol updates, and early access drops. No spam. Unsubscribe
            anytime.
          </p>

          {/* Email Input */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="enter@youremail.com"
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
            >
              <span className="font-bebas tracking-wider">Subscribe</span>
            </button>
          </form>

          {/* Privacy note */}
          <p className="text-neutral-700 text-[10px] mt-4 font-mono">
            We respect your privacy. View our{" "}
            <Link to="/privacy" className="text-neutral-600 hover:text-neutral-500 underline">
              privacy policy
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
