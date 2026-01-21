// ═══════════════════════════════════════════════════════════
// VOICE REVIEW PANEL
// Ultra-easy voice-first review for James & Adam
// Features: Quick commands, templates, swipe approval
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface VoiceReviewPanelProps {
  contentId: string;
  contentBody: string;
  contentTitle: string;
  author: "JAMES" | "ADAM" | "YP" | "TEAM_YP";
  contentType: "pillar" | "topic" | "qa" | "drill";
  onApprove: () => void;
  onRequestChanges: (feedback: string) => void;
  onIterate: (feedback: string) => Promise<string | null>;
  onNext?: () => void;
  onPrevious?: () => void;
}

// Quick feedback templates for common edits
const QUICK_TEMPLATES = [
  { label: "Make it shorter", icon: "✂️", feedback: "Make this more concise. Cut any fluff." },
  { label: "More direct", icon: "🎯", feedback: "Make this more direct and actionable." },
  { label: "Add coaching cue", icon: "💡", feedback: "Add a specific coaching cue athletes can use." },
  { label: "More technical", icon: "🔬", feedback: "Add more technical detail for advanced athletes." },
  { label: "Simplify", icon: "📝", feedback: "Simplify the language for younger athletes." },
  { label: "Add drill", icon: "🏋️", feedback: "Add a specific drill or exercise to practice this." },
];

