import { useEffect, useState } from "react";

function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Unicorn Studio
  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.body.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);

    // Simulate API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  // Brand color: #00f6e0
  const brandColor = "#00f6e0";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Unicorn Studio Background with bottom fade */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div
          className="aura-background-component absolute inset-0 w-full h-full"
          data-alpha-mask="80"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        >
          <div
            data-us-project="XxCmD31vVBmiINgvYCho"
            className="absolute inset-0 w-full h-full bg-neutral-950"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* YP Logo */}
        <div className="mb-8">
          <img src="/logo/yp-logo.png" alt="Youth Performance" className="h-12 md:h-16 w-auto" />
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md">
          {!submitted ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${brandColor}15`,
                    border: `1px solid ${brandColor}40`,
                    color: brandColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: brandColor }}
                  />
                  FREE Playbook
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 leading-tight">
                Bulletproof
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, #00d4ff 50%, #a855f7 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Ankles Playbook
                </span>
              </h1>

              {/* Value Props */}
              <p className="text-gray-400 text-center mb-6 leading-relaxed">
                The exact protocols pro athletes use to eliminate ankle injuries and unlock
                explosive first-step speed.
              </p>

              {/* Checklist */}
              <ul className="space-y-3 mb-8">
                {[
                  "8 proven ankle stability drills",
                  "Video demonstrations for each movement",
                  "7-day progressive training plan",
                  "Zero equipment required",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: brandColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all"
                    style={{
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = `${brandColor}50`;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColor}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, #00d4ff 100%)`,
                    boxShadow: `0 8px 32px ${brandColor}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = `0 12px 40px ${brandColor}60`;
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = `0 8px 32px ${brandColor}40`;
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                  ) : (
                    <>
                      Get Free Playbook
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Trust Signal */}
              <p className="text-center text-gray-500 text-xs mt-4">
                Join 2,000+ athletes already training smarter
              </p>
            </div>
          ) : (
            /* Success State */
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${brandColor} 0%, #00d4ff 100%)`,
                }}
              >
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">You're In!</h2>

              <p className="text-gray-400 mb-6">
                Check your inbox for the Bulletproof Ankles Playbook. Welcome to the Pack.
              </p>

              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: `${brandColor}15`,
                  border: `1px solid ${brandColor}30`,
                }}
              >
                <p className="text-sm font-medium" style={{ color: brandColor }}>
                  🐺 Pro Tip: Add us to your contacts so you don't miss the drills.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">Elite training for every kid, everywhere.</p>
          <div className="flex justify-center gap-6 text-gray-600 text-xs">
            <a
              href="/terms"
              className="transition-colors"
              style={{ color: "rgb(75, 85, 99)" }}
              onMouseEnter={(e) => (e.target.style.color = brandColor)}
              onMouseLeave={(e) => (e.target.style.color = "rgb(75, 85, 99)")}
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="transition-colors"
              style={{ color: "rgb(75, 85, 99)" }}
              onMouseEnter={(e) => (e.target.style.color = brandColor)}
              onMouseLeave={(e) => (e.target.style.color = "rgb(75, 85, 99)")}
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Waitlist;
