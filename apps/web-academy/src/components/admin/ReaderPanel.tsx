// ═══════════════════════════════════════════════════════════
// READER PANEL
// Eight Sleep-inspired full article reader with voice editing
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useCallback, useMemo } from "react";
import { Doc, Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceEditOverlay } from "./VoiceEditOverlay";
import { ScoreGauge } from "./ScoreGauge";
import { markdownToHtml } from "@/lib/seo-content";

interface ReaderPanelProps {
  content: Doc<"playbook_content">;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  expert: "JAMES" | "ADAM";
}

export function ReaderPanel({ content, onClose, onApprove, onReject, expert }: ReaderPanelProps) {
  const [selectedText, setSelectedText] = useState("");
  const [selectionContext, setSelectionContext] = useState("");
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [editedBody, setEditedBody] = useState(content.body);
  const [hasEdits, setHasEdits] = useState(false);

  const updateContent = useMutation(api.playbook.updatePlaybookContent);

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());

      // Get surrounding context (200 chars before and after)
      const body = typeof editedBody === "string" ? editedBody : "";
      const selectionStart = body.indexOf(selection.toString());
      if (selectionStart !== -1) {
        const contextStart = Math.max(0, selectionStart - 200);
        const contextEnd = Math.min(body.length, selectionStart + selection.toString().length + 200);
        setSelectionContext(body.substring(contextStart, contextEnd));
      }

      setShowVoiceOverlay(true);
    }
  }, [editedBody]);

  // Handle voice edit applied
  const handleEditApplied = useCallback((originalText: string, newText: string) => {
    if (typeof editedBody === "string") {
      const newBody = editedBody.replace(originalText, newText);
      setEditedBody(newBody);
      setHasEdits(true);
    }
    setShowVoiceOverlay(false);
    setSelectedText("");
  }, [editedBody]);

  // Save changes and approve
  const handleApprove = async () => {
    if (hasEdits && typeof editedBody === "string") {
      await updateContent({
        id: content._id,
        body: editedBody,
        status: "published",
        approvalTier: "green",
      });
    }
    onApprove();
  };

  const score = content.voiceComplianceScore ?? 0;
  const tier = content.approvalTier || "yellow";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/95 backdrop-blur border-b border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <span className="text-sm font-medium text-white">Edit Content</span>

          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Score Header */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <ScoreGauge score={score} size="md" />
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="text-center">
              <div className="text-white font-medium">{content.category}</div>
              <div className="text-xs text-zinc-500">Category</div>
            </div>
            <div className="w-px h-8 bg-[#1a1a1a]" />
            <div className="text-center">
              <div className="text-white font-medium capitalize">{content.contentType}</div>
              <div className="text-xs text-zinc-500">Type</div>
            </div>
            <div className="w-px h-8 bg-[#1a1a1a]" />
            <div className="text-center">
              <div className="text-white font-medium capitalize">{tier}</div>
              <div className="text-xs text-zinc-500">Tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article
        className="max-w-3xl mx-auto px-4 py-8 pb-32"
        onMouseUp={handleMouseUp}
      >
        {/* Title */}
        <h1 className="text-2xl font-medium text-white mb-8 leading-tight">
          {content.title}
        </h1>

        {/* Body - Rendered as styled HTML */}
        <div className="selection:bg-blue-500/30">
          {typeof editedBody === "string" ? (
            <div
              className="prose prose-invert prose-zinc max-w-none
                prose-headings:font-bebas prose-headings:tracking-wider
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-white prose-strong:font-semibold
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-ul:mb-6 prose-ol:mb-6 prose-li:text-zinc-300 prose-li:mb-2
                prose-table:border-collapse prose-th:border prose-th:border-zinc-700
                prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-white
                prose-td:border prose-td:border-zinc-700 prose-td:px-4 prose-td:py-2 prose-td:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(editedBody) }}
            />
          ) : (
            <p className="text-zinc-500 italic">No content body available</p>
          )}
        </div>

        {/* Voice hint */}
        <div className="mt-12 p-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] text-center">
          <p className="text-sm text-zinc-400">
            <span className="text-blue-400 font-medium">Select text</span> to edit with your voice
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            Hold SPACEBAR or tap the mic button to speak
          </p>
        </div>

        {hasEdits && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Unsaved changes
          </div>
        )}
      </article>

      {/* Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
          <button
            onClick={onReject}
            className="flex-1 max-w-[140px] py-3 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-sm font-medium text-red-400 hover:border-red-400/30 transition-all"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="flex-1 max-w-[140px] py-3 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-sm font-medium text-zinc-400 hover:text-white hover:border-[#2a2a2a] transition-all"
          >
            Skip
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 max-w-[140px] py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all"
          >
            {hasEdits ? "Save" : "Approve"}
          </button>
        </div>
      </div>

      {/* Voice Edit Overlay */}
      <AnimatePresence>
        {showVoiceOverlay && (
          <VoiceEditOverlay
            selectedText={selectedText}
            context={selectionContext}
            contentId={content._id}
            contentType={content.contentType}
            category={content.category}
            expert={expert}
            onClose={() => {
              setShowVoiceOverlay(false);
              setSelectedText("");
            }}
            onApply={handleEditApplied}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
