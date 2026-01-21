// ═══════════════════════════════════════════════════════════
// QUICK REVIEW QUEUE
// Swipeable card stack for rapid content review
// Optimized for James & Adam's approval workflow
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useCallback, useState } from "react";
import { VoiceReviewPanel } from "./VoiceReviewPanel";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface PlaybookContent {
  _id: Id<"playbook_content">;
  slug: string;
  contentType: "pillar" | "topic" | "qa" | "drill";
  author: "JAMES" | "ADAM" | "YP" | "TEAM_YP";
  category: string;
  subcategory?: string;
  title: string;
  body: string;
  status: "DRAFT" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "PUBLISHED";
  version: number;
  createdAt: number;
  updatedAt: number;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function QuickReviewQueue({ author }: { author?: "JAMES" | "ADAM" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  // Fetch content for review (IN_REVIEW status only)
  const content = useQuery(api.playbook.listContent, {
    author: author,
    status: "IN_REVIEW",
    limit: 50,
  });

  // Mutations
  const approveContent = useMutation(api.playbook.approveContent);
  const requestChanges = useMutation(api.playbook.requestChanges);
  const updateContent = useMutation(api.playbook.updateContent);

  // Filter out processed items
  const pendingContent = content?.filter((c: PlaybookContent) => !processedIds.has(c._id)) || [];
  const currentItem = pendingContent[currentIndex];

  // ─────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────

  const handleApprove = useCallback(async () => {
    if (!currentItem) return;

    await approveContent({ contentId: currentItem._id });
    setProcessedIds((prev) => new Set(prev).add(currentItem._id));
    setDirection(1);

    // Move to next or stay if last
    if (currentIndex >= pendingContent.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  }, [currentItem, approveContent, currentIndex, pendingContent.length]);

  const handleRequestChanges = useCallback(
    async (feedback: string) => {
      if (!currentItem) return;

      await requestChanges({
        contentId: currentItem._id,
        changesRequested: feedback,
      });
      setProcessedIds((prev) => new Set(prev).add(currentItem._id));
      setDirection(-1);

      if (currentIndex >= pendingContent.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    },
    [currentItem, requestChanges, currentIndex, pendingContent.length]
  );

  const handleIterate = useCallback(
    async (feedback: string): Promise<string | null> => {
      if (!currentItem) return null;

      try {
        const response = await fetch("/api/content/iterate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: currentItem._id,
            originalContent: currentItem.body,
            feedbackTranscript: feedback,
            author: currentItem.author,
            contentType: currentItem.contentType,
          }),
        });

        const result = await response.json();
        if (result.newContent) {
          // Save the iterated content
          await updateContent({
            contentId: currentItem._id,
            body: result.newContent,
            iterationNotes: feedback,
          });
          return result.newContent;
        }
        return null;
      } catch (error) {
        console.error("Iteration failed:", error);
        return null;
      }
    },
    [currentItem, updateContent]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < pendingContent.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, pendingContent.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // ─────────────────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────────────────

  if (content === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-8 h-8">
            <div
              className="absolute inset-0 border-2 rounded-full"
              style={{ borderColor: "var(--accent-primary)", opacity: 0.2 }}
            />
            <div
              className="absolute inset-0 border-2 border-transparent rounded-full animate-spin"
              style={{ borderTopColor: "var(--accent-primary)" }}
            />
          </div>
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Loading review queue...
          </span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────────────────────

  if (pendingContent.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2
          className="font-bebas text-2xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          ALL CAUGHT UP!
        </h2>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          No content waiting for review
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="font-bebas text-xl tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            QUICK REVIEW
          </span>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(0, 246, 224, 0.2)",
              color: "#00F6E0",
            }}
          >
            {currentIndex + 1} / {pendingContent.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Processed: {processedIds.size}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "#00F6E0" }}
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / pendingContent.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card Stack */}
      <AnimatePresence mode="wait" custom={direction}>
        {currentItem && (
          <motion.div
            key={currentItem._id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="space-y-6"
          >
            {/* Content Card */}
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {currentItem.contentType === "pillar" && "📖"}
                    {currentItem.contentType === "topic" && "📄"}
                    {currentItem.contentType === "qa" && "❓"}
                    {currentItem.contentType === "drill" && "🏋️"}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor:
                        currentItem.author === "ADAM"
                          ? "rgba(0, 246, 224, 0.2)"
                          : "rgba(156, 39, 176, 0.2)",
                      color: currentItem.author === "ADAM" ? "#00F6E0" : "#9C27B0",
                    }}
                  >
                    {currentItem.author}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {currentItem.category}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  v{currentItem.version}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-bebas text-2xl tracking-wider mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {currentItem.title}
              </h2>

              {/* Body Preview */}
              <div
                className="p-4 rounded-lg max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                }}
              >
                <pre
                  className="whitespace-pre-wrap text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currentItem.body}
                </pre>
              </div>
            </div>

            {/* Voice Review Panel */}
            <VoiceReviewPanel
              contentId={currentItem._id}
              contentBody={currentItem.body}
              contentTitle={currentItem.title}
              author={currentItem.author}
              contentType={currentItem.contentType}
              onApprove={handleApprove}
              onRequestChanges={handleRequestChanges}
              onIterate={handleIterate}
              onNext={currentIndex < pendingContent.length - 1 ? handleNext : undefined}
              onPrevious={currentIndex > 0 ? handlePrevious : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Hints */}
      <div
        className="text-center text-xs p-4 rounded-lg"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-tertiary)",
        }}
      >
        <p>
          <kbd className="px-2 py-1 rounded bg-black/30">←</kbd> Previous •{" "}
          <kbd className="px-2 py-1 rounded bg-black/30">→</kbd> Next •{" "}
          <kbd className="px-2 py-1 rounded bg-black/30">Enter</kbd> Approve •{" "}
          <kbd className="px-2 py-1 rounded bg-black/30">Space</kbd> Start Recording
        </p>
      </div>
    </div>
  );
}
