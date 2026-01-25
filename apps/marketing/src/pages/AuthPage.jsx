// ═══════════════════════════════════════════════════════════
// AUTH PAGE REDIRECT
// Marketing site doesn't handle auth - redirect to app
// ═══════════════════════════════════════════════════════════

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.youthperformance.com";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";

  useEffect(() => {
    // Redirect to the main app's auth page with signup param if present
    const authUrl = isSignUp ? `${APP_URL}/auth?signup=true` : `${APP_URL}/auth`;
    window.location.href = authUrl;
  }, [isSignUp]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-dark-text-secondary mb-4">
          Redirecting to {isSignUp ? "sign up" : "login"}...
        </p>
        <a
          href={`${APP_URL}/auth${isSignUp ? "?signup=true" : ""}`}
          className="text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}
