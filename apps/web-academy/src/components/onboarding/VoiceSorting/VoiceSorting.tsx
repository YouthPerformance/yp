// ═══════════════════════════════════════════════════════════
// VOICE SORTING COMPONENT v4
// Voice-first UX: Glowing "Speak to Wolf" CTA → graceful button fallback
// Optimized for parents: Never punish voice failure, smooth transitions
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
  const [voiceAttemptedThisStep, setVoiceAttemptedThisStep] = useState(false);
  const [buttonsRevealed, setButtonsRevealed] = useState(false);

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setHasMicPermission(true);
      })
      .catch(() => setHasMicPermission(false));
  }, []);

  // Reset voice attempt tracking when step changes
  useEffect(() => {
    setVoiceAttemptedThisStep(false);
    setButtonsRevealed(false);
  }, [step]);

  // Auto-reveal buttons after voice failure
  useEffect(() => {
    if (voiceFailures > 0 && !buttonsRevealed) {
      setButtonsRevealed(true);
    }
  }, [voiceFailures, buttonsRevealed]);

  // Show reveal when we have result
  useEffect(() => {
    if (step === "reveal" && wolfIdentity && trainingPath) {
      const timer = setTimeout(() => setShowReveal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [step, wolfIdentity, trainingPath]);

  const handleRevealComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  // Handle voice button click
  const handleVoiceClick = () => {
    setVoiceAttemptedThisStep(true);
    answerWithVoice();
  };

  // Is it a question step?
  const isQuestionStep = step === "pain" || step === "volume" || step === "ambition";

  // Should show voice CTA as primary? (first attempt, has mic, not listening)
  const showVoicePrimary =
    waitingForInput &&
    isQuestionStep &&
    !voiceAttemptedThisStep &&
    voiceFailures === 0 &&
    hasMicPermission &&
    !isListening;

  // Should show buttons? (after voice attempt or no mic)
  const showButtons =
    waitingForInput &&
    (buttonsRevealed || voiceAttemptedThisStep || !hasMicPermission || voiceFailures > 0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Futuristic HUD Progress Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {["pain", "volume", "ambition"].map((s, i) => {
          const questionSteps = ["pain", "volume", "ambition"];
          const stepIndex = questionSteps.indexOf(step);
          const isComplete = stepIndex > i || step === "reveal" || step === "complete";
          const isCurrent = step === s;
          const isUpcoming = step === "idle" || step === "intro";

          return (
            <div key={s} className="flex items-center gap-4">
              {/* Diamond indicator */}
              <motion.div
                className="relative"
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Outer glow ring for current */}
                {isCurrent && (
                  <motion.div
                    className="absolute -inset-2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0, 246, 224, 0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Diamond shape */}
                <motion.div
                  className="w-4 h-4 rotate-45 border-2 transition-all duration-300"
                  style={{
                    borderColor: isComplete
                      ? "#00f6e0"
                      : isCurrent
                        ? "#00f6e0"
                        : isUpcoming
                          ? "#374151"
                          : "#1f2937",
                    backgroundColor: isComplete ? "#00f6e0" : "transparent",
                    boxShadow:
                      isComplete || isCurrent
                        ? "0 0 10px rgba(0, 246, 224, 0.5), inset 0 0 5px rgba(0, 246, 224, 0.3)"
                        : "none",
                  }}
                  animate={
                    isCurrent
                      ? {
                          boxShadow: [
                            "0 0 10px rgba(0, 246, 224, 0.3), inset 0 0 5px rgba(0, 246, 224, 0.2)",
                            "0 0 20px rgba(0, 246, 224, 0.6), inset 0 0 10px rgba(0, 246, 224, 0.4)",
                            "0 0 10px rgba(0, 246, 224, 0.3), inset 0 0 5px rgba(0, 246, 224, 0.2)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                />

                {/* Inner dot for complete */}
                {isComplete && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </motion.div>
                )}
              </motion.div>

              {/* Connecting line (except after last) */}
              {i < 2 && (
                <motion.div
                  className="w-8 h-[2px] transition-all duration-500"
                  style={{
                    background:
                      stepIndex > i || step === "reveal" || step === "complete"
                        ? "linear-gradient(90deg, #00f6e0 0%, #00f6e0 100%)"
                        : "linear-gradient(90deg, #374151 0%, #1f2937 100%)",
                    boxShadow:
                      stepIndex > i || step === "reveal" || step === "complete"
                        ? "0 0 8px rgba(0, 246, 224, 0.5)"
                        : "none",
                  }}
                />
              )}
            </div>
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
            <p className="text-gray-400 text-sm">&quot;{transcript}&quot;</p>
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

      {/* PRIMARY: Glowing "Speak to Wolf" button (first attempt) */}
      {showVoicePrimary && (
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Glowing voice CTA */}
          <motion.button
            onClick={handleVoiceClick}
            className="relative px-8 py-4 rounded-full text-black font-bold text-lg flex items-center gap-3"
            style={{ backgroundColor: "#00f6e0" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 246, 224, 0.4), 0 0 40px rgba(0, 246, 224, 0.2)",
                "0 0 30px rgba(0, 246, 224, 0.6), 0 0 60px rgba(0, 246, 224, 0.3)",
                "0 0 20px rgba(0, 246, 224, 0.4), 0 0 40px rgba(0, 246, 224, 0.2)",
              ],
            }}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Mic className="w-5 h-5" />
            Speak to Wolf
          </motion.button>

          {/* Subtle "or tap below" hint */}
          <motion.button
            onClick={() => setButtonsRevealed(true)}
            className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            or tap your answer below
          </motion.button>
        </motion.div>
      )}

      {/* Listening indicator */}
      {waitingForInput && isListening && (
        <motion.div
          className="flex flex-col items-center gap-3"
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
          <p className="text-gray-500 text-xs">Speak your answer</p>
        </motion.div>
      )}

      {/* BUTTONS: Shown after voice attempt or on "tap below" */}
      <AnimatePresence>
        {showButtons && !isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Friendly transition message (no error feel) */}
            {voiceAttemptedThisStep && voiceFailures > 0 && (
              <motion.p
                className="text-gray-400 text-sm text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Tap your answer:
              </motion.p>
            )}

            <AnswerButtons
              step={step}
              onPainAnswer={answerPain}
              onVolumeAnswer={answerVolume}
              onAmbitionAnswer={answerAmbition}
              highlighted={false}
            />

            {/* Voice retry option (if still has mic and < 2 failures) */}
            {hasMicPermission && voiceFailures < 2 && !isListening && (
              <motion.button
                onClick={handleVoiceClick}
                className="mt-4 text-gray-500 text-sm flex items-center justify-center gap-2 w-full hover:text-gray-400 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Mic className="w-4 h-4" />
                Try voice again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
