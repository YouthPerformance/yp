// ═══════════════════════════════════════════════════════════
// WORKOUT PLAYER PAGE
// State machine: music → countdown → active → finished
// ═══════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@yp/alpha/convex/_generated/api';
import { useUserContext } from '@/contexts/UserContext';
import { PROGRAM, getDay, getThemeColor } from '@/data/programs/basketball-chassis';
import { useProgramAccess, isDayUnlocked } from '@/hooks/useProgramAccess';
import {
  MusicPrompt,
  CountdownView,
  ActiveWorkout,
  FinishedView,
} from '@/components/programs/player';

type PlayerState = 'loading' | 'music' | 'countdown' | 'active' | 'finished';

export default function WorkoutPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const dayNumber = parseInt(params.n as string, 10);
  const { user } = useUserContext();

  const { hasAccess, completedDays, isLoading: accessLoading } = useProgramAccess('basketball-chassis');
  const completeDay = useMutation(api.progress.completeProgramDay);

  const [playerState, setPlayerState] = useState<PlayerState>('loading');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(true);
  const hasInitialized = useRef(false);

  const day = getDay(dayNumber);
  const themeColor = day ? getThemeColor(day.theme) : '#00C8C8';
  const exercises = day?.exercises ?? [];
  const currentExercise = exercises[currentExerciseIndex];

  // Check access and initialize (only once)
  useEffect(() => {
    if (accessLoading || hasInitialized.current) return;

    if (!hasAccess) {
      router.replace('/programs/basketball-chassis');
      return;
    }

    if (!day || !isDayUnlocked(dayNumber, completedDays)) {
      router.replace('/programs/basketball-chassis');
      return;
    }

    // Mark as initialized to prevent re-running
    hasInitialized.current = true;

    // Check if this is a replay
    setIsFirstCompletion(!completedDays.includes(dayNumber));
    setPlayerState('music');
  }, [hasAccess, completedDays, dayNumber, day, accessLoading, router]);

  // Handle music prompt dismissal
  const handleMusicDismiss = useCallback(() => {
    setPlayerState('countdown');
  }, []);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setPlayerState('active');
  }, []);

  // Handle exercise complete
  const handleExerciseComplete = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      // Workout complete - record completion if first time
      if (isFirstCompletion && user?.clerkId) {
        completeDay({
          clerkUserId: user.clerkId,
          programSlug: 'basketball-chassis',
          dayNumber,
          xpEarned: PROGRAM.xpPerDay,
          crystalsEarned: PROGRAM.crystalsPerDay,
        }).catch(console.error);
      }
      setPlayerState('finished');
    }
  }, [currentExerciseIndex, exercises.length, isFirstCompletion, user?.clerkId, completeDay, dayNumber]);

  // Handle skip exercise
  const handleSkipExercise = useCallback(() => {
    handleExerciseComplete();
  }, [handleExerciseComplete]);

  // Handle exit workout
  const handleExit = useCallback(() => {
    router.push(`/programs/basketball-chassis/day/${dayNumber}`);
  }, [router, dayNumber]);

  // Handle continue after finish
  const handleContinue = useCallback(() => {
    router.push('/programs/basketball-chassis');
  }, [router]);

  // Handle replay
  const handleReplay = useCallback(() => {
    setCurrentExerciseIndex(0);
    setPlayerState('countdown');
  }, []);

  // Loading state
  if (playerState === 'loading' || !day) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-2">🏀</div>
          <p style={{ color: 'var(--text-tertiary)' }}>Loading workout...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen max-w-md mx-auto relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <AnimatePresence mode="wait">
        {playerState === 'music' && (
          <MusicPrompt key="music" onDismiss={handleMusicDismiss} />
        )}

        {playerState === 'countdown' && (
          <CountdownView
            key="countdown"
            onComplete={handleCountdownComplete}
            workoutTitle={day.title}
          />
        )}

        {playerState === 'active' && currentExercise && (
          <ActiveWorkout
            key={`exercise-${currentExerciseIndex}`}
            exercise={currentExercise}
            exerciseIndex={currentExerciseIndex}
            totalExercises={exercises.length}
            onComplete={handleExerciseComplete}
            onSkip={handleSkipExercise}
            onExit={handleExit}
            themeColor={themeColor}
          />
        )}

        {playerState === 'finished' && (
          <FinishedView
            key="finished"
            dayNumber={dayNumber}
            dayTitle={day.title}
            xpEarned={PROGRAM.xpPerDay}
            crystalsEarned={PROGRAM.crystalsPerDay}
            isFirstCompletion={isFirstCompletion}
            onContinue={handleContinue}
            onReplay={handleReplay}
            themeColor={themeColor}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
