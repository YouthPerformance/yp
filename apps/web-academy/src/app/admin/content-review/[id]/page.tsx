// ═══════════════════════════════════════════════════════════
// CONTENT REVIEW DETAIL PAGE
// Review, iterate with voice, and approve/reject content
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "rgba(255, 193, 7, 0.2)", text: "#FFC107" },
  IN_REVIEW: { bg: "rgba(33, 150, 243, 0.2)", text: "#2196F3" },
  CHANGES_REQUESTED: { bg: "rgba(255, 152, 0, 0.2)", text: "#FF9800" },
  APPROVED: { bg: "rgba(0, 246, 224, 0.2)", text: "#00F6E0" },
  PUBLISHED: { bg: "rgba(76, 175, 80, 0.2)", text: "#4CAF50" },
};

// Author badge colors
const AUTHOR_COLORS: Record<string, { bg: string; text: string }> = {
  ADAM: { bg: "rgba(0, 246, 224, 0.2)", text: "#00F6E0" },
  JAMES: { bg: "rgba(156, 39, 176, 0.2)", text: "#9C27B0" },
  YP: { bg: "rgba(255, 255, 255, 0.2)", text: "#FFFFFF" },
  TEAM_YP: { bg: "rgba(255, 215, 0, 0.2)", text: "#FFD700" },
};

