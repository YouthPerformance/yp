/**
 * Quick Review Queue
 *
 * Optimized for busy dads (James & Adam) doing quick editing sessions.
 * - Card-based swipe UX
 * - Voice editing
 * - One-tap approve
 * - Progress tracking
 */

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface ReviewItem {
  id: string;
  type: "section" | "article";
  title: string;
  content: string;
  articleTitle: string;
  sectionType: string;
  status: "pending" | "approved" | "needs_edit";
}

// ─────────────────────────────────────────────────────────────
// QUICK STATS BAR
// ─────────────────────────────────────────────────────────────

function StatsBar({
  reviewed,
  total,
  sessionTime,
}: {
  reviewed: number;
  total: number;
  sessionTime: number;
}) {
  const progress = total > 0 ? (reviewed / total) * 100 : 0;
  const minutes = Math.floor(sessionTime / 60);

  return (
    <div className="bg-bg-secondary border-b border-border-default px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-text-secondary">
          <span className="text-2xl font-bold text-text-primary">{reviewed}</span>
          <span className="text-text-tertiary">/{total} reviewed</span>
        </div>
        <div className="text-xs text-text-tertiary">{minutes}m session</div>
      </div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-primary to-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {reviewed > 0 && reviewed === total && (
        <div className="mt-2 text-center text-green-500 text-sm font-medium">
          All caught up! Great work.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REVIEW CARD (Main interaction)
// ─────────────────────────────────────────────────────────────

function ReviewCard({
  item,
  onApprove,
  onEdit,
  onSkip,
}: {
  item: ReviewItem;
  onApprove: () => void;
  onEdit: (newContent: string) => void;
  onSkip: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [isRecording, setIsRecording] = useState(false);

  const sectionColors: Record<string, string> = {
    intro: "bg-blue-500/20 text-blue-400",
    body: "bg-purple-500/20 text-purple-400",
    drill: "bg-green-500/20 text-green-400",
    faq: "bg-yellow-500/20 text-yellow-400",
    cta: "bg-red-500/20 text-red-400",
  };

  const handleVoiceEdit = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEditedContent((prev) => prev + " " + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSaveEdit = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-default overflow-hidden mx-4 shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-tertiary">{item.articleTitle}</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${sectionColors[item.sectionType] || "bg-bg-tertiary text-text-secondary"}`}
              >
                {item.sectionType}
              </span>
              <span className="text-text-primary font-semibold">{item.title}</span>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-text-tertiary hover:text-text-secondary p-2"
            title="Skip for now"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-40 p-3 bg-bg-tertiary border border-border-default rounded-xl text-text-primary resize-none focus:outline-none focus:border-accent-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleVoiceEdit}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                }`}
              >
                {isRecording ? (
                  <>
                    <span className="w-3 h-3 bg-white rounded-full animate-ping" />
                    Recording...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3z" />
                      <path d="M5 9a1 1 0 00-2 0 7 7 0 0014 0 1 1 0 10-2 0 5 5 0 01-10 0z" />
                      <path d="M9 15v2H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2h-2z" />
                    </svg>
                    Add Voice
                  </>
                )}
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-accent-primary text-black font-semibold rounded-xl"
              >
                Save Changes
              </button>
            </div>
            <button
              onClick={() => {
                setEditedContent(item.content);
                setIsEditing(false);
              }}
              className="w-full py-2 text-text-tertiary text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="text-text-secondary leading-relaxed cursor-pointer hover:bg-bg-tertiary/50 -m-2 p-2 rounded-lg transition-colors"
            onClick={() => setIsEditing(true)}
          >
            {item.content || (
              <span className="text-text-muted italic">No content yet. Tap to add.</span>
            )}
            <div className="text-xs text-text-tertiary mt-2">Tap to edit</div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 py-3 bg-bg-tertiary text-text-secondary font-medium rounded-xl hover:bg-bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 2.5L15.5 4.5L5 15H3V13L13.5 2.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9L7 13L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">All Caught Up!</h2>
        <p className="text-text-tertiary text-sm max-w-xs mx-auto">
          No content waiting for review. Check back later or create something new.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function ReviewQueuePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState(0);

  // Mock data for now - will connect to Convex
  const [items, setItems] = useState<ReviewItem[]>([
    {
      id: "1",
      type: "section",
      title: "Introduction",
      content:
        "Speed training for youth athletes isn't about running faster. It's about moving smarter. The fastest kids aren't always the ones with the best genetics.",
      articleTitle: "Speed Training for Youth Athletes",
      sectionType: "intro",
      status: "pending",
    },
    {
      id: "2",
      type: "section",
      title: "A-Skip Progression",
      content:
        "Start at one end of a 20-yard lane. Skip forward, driving the lead knee to hip height on each rep. Focus on tall posture and quick ground contact.",
      articleTitle: "Speed Training for Youth Athletes",
      sectionType: "drill",
      status: "pending",
    },
    {
      id: "3",
      type: "section",
      title: "Key Takeaway",
      content:
        "Stack these drills 3x per week. In 4 weeks, you'll see the difference in their first step.",
      articleTitle: "Speed Training for Youth Athletes",
      sectionType: "cta",
      status: "pending",
    },
  ]);

  // Update session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStart) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const currentItem = items.filter((i) => i.status === "pending")[0];
  const totalPending = items.filter((i) => i.status === "pending").length;

  const handleApprove = () => {
    if (!currentItem) return;
    setItems((prev) => prev.map((i) => (i.id === currentItem.id ? { ...i, status: "approved" } : i)));
    setReviewedCount((prev) => prev + 1);
  };

  const handleEdit = (newContent: string) => {
    if (!currentItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === currentItem.id ? { ...i, content: newContent, status: "approved" } : i)),
    );
    setReviewedCount((prev) => prev + 1);
  };

  const handleSkip = () => {
    // Move to end of queue
    if (!currentItem) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === currentItem.id);
      const item = prev[idx];
      const rest = prev.filter((i) => i.id !== currentItem.id);
      return [...rest, item];
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-default">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Quick Review</h1>
            <p className="text-xs text-text-tertiary">Tap to edit, swipe to approve</p>
          </div>
          <a
            href="/admin/content-strategy"
            className="px-3 py-1.5 text-sm text-text-tertiary hover:text-text-primary"
          >
            Done
          </a>
        </div>
        <StatsBar reviewed={reviewedCount} total={items.length} sessionTime={sessionTime} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-6">
        {currentItem ? (
          <ReviewCard
            item={currentItem}
            onApprove={handleApprove}
            onEdit={handleEdit}
            onSkip={handleSkip}
          />
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Quick Stats Footer */}
      {totalPending > 0 && (
        <footer className="sticky bottom-0 bg-bg-secondary border-t border-border-default px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-tertiary">{totalPending} items remaining</span>
            <span className="text-text-tertiary">
              ~{Math.ceil(totalPending * 0.5)} min to finish
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
