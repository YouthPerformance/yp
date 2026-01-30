// ═══════════════════════════════════════════════════════════
// VOICE EDIT OVERLAY
// Eight Sleep-inspired voice recording UI
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Id } from "@yp/alpha/convex/_generated/dataModel";
import { motion } from "framer-motion";

interface VoiceEditOverlayProps {
  selectedText: string;
  context: string;
  contentId: Id<"playbook_content">;
  contentType: string;
  category: string;
  expert: "JAMES" | "ADAM";
  onClose: () => void;
  onApply: (originalText: string, newText: string) => void;
}

type Stage = "ready" | "recording" | "processing" | "preview";

export function VoiceEditOverlay({
  selectedText,
  context,
  contentId,
  contentType,
  category,
  expert,
  onClose,
  onApply,
}: VoiceEditOverlayProps) {
  const [stage, setStage] = useState<Stage>("ready");
  const [transcript, setTranscript] = useState("");
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && stage === "ready") {
        e.preventDefault();
        startRecording();
      }
      if (e.code === "Escape") {
        onClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && stage === "recording") {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stage, onClose]);

  // Start recording
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

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        processVoiceEdit(blob);
      };

      mediaRecorder.start();
      setStage("recording");
    } catch (err) {
      setError("Microphone access denied");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && stage === "recording") {
      mediaRecorderRef.current.stop();
      setStage("processing");
    }
  }, [stage]);

  // Process voice edit via API
  const processVoiceEdit = async (blob: Blob) => {
    try {
      // First transcribe the audio
      const formData = new FormData();
      formData.append("audio", blob);

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) {
        throw new Error("Transcription failed");
      }

      const { transcript: voiceTranscript } = await transcribeRes.json();
      setTranscript(voiceTranscript);

      // Call voice edit endpoint
      const editRes = await fetch("/api/content/voice-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText,
          voiceTranscript,
          surroundingContext: context,
          author: expert,
          category,
          contentType,
        }),
      });

      if (!editRes.ok) {
        throw new Error("Edit processing failed");
      }

      const { editedText: result } = await editRes.json();
      setEditedText(result);
      setStage("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setStage("ready");
    }
  };

  // Apply edit and save learning
  const handleApply = async () => {
    try {
      await fetch("/api/content/save-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expert,
          contentType,
          category,
          originalText: selectedText,
          voiceInstruction: transcript,
          correctedText: editedText,
          selectedContext: context,
          contentId,
          applied: true,
        }),
      });

      onApply(selectedText, editedText);
    } catch (err) {
      console.error("Failed to save learning:", err);
      onApply(selectedText, editedText);
    }
  };

  // Discard
  const handleDiscard = async () => {
    try {
      await fetch("/api/content/save-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expert,
          contentType,
          category,
          originalText: selectedText,
          voiceInstruction: transcript,
          correctedText: editedText,
          selectedContext: context,
          contentId,
          applied: false,
        }),
      });
    } catch (err) {
      console.error("Failed to save learning:", err);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#0a0a0a] rounded-3xl border border-[#1a1a1a] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-medium text-white">Voice Edit</span>
          <div className="w-5" />
        </div>

        {/* Selected Text */}
        <div className="px-6 py-4 border-b border-[#1a1a1a]">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">SELECTED</div>
          <p className="text-sm text-zinc-300 line-clamp-3">"{selectedText}"</p>
        </div>

        {/* Stage Content */}
        <div className="px-6 py-8">
          {stage === "ready" && (
            <div className="flex flex-col items-center">
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
              <p className="mt-6 text-sm text-zinc-400">
                Hold <span className="px-2 py-1 rounded bg-[#1a1a1a] text-white font-mono text-xs">SPACE</span> to speak
              </p>
            </div>
          )}

          {stage === "recording" && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
              </div>
              <p className="mt-6 text-sm text-red-400 font-medium">Recording...</p>
              <p className="text-xs text-zinc-500 mt-1">Release to stop</p>
            </div>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p className="mt-6 text-sm text-zinc-400">Processing...</p>
            </div>
          )}

          {stage === "preview" && (
            <div className="space-y-4">
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">YOUR INSTRUCTION</div>
                <p className="text-sm text-blue-400">"{transcript}"</p>
              </div>

              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">RESULT</div>
                <p className="text-sm text-green-400">"{editedText}"</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        {stage === "preview" && (
          <div className="px-6 pb-6 flex items-center gap-3">
            <button
              onClick={handleDiscard}
              className="flex-1 py-3 rounded-full bg-[#1a1a1a] text-sm font-medium text-zinc-400 hover:text-white transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all"
            >
              Apply
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
