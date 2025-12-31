import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Card, Badge, ProgressBar } from '../../components/ui'
import analytics, { EVENTS } from '../../lib/analytics'

// Mock lesson data
const lessons = {
  'w1-d1': {
    id: 'w1-d1',
    weekNumber: 1,
    day: 1,
    title: 'Tripod Activation',
    duration: '12 min',
    videoUrl: null, // Would be actual video URL
    description: 'Learn the foundation of foot mechanics - the tripod position. This is the base for everything that follows.',
    steps: [
      'Stand barefoot on a flat surface',
      'Feel three points of contact: big toe, pinky toe, heel',
      'Press all three points equally into the ground',
      'Notice how your arch naturally lifts when engaged',
      'Hold for 30 seconds, repeat 3 times',
    ],
    cues: [
      'Grip the floor without curling toes',
      'Equal pressure all three points',
      'Soft knees, not locked',
    ],
    nextLesson: 'w1-d2',
    prevLesson: null,
  },
  'w1-d2': {
    id: 'w1-d2',
    weekNumber: 1,
    day: 2,
    title: 'Short Foot Mastery',
    duration: '10 min',
    videoUrl: null,
    description: 'Build on the tripod with short foot exercises that strengthen your arch without equipment.',
    steps: [
      'Start in tripod position',
      'Try to shorten your foot by pulling ball toward heel',
      'Keep toes flat - no curling',
      'Hold the dome for 5 seconds',
      'Repeat 10 times each foot',
    ],
    cues: [
      'Imagine pulling your arch up from inside',
      'Toes stay long and relaxed',
      'Feel the foot muscles work',
    ],
    nextLesson: 'w1-d3',
    prevLesson: 'w1-d1',
  },
  'w1-d3': {
    id: 'w1-d3',
    weekNumber: 1,
    day: 3,
    title: 'Single Leg Balance',
    duration: '12 min',
    videoUrl: null,
    description: 'Test and build your stability with single leg balance progressions.',
    steps: [
      'Stand on one foot with tripod engaged',
      'Keep knee soft, not locked',
      'Find your balance point',
      'Hold for 30 seconds each side',
      'Progress: close your eyes',
    ],
    cues: [
      'Small corrections are normal',
      'Stay relaxed, don\'t fight the wobble',
      'Breathe normally',
    ],
    nextLesson: 'w1-d4',
    prevLesson: 'w1-d2',
  },
}

function LessonPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = lessons[id] || lessons['w1-d1']

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const videoRef = useRef(null)
  const hasTrackedStart = useRef(false)

  // Track lesson start on mount
  useEffect(() => {
    analytics.track(EVENTS.LESSON_START, {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      week: lesson.weekNumber,
      day: lesson.day,
    })
  }, [lesson])

  // Simulate video progress
  useEffect(() => {
    let interval
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((p) => {
          const newProgress = Math.min(p + 0.5, 100)
          if (newProgress >= 90 && !isComplete) {
            setIsComplete(true)
          }
          return newProgress
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, progress, isComplete])

  const handleMarkComplete = () => {
    setIsComplete(true)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)

    // Track lesson completion
    analytics.track(EVENTS.LESSON_COMPLETE, {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      week: lesson.weekNumber,
      day: lesson.day,
      progress_percent: progress,
    })
  }

  const handleNextLesson = () => {
    if (lesson.nextLesson) {
      navigate(`/app/lessons/${lesson.nextLesson}`)
    } else {
      navigate('/app/programs/barefoot-reset')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-yp-display uppercase text-white mb-2">
              Lesson Complete!
            </h2>
            <p className="text-dark-text-secondary">Great work. Keep building.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black-50 border-b border-black-400">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/app/programs/barefoot-reset"
              className="text-dark-text-secondary hover:text-white flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <Badge variant="cyan">Week {lesson.weekNumber} • Day {lesson.day}</Badge>
          </div>
        </div>
      </header>

      {/* Video Player Area */}
      <div className="bg-black-100 aspect-video max-w-4xl mx-auto relative">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors shadow-glow-cyan"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black-400">
          <div
            className="h-full bg-cyan-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-yp-display uppercase text-white mb-2">
          {lesson.title}
        </h1>
        <p className="text-dark-text-secondary mb-6">{lesson.description}</p>

        {/* Steps */}
        <Card className="mb-6">
          <h2 className="text-lg font-yp-display uppercase text-white mb-4">Steps</h2>
          <ol className="space-y-3">
            {lesson.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-sm flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-dark-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Cues */}
        <Card className="mb-6 border-cyan-500/30">
          <h2 className="text-lg font-yp-display uppercase text-cyan-500 mb-4">Coaching Cues</h2>
          <ul className="space-y-2">
            {lesson.cues.map((cue, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-dark-text-secondary">{cue}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isComplete ? (
            <Button size="lg" fullWidth onClick={handleMarkComplete}>
              Mark Complete
            </Button>
          ) : (
            <Button size="lg" fullWidth onClick={handleNextLesson}>
              {lesson.nextLesson ? 'Next Lesson →' : 'Back to Program'}
            </Button>
          )}

          {lesson.prevLesson && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/app/lessons/${lesson.prevLesson}`)}
            >
              ← Previous
            </Button>
          )}
        </div>

        {/* Completion status */}
        {isComplete && (
          <div className="mt-4 flex items-center justify-center gap-2 text-success">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Lesson completed</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonPlayer
