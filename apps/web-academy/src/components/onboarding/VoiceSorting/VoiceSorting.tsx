// ═══════════════════════════════════════════════════════════
// VOICE SORTING COMPONENT v3
// Buttons-first UX: Primary buttons + optional voice ("Or speak")
// Progressive fallback: After 2 voice failures, mic auto-hides
// Skip option: "Use buttons instead" for full session
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useVoiceSorting } from "@/hooks/useVoiceSorting";
import { AnswerButtons } from "./AnswerButtons";
import { IdentityReveal } from "./IdentityReveal";
import { WolfAvatar } from "./WolfAvatar";

interface VoiceSortingProps {
  onComplete: (result: {
    trainingPath: "glass" | "grinder" | "prospect";
    wolfIdentity: "speed" | "tank" | "air";
    coachComment: string;
    firstMissionId: string;
  }) => void;
}

const STEP_PROMPTS: Record<string, string> = {
  idle: "Ready to find your wolf identity?",
  intro: "Preparing your session...",
  pain: "Does anything hurt when you play?",
  volume: "How many teams are you on?",
  ambition: "What do you want to build?",
  reveal: "Analyzing your profile...",
  complete: "Welcome to the Pack",
};

export function VoiceSorting({ onComplete }: VoiceSortingProps) {
  const {
    step,
    isListening,
    isSpeaking,
    transcript,
    error,
    wolfIdentity,
    trainingPath,
    result,
    waitingForInput,
    voiceFailures,
    startSorting,
    answerWithVoice,
    answerPain,
    answerVolume,
    answerAmbition,
  } = useVoiceSorting();

  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [skipVoice, setSkipVoice] = useState(false); // User chose buttons-only mode

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Stop the stream immediately - we just wanted to check permission
        stream.getTracks().forEach((track) => track.stop());
        setHasMicPermission(true);
      })
      .catch(() => setHasMicPermission(false));
  }, []);

  // Show reveal when we have result
  useEffect(() => {
    if (step === "reveal" && wolfIdentity && trainingPath) {
      const timer = setTimeout(() => setShowReveal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [step, wolfIdentity, trainingPath]);

  // Handle reveal complete
  const handleRevealComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  // Is it a question step?
  const isQuestionStep = step === "pain" || step === "volume" || step === "ambition";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Progress indicator - always visible */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
        {["pain", "volume", "ambition"].map((s, i) => {
          const questionSteps = ["pain", "volume", "ambition"];
          const stepIndex = questionSteps.indexOf(step);
          const isComplete = stepIndex > i || step === "reveal" || step === "complete";
          const isCurrent = step === s;
          const isUpcoming = step === "idle" || step === "intro";

          return (
            <motion.div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                isComplete
                  ? "bg-cyan-400"
                  : isCurrent
                    ? "bg-cyan-400"
                    : isUpcoming
                      ? "bg-gray-600"
                      : "bg-gray-700"
              }`}
              animate={
                isCurrent
                  ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }
                  : isUpcoming
                    ? { opacity: [0.4, 0.6, 0.4] }
                    : {}
              }
              transition={{ duration: isCurrent ? 0.8 : 2, repeat: Infinity }}
            />
          );
        })}
      </div>

      {/* Wolf avatar */}
      <WolfAvatar
        isSpeaking={isSpeaking}
        isListening={isListening}
        identity={wolfIdentity}
        revealed={step === "reveal" || step === "complete"}
      />

      {/* Current prompt */}
      <motion.p
        key={step}
        className="text-xl md:text-2xl text-gray-300 text-center mt-8 mb-4 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {STEP_PROMPTS[step] || "..."}
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
            <p className="text-gray-400 text-sm">"{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking indicator (wolf is talking) */}
      {isSpeaking && (
        <motion.div
          className="flex items-center gap-2 mb-6"
          style={{ color: "#00f6e0" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm">Speaking...</span>
        </motion.div>
      )}

      {/* Error / guidance display */}
      {error && (
        <motion.div
          className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 mb-4 max-w-xs text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-300 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Start button (idle state) */}
      {step === "idle" && (
        <motion.button
          onClick={startSorting}
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

      {/* PRIMARY: Answer buttons (always shown when waiting for input) */}
      {waitingForInput && (
        <AnswerButtons
          step={step}
          onPainAnswer={answerPain}
          onVolumeAnswer={answerVolume}
          onAmbitionAnswer={answerAmbition}
          highlighted={voiceFailures > 0}
        />
      )}

      {/* SECONDARY: Voice option (if not skipped and < 2 failures) */}
      {waitingForInput && isQuestionStep && !skipVoice && voiceFailures < 2 && hasMicPermission && !isListening && (
        <motion.div
          className="flex items-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={answerWithVoice}
            className="text-gray-400 text-sm flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <Mic className="w-4 h-4" /> Or speak your answer
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => setSkipVoice(true)}
            className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
          >
            Use buttons instead
          </button>
        </motion.div>
      )}

      {/* Listening indicator with mic */}
      {waitingForInput && isListening && (
        <motion.div
          className="flex items-center gap-2 mt-6 text-cyan-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Mic className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Listening...</span>
        </motion.div>
      )}

      {/* Identity reveal overlay */}
      <AnimatePresence>
        {showReveal && result && (
          <IdentityReveal
            identity={result.wolfIdentity}
            trainingPath={result.trainingPath}
            coachComment={result.coachComment}
            onComplete={handleRevealComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
