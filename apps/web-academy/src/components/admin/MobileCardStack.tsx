// ═══════════════════════════════════════════════════════════
// MOBILE CARD STACK
// Eight Sleep-inspired swipeable card stack for mobile
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { Doc } from "@yp/alpha/convex/_generated/dataModel";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface MobileCardStackProps {
  contents: Doc<"playbook_content">[];
  onApprove: (content: Doc<"playbook_content">) => void;
  onReject: (content: Doc<"playbook_content">) => void;
  onOpen: (content: Doc<"playbook_content">) => void;
}

export function MobileCardStack({ contents, onApprove, onReject, onOpen }: MobileCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const currentContent = contents[currentIndex];
  const remainingCount = contents.length - currentIndex;

  if (!currentContent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-white mb-1">All done!</h2>
        <p className="text-sm text-zinc-500">No more content to review</p>
      </div>
    );
  }

  const score = currentContent.voiceComplianceScore ?? 0;
  const tier = currentContent.approvalTier || "yellow";

  const getTierColor = () => {
    if (tier === "green") return "#22c55e";
    if (tier === "yellow") return "#eab308";
    return "#ef4444";
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      setExitDirection("right");
      setTimeout(() => {
        onApprove(currentContent);
        setCurrentIndex((i) => i + 1);
        setExitDirection(null);
      }, 200);
    } else if (info.offset.x < -threshold) {
      setExitDirection("left");
      setTimeout(() => {
        onReject(currentContent);
        setCurrentIndex((i) => i + 1);
        setExitDirection(null);
      }, 200);
    }
  };

  const previewText = typeof currentContent.body === "string"
    ? currentContent.body.substring(0, 150) + "..."
    : "";

  return (
    <div className="relative pb-24">
      {/* Progress */}
      <div className="text-center mb-6">
        <span className="text-sm text-zinc-500">{remainingCount} remaining</span>
      </div>

      {/* Card Stack */}
      <div className="relative h-[400px] w-full max-w-sm mx-auto">
        {/* Background cards */}
        {contents.slice(currentIndex + 1, currentIndex + 3).map((content, i) => (
          <div
            key={content._id}
            className="absolute inset-x-0 top-0 h-full rounded-3xl bg-[#080808] border border-[#1a1a1a]"
            style={{
              transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.03})`,
              zIndex: -i - 1,
            }}
          />
        ))}

        {/* Current card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentContent._id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: exitDirection === "left" ? -300 : exitDirection === "right" ? 300 : 0,
              rotate: exitDirection === "left" ? -15 : exitDirection === "right" ? 15 : 0,
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute inset-0 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 cursor-grab active:cursor-grabbing"
          >
            {/* Score */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg className="absolute inset-0 -rotate-90" width="96" height="96">
                  <circle cx="48" cy="48" r="42" fill="none" stroke="#1a1a1a" strokeWidth="6" />
                </svg>
                <svg className="absolute inset-0 -rotate-90" width="96" height="96">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    stroke={getTierColor()}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-light text-white">{score}</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="text-center mb-4">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                {currentContent.category} • {currentContent.contentType}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-medium text-white text-center mb-4 line-clamp-2">
              {currentContent.title}
            </h2>

            {/* Preview */}
            <p className="text-sm text-zinc-400 text-center line-clamp-4">
              {previewText}
            </p>

            {/* Swipe hints */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-zinc-600">
              <span>← Reject</span>
              <span>Approve →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={() => {
            setExitDirection("left");
            setTimeout(() => {
              onReject(currentContent);
              setCurrentIndex((i) => i + 1);
              setExitDirection(null);
            }, 200);
          }}
          className="w-14 h-14 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-red-400 hover:border-red-400/30 transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => onOpen(currentContent)}
          className="w-14 h-14 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#2a2a2a] transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button
          onClick={() => {
            setExitDirection("right");
            setTimeout(() => {
              onApprove(currentContent);
              setCurrentIndex((i) => i + 1);
              setExitDirection(null);
            }, 200);
          }}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
