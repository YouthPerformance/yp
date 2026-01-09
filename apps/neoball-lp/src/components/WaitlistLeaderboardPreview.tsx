import { api } from "@yp/alpha/convex/_generated/api";
import { useQuery } from "convex/react";

interface WaitlistLeaderboardPreviewProps {
  onJoinClick: () => void;
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

export default function WaitlistLeaderboardPreview({
  onJoinClick,
}: WaitlistLeaderboardPreviewProps) {
  const leaderboard = useQuery(api.waitlist.getLeaderboard, { limit: 5 });
  const stats = useQuery(api.waitlist.getStats);

  // Basketball positions for top 5
  const positions = ["PG", "SG", "SF", "PF", "C"];

  return (
    <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl tracking-wider text-pink">THE STARTING 5</h3>
          <p className="text-gray-600 text-xs font-mono mt-0.5">Top dime droppers this week</p>
        </div>
        {stats && (
          <div className="text-right">
            <p className="text-2xl font-display text-cyan">{stats.totalCount.toLocaleString()}</p>
            <p className="text-gray-600 text-xs font-mono">on waitlist</p>
          </div>
        )}
      </div>

      {/* Leaderboard rows */}
      <div className="divide-y divide-white/5">
        {leaderboard && leaderboard.length > 0 ? (
          (leaderboard as LeaderboardEntry[]).map((entry: LeaderboardEntry, index: number) => (
            <div
              key={entry.rank}
              className="px-6 py-3 flex items-center gap-4 hover:bg-white/2 transition-colors"
            >
              {/* Position badge */}
              <div
                className={`w-8 h-8 rounded flex items-center justify-center font-display text-sm ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-wolf-black"
                    : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-500 text-wolf-black"
                      : index === 2
                        ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                        : "bg-cyan/20 text-cyan"
                }`}
              >
                {positions[index]}
              </div>

              {/* Email (anonymized) */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-mono text-sm truncate">{entry.anonymizedEmail}</p>
              </div>

              {/* Assist count */}
              <div className="flex items-center gap-2">
                <span className="text-cyan font-display text-lg">{entry.referralCount}</span>
                <span className="text-gray-600 text-xs">assists</span>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 text-sm">Be the first to join and claim your spot!</p>
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div className="p-4 bg-wolf-black/50">
        <button
          onClick={onJoinClick}
          className="w-full py-3 bg-pink text-white font-bold rounded-lg glow-pink hover:bg-cyan hover:text-wolf-black transition-all"
        >
          JOIN THE WAITLIST
        </button>
        <p className="text-center text-gray-600 text-xs mt-2 font-mono">
          Invite friends to move up the list
        </p>
      </div>
    </div>
  );
}
