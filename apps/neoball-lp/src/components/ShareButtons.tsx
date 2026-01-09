import { useState } from "react";

interface ShareButtonsProps {
  referralLink: string;
  position: number;
}

export default function ShareButtons({ referralLink, position }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Just locked in my spot for the NeoBall - silent basketball so I can train anywhere. Get in before it's sold out`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[ShareButtons] Copy failed:", err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(referralLink)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleSmsShare = () => {
    const smsText = `Yo check this out - silent basketball so you can train anywhere. Use my link: ${referralLink}`;
    // iOS uses &body=, Android uses ?body=
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = isIOS
      ? `sms:&body=${encodeURIComponent(smsText)}`
      : `sms:?body=${encodeURIComponent(smsText)}`;
    window.location.href = smsUrl;
  };

  const handleEmailShare = () => {
    const subject = "Check out NeoBall - Silent Basketball";
    const body = `Hey,\n\nI just got on the waitlist for NeoBall - it's a silent basketball so you can train anywhere without the noise.\n\nI'm #${position} on the waitlist. Use my link to join:\n${referralLink}\n\nLet's get our spots!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex justify-center gap-3">
      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-12 h-12 bg-surface border border-white/10 rounded-lg hover:border-cyan/50 hover:bg-cyan/10 transition-all group"
        title="Copy link"
      >
        {copied ? (
          <svg
            className="w-5 h-5 text-neon-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-cyan transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        )}
      </button>

      {/* Twitter/X */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center justify-center w-12 h-12 bg-surface border border-white/10 rounded-lg hover:border-cyan/50 hover:bg-cyan/10 transition-all group"
        title="Share on X"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-cyan transition-colors"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* SMS */}
      <button
        onClick={handleSmsShare}
        className="flex items-center justify-center w-12 h-12 bg-surface border border-white/10 rounded-lg hover:border-cyan/50 hover:bg-cyan/10 transition-all group"
        title="Share via text"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-cyan transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Email */}
      <button
        onClick={handleEmailShare}
        className="flex items-center justify-center w-12 h-12 bg-surface border border-white/10 rounded-lg hover:border-cyan/50 hover:bg-cyan/10 transition-all group"
        title="Share via email"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-cyan transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}
