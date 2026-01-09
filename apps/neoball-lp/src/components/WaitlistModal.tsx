import { api } from "@yp/alpha/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import ShareButtons from "./ShareButtons";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrerCode?: string;
}

type Size = "6" | "7";

interface PositionTier {
  tier: string;
  label: string;
  emoji: string;
}

interface JoinResult {
  success: boolean;
  error?: string;
  isExisting?: boolean;
  entryId?: string;
  email?: string;
  size?: Size;
  referralCode?: string;
  basePosition?: number;
  effectivePosition?: number;
  referralCount?: number;
  tier?: PositionTier;
}

export default function WaitlistModal({ isOpen, onClose, referrerCode }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [size, setSize] = useState<Size>("7");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JoinResult | null>(null);

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const stats = useQuery(api.waitlist.getStats);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setError("");
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await joinWaitlist({
        email,
        size,
        referrerCode: referrerCode,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          referrer: document.referrer || null,
        },
      });

      if (response.success) {
        setResult(response as JoinResult);
      } else {
        setError(response.error || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("[Waitlist] Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const referralLink = result?.referralCode ? `https://neoball.com/w/${result.referralCode}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-wolf-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {!result ? (
          // ─────────────────────────────────────────────────────────────
          // FORM STATE
          // ─────────────────────────────────────────────────────────────
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl tracking-wider text-cyan">NEOBALL</h2>
              <p className="mt-2 text-gray-400 text-sm">
                Register to get notified when NeoBall is back in stock.
              </p>
            </div>

            {/* Social proof */}
            {stats && stats.totalCount > 0 && (
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-500 font-mono">
                  <span className="text-cyan">{stats.totalCount.toLocaleString()}</span> hoopers on
                  the waitlist
                  {stats.recentSignups > 0 && (
                    <span className="text-gray-600">
                      {" "}
                      · {stats.recentSignups} joined in the last hour
                    </span>
                  )}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Size selector */}
              <div>
                <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                  Select Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSize("6")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      size === "6"
                        ? "border-cyan bg-cyan/10 text-white"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span className="font-display text-2xl block">6"</span>
                    <span className="text-xs text-gray-500 mt-1 block">Youth / Handles</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSize("7")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      size === "7"
                        ? "border-cyan bg-cyan/10 text-white"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span className="font-display text-2xl block">7"</span>
                    <span className="text-xs text-gray-500 mt-1 block">Official / Game feel</span>
                  </button>
                </div>
              </div>

              {/* Email input */}
              <div>
                <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan transition-colors"
                />
              </div>

              {/* Error message */}
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-4 bg-pink text-white font-bold text-lg rounded-lg glow-pink hover:bg-cyan hover:text-wolf-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    JOINING...
                  </span>
                ) : (
                  "NOTIFY ME WHEN AVAILABLE"
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-600 text-center">No spam. Unsubscribe anytime.</p>
          </div>
        ) : (
          // ─────────────────────────────────────────────────────────────
          // SUCCESS STATE
          // ─────────────────────────────────────────────────────────────
          <div className="p-8">
            {/* Success header */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <span className="text-6xl">🏀</span>
              </div>
              <h2 className="font-display text-3xl tracking-wider text-neon-green">
                NOTHING BUT NET
              </h2>
              <p className="mt-2 text-gray-400 text-sm">
                {result.isExisting
                  ? "Welcome back! Here's your position."
                  : "You're on the waitlist!"}
              </p>
            </div>

            {/* Position display */}
            <div className="bg-surface rounded-xl p-6 mb-6 text-center border border-white/5">
              <p className="text-xs text-cyan font-mono uppercase tracking-wider mb-2">
                Your Position
              </p>
              <p className="font-display text-5xl text-white">
                #{result.effectivePosition?.toLocaleString()}
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                {result.tier?.emoji} {result.tier?.label}
              </p>
            </div>

            {/* Progress indicator */}
            {result.tier && result.effectivePosition && result.effectivePosition > 10 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress to Starter</span>
                  <span>
                    {Math.min(100, Math.round((1 - (result.effectivePosition - 10) / 500) * 100))}%
                  </span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink to-cyan rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(5, (1 - (result.effectivePosition - 10) / 500) * 100))}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  Need {Math.ceil((result.effectivePosition - 10) / 10)} more assists to move up
                </p>
              </div>
            )}

            {/* Referral section */}
            <div className="border-t border-white/5 pt-6">
              <h3 className="font-display text-xl text-pink text-center tracking-wider mb-2">
                PASS THE ROCK
              </h3>
              <p className="text-gray-500 text-sm text-center mb-4">
                Each friend you refer = +10 spots up the list
              </p>

              {/* Referral stats */}
              {result.referralCount !== undefined && result.referralCount > 0 && (
                <p className="text-center text-cyan font-mono text-sm mb-4">
                  Your assist count: {result.referralCount}
                </p>
              )}

              {/* Referral link */}
              <div className="bg-surface border border-cyan/30 rounded-lg p-3 mb-4">
                <p className="text-cyan font-mono text-sm text-center break-all">{referralLink}</p>
              </div>

              {/* Share buttons */}
              <ShareButtons referralLink={referralLink} position={result.effectivePosition || 0} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 border border-white/10 text-gray-400 rounded-lg hover:border-white/20 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
