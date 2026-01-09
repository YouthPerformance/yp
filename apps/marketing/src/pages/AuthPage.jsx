/**
 * AuthPage - Full-screen login with Unicorn Studio aurora background
 * Ported from /playbook/home AuthPage.tsx
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Demo mode - no actual auth, just UI demo
const DEMO_MODE = true;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check URL params for signup mode
  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Load Unicorn Studio
  useEffect(() => {
    if (!window.UnicornStudio && !document.querySelector('script[src*="unicornStudio.umd.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init();
        }
      };
      document.head.appendChild(script);
    } else {
      const checkAndInit = () => {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init();
        }
      };
      checkAndInit();
      const interval = setInterval(checkAndInit, 500);
      setTimeout(() => clearInterval(interval), 3000);
    }
  }, []);

  const toggleMode = (e) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Demo mode - simulate login
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      navigate("/dashboard");
      return;
    }
  };

  const handleSocialSignIn = (_provider) => {
    // Demo mode - simulate social login
    if (DEMO_MODE) {
      setIsLoading(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
      return;
    }
  };

  return (
    <div className="min-h-screen antialiased flex items-center justify-center text-neutral-100 bg-transparent px-4 overflow-hidden relative">
      {/* Unicorn Studio Aurora Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)",
        }}
      >
        <div data-us-project="bmaMERjX2VZDtPrh4Zwx" className="absolute inset-0" />
      </div>

      <div className="w-full max-w-5xl mx-auto my-8 relative">
        {/* Circuit-style decorative nodes (desktop only) */}
        <div className="pointer-events-none hidden md:block absolute inset-0">
          {/* Left upper node */}
          <div className="absolute left-4 top-1/4 flex items-center gap-2 text-neutral-700">
            <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
            <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
              <div className="h-1 w-10 rounded-full bg-neutral-700" />
              <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
            </div>
            <div className="h-px w-12 bg-neutral-800" />
          </div>

          {/* Left bottom node */}
          <div className="absolute left-10 bottom-10 flex items-center gap-2 text-neutral-700">
            <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
            <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
              <div className="flex gap-1">
                <span className="h-1 w-2 rounded bg-neutral-700" />
                <span className="h-1 w-2 rounded bg-neutral-700/60" />
                <span className="h-1 w-2 rounded bg-neutral-700/40" />
              </div>
              <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
            </div>
            <div className="h-px w-16 bg-neutral-800" />
          </div>

          {/* Right upper node */}
          <div className="absolute right-4 top-1/5 flex items-center gap-2 text-neutral-700">
            <div className="h-px w-16 bg-neutral-800" />
            <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
              <span className="h-1 w-6 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0]" />
              <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
            </div>
            <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
          </div>

          {/* Right bottom node */}
          <div className="absolute right-8 bottom-16 flex items-center gap-2 text-neutral-700">
            <div className="h-px w-10 bg-neutral-800" />
            <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
              <div className="h-1 w-8 rounded-full bg-neutral-700" />
              <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
            </div>
            <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
          </div>
        </div>

        {/* Auth Card */}
        <div className="sm:px-10 sm:py-10 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 max-w-md border-neutral-800 border rounded-3xl mx-auto pt-8 px-6 pb-8 relative shadow-xl z-10">
          {/* Top glow bars */}
          <div className="absolute left-10 top-5 hidden h-1.5 w-16 rounded-full bg-neutral-700/60 sm:block" />
          <div className="absolute right-10 top-5 hidden h-1.5 w-10 rounded-full bg-neutral-700/30 sm:block" />

          {/* YP Logo */}
          <div className="flex justify-center">
            <div className="flex bg-neutral-900 w-14 h-14 rounded-2xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
              <div className="flex bg-neutral-950 w-10 h-10 rounded-2xl items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#00f6e0"
                >
                  <path
                    d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35"
                    opacity=".5"
                  />
                  <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-[22px] leading-tight tracking-tight font-semibold text-neutral-50">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-sm font-normal text-neutral-400">
              Train smarter. Play better. Every day.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Social buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn("apple")}
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f6e0">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("discord")}
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f6e0">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11a13.1 13.1 0 0 1-1.64.78c-.04.01-.05.06-.04.09c.31.61.66 1.19 1.07 1.74c.03.01.06.02.09.01c1.67-.53 3.4-1.33 5.2-2.65c.02-.01.03-.03.03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    fill="#00f6e0"
                    d="M12 5a7 7 0 1 0 6.93 8H13a1 1 0 1 1 0-2h7a1 1 0 0 1 1 1a9 9 0 1 1-2.654-6.381a1 1 0 0 1-1.41 1.418A6.98 6.98 0 0 0 12 5"
                  />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <div className="h-px flex-1 bg-neutral-800/80" />
              <span className="font-medium">OR</span>
              <div className="h-px flex-1 bg-neutral-800/80" />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400"
                >
                  Full Name
                </label>
                <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 focus-within:border-[#00f6e0] focus-within:ring-1 focus-within:ring-[#00f6e0]/70">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-neutral-500"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="ml-3 flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400"
              >
                Email
              </label>
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 focus-within:border-[#00f6e0] focus-within:ring-1 focus-within:ring-[#00f6e0]/70">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-neutral-500"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="ml-3 flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400"
                >
                  Password
                </label>
                {!isSignUp && (
                  <a
                    href="#"
                    className="text-xs font-medium text-neutral-400 hover:text-neutral-100"
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 focus-within:border-[#00f6e0] focus-within:ring-1 focus-within:ring-[#00f6e0]/70">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-neutral-500"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="ml-3 flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#00f6e0] px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_35px_rgba(0,246,224,0.3)] hover:bg-[#00f6e0]/90 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {isSignUp ? "Create account" : "Continue"}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-2"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </>
              )}
            </button>

            {/* Toggle mode */}
            <p className="text-center text-sm text-neutral-400">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <a
                href="#"
                onClick={toggleMode}
                className="font-medium text-[#00f6e0] hover:text-[#00f6e0]/80"
              >
                {isSignUp ? "Sign In" : "Sign up"}
              </a>
            </p>

            {/* Terms */}
            <p className="pt-1 text-[11px] leading-relaxed text-neutral-500 text-center">
              By continuing, you agree to the YP{" "}
              <a href="/terms" className="font-medium text-neutral-200 hover:text-[#00f6e0]">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-neutral-200 hover:text-[#00f6e0]">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
