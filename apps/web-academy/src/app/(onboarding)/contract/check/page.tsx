// ═══════════════════════════════════════════════════════════
// QUICK CHECK PAGE (VELVET ROPE)
// Gateway to Wolf Contract: Simple yes/no commitment check
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Answer = "yes" | "no" | null;

interface Question {
  id: string;
  text: string;
  yesResponse: string;
  noResponse: string;
}

const QUESTIONS: Question[] = [
  {
    id: "ready",
    text: "Is your athlete ready to commit to training 30 times in the next 42 days?",
    yesResponse: "That's the Pack mindset.",
    noResponse: "The Pack isn't for everyone. That's okay.",
  },
  {
    id: "parent",
    text: "Will you, as the parent, help hold them accountable?",
    yesResponse: "Pack parents are part of the mission.",
    noResponse: "We need parent support to succeed.",
  },
];

export default function QuickCheckPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showResponse, setShowResponse] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [country, setCountry] = useState<{ symbol: string; price: number; currency: string } | null>(null);

  // Load country from session
  useEffect(() => {
    const stored = sessionStorage.getItem("wolfContract_country");
    if (stored) {
      setCountry(JSON.parse(stored));
    }
  }, []);

  const question = QUESTIONS[currentQuestion];
  const currentAnswer = answers[question.id];
  const allAnswered = Object.keys(answers).length === QUESTIONS.length;
  const allYes = Object.values(answers).every((a) => a === "yes");

  const handleAnswer = (answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    setShowResponse(true);

    // Auto-advance after showing response
    setTimeout(() => {
      setShowResponse(false);

      if (answer === "no") {
        // Exit flow
        setIsExiting(true);
        setTimeout(() => {
          router.push("/home"); // Back to dashboard
        }, 1500);
      } else if (currentQuestion < QUESTIONS.length - 1) {
        // Next question
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleContinue = () => {
    if (!allAnswered || !allYes) return;
    router.push("/contract/payment");
  };

  // Exiting state - show wolf goodbye
  if (isExiting) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--bg-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-xl overflow-hidden opacity-50">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={96}
            height={96}
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <h2
          className="font-bebas text-2xl tracking-wider text-center mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          NO HARD FEELINGS
        </h2>
        <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-tertiary)" }}>
          The Pack will be here when you're ready.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
          <Image
            src="/images/wolffront.webp"
            alt="Wolf Pack"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h1
          className="font-bebas text-3xl tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          QUICK CHECK
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Two questions. Be honest.
        </p>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              backgroundColor:
                i < currentQuestion
                  ? "var(--accent-primary)"
                  : i === currentQuestion
                    ? "var(--text-primary)"
                    : "var(--bg-tertiary)",
            }}
          />
        ))}
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {!showResponse ? (
            <motion.div
              key={`question-${currentQuestion}`}
              className="text-center w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Question */}
              <h2
                className="font-bebas text-2xl tracking-wide mb-8 leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {question.text}
              </h2>

              {/* Yes/No Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={() => handleAnswer("yes")}
                  className="px-12 py-4 rounded-xl font-bebas text-xl tracking-wider"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--bg-primary)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  YES
                </motion.button>
                <motion.button
                  onClick={() => handleAnswer("no")}
                  className="px-12 py-4 rounded-xl font-bebas text-xl tracking-wider"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  NO
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`response-${currentQuestion}`}
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Wolf Response */}
              <p
                className="font-bebas text-xl tracking-wide"
                style={{
                  color: currentAnswer === "yes" ? "var(--accent-primary)" : "var(--text-tertiary)",
                }}
              >
                {currentAnswer === "yes" ? question.yesResponse : question.noResponse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue to Payment (only after all Yes) */}
      {allAnswered && allYes && (
        <motion.div
          className="max-w-md mx-auto w-full pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-primary)",
            }}
          >
            CONTINUE TO PAYMENT{" "}
            {country && (
              <span className="opacity-75">
                ({country.symbol}{country.price})
              </span>
            )}
          </button>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.div
        className="max-w-md mx-auto w-full pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => router.back()}
          className="w-full py-3 text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Back
        </button>
      </motion.div>
    </motion.div>
  );
}
