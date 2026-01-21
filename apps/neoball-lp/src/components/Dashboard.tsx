import { api } from "@yp/alpha/convex/_generated/api";
import { useQuery } from "convex/react";
import ShareButtons from "./ShareButtons";

interface DashboardProps {
  referralCode: string;
}

// Wolf Pack tier progression
const WOLF_TIERS = [
  { slug: "recruit", label: "The Recruit", emoji: "🐺", threshold: 0, reward: null },
  { slug: "pack_runner", label: "Pack Runner", emoji: "🏃", threshold: 3, reward: "Training Blueprint PDF" },
  { slug: "rising_wolf", label: "Rising Wolf", emoji: "📈", threshold: 5, reward: "1 Month Academy Access" },
  { slug: "elite_wolf", label: "Elite Wolf", emoji: "⚡", threshold: 10, reward: "3 Month Academy Access" },
  { slug: "alpha", label: "The Alpha", emoji: "👑", threshold: 25, reward: "Alpha 8 Draft Entry" },
  { slug: "legend", label: "Lone Wolf Legend", emoji: "🏆", threshold: 50, reward: "Legend Status" },
];

export default function Dashboard({ referralCode }: DashboardProps) {
  const userData = useQuery(api.waitlist.getPositionByCode, { referralCode });
  const leaderboard = useQuery(api.waitlist.getLeaderboard, { product: "neoball", limit: 8 });
  const stats = useQuery(api.waitlist.getStats, { product: "neoball" });

  if (userData === undefined) {
    return (
      <div className="min-h-screen bg-wolf-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  if (userData === null) {
    return (
      <div className="min-h-screen bg-wolf-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl text-white mb-4">CODE NOT FOUND</h1>
          <p className="text-gray-400 mb-6">This referral code doesn't exist or has expired.</p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-pink text-white font-bold rounded-lg hover:bg-cyan hover:text-wolf-black transition-all"
          >
            ENTER THE DRAFT
          </a>
        </div>
      </div>
    );
  }

  const referralLink = `https://neoball.co/w/${userData.referralCode}`;
  const isInAlpha8 = userData.effectivePosition <= 8;
  const isTop100 = userData.effectivePosition <= 100;

  // Find current tier index
  const currentTierIndex = WOLF_TIERS.findIndex((t) => t.slug === userData.tier.slug);
  const nextTierData = WOLF_TIERS[currentTierIndex + 1];

  return (
    <div className="min-h-screen bg-wolf-black py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan/10 border border-cyan/30 rounded-full mb-2">
            <span className="text-cyan text-xs font-mono uppercase tracking-wider">
              {isInAlpha8 ? "ALPHA 8 MEMBER" : "THE HUB"}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl tracking-wider text-white">
            YOUR PACK CARD
          </h1>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PACK CARD - Main Profile */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="relative">
          <div
            className="mx-auto w-full max-w-sm rounded-2xl border-2 border-cyan/40 bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6 overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(0, 246, 224, 0.2)" }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-pink/5 pointer-events-none" />

            {/* Card content */}
            <div className="relative z-10">
              {/* Logo */}
              <div className="text-center mb-4">
                <span className="text-cyan font-display text-sm tracking-widest">NEOBALL</span>
                <span className="mx-2 text-gray-600">×</span>
                <span className="text-pink font-display text-sm tracking-widest">ALPHA 8</span>
              </div>

              {/* Rank Display */}
              <div className="text-center py-6">
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-2">
                  YOUR RANK
                </p>
                <p
                  className="font-display text-6xl md:text-7xl text-white"
                  style={{ textShadow: isInAlpha8 ? "0 0 30px rgba(0, 246, 224, 0.6)" : "none" }}
                >
                  #{userData.effectivePosition.toLocaleString()}
                </p>

                {/* Movement indicator */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {userData.referralCount > 0 && (
                    <span className="text-neon-green text-sm font-mono">
                      ↑ +{userData.referralCount * 10} spots from referrals
                    </span>
                  )}
                </div>
              </div>

              {/* Tier badge */}
              <div className="text-center py-4 border-t border-white/5">
                <p className="text-4xl mb-2">{userData.tier.emoji}</p>
                <p className="text-white font-display tracking-wider">{userData.tier.label}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">
                  {userData.referralCount} {userData.referralCount === 1 ? "recruit" : "recruits"}
                </p>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-white/5">
                {isInAlpha8 && (
                  <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded-full text-neon-green text-xs font-mono">
                    ALPHA 8
                  </span>
                )}
                {isTop100 && !isInAlpha8 && (
                  <span className="px-3 py-1 bg-cyan/10 border border-cyan/30 rounded-full text-cyan text-xs font-mono">
                    TOP 100
                  </span>
                )}
                <span className="px-3 py-1 bg-pink/10 border border-pink/30 rounded-full text-pink text-xs font-mono">
                  FOUNDERS EDITION
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alpha 8 Status Banner */}
        {isInAlpha8 ? (
          <div className="bg-gradient-to-r from-neon-green/10 to-cyan/10 border border-neon-green/30 rounded-xl p-6 text-center">
            <h3 className="font-display text-xl text-neon-green tracking-wider mb-2">
              YOU'RE IN THE ALPHA 8!
            </h3>
            <p className="text-gray-400 text-sm">
              Keep sharing to hold your spot. Top 8 at launch win the LA trip.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-pink/10 to-gray-900 border border-pink/20 rounded-xl p-6 text-center">
            <h3 className="font-display text-xl text-pink tracking-wider mb-2">
              YOU ARE NOT IN THE ALPHA 8.
            </h3>
            <p className="text-gray-400 text-sm">
              {userData.effectivePosition - 8} spots away. Share to climb.
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BATTLE PASS - Tier Progress */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="font-display text-lg tracking-wider text-white">WOLF PACK PROGRESS</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">Unlock rewards by growing the pack</p>
          </div>

          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan via-pink to-neon-green rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (userData.referralCount / 50) * 100)}%`,
                }}
              />
            </div>

            {/* Tier markers */}
            <div className="absolute top-6 left-0 right-0 flex justify-between px-1">
              {WOLF_TIERS.map((tier) => {
                const isUnlocked = userData.referralCount >= tier.threshold;
                const isCurrent = tier.slug === userData.tier.slug;
                const position = (tier.threshold / 50) * 100;

                return (
                  <div
                    key={tier.slug}
                    className="flex flex-col items-center"
                    style={{
                      position: "absolute",
                      left: `${Math.min(position, 100)}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        isCurrent
                          ? "border-cyan bg-cyan/20 scale-110"
                          : isUnlocked
                            ? "border-neon-green bg-neon-green/10"
                            : "border-gray-700 bg-gray-800"
                      }`}
                    >
                      {tier.emoji}
                    </div>
                    <p className={`text-xs mt-1 ${isUnlocked ? "text-white" : "text-gray-600"}`}>
                      {tier.threshold}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spacer for tier markers */}
          <div className="h-14" />

          {/* Next tier info */}
          {nextTierData && (
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">
                <span className="text-cyan">{nextTierData.threshold - userData.referralCount}</span> more
                referrals to unlock{" "}
                <span className="text-white">
                  {nextTierData.emoji} {nextTierData.label}
                </span>
              </p>
              {nextTierData.reward && (
                <p className="text-gray-600 text-xs mt-1">
                  Reward: {nextTierData.reward}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VAULT - Rewards Grid */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="font-display text-lg tracking-wider text-white">THE VAULT</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">Your unlocked rewards</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WOLF_TIERS.filter((t) => t.reward).map((tier) => {
              const isUnlocked = userData.referralCount >= tier.threshold;

              return (
                <div
                  key={tier.slug}
                  className={`relative rounded-lg p-4 text-center transition-all ${
                    isUnlocked
                      ? "bg-gradient-to-b from-cyan/10 to-transparent border border-cyan/30"
                      : "bg-gray-900/50 border border-white/5"
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm z-10">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                  <p className="text-2xl mb-2">{tier.emoji}</p>
                  <p className={`text-xs ${isUnlocked ? "text-white" : "text-gray-600"}`}>
                    {tier.reward}
                  </p>
                  <p className="text-gray-600 text-xs mt-1 font-mono">{tier.threshold} refs</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* GROW THE PACK - Share Section */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="font-display text-xl tracking-wider text-white">GROW THE PACK</h3>
            <p className="text-gray-500 text-sm mt-1">Each friend = +10 spots up</p>
          </div>

          {/* Referral link */}
          <div className="bg-black/50 border border-cyan/30 rounded-lg p-4 mb-4">
            <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-2 text-center">
              Your Invite Link
            </p>
            <p className="text-cyan font-mono text-sm md:text-base text-center break-all">
              {referralLink}
            </p>
          </div>

          {/* Share buttons */}
          <ShareButtons referralLink={referralLink} position={userData.effectivePosition} />

          {/* Referral count */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              You've recruited{" "}
              <span className="text-cyan font-bold">{userData.referralCount}</span>{" "}
              {userData.referralCount === 1 ? "wolf" : "wolves"} to the pack
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ALPHA 8 LEADERBOARD */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {leaderboard && leaderboard.length > 0 && (
          <div className="bg-surface border border-white/5 rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="font-display text-lg tracking-wider text-pink">ALPHA 8 LEADERBOARD</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">
                Top 8 win the LA training trip ($4,999 value)
              </p>
            </div>

            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.anonymizedEmail === userData.email;

                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrentUser
                        ? "bg-cyan/10 border border-cyan/30"
                        : index < 8
                          ? "bg-gradient-to-r from-pink/5 to-transparent border border-pink/10"
                          : "bg-black/30 border border-white/5"
                    }`}
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-wolf-black"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-wolf-black"
                            : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                              : index < 8
                                ? "bg-pink/20 text-pink"
                                : "bg-surface text-gray-500"
                      }`}
                    >
                      {entry.position || entry.rank}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-sm truncate ${isCurrentUser ? "text-cyan" : "text-white"}`}>
                        {isCurrentUser ? "YOU" : entry.anonymizedEmail}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {entry.tier.emoji} {entry.tier.label}
                      </p>
                    </div>

                    {/* Referral count */}
                    <div className="text-right">
                      <p className={`font-display text-xl ${isCurrentUser ? "text-cyan" : "text-pink"}`}>
                        {entry.referralCount}
                      </p>
                      <p className="text-gray-600 text-xs font-mono">recruits</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats footer */}
            {stats && (
              <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <p className="text-gray-500 text-xs font-mono">
                  <span className="text-cyan">{stats.totalCount.toLocaleString()}</span> athletes in the draft
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SKIP THE LINE - Upsell */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {!isTop100 && (
          <div className="bg-gradient-to-r from-pink/10 via-purple-500/10 to-cyan/10 border border-pink/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-display text-xl text-white tracking-wider">SKIP THE LINE</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  Don't wait. Secure your NeoBall now and jump to the top 100.
                </p>
                <ul className="text-gray-500 text-xs space-y-1">
                  <li>✓ Instant Founder Status</li>
                  <li>✓ 500 Bonus Draft Entries</li>
                  <li>✓ Jump to Top 100</li>
                  <li>✓ Guaranteed Ball Delivery</li>
                </ul>
              </div>
              <a
                href="https://shop.youthperformance.com/products/neoball"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-pink text-white font-bold text-lg rounded-lg hover:bg-cyan hover:text-wolf-black transition-all whitespace-nowrap"
                style={{ boxShadow: "0 0 30px rgba(255, 20, 147, 0.4)" }}
              >
                $149 - GET IT NOW
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <a href="/" className="text-gray-500 hover:text-cyan transition-colors text-sm">
            ← Back to neoball.co
          </a>
        </div>
      </div>
    </div>
  );
}
