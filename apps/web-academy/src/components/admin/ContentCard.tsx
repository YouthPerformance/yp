// ═══════════════════════════════════════════════════════════
// CONTENT CARD
// Eight Sleep-inspired content list item with score and preview
// ═══════════════════════════════════════════════════════════

"use client";

import { Doc } from "@yp/alpha/convex/_generated/dataModel";
import { motion } from "framer-motion";

interface ContentCardProps {
  content: Doc<"playbook_content">;
  onClick: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  const score = content.voiceComplianceScore ?? 0;
  const tier = content.approvalTier || "yellow";

  // Get tier color
  const getTierColor = () => {
    if (tier === "green") return "#22c55e";
    if (tier === "yellow") return "#eab308";
    return "#ef4444";
  };

  // Get status text
  const getStatusText = () => {
    if (tier === "green") return "In range";
    if (tier === "yellow") return "Review";
    return "Needs work";
  };

  // Truncate title
  const displayTitle = content.title.length > 60
    ? content.title.substring(0, 60) + "..."
    : content.title;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-4 hover:border-[#2a2a2a] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content info */}
        <div className="flex-1 min-w-0">
          {/* Category & Type */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {content.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-xs text-zinc-600">
              {content.contentType}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-white leading-snug mb-2">
            {displayTitle}
          </h3>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTierColor() }}
            />
            <span className="text-xs text-zinc-500">{getStatusText()}</span>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12">
            {/* Background ring */}
            <svg className="absolute inset-0 -rotate-90" width="48" height="48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="4"
              />
            </svg>
            {/* Progress ring */}
            <svg className="absolute inset-0 -rotate-90" width="48" height="48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={getTierColor()}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - score / 100)}
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-white">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chevron */}
      <div className="flex justify-end mt-2 -mb-1">
        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </motion.button>
  );
}
