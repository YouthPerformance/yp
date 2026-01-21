import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, ProgressBar } from "../components/ui";
import analytics, { EVENTS } from "../lib/analytics";

// Lightning bolt icon
const LightningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const questions = [
  {
    id: 1,
    question: "How do your feet feel after standing or walking for a while?",
    options: [
      {
        value: "a",
        label: "Fine, no issues",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "Tired or achy",
        scores: { forceLeaker: 1, elasticity: 0, absorption: 1, control: 0 },
      },
      {
        value: "c",
        label: "Tight or stiff",
        scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 },
      },
      {
        value: "d",
        label: "Inconsistent - varies day to day",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 },
      },
    ],
  },
  {
    id: 2,
    question: "When you land from a jump, what do you notice?",
    options: [
      {
        value: "a",
        label: "Soft and quiet",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "Loud and heavy",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 },
      },
      {
        value: "c",
        label: "Wobbly or unstable",
        scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 1 },
      },
      {
        value: "d",
        label: "I don't really pay attention",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 1, control: 1 },
      },
    ],
  },
  {
    id: 3,
    question: "How would you describe your explosiveness?",
    options: [
      {
        value: "a",
        label: "I feel bouncy and springy",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "Strong but not springy",
        scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 },
      },
      {
        value: "c",
        label: "Explosive early, then I fade",
        scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "d",
        label: "It's inconsistent",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 },
      },
    ],
  },
  {
    id: 4,
    question: "When cutting or changing direction, what happens?",
    options: [
      {
        value: "a",
        label: "Smooth and sharp",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "I feel like I lose power",
        scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "c",
        label: "Slow to get going again",
        scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 },
      },
      {
        value: "d",
        label: "Sometimes good, sometimes not",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 },
      },
    ],
  },
  {
    id: 5,
    question: "Do you experience any of these after intense activity?",
    options: [
      {
        value: "a",
        label: "Nothing unusual",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "Shin or knee discomfort",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 },
      },
      {
        value: "c",
        label: "Ankle instability or rolling",
        scores: { forceLeaker: 2, elasticity: 0, absorption: 0, control: 1 },
      },
      {
        value: "d",
        label: "General tightness everywhere",
        scores: { forceLeaker: 0, elasticity: 2, absorption: 0, control: 0 },
      },
    ],
  },
  {
    id: 6,
    question: "How does your body feel at the end of a practice or game?",
    options: [
      {
        value: "a",
        label: "Tired but good",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 0 },
      },
      {
        value: "b",
        label: "More beat up than I should be",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 2, control: 0 },
      },
      {
        value: "c",
        label: "Feels like I worked harder than I actually did",
        scores: { forceLeaker: 2, elasticity: 1, absorption: 0, control: 0 },
      },
      {
        value: "d",
        label: "Depends on the day",
        scores: { forceLeaker: 0, elasticity: 0, absorption: 0, control: 2 },
      },
    ],
  },
];

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState({
    forceLeaker: 0,
    elasticity: 0,
    absorption: 0,
    control: 0,
  });

  // Track quiz start on mount
  useEffect(() => {
    analytics.track(EVENTS.QUIZ_START, {
      total_questions: questions.length,
    });
  }, []);

  const handleAnswer = (option) => {
    // Track each answer
    analytics.track(EVENTS.QUIZ_ANSWER, {
      question_number: currentQuestion + 1,
      question_text: questions[currentQuestion].question,
      answer: option.label,
    });
    const newAnswers = [...answers, option.value];
    setAnswers(newAnswers);

    // Add scores
    const newScores = { ...scores };
    Object.keys(option.scores).forEach((key) => {
      newScores[key] += option.scores[key];
    });
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result and navigate
      const identityType = calculateIdentity(newScores);

      // Track quiz completion
      analytics.track(EVENTS.QUIZ_COMPLETE, {
        identity_type: identityType,
        scores: newScores,
      });

      // Store identity for later use
      localStorage.setItem("yp_athlete_identity", identityType);

      navigate("/quiz/results", { state: { identityType, scores: newScores } });
    }
  };

  const calculateIdentity = (finalScores) => {
    const max = Math.max(
      finalScores.forceLeaker,
      finalScores.elasticity,
      finalScores.absorption,
      finalScores.control,
    );

    if (finalScores.forceLeaker === max) return "force-leaker";
    if (finalScores.elasticity === max) return "elasticity-block";
    if (finalScores.absorption === max) return "absorption-deficit";
    return "control-gap";
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Wolf Coach - Scanning */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full scale-75" />
            <img
              src="/logo/wolffront.png"
              alt="Coach Wolf"
              className="relative w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(0,246,224,0.3)]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-yp-display uppercase tracking-wide text-white mb-2">
            Chassis Diagnostic
          </h1>
          <p className="text-dark-text-secondary">
            6 quick questions to scan how your athlete moves — and pinpoint the fix.
          </p>
        </div>

        {/* Progress - Military style */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-cyan-400 uppercase tracking-wider text-xs font-medium flex items-center gap-2">
              <LightningIcon className="w-3 h-3" />
              Scan {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-dark-text-tertiary">~2 min</span>
          </div>
          {/* Custom progress bar with cyan glow */}
          <div className="h-2 bg-black-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,246,224,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 border border-cyan-500/10 bg-gradient-to-b from-black-200/80 to-black-100/50">
          <h2 className="text-xl font-medium text-white mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left bg-black-300/50 border border-black-400/50 rounded-xl hover:border-cyan-500/50 hover:bg-black-200/50 hover:shadow-[0_0_15px_rgba(0,246,224,0.1)] transition-all group"
              >
                <span className="text-dark-text-secondary group-hover:text-white transition-colors">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Trust text */}
        <p className="text-center text-dark-text-tertiary text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          All data stays with you. We never share athlete info.
        </p>
      </div>
    </div>
  );
}

export default Quiz;
