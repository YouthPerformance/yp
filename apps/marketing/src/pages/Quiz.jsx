import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ProgressBar, Card } from '../components/ui'
import analytics, { EVENTS } from '../lib/analytics'

const questions = [
  {
    id: 1,
    question: 'How do your feet feel after standing or walking for a while?',
    options: [
      { value: 'a', label: 'Fine, no issues', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'Tired or achy', scores: { forceLeaker: 1, elasticity: 0, absorption: 1, control: 0 } },
      { value: 'c', label: 'Tight or stiff', scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 } },
      { value: 'd', label: 'Inconsistent - varies day to day', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 } },
    ],
  },
  {
    id: 2,
    question: 'When you land from a jump, what do you notice?',
    options: [
      { value: 'a', label: 'Soft and quiet', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'Loud and heavy', scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 } },
      { value: 'c', label: 'Wobbly or unstable', scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 1 } },
      { value: 'd', label: "I don't really pay attention", scores: { forceLeaker: 0, elasticity: 0, absorption: 1, control: 1 } },
    ],
  },
  {
    id: 3,
    question: 'How would you describe your explosiveness?',
    options: [
      { value: 'a', label: 'I feel bouncy and springy', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'Strong but not springy', scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 } },
      { value: 'c', label: 'Explosive early, then I fade', scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'd', label: "It's inconsistent", scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 } },
    ],
  },
  {
    id: 4,
    question: 'When cutting or changing direction, what happens?',
    options: [
      { value: 'a', label: 'Smooth and sharp', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'I feel like I lose power', scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'c', label: 'Slow to get going again', scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 } },
      { value: 'd', label: 'Sometimes good, sometimes not', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 } },
    ],
  },
  {
    id: 5,
    question: 'Do you experience any of these after intense activity?',
    options: [
      { value: 'a', label: 'Nothing unusual', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'Shin or knee discomfort', scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 } },
      { value: 'c', label: 'Ankle instability or rolling', scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 1 } },
      { value: 'd', label: 'General tightness everywhere', scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 } },
    ],
  },
  {
    id: 6,
    question: 'How does your body feel at the end of a practice or game?',
    options: [
      { value: 'a', label: 'Tired but good', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 } },
      { value: 'b', label: 'More beat up than I should be', scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 } },
      { value: 'c', label: 'Feels like I worked harder than I actually did', scores: { forceLeaker: 2, elasticity: 1, absorption: 0, control: 0 } },
      { value: 'd', label: 'Depends on the day', scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 } },
    ],
  },
]

function Quiz() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState({
    forceLeaker: 0,
    elasticity: 0,
    absorption: 0,
    control: 0,
  })

  // Track quiz start on mount
  useEffect(() => {
    analytics.track(EVENTS.QUIZ_START, {
      total_questions: questions.length,
    })
  }, [])

  const handleAnswer = (option) => {
    // Track each answer
    analytics.track(EVENTS.QUIZ_ANSWER, {
      question_number: currentQuestion + 1,
      question_text: questions[currentQuestion].question,
      answer: option.label,
    })
    const newAnswers = [...answers, option.value]
    setAnswers(newAnswers)

    // Add scores
    const newScores = { ...scores }
    Object.keys(option.scores).forEach((key) => {
      newScores[key] += option.scores[key]
    })
    setScores(newScores)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate result and navigate
      const identityType = calculateIdentity(newScores)

      // Track quiz completion
      analytics.track(EVENTS.QUIZ_COMPLETE, {
        identity_type: identityType,
        scores: newScores,
      })

      // Store identity for later use
      localStorage.setItem('yp_athlete_identity', identityType)

      navigate('/quiz/results', { state: { identityType, scores: newScores } })
    }
  }

  const calculateIdentity = (finalScores) => {
    const max = Math.max(
      finalScores.forceLeaker,
      finalScores.elasticity,
      finalScores.absorption,
      finalScores.control
    )

    if (finalScores.forceLeaker === max) return 'force-leaker'
    if (finalScores.elasticity === max) return 'elasticity-block'
    if (finalScores.absorption === max) return 'absorption-deficit'
    return 'control-gap'
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-yp-display uppercase tracking-wide text-white mb-2">
            Movement Check
          </h1>
          <p className="text-dark-text-secondary">
            6 quick questions to understand how your athlete moves — and what to focus on first.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-dark-text-tertiary mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>~2 min</span>
          </div>
          <ProgressBar value={currentQuestion + 1} max={questions.length} />
        </div>

        {/* Question */}
        <Card className="mb-8">
          <h2 className="text-xl font-medium text-white mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left bg-black-200 border border-black-400 rounded-xl hover:border-cyan-500/50 hover:bg-black-100 transition-all"
              >
                <span className="text-dark-text-secondary">{option.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Skip to results (for testing) */}
        {currentQuestion > 2 && (
          <p className="text-center text-dark-text-tertiary text-sm">
            Answer all questions for the most accurate result
          </p>
        )}
      </div>
    </div>
  )
}

export default Quiz
