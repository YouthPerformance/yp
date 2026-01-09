import { api } from "@yp/alpha/convex/_generated/api";
import { useQuery } from "convex/react";

interface WaitlistLeaderboardProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  position: string | null;
  anonymizedEmail: string;
  referralCount: number;
  effectivePosition: number;
  tier: {
    tier: string;
    label: string;
    emoji: string;
  };
}

export default function WaitlistLeaderboard({
  limit = 10,
  showTitle = true,
  compact = false,
}: WaitlistLeaderboardProps) {
  const leaderboard = useQuery(api.waitlist.getLeaderboard, { limit });
  const stats = useQuery(api.waitlist.getStats);

  if (!leaderboard || leaderboard.length === 0) {
    return null;
  }

  return (
    <div className={compact ? "" : "p-6 bg-surface rounded-xl border border-white/5"}>
      {showTitle && (
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl tracking-wider text-pink">THE STARTING 5</h3>
          <p className="text-gray-500 text-sm mt-1 font-mono">Top dime droppers on the waitlist</p>
        </div>
      )}

      <div className="space-y-3">
        {(leaderboard as LeaderboardEntry[]).map((entry: LeaderboardEntry, index: number) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              index < 5
                ? "bg-gradient-to-r from-cyan/10 to-transparent border border-cyan/20"
                : "bg-wolf-black/50 border border-white/5"
            }`}
          >
            {/* Position badge */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg ${
                index === 0
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-wolf-black"
                  : index === 1
                    ? "bg-gradient-to-br from-gray-300 to-gray-500 text-wolf-black"
                    : index === 2
                      ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                      : index < 5
                        ? "bg-cyan/20 text-cyan"
                        : "bg-surface text-gray-500"
              }`}
            >
              {entry.position || entry.rank}
            </div>

            {/* Email (anonymized) */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-mono text-sm truncate">{entry.anonymizedEmail}</p>
              <p className="text-gray-500 text-xs">
                {entry.tier.emoji} {entry.tier.label}
              </p>
            </div>

            {/* Assist count */}
            <div className="text-right">
              <p className="text-cyan font-display text-xl">{entry.referralCount}</p>
              <p className="text-gray-600 text-xs font-mono">assists</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      {stats && !compact && (
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-gray-500 text-xs font-mono">
            <span className="text-cyan">{stats.totalCount.toLocaleString()}</span> hoopers on the
            waitlist
          </p>
        </div>
      )}
    </div>
  );
}
