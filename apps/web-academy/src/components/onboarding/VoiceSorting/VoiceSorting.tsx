// ═══════════════════════════════════════════════════════════
// VOICE SORTING COMPONENT
// Main orchestrator for the voice onboarding flow
// ═══════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceSorting } from '@/hooks/useVoiceSorting';
import { WolfAvatar } from './WolfAvatar';
import { FallbackButtons } from './FallbackButtons';
import { IdentityReveal } from './IdentityReveal';

interface VoiceSortingProps {
  onComplete: (result: {
    trainingPath: 'glass' | 'grinder' | 'prospect';
    wolfIdentity: 'speed' | 'tank' | 'air';
    coachComment: string;
    firstMissionId: string;
  }) => void;
}

const STEP_PROMPTS: Record<string, string> = {
  idle: 'Tap to begin',
  intro: 'Calibrating...',
  pain: 'Does anything hurt when you play?',
  volume: 'How many teams are you on?',
  ambition: 'Speed, bounce, or strength?',
  reveal: 'Analyzing...',
  complete: 'Welcome to the Pack',
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
    startSorting,
    answerPain,
    answerVolume,
    answerAmbition,
  } = useVoiceSorting();

  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasMicPermission(true))
      .catch(() => setHasMicPermission(false));
  }, []);

  // Show reveal when we have result
  useEffect(() => {
    if (step === 'reveal' && wolfIdentity && trainingPath) {
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Progress indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
        {['pain', 'volume', 'ambition'].map((s, i) => {
          const stepIndex = ['pain', 'volume', 'ambition'].indexOf(step);
          const isComplete = stepIndex > i || step === 'reveal' || step === 'complete';
          const isCurrent = step === s;

          return (
            <motion.div
              key={s}
              className={`w-3 h-3 rounded-full ${
                isComplete ? 'bg-cyan-400' :
                isCurrent ? 'bg-cyan-400/50' :
                'bg-gray-700'
              }`}
              animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          );
        })}
      </div>

      {/* Wolf avatar */}
      <WolfAvatar
        isSpeaking={isSpeaking}
        isListening={isListening}
        identity={wolfIdentity}
        revealed={step === 'reveal' || step === 'complete'}
      />

      {/* Current prompt */}
      <motion.p
        key={step}
        className="text-xl md:text-2xl text-gray-300 text-center mt-8 mb-4 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {STEP_PROMPTS[step] || '...'}
      </motion.p>

      {/* Transcript display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="bg-gray-900/50 rounded-lg px-4 py-2 mb-6 max-w-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-gray-400 text-sm">
              "{transcript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicators */}
      <div className="flex items-center gap-4 mb-8">
        {isListening && (
          <motion.div
            className="flex items-center gap-2 text-cyan-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Mic className="w-5 h-5" />
            <span className="text-sm">Listening...</span>
          </motion.div>
        )}

        {isSpeaking && (
          <motion.div
            className="flex items-center gap-2 text-purple-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Speaking...</span>
          </motion.div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <motion.p
          className="text-red-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* Start button (idle state) */}
      {step === 'idle' && (
        <motion.button
          onClick={startSorting}
          className="px-8 py-4 rounded-full bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition-colors"
          whileHover={{ scale: 1.05 }}
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

      {/* Fallback buttons for each step */}
      <FallbackButtons
        step={step}
        onPainAnswer={answerPain}
        onVolumeAnswer={answerVolume}
        onAmbitionAnswer={answerAmbition}
      />

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
