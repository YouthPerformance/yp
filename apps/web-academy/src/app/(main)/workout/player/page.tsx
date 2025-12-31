// ═══════════════════════════════════════════════════════════
// WORKOUT PLAYER PAGE
// Video player with exercise tracking
// ═══════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@yp/alpha/convex/_generated/api';
import { X, Play, Pause, SkipForward, Volume2, VolumeX, CheckCircle, Loader2, AlertCircle, WifiOff, Trophy } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';

// ─────────────────────────────────────────────────────────────
// OFFLINE QUEUE TYPES & HELPERS
// ─────────────────────────────────────────────────────────────

interface QueuedWorkout {
  id: string;
  userId: string;
  enrollmentId: string;
  dayNumber: number;
  durationSeconds: number;
  perfectForm: boolean;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'yp_workout_queue';

function getOfflineQueue(): QueuedWorkout[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addToOfflineQueue(workout: QueuedWorkout): void {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue();
  queue.push(workout);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

function removeFromOfflineQueue(id: string): void {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue().filter(w => w.id !== id);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

// ─────────────────────────────────────────────────────────────
// COMPLETION RESULT TYPE
// ─────────────────────────────────────────────────────────────

interface CompletionResult {
  xpAwarded: number;
  crystalsAwarded: number;
  bonuses: string[];
  streak: number;
  streakMilestones: Array<{ days: number; crystals: number; xp: number }>;
  leveledUp: boolean;
  newLevel?: number;
}

export default function WorkoutPlayerPage() {
  const router = useRouter();
  const { user, enrollment, currentDay } = useUserContext();
  const completeWorkoutMutation = useMutation(api.gamification.completeWorkout);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [progress, setProgress] = useState(0);

  // Completion state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Track workout start time
  const startTimeRef = useRef<number>(Date.now());

  const exercises = [
    { name: 'Ankle Circles', duration: 60 },
    { name: 'Toe Spreads', duration: 45 },
    { name: 'Calf Raises', duration: 60 },
    { name: 'Heel Walks', duration: 30 },
    { name: 'Single Leg Balance', duration: 45 },
    { name: 'Pogos', duration: 30 },
  ];

  // ─────────────────────────────────────────────────────────────
  // OFFLINE DETECTION & SYNC
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOffline(true);

    // Check initial state
    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try to sync any queued workouts on mount
    if (navigator.onLine) {
      syncOfflineQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineQueue = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    for (const workout of queue) {
      try {
        await completeWorkoutMutation({
          userId: workout.userId as any,
          enrollmentId: workout.enrollmentId as any,
          dayNumber: workout.dayNumber,
          durationSeconds: workout.durationSeconds,
          perfectForm: workout.perfectForm,
        });
        removeFromOfflineQueue(workout.id);
        console.log('[WorkoutPlayer] Synced offline workout:', workout.id);
      } catch (error) {
        console.error('[WorkoutPlayer] Failed to sync workout:', workout.id, error);
        // Keep in queue for next sync attempt
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // COMPLETE WORKOUT HANDLER
  // ─────────────────────────────────────────────────────────────

  const handleComplete = async () => {
    if (!user || !enrollment) {
      setSaveError('User or enrollment not found. Please try again.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const perfectForm = false; // TODO: Implement form tracking

    const workoutData = {
      userId: user._id,
      enrollmentId: enrollment._id,
      dayNumber: currentDay,
      durationSeconds,
      perfectForm,
    };

    // If offline, queue for later
    if (!navigator.onLine) {
      const queuedWorkout: QueuedWorkout = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId: user._id,
        enrollmentId: enrollment._id,
        dayNumber: currentDay,
        durationSeconds,
        perfectForm,
        timestamp: Date.now(),
      };
      addToOfflineQueue(queuedWorkout);
      setIsSaving(false);

      // Show offline success and navigate
      setCompletionResult({
        xpAwarded: 100, // Estimated
        crystalsAwarded: 5,
        bonuses: [],
        streak: (user.streakCurrent || 0) + 1,
        streakMilestones: [],
        leveledUp: false,
      });
      setShowSuccessModal(true);
      return;
    }

    try {
      const result = await completeWorkoutMutation(workoutData);
      console.log('[WorkoutPlayer] Workout completed:', result);

      setCompletionResult(result);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('[WorkoutPlayer] Failed to record workout:', error);

      // If network error, queue for later
      if (error instanceof Error && error.message.includes('network')) {
        const queuedWorkout: QueuedWorkout = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          userId: user._id,
          enrollmentId: enrollment._id,
          dayNumber: currentDay,
          durationSeconds,
          perfectForm,
          timestamp: Date.now(),
        };
        addToOfflineQueue(queuedWorkout);
        setSaveError('Saved offline. Will sync when connected.');
      } else {
        setSaveError(error instanceof Error ? error.message : 'Failed to save workout. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/home');
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Video Area */}
      <div className="relative aspect-video bg-black">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl mb-4 block">🐺</span>
            <p className="text-lg font-bebas tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {exercises[currentExercise]?.name.toUpperCase()}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Video player placeholder
            </p>
          </motion.div>
        </div>

        {/* Close Button */}
        <motion.button
          onClick={() => router.push('/home')}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </motion.button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Exercise Info */}
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Exercise {currentExercise + 1} of {exercises.length}
          </p>
          <h2 className="font-bebas text-2xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {exercises[currentExercise]?.name.toUpperCase()}
          </h2>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Volume2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </motion.button>

          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="var(--bg-primary)" style={{ color: 'var(--bg-primary)' }} />
            )}
          </motion.button>

          <motion.button
            onClick={() => {
              if (currentExercise < exercises.length - 1) {
                setCurrentExercise(currentExercise + 1);
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <motion.div
              key={ex.name}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                backgroundColor: i === currentExercise ? 'var(--bg-secondary)' : 'transparent',
                border: i === currentExercise ? '1px solid var(--accent-primary)' : '1px solid transparent',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentExercise(i)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: i < currentExercise ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  }}
                >
                  {i < currentExercise ? (
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: i === currentExercise ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {ex.name}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {ex.duration}s
              </span>
            </motion.div>
          ))}
        </div>

        {/* Offline Indicator */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl mb-4"
            style={{ backgroundColor: 'rgba(255, 171, 0, 0.15)' }}
          >
            <WifiOff className="w-4 h-4" style={{ color: '#FFAB00' }} />
            <span className="text-sm" style={{ color: '#FFAB00' }}>
              Offline mode - progress will sync when connected
            </span>
          </motion.div>
        )}

        {/* Error Display */}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl mb-4"
            style={{ backgroundColor: 'rgba(255, 82, 82, 0.15)' }}
          >
            <AlertCircle className="w-4 h-4" style={{ color: '#FF5252' }} />
            <span className="text-sm" style={{ color: '#FF5252' }}>
              {saveError}
            </span>
          </motion.div>
        )}

        {/* Complete Button */}
        <motion.button
          onClick={handleComplete}
          disabled={isSaving}
          className="w-full mt-6 py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
          style={{
            backgroundColor: isSaving ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
            color: 'var(--bg-primary)',
            opacity: isSaving ? 0.7 : 1,
          }}
          whileHover={isSaving ? {} : { scale: 1.02 }}
          whileTap={isSaving ? {} : { scale: 0.98 }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              SAVING...
            </>
          ) : (
            'COMPLETE WORKOUT'
          )}
        </motion.button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && completionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={handleCloseSuccessModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 text-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Trophy className="w-10 h-10" style={{ color: 'var(--bg-primary)' }} />
              </motion.div>

              <h2 className="font-bebas text-3xl tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
                WORKOUT COMPLETE!
              </h2>

              {isOffline && (
                <p className="text-sm mb-4" style={{ color: '#FFAB00' }}>
                  Will sync when online
                </p>
              )}

              {/* Rewards */}
              <div className="space-y-3 mb-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>XP Earned</span>
                  <span className="font-bebas text-xl" style={{ color: 'var(--accent-primary)' }}>
                    +{completionResult.xpAwarded}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Crystals</span>
                  <span className="font-bebas text-xl" style={{ color: '#9C27B0' }}>
                    +{completionResult.crystalsAwarded}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Streak</span>
                  <span className="font-bebas text-xl" style={{ color: '#FF6B35' }}>
                    {completionResult.streak} days
                  </span>
                </motion.div>

                {/* Bonuses */}
                {completionResult.bonuses.length > 0 && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-2 justify-center"
                  >
                    {completionResult.bonuses.map((bonus, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: 'rgba(0, 255, 255, 0.15)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        {bonus}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Level Up */}
                {completionResult.leveledUp && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid #FFD700',
                    }}
                  >
                    <p className="font-bebas text-2xl" style={{ color: '#FFD700' }}>
                      LEVEL UP!
                    </p>
                    <p className="text-sm" style={{ color: '#FFD700' }}>
                      You reached Level {completionResult.newLevel}
                    </p>
                  </motion.div>
                )}

                {/* Streak Milestones */}
                {completionResult.streakMilestones.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(255, 107, 53, 0.15)',
                      border: '1px solid #FF6B35',
                    }}
                  >
                    {completionResult.streakMilestones.map((milestone, i) => (
                      <p key={i} className="font-bebas text-xl" style={{ color: '#FF6B35' }}>
                        {milestone.days}-DAY STREAK! +{milestone.crystals} Crystals
                      </p>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Continue Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={handleCloseSuccessModal}
                className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
