// ═══════════════════════════════════════════════════════════
// VOICE SORTING COMPONENT - REALTIME API VERSION
// OpenAI GPT-4o Realtime API with native audio processing
// ~300ms latency vs ~950ms modular pipeline
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Mic, MicOff, Volume2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type ClassificationResult, useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import { IdentityReveal } from "./IdentityReveal";
import { WolfAvatar } from "./WolfAvatar";

interface VoiceSortingRealtimeProps {
  onComplete: (result: {
    trainingPath: "glass" | "grinder" | "prospect";
    wolfIdentity: "speed" | "tank" | "air";
    coachComment: string;
    firstMissionId: string;
  }) => void;
  onFallbackToModular?: () => void;
}

/**
 * Map Realtime API classification to component format
 */
function mapClassificationResult(result: ClassificationResult): {
  trainingPath: "glass" | "grinder" | "prospect";
  wolfIdentity: "speed" | "tank" | "air";
  coachComment: string;
  firstMissionId: string;
} {
  return {
    trainingPath: result.training_path.toLowerCase() as "glass" | "grinder" | "prospect",
    wolfIdentity: result.wolf_identity.toLowerCase() as "speed" | "tank" | "air",
    coachComment: result.coach_comment || "Welcome to the Pack.",
    firstMissionId: `${result.training_path.toLowerCase()}-${result.wolf_identity.toLowerCase()}-001`,
  };
}

export function VoiceSortingRealtime({
  onComplete,
  onFallbackToModular,
}: VoiceSortingRealtimeProps) {
  const {
    state,
    isConnected,
    isSpeaking,
    isListening,
    transcript,
    classification,
    error,
    connect,
    disconnect,
    interrupt,
  } = useRealtimeVoice({
    onClassification: (result) => {
      console.log("[realtime] Classification received:", result);
    },
    onError: (err) => {
      console.error("[realtime] Error:", err);
      setConnectionAttempts((prev) => prev + 1);
    },
  });

  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [mappedResult, setMappedResult] = useState<ReturnType<
    typeof mapClassificationResult
  > | null>(null);

  // Determine current sorting step based on transcript analysis
  // (Realtime API handles the conversation flow internally)
  const currentStep = classification
    ? "reveal"
    : state === "idle"
      ? "idle"
      : state === "connecting"
        ? "intro"
        : state === "error"
          ? "error"
          : "conversation";

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setHasMicPermission(true);
      })
      .catch(() => {
        setHasMicPermission(false);
        setShowButtons(true);
      });
  }, []);

  // Handle classification result
  useEffect(() => {
    if (classification) {
      const result = mapClassificationResult(classification);
      setMappedResult(result);
      // Delay reveal for dramatic effect
      const timer = setTimeout(() => setShowReveal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [classification]);

  // Auto-fallback after 2 connection failures
  useEffect(() => {
    if (connectionAttempts >= 2 && onFallbackToModular) {
      console.log("[realtime] Falling back to modular pipeline after 2 failures");
      onFallbackToModular();
    }
  }, [connectionAttempts, onFallbackToModular]);

  // Show buttons after timeout or on error
  useEffect(() => {
    if (state === "error" || (state === "listening" && !showButtons)) {
      // Show button fallback after 10 seconds of listening with no progress
      const timer = setTimeout(() => setShowButtons(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [state, showButtons]);

  const handleRevealComplete = useCallback(() => {
    if (mappedResult) {
      onComplete(mappedResult);
    }
  }, [mappedResult, onComplete]);

  const handleStartSorting = useCallback(async () => {
    if (hasMicPermission) {
      await connect();
    } else {
      setShowButtons(true);
    }
  }, [hasMicPermission, connect]);

  const handleShowButtons = useCallback(() => {
    setShowButtons(true);
  }, []);

  // Button answer handlers (fallback mode)
  // These would need to be connected to a fallback classification system
  // For now, they trigger a fallback to the modular pipeline
  const handleButtonFallback = useCallback(() => {
    if (onFallbackToModular) {
      disconnect();
      onFallbackToModular();
    }
  }, [disconnect, onFallbackToModular]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Connection status indicator */}
      {state !== "idle" && state !== "complete" && (
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-green-500"
                : state === "connecting"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {state === "connecting" ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      )}

      {/* HUD Progress - simplified for realtime */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <motion.div
          className="px-4 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "rgba(0, 246, 224, 0.1)",
            color: "#00f6e0",
            border: "1px solid rgba(0, 246, 224, 0.3)",
          }}
          animate={{
            boxShadow:
              isSpeaking || isListening
                ? [
                    "0 0 10px rgba(0, 246, 224, 0.3)",
                    "0 0 20px rgba(0, 246, 224, 0.5)",
                    "0 0 10px rgba(0, 246, 224, 0.3)",
                  ]
                : "none",
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {state === "idle" && "Ready"}
          {state === "connecting" && "Initializing..."}
          {state === "listening" && "Listening"}
          {state === "processing" && "Processing"}
          {state === "speaking" && "Wolf Speaking"}
          {state === "complete" && "Complete"}
          {state === "error" && "Error"}
        </motion.div>
      </div>

      {/* Wolf avatar */}
      <WolfAvatar
        isSpeaking={isSpeaking}
        isListening={isListening}
        identity={
          classification?.wolf_identity.toLowerCase() as "speed" | "tank" | "air" | undefined
        }
        revealed={!!classification}
      />

      {/* Current prompt / status */}
      <motion.p
        key={state}
        className="text-xl md:text-2xl text-gray-300 text-center mt-8 mb-4 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {state === "idle" && "Ready to find your wolf identity?"}
        {state === "connecting" && "Connecting to Wolf..."}
        {state === "listening" && "Speak to Wolf"}
        {state === "processing" && "Processing..."}
        {state === "speaking" && "Wolf is speaking..."}
        {state === "complete" && "Welcome to the Pack"}
        {state === "error" && "Connection issue"}
      </motion.p>

      {/* Transcript display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="bg-gray-900/50 rounded-lg px-4 py-2 mb-6 max-w-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-gray-400 text-sm">&quot;{transcript}&quot;</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking indicator */}
      {isSpeaking && (
        <motion.div
          className="flex items-center gap-2 mb-6"
          style={{ color: "#00f6e0" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm">Wolf is speaking...</span>
          <motion.button
            onClick={interrupt}
            className="ml-2 px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
          >
            Interrupt
          </motion.button>
        </motion.div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          className="flex flex-col items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="flex items-center gap-2" style={{ color: "#00f6e0" }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Mic className="w-6 h-6" />
            </motion.div>
            <span className="text-sm font-medium">Listening...</span>
          </motion.div>
          <p className="text-gray-500 text-xs">Speak naturally</p>
        </motion.div>
      )}

      {/* Start button (idle state) */}
      {state === "idle" && (
        <motion.button
          onClick={handleStartSorting}
          className="px-8 py-4 rounded-full text-black font-bold text-lg transition-colors"
          style={{ backgroundColor: "#00f6e0" }}
          whileHover={{ scale: 1.05, backgroundColor: "#33f8e6" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {hasMicPermission === false ? (
            <span className="flex items-center gap-2">
              <MicOff className="w-5 h-5" />
              Start (No Mic)
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Begin Sorting
            </span>
          )}
        </motion.button>
      )}

      {/* Error state */}
      {state === "error" && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error?.message || "Connection failed"}</span>
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={handleStartSorting}
              className="px-6 py-3 rounded-full text-black font-bold"
              style={{ backgroundColor: "#00f6e0" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
            {onFallbackToModular && (
              <motion.button
                onClick={handleButtonFallback}
                className="px-6 py-3 rounded-full border border-gray-600 text-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Use Buttons
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Button fallback hint */}
      {isConnected && !showButtons && state !== "complete" && (
        <motion.button
          onClick={handleShowButtons}
          className="mt-4 text-gray-500 text-sm hover:text-gray-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          or tap answers instead
        </motion.button>
      )}

      {/* Button fallback */}
      <AnimatePresence>
        {showButtons && !classification && state !== "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <p className="text-gray-400 text-sm text-center mb-4">
              Voice not working? Tap to answer:
            </p>
            {/* Note: In production, these buttons would need to handle classification
                For now, they trigger fallback to modular pipeline */}
            <div className="flex flex-col gap-2">
              <motion.button
                onClick={handleButtonFallback}
                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Switch to Button Mode
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity reveal overlay */}
      <AnimatePresence>
        {showReveal && mappedResult && (
          <IdentityReveal
            identity={mappedResult.wolfIdentity}
            trainingPath={mappedResult.trainingPath}
            coachComment={mappedResult.coachComment}
            onComplete={handleRevealComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default VoiceSortingRealtime;
