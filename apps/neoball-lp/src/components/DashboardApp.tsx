import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

interface DashboardAppProps {
  convexUrl: string;
}

export default function DashboardApp({ convexUrl }: DashboardAppProps) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (convexUrl) {
      setConvex(new ConvexReactClient(convexUrl));
    }
  }, [convexUrl]);

  // Get referral code from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setReferralCode(code.toUpperCase());
    }
  }, []);

  if (!convex) {
    return (
      <div className="min-h-screen bg-wolf-black flex items-center justify-center">
        <div className="animate-pulse text-cyan font-mono">Loading...</div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="min-h-screen bg-wolf-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl text-white tracking-wider mb-4">NO ACCESS CODE</h1>
          <p className="text-gray-400 mb-6">
            You need a referral code to view your dashboard. Join the waitlist to get yours.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-pink text-white font-bold rounded-lg hover:bg-cyan hover:text-wolf-black transition-all"
          >
            JOIN THE DRAFT
          </a>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <Dashboard referralCode={referralCode} />
    </ConvexProvider>
  );
}
