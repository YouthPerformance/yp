// ═══════════════════════════════════════════════════════════
// SETTINGS REDIRECT
// Marketing site doesn't handle auth - redirect to app
// ═══════════════════════════════════════════════════════════

import { useEffect } from "react";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.youthperformance.com";

function Settings() {
  useEffect(() => {
    // Redirect to the main app's profile page
    window.location.href = `${APP_URL}/profile`;
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-dark-text-secondary mb-4">Redirecting to your settings...</p>
        <a
          href={`${APP_URL}/profile`}
          className="text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          Click here if not redirected
        </a>
      </div>
    </div>
  );
}

export default Settings;