export default function ContentReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as Id<"playbook_content">;

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isIterating, setIsIterating] = useState(false);
  const [iteratedContent, setIteratedContent] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedBody, setEditedBody] = useState("");

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch content
  const content = useQuery(api.playbook.getContent, { contentId });

  // Mutations
  const updateContent = useMutation(api.playbook.updateContent);
  const approveContent = useMutation(api.playbook.approveContent);
  const requestChanges = useMutation(api.playbook.requestChanges);

  // Initialize edited body when content loads
  useEffect(() => {
    if (content?.body) {
      setEditedBody(content.body);
    }
  }, [content?.body]);

  // Start voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to access microphone. Please check permissions.");
    }
  }, []);

  // Stop voice recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Transcribe audio using Deepgram
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Get Deepgram token from API
      const tokenRes = await fetch("/api/voice/deepgram-token");
      const { token } = await tokenRes.json();

      // Send to Deepgram
      const response = await fetch(
        "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "audio/webm",
          },
          body: audioBlob,
        },
      );

      const result = await response.json();
      const transcriptText = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
      setTranscript(transcriptText);
    } catch (error) {
      console.error("Failed to transcribe:", error);
      setTranscript("(Transcription failed - please type your feedback)");
    }
  };

  // Iterate content with voice feedback
  const iterateWithFeedback = async () => {
    if (!content || !transcript) return;

    setIsIterating(true);
    try {
      const response = await fetch("/api/content/iterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          originalContent: content.body,
          feedbackTranscript: transcript,
          author: content.author,
          contentType: content.contentType,
        }),
      });

      const result = await response.json();
      if (result.newContent) {
        setIteratedContent(result.newContent);
        setShowDiff(true);
      }
    } catch (error) {
      console.error("Failed to iterate:", error);
      alert("Failed to generate updated content. Please try again.");
    } finally {
      setIsIterating(false);
    }
  };

  // Apply iterated content
  const applyIteratedContent = async () => {
    if (!iteratedContent) return;

    await updateContent({
      contentId,
      body: iteratedContent,
      iterationNotes: transcript,
    });

    setIteratedContent(null);
    setShowDiff(false);
    setTranscript("");
  };

  // Save manual edits
  const saveEdits = async () => {
    await updateContent({
      contentId,
      body: editedBody,
    });
    setEditMode(false);
  };

  // Approve content
  const handleApprove = async () => {
    await approveContent({ contentId });
    router.push("/admin/content-review");
  };

  // Request changes
  const handleRequestChanges = async () => {
    if (!transcript) {
      alert("Please record your feedback first");
      return;
    }
    await requestChanges({ contentId, changesRequested: transcript });
    router.push("/admin/content-review");
  };

  if (!content) {
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
            Loading content...
          </span>
        </div>
      </div>
    );
  }

  const statusColors = STATUS_COLORS[content.status];
  const authorColors = AUTHOR_COLORS[content.author];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/content-review"
            className="text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            ← Back to Queue
          </Link>
          <Link
            href="/admin/quick-review"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "rgba(0, 246, 224, 0.2)",
              color: "#00F6E0",
            }}
          >
            🎙️ Quick Review Mode
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Author Badge */}
          <span
            className="px-3 py-1 rounded text-sm font-medium"
            style={{
              backgroundColor: authorColors.bg,
              color: authorColors.text,
            }}
          >
            {content.author === "TEAM_YP" ? "Team YP" : content.author}
          </span>
          {/* Status Badge */}
          <span
            className="px-3 py-1 rounded text-sm font-medium"
            style={{
              backgroundColor: statusColors.bg,
              color: statusColors.text,
            }}
          >
            {content.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Title & Meta */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {content.title}
        </h1>
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
          <span>Category: {content.category}</span>
          <span>Type: {content.contentType}</span>
          <span>Version: {content.version}</span>
          <span>Created: {new Date(content.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Voice Iteration Panel */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <h2
          className="font-bebas text-xl tracking-wider mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          VOICE ITERATION
        </h2>

        <div className="space-y-4">
          {/* Recording Button */}
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: isRecording ? "rgba(244, 67, 54, 0.2)" : "var(--accent-primary)",
                color: isRecording ? "#F44336" : "var(--bg-primary)",
                border: isRecording ? "2px solid #F44336" : "none",
              }}
            >
              {isRecording ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Stop Recording
                </>
              ) : (
                <>🎤 Record Feedback</>
              )}
            </motion.button>

            {transcript && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={iterateWithFeedback}
                disabled={isIterating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: isIterating ? "var(--bg-tertiary)" : "rgba(0, 246, 224, 0.2)",
                  color: "#00F6E0",
                  opacity: isIterating ? 0.5 : 1,
                }}
              >
                {isIterating ? "Iterating..." : "✨ Apply Feedback"}
              </motion.button>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <p className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
                Your feedback:
              </p>
              <p style={{ color: "var(--text-primary)" }}>{transcript}</p>
            </div>
          )}

          {/* Or type feedback */}
          <div>
            <p className="text-sm mb-2" style={{ color: "var(--text-tertiary)" }}>
              Or type your feedback:
            </p>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type feedback here... (e.g., 'Make it more direct. Add a coaching cue about ankle mobility.')"
              className="w-full p-3 rounded-lg text-sm resize-none"
              rows={3}
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Diff View (when iterated content is available) */}
      {showDiff && iteratedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "2px solid #00F6E0",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bebas text-xl tracking-wider" style={{ color: "#00F6E0" }}>
              UPDATED VERSION
            </h2>
            <div className="flex gap-2">
              <button
                onClick={applyIteratedContent}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "rgba(76, 175, 80, 0.2)",
                  color: "#4CAF50",
                }}
              >
                ✓ Use This Version
              </button>
              <button
                onClick={() => {
                  setIteratedContent(null);
                  setShowDiff(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                ✕ Discard
              </button>
            </div>
          </div>
          <pre
            className="whitespace-pre-wrap text-sm p-4 rounded-lg overflow-auto max-h-96"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            {iteratedContent}
          </pre>
        </motion.div>
      )}

      {/* Content Preview */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bebas text-xl tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            CONTENT
          </h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: editMode ? "rgba(255, 193, 7, 0.2)" : "var(--bg-tertiary)",
              color: editMode ? "#FFC107" : "var(--text-secondary)",
            }}
          >
            {editMode ? "Cancel Edit" : "✏️ Edit Manually"}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className="w-full p-4 rounded-lg text-sm font-mono resize-none"
              rows={20}
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={saveEdits}
              className="px-6 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm" style={{ color: "var(--text-secondary)" }}>
            {content.body}
          </pre>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className="flex items-center justify-between p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <button
          onClick={handleRequestChanges}
          className="px-6 py-3 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: "rgba(255, 152, 0, 0.2)",
            color: "#FF9800",
          }}
        >
          Request Changes
        </button>

        <button
          onClick={handleApprove}
          className="px-8 py-3 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: "rgba(76, 175, 80, 0.3)",
            color: "#4CAF50",
            border: "2px solid #4CAF50",
          }}
        >
          ✓ Approve Content
        </button>
      </div>
    </div>
  );
}
