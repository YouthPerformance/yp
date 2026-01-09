// ═══════════════════════════════════════════════════════════
// AUTH PAGE
// Unified sign-in/sign-up with UnicornStudio background
// Design: YP Design System v2 tokens
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { UnicornBackground } from "@/components/effects";
import { sendOTP, signInWithApple, signInWithGoogle, useSession, verifyOTP } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Step = "choose" | "email" | "otp" | "loading";

// ─────────────────────────────────────────────────────────────
// OTP INPUT COMPONENT
// ─────────────────────────────────────────────────────────────

function OTPInput({
  value,
  onChange,
  onComplete,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;

    const newValue = value.split("");
    newValue[index] = char;
    const joined = newValue.join("").slice(0, 6);
    onChange(joined);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (joined.length === 6) {
      onComplete(joined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    if (pasted.length === 6) {
      onComplete(pasted);
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-[48px] h-[56px] text-center text-display-sm font-mono
                     bg-bg-secondary border border-border-default rounded-lg
                     text-text-primary placeholder-text-muted
                     focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-fast"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OAUTH ICONS
// ─────────────────────────────────────────────────────────────

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" {...props}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH FORM COMPONENT (uses searchParams)
// ─────────────────────────────────────────────────────────────

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect URL from query params
  const redirectTo = searchParams.get("redirect") || "/home";
  const isNewUser = searchParams.get("new") === "true";

  // Redirect if already signed in
  useEffect(() => {
    if (session?.user) {
      router.push(redirectTo);
    }
  }, [session, router, redirectTo]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      await sendOTP(email);
      setStep("otp");
    } catch (err) {
      setError("Failed to send code. Please try again.");
      console.error("[Auth] OTP send error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      await verifyOTP(email, code);
      setStep("loading");
    } catch (err) {
      setError("Invalid code. Please try again.");
      setOtp("");
      console.error("[Auth] OTP verify error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(redirectTo);
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      console.error("[Auth] Google error:", err);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithApple(redirectTo);
    } catch (err) {
      setError("Apple sign-in failed. Please try again.");
      console.error("[Auth] Apple error:", err);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-[360px] space-y-6"
    >
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/images/wolffront.webp"
          alt="Wolf Pack"
          width={80}
          height={80}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Title */}
      <div className="space-y-1 text-center">
        <h1 className="font-bebas text-display-md tracking-wide text-text-primary">
          CLAIM YOUR YP ID
        </h1>
        <p className="text-body-md text-text-secondary">
          {step === "otp"
            ? "Check your email for the code"
            : step === "loading"
              ? "Signing you in..."
              : "Your gateway to elite youth training"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Choose Method / OAuth Buttons */}
        {(step === "choose" || step === "email") && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 bg-bg-secondary hover:bg-bg-elevated
                           text-text-primary font-inter text-body-md font-medium rounded-xl
                           border border-border-default hover:border-border-strong
                           flex items-center justify-center gap-3
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-fast"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full py-3 bg-bg-secondary hover:bg-bg-elevated
                           text-text-primary font-inter text-body-md font-medium rounded-xl
                           border border-border-default hover:border-border-strong
                           flex items-center justify-center gap-3
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-fast"
              >
                <AppleIcon />
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border-default" />
              <span className="text-text-muted text-body-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border-default" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendOTP} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl
                           text-text-primary text-body-md placeholder-text-muted font-inter
                           focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-fast"
              />

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 bg-accent-primary hover:bg-accent-primary-hover
                           text-bg-primary font-bebas text-body-lg tracking-wide rounded-xl
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-glow-cyan hover:shadow-glow-cyan-strong
                           transition-all duration-fast transform hover:scale-[1.02]"
              >
                {isLoading ? "SENDING..." : "CONTINUE WITH EMAIL"}
              </button>
            </form>
          </motion.div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-text-secondary text-body-sm mb-1">Code sent to</p>
              <p className="text-text-primary text-body-md font-medium">{email}</p>
            </div>

            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOTP}
              disabled={isLoading}
            />

            <button
              onClick={() => handleVerifyOTP(otp)}
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 bg-accent-primary hover:bg-accent-primary-hover
                         text-bg-primary font-bebas text-body-lg tracking-wide rounded-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-glow-cyan hover:shadow-glow-cyan-strong
                         transition-all duration-fast"
            >
              {isLoading ? "VERIFYING..." : "VERIFY"}
            </button>

            <div className="flex justify-between text-body-sm">
              <button
                onClick={() => {
                  setStep("choose");
                  setOtp("");
                }}
                className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
              >
                Change email
              </button>
              <button
                onClick={() => handleSendOTP()}
                disabled={isLoading}
                className="text-accent-primary hover:text-accent-primary-hover transition-colors duration-fast disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Step */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary text-body-md">Signing you in...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg
                       text-[#EF4444] text-body-sm text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms */}
      <p className="text-text-muted text-body-xs text-center">
        By clicking continue, you agree to our{" "}
        <Link
          href="/legal/terms"
          className="underline underline-offset-4 hover:text-text-secondary transition-colors duration-fast"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="underline underline-offset-4 hover:text-text-secondary transition-colors duration-fast"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING FALLBACK
// ─────────────────────────────────────────────────────────────

function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-[360px] space-y-6">
      <div className="flex justify-center">
        <div className="w-[80px] h-[80px] bg-bg-secondary rounded-xl animate-pulse" />
      </div>
      <div className="space-y-1 text-center">
        <div className="h-9 w-48 bg-bg-secondary rounded animate-pulse mx-auto" />
        <div className="h-5 w-64 bg-bg-secondary/50 rounded animate-pulse mx-auto" />
      </div>
      <div className="space-y-3">
        <div className="h-12 w-full bg-bg-secondary rounded-xl animate-pulse" />
        <div className="h-12 w-full bg-bg-secondary rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

export default function AuthPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-bg-primary">
      {/* Animated Background */}
      <UnicornBackground className="opacity-80" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center gap-1 text-text-secondary hover:text-text-primary
                     transition-colors duration-fast px-3 py-2 rounded-lg hover:bg-bg-secondary/50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-body-sm">Home</span>
        </Link>

        {/* Auth Form with Suspense */}
        <Suspense fallback={<AuthLoading />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