// Voice command patterns
const VOICE_COMMANDS = {
  approve: ["approve", "approved", "looks good", "perfect", "ship it", "good to go", "send it"],
  reject: ["reject", "rejected", "needs work", "not ready", "try again"],
  next: ["next", "skip", "move on", "next one"],
  previous: ["previous", "back", "go back", "last one"],
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function VoiceReviewPanel({
  contentId,
  contentBody,
  contentTitle,
  author,
  contentType,
  onApprove,
  onRequestChanges,
  onIterate,
  onNext,
  onPrevious,
}: VoiceReviewPanelProps) {
  // State
  const [mode, setMode] = useState<"idle" | "recording" | "processing" | "reviewing">("idle");
  const [transcript, setTranscript] = useState("");
  const [iteratedContent, setIteratedContent] = useState<string | null>(null);
  const [voiceOnlyMode, setVoiceOnlyMode] = useState(false);
  const [commandDetected, setCommandDetected] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Swipe gesture
  const x = useMotionValue(0);
  const approveOpacity = useTransform(x, [0, 150], [0, 1]);
  const rejectOpacity = useTransform(x, [-150, 0], [1, 0]);

  // ─────────────────────────────────────────────────────────
  // VOICE RECORDING
  // ─────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setRecordingDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        await transcribeAndProcess(audioBlob);
      };

      mediaRecorder.start();
      setMode("recording");

      // Track recording duration
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mode === "recording") {
      mediaRecorderRef.current.stop();
      setMode("processing");
    }
  }, [mode]);

  // ─────────────────────────────────────────────────────────
  // TRANSCRIPTION & COMMAND DETECTION
  // ─────────────────────────────────────────────────────────

  const transcribeAndProcess = async (audioBlob: Blob) => {
    try {
      // Get Deepgram token
      const tokenRes = await fetch("/api/voice/deepgram-token");
      const { token } = await tokenRes.json();

      // Transcribe
      const response = await fetch(
        "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "audio/webm",
          },
          body: audioBlob,
        }
      );

      const result = await response.json();
      const transcriptText =
        result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
      setTranscript(transcriptText);

      // Check for voice commands
      const lowerTranscript = transcriptText.toLowerCase();

      // Approve commands
      if (VOICE_COMMANDS.approve.some((cmd) => lowerTranscript.includes(cmd))) {
        setCommandDetected("approve");
        setTimeout(() => {
          onApprove();
          setMode("idle");
          setCommandDetected(null);
        }, 1000);
        return;
      }

      // Reject commands
      if (VOICE_COMMANDS.reject.some((cmd) => lowerTranscript.includes(cmd))) {
        setCommandDetected("reject");
        setTimeout(() => {
          onRequestChanges(transcriptText);
          setMode("idle");
          setCommandDetected(null);
        }, 1000);
        return;
      }

      // Next command
      if (VOICE_COMMANDS.next.some((cmd) => lowerTranscript.includes(cmd))) {
        setCommandDetected("next");
        setTimeout(() => {
          onNext?.();
          setMode("idle");
          setCommandDetected(null);
        }, 500);
        return;
      }

      // Previous command
      if (VOICE_COMMANDS.previous.some((cmd) => lowerTranscript.includes(cmd))) {
        setCommandDetected("previous");
        setTimeout(() => {
          onPrevious?.();
          setMode("idle");
          setCommandDetected(null);
        }, 500);
        return;
      }

      // If no command detected, treat as feedback for iteration
      if (transcriptText.trim()) {
        setMode("processing");
        const newContent = await onIterate(transcriptText);
        if (newContent) {
          setIteratedContent(newContent);
          setMode("reviewing");
        } else {
          setMode("idle");
        }
      } else {
        setMode("idle");
      }
    } catch (error) {
      console.error("Transcription failed:", error);
      setMode("idle");
    }
  };

  // ─────────────────────────────────────────────────────────
  // QUICK TEMPLATE ACTIONS
  // ─────────────────────────────────────────────────────────

  const applyQuickTemplate = async (template: (typeof QUICK_TEMPLATES)[0]) => {
    setTranscript(template.feedback);
    setMode("processing");
    const newContent = await onIterate(template.feedback);
    if (newContent) {
      setIteratedContent(newContent);
      setMode("reviewing");
    } else {
      setMode("idle");
    }
  };

  // ─────────────────────────────────────────────────────────
  // SWIPE HANDLERS
  // ─────────────────────────────────────────────────────────

  const handleDragEnd = () => {
    const xValue = x.get();
    if (xValue > 150) {
      onApprove();
    } else if (xValue < -150) {
      // Swipe left = request more info before rejecting
    }
    x.set(0);
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Voice-Only Mode Toggle */}
      <div className="flex items-center justify-between">
        <h2
          className="font-bebas text-xl tracking-wider"
          style={{ color: "var(--text-primary)" }}
        >
          VOICE REVIEW
        </h2>
        <button
          onClick={() => setVoiceOnlyMode(!voiceOnlyMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: voiceOnlyMode
              ? "rgba(0, 246, 224, 0.2)"
              : "var(--bg-tertiary)",
            color: voiceOnlyMode ? "#00F6E0" : "var(--text-secondary)",
          }}
        >
          {voiceOnlyMode ? "🎙️ Voice-Only ON" : "🎙️ Voice-Only Mode"}
        </button>
      </div>

      {/* Command Detection Overlay */}
      <AnimatePresence>
        {commandDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="text-8xl mb-4"
              >
                {commandDetected === "approve" && "✅"}
                {commandDetected === "reject" && "❌"}
                {commandDetected === "next" && "➡️"}
                {commandDetected === "previous" && "⬅️"}
              </motion.div>
              <p
                className="font-bebas text-3xl tracking-wider"
                style={{ color: "var(--text-primary)" }}
              >
                {commandDetected.toUpperCase()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Interface */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Main Recording Button - Big and Tappable */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={mode === "recording" ? stopRecording : startRecording}
            disabled={mode === "processing"}
            className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor:
                mode === "recording"
                  ? "rgba(244, 67, 54, 0.3)"
                  : mode === "processing"
                    ? "var(--bg-tertiary)"
                    : "var(--accent-primary)",
              border:
                mode === "recording"
                  ? "3px solid #F44336"
                  : "3px solid transparent",
            }}
          >
            {mode === "processing" ? (
              <div className="relative w-8 h-8">
                <div
                  className="absolute inset-0 border-3 rounded-full animate-spin"
                  style={{
                    borderColor: "transparent",
                    borderTopColor: "var(--accent-primary)",
                  }}
                />
              </div>
            ) : mode === "recording" ? (
              <div className="flex flex-col items-center">
                <span className="relative flex h-4 w-4 mb-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
                </span>
                <span className="text-sm font-mono text-red-400">
                  {recordingDuration}s
                </span>
              </div>
            ) : (
              <span className="text-4xl">🎤</span>
            )}
          </motion.button>

          <p
            className="text-sm text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            {mode === "recording"
              ? "Listening... Tap to stop"
              : mode === "processing"
                ? "Processing your feedback..."
                : "Tap to speak your feedback"}
          </p>

          {/* Voice Commands Hint */}
          {!voiceOnlyMode && mode === "idle" && (
            <div
              className="text-xs text-center p-3 rounded-lg"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-tertiary)",
              }}
            >
              <p className="mb-1">💡 Voice commands:</p>
              <p>
                &quot;Approve&quot; • &quot;Next&quot; • &quot;Needs
                work&quot; • Or just speak your feedback
              </p>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && mode !== "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p
              className="text-xs mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              You said:
            </p>
            <p style={{ color: "var(--text-primary)" }}>{transcript}</p>
          </motion.div>
        )}
      </div>

      {/* Quick Templates (hidden in voice-only mode) */}
      {!voiceOnlyMode && mode === "idle" && (
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Quick edits:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TEMPLATES.map((template) => (
              <motion.button
                key={template.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyQuickTemplate(template)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                <span>{template.icon}</span>
                {template.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Iterated Content Review */}
      <AnimatePresence>
        {mode === "reviewing" && iteratedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "2px solid #00F6E0",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-bebas text-lg tracking-wider"
                style={{ color: "#00F6E0" }}
              >
                UPDATED VERSION
              </h3>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Apply the iterated content
                    setMode("idle");
                    setIteratedContent(null);
                    onApprove();
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(76, 175, 80, 0.3)",
                    color: "#4CAF50",
                  }}
                >
                  ✓ Use & Approve
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMode("idle");
                    setIteratedContent(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  ✕ Discard
                </motion.button>
              </div>
            </div>

            <pre
              className="whitespace-pre-wrap text-sm p-4 rounded-lg overflow-auto max-h-64"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              {iteratedContent}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe-to-Approve (mobile) */}
      {!voiceOnlyMode && mode === "idle" && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="relative p-6 rounded-xl cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: "grabbing" }}
        >
          {/* Background indicators */}
          <motion.div
            className="absolute inset-0 rounded-xl flex items-center justify-end px-6"
            style={{
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              opacity: approveOpacity,
            }}
          >
            <span className="text-4xl">✅</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-xl flex items-center justify-start px-6"
            style={{
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              opacity: rejectOpacity,
            }}
          >
            <span className="text-4xl">↩️</span>
          </motion.div>

          {/* Swipe hint */}
          <div
            className="relative z-10 flex items-center justify-center py-4 rounded-xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center gap-4">
              <span style={{ color: "var(--text-tertiary)" }}>← More info</span>
              <span className="text-2xl">👆</span>
              <span style={{ color: "var(--text-tertiary)" }}>
                Swipe to approve →
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Action Buttons (always visible) */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: onPrevious ? "var(--text-secondary)" : "var(--text-tertiary)",
            opacity: onPrevious ? 1 : 0.5,
          }}
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onRequestChanges(transcript || "Needs more work")}
            className="px-6 py-3 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              color: "#FF9800",
            }}
          >
            Request Changes
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onApprove}
            className="px-8 py-3 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: "rgba(76, 175, 80, 0.3)",
              color: "#4CAF50",
              border: "2px solid #4CAF50",
            }}
          >
            ✓ Approve
          </motion.button>
        </div>

        <button
          onClick={onNext}
          disabled={!onNext}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: onNext ? "var(--text-secondary)" : "var(--text-tertiary)",
            opacity: onNext ? 1 : 0.5,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
