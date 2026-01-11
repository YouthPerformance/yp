/**
 * Voice Editor Button
 *
 * Simple, beautiful mic button for James & Adam to dictate content.
 * One-tap to start, one-tap to stop.
 *
 * Features:
 * - Animated recording indicator
 * - Real-time transcript preview
 * - Processing state for Groq
 * - Mobile-optimized
 */

"use client";

import { useState } from "react";
import { useVoiceEditor, type STTProvider } from "@/lib/voice/speech-to-text";

interface VoiceEditorButtonProps {
  provider?: STTProvider;
  groqApiKey?: string;
  deepgramApiKey?: string;
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceEditorButton({
  provider = "browser",
  groqApiKey,
  deepgramApiKey,
  onTranscript,
  className = "",
}: VoiceEditorButtonProps) {
  const [showPreview, setShowPreview] = useState(false);

  const { isRecording, isProcessing, transcript, startRecording, stopRecording, clear } =
    useVoiceEditor({
      provider,
      groqApiKey,
      deepgramApiKey,
      onFinalResult: (result) => {
        if (result.text) {
          onTranscript(result.text);
        }
      },
    });

  const handleClick = async () => {
    if (isRecording) {
      await stopRecording();
      setShowPreview(false);
    } else {
      await startRecording();
      setShowPreview(true);
    }
  };

  const handleUseTranscript = () => {
    if (transcript) {
      onTranscript(transcript);
      clear();
      setShowPreview(false);
    }
  };

  const handleDiscard = () => {
    clear();
    setShowPreview(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Mic Button */}
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 ease-out
          ${
            isRecording
              ? "bg-red-500 scale-110 shadow-lg shadow-red-500/30"
              : isProcessing
              ? "bg-accent-primary/50 animate-pulse"
              : "bg-accent-primary hover:bg-accent-primary-hover hover:scale-105"
          }
        `}
      >
        {/* Mic Icon */}
        {!isProcessing ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`text-black transition-transform ${isRecording ? "scale-110" : ""}`}
          >
            <path
              d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
              fill="currentColor"
            />
            <path
              d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.41 6.28 20.06 10.5 20.79V23H13.5V20.79C17.72 20.06 21 16.41 21 12V10H19Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          // Processing spinner
          <svg className="w-6 h-6 animate-spin text-black" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Recording pulse rings */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-20" />
          </>
        )}
      </button>

      {/* Status Label */}
      <div className="mt-2 text-center text-xs text-text-tertiary">
        {isRecording ? (
          <span className="text-red-500 font-medium">Recording...</span>
        ) : isProcessing ? (
          <span className="text-accent-primary">Processing...</span>
        ) : (
          <span>Tap to speak</span>
        )}
      </div>

      {/* Live Transcript Preview */}
      {showPreview && transcript && !isRecording && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 max-w-[90vw]">
          <div className="bg-bg-secondary border border-border-default rounded-xl p-4 shadow-xl">
            <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
              Transcript Preview
            </div>
            <div className="text-text-primary text-sm max-h-32 overflow-y-auto mb-3">
              {transcript}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUseTranscript}
                className="flex-1 py-2 bg-accent-primary text-black text-sm font-semibold rounded-lg"
              >
                Use This
              </button>
              <button
                onClick={handleDiscard}
                className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-lg"
              >
                Discard
              </button>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-bg-secondary border-r border-b border-border-default transform rotate-45" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INLINE VOICE EDITOR (For text fields)
// ─────────────────────────────────────────────────────────────

interface InlineVoiceEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  provider?: STTProvider;
  groqApiKey?: string;
  className?: string;
}

export function InlineVoiceEditor({
  value,
  onChange,
  placeholder = "Type or speak...",
  provider = "browser",
  groqApiKey,
  className = "",
}: InlineVoiceEditorProps) {
  const { isRecording, isProcessing, transcript, startRecording, stopRecording } =
    useVoiceEditor({
      provider,
      groqApiKey,
      onInterimResult: (text) => {
        // Update in real-time for browser/deepgram
        if (provider !== "groq") {
          onChange(text);
        }
      },
      onFinalResult: (result) => {
        onChange(result.text);
      },
    });

  const handleMicClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        value={isRecording && provider !== "groq" ? transcript : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-4 pr-14 bg-bg-secondary border border-border-default rounded-xl text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary"
        disabled={isRecording}
      />

      {/* Mic Button */}
      <button
        onClick={handleMicClick}
        disabled={isProcessing}
        className={`
          absolute right-3 bottom-3 w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-200
          ${
            isRecording
              ? "bg-red-500 animate-pulse"
              : isProcessing
              ? "bg-accent-primary/50"
              : "bg-bg-tertiary hover:bg-accent-primary/20"
          }
        `}
      >
        {isProcessing ? (
          <svg className="w-5 h-5 animate-spin text-accent-primary" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={isRecording ? "text-white" : "text-text-tertiary"}
          >
            <path
              d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
              fill="currentColor"
            />
            <path
              d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.41 6.28 20.06 10.5 20.79V23H13.5V20.79C17.72 20.06 21 16.41 21 12V10H19Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-500 font-medium">Recording</span>
        </div>
      )}
    </div>
  );
}
