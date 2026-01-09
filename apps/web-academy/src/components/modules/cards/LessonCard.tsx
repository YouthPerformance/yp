// ═══════════════════════════════════════════════════════════
// LESSON CARD
// Displays educational content in Athlete or Parent mode
// ═══════════════════════════════════════════════════════════

"use client";

import Image from "next/image";
import type { ContentMode, LessonCard as LessonCardType } from "@/data/modules/types";

interface LessonCardProps {
  card: LessonCardType;
  mode: ContentMode;
}

export function LessonCard({ card, mode }: LessonCardProps) {
  const content = card.content[mode];

  return (
    <div className="flex flex-col h-full min-h-full px-6 py-8 bg-bg-primary">
      {/* Headline */}
      <h2 className="text-2xl md:text-3xl font-bebas uppercase tracking-wide text-white mb-6">
        {content.headline}
      </h2>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {content.body && (
          <div className="text-base md:text-lg text-text-secondary leading-relaxed whitespace-pre-line">
            {content.body}
          </div>
        )}

        {/* Media */}
        {content.mediaType === "image" && content.mediaUrl && (
          <div className="mt-6 rounded-xl overflow-hidden border border-border-subtle">
            <div className="relative aspect-video bg-bg-tertiary">
              <Image
                src={content.mediaUrl}
                alt={content.caption || content.headline}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            {content.caption && (
              <p className="px-4 py-2 text-sm text-text-tertiary bg-bg-secondary">
                {content.caption}
              </p>
            )}
          </div>
        )}

        {content.mediaType === "video" && content.mediaUrl && (
          <div className="mt-6 rounded-xl overflow-hidden border border-border-subtle">
            <video
              src={content.mediaUrl}
              controls
              playsInline
              className="w-full aspect-video bg-black"
            />
            {content.caption && (
              <p className="px-4 py-2 text-sm text-text-tertiary bg-bg-secondary">
                {content.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Swipe indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-text-tertiary uppercase tracking-widest">Swipe up to continue</p>
        <div className="mt-2 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
