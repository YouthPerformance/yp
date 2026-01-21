// ═══════════════════════════════════════════════════════════
// PARENT WOLF INTERVIEW
// Conversational onboarding where Wolf interviews the parent
// Day 1 flow: Name → Age → Sport → Injuries → Personality → Confirm
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatWolfAvatar } from "./ChatWolfAvatar";
import {
  PERSONALITIES,
  SPORTS,
  type ConversationStep,
  type InterviewResult,
  type Message,
} from "./types";
import type { WolfPersonality } from "@/contexts/OnboardingContext";

interface ParentWolfInterviewProps {
  onComplete: (result: InterviewResult) => void;
  initialName?: string;
  initialAge?: number | null;
}

// Conversation flow configuration
const STEPS: Record<ConversationStep, { getMessage: (name: string) => string }> = {
  greeting: {
    getMessage: () =>
      "Hey! I'm Wolf — I'll be your kid's training buddy. But first, I want to get to know them through YOUR eyes. You know them best.",
  },
  name: {
    getMessage: () => "What's your athlete's first name?",
  },
  age: {
    getMessage: (name) => `Great! How old is ${name}?`,
  },
  sport: {
    getMessage: (name) => `What sport does ${name} play?`,
  },
  injuries: {
    getMessage: (name) =>
      `Safety first — any current injuries or limitations I should know about for ${name}?`,
  },
  personality: {
    getMessage: (name) => `Last one — how should I talk to ${name}?`,
  },
  confirmation: {
    getMessage: () => "", // Handled specially
  },
};

export function ParentWolfInterview({
  onComplete,
  initialName = "",
  initialAge = null,
}: ParentWolfInterviewProps) {
  // State
  const [step, setStep] = useState<ConversationStep>("greeting");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // Collected data
  const [athleteName, setAthleteName] = useState(initialName);
  const [athleteAge, setAthleteAge] = useState<number | null>(initialAge);
  const [sport, setSport] = useState("");
  const [injuries, setInjuries] = useState<string | null>(null);
  const [personality, setPersonality] = useState<WolfPersonality | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add Wolf message with typing delay
  const addWolfMessage = useCallback((content: string, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `wolf-${Date.now()}`,
          sender: "wolf",
          content,
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  }, []);

  // Add parent message
  const addParentMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `parent-${Date.now()}`,
        sender: "parent",
        content,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Initialize conversation (with StrictMode protection)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Greeting
    addWolfMessage(STEPS.greeting.getMessage(""), 500);

    // Then ask name
    setTimeout(() => {
      addWolfMessage(STEPS.name.getMessage(""), 1200);
      setStep("name");
    }, 2000);
  }, [addWolfMessage]);

  // Handle advancing to next step
  // Note: newName param is used when advancing from name step (state hasn't updated yet)
  const advanceStep = useCallback(
    (currentStep: ConversationStep, newName?: string) => {
      const name = newName || athleteName;

      switch (currentStep) {
        case "name":
          setStep("age");
          addWolfMessage(STEPS.age.getMessage(name));
          break;
        case "age":
          setStep("sport");
          addWolfMessage(STEPS.sport.getMessage(name));
          break;
        case "sport":
          setStep("injuries");
          addWolfMessage(STEPS.injuries.getMessage(name));
          break;
        case "injuries":
          setStep("personality");
          addWolfMessage(STEPS.personality.getMessage(name));
          break;
        case "personality":
          setStep("confirmation");
          // Build confirmation message
          const selectedPersonality = PERSONALITIES.find((p) => p.id === personality);
          const confirmMsg = `Perfect! Here's what I've got:\n\n🏃 ${name}, ${athleteAge} years old\n${SPORTS.find((s) => s.value === sport)?.emoji || "🎯"} ${sport.charAt(0).toUpperCase() + sport.slice(1)}\n${injuries ? `⚠️ Note: ${injuries}` : "✅ No injuries"}\n${selectedPersonality?.emoji || "🎯"} ${selectedPersonality?.name || "Coach"} style\n\nDoes this sound right?`;
          addWolfMessage(confirmMsg);
          break;
        default:
          break;
      }
    },
    [athleteName, athleteAge, sport, injuries, personality, addWolfMessage],
  );

  // Handle text input submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;

      const value = inputValue.trim();
      addParentMessage(value);
      setInputValue("");

      if (step === "name") {
        setAthleteName(value);
        // Pass the name directly since state hasn't updated yet
        setTimeout(() => advanceStep("name", value), 300);
      } else if (step === "injuries") {
        setInjuries(value === "none" || value.toLowerCase() === "no" ? null : value);
        setTimeout(() => advanceStep("injuries"), 300);
      }
    },
    [inputValue, step, addParentMessage, advanceStep],
  );

  // Handle age selection
  const handleAgeSelect = useCallback(
    (age: number) => {
      setAthleteAge(age);
      addParentMessage(`${age} years old`);
      setTimeout(() => advanceStep("age"), 300);
    },
    [addParentMessage, advanceStep],
  );

  // Handle sport selection
  const handleSportSelect = useCallback(
    (sportValue: string, sportLabel: string) => {
      setSport(sportValue);
      addParentMessage(sportLabel);
      setTimeout(() => advanceStep("sport"), 300);
    },
    [addParentMessage, advanceStep],
  );

  // Handle no injuries quick reply
  const handleNoInjuries = useCallback(() => {
    setInjuries(null);
    addParentMessage("No injuries");
    setTimeout(() => advanceStep("injuries"), 300);
  }, [addParentMessage, advanceStep]);

  // Handle personality selection
  const handlePersonalitySelect = useCallback(
    (p: WolfPersonality) => {
      setPersonality(p);
      const selected = PERSONALITIES.find((pers) => pers.id === p);
      addParentMessage(`${selected?.emoji} ${selected?.name}`);
      // Need to manually update personality before advancing
      setTimeout(() => {
        setStep("confirmation");
        const confirmMsg = `Perfect! Here's what I've got:\n\n🏃 ${athleteName}, ${athleteAge} years old\n${SPORTS.find((s) => s.value === sport)?.emoji || "🎯"} ${sport.charAt(0).toUpperCase() + sport.slice(1)}\n${injuries ? `⚠️ Note: ${injuries}` : "✅ No injuries"}\n${selected?.emoji || "🎯"} ${selected?.name || "Coach"} style\n\nDoes this sound right?`;
        addWolfMessage(confirmMsg);
      }, 300);
    },
    [athleteName, athleteAge, sport, injuries, addParentMessage, addWolfMessage],
  );

  // Handle confirmation
  const handleConfirm = useCallback(() => {
    if (!athleteName || !athleteAge || !sport || !personality) return;

    addParentMessage("Looks good!");

    setTimeout(() => {
      addWolfMessage(
        `Awesome! I can't wait to meet ${athleteName}. I'll take good care of them. 🐺`,
      );

      setTimeout(() => {
        onComplete({
          athleteName,
          athleteAge,
          sport,
          injuries,
          wolfPersonality: personality,
        });
      }, 1500);
    }, 300);
  }, [athleteName, athleteAge, sport, injuries, personality, addParentMessage, addWolfMessage, onComplete]);

  // Handle edit (go back)
  const handleEdit = useCallback(() => {
    // Reset to name step
    setStep("name");
    setMessages([]);
    setAthleteName("");
    setAthleteAge(null);
    setSport("");
    setInjuries(null);
    setPersonality(null);

    // Restart conversation
    setTimeout(() => {
      addWolfMessage("No problem! Let's start over.", 300);
      setTimeout(() => {
        addWolfMessage(STEPS.name.getMessage(""), 800);
      }, 800);
    }, 100);
  }, [addWolfMessage]);

  // Render input area based on current step
  const renderInput = () => {
    if (isTyping) return null;

    switch (step) {
      case "name":
        return (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter their name..."
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-4 py-3 rounded-xl font-bebas tracking-wider transition-all disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              →
            </button>
          </form>
        );

      case "age":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((age) => (
              <motion.button
                key={age}
                onClick={() => handleAgeSelect(age)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {age}
              </motion.button>
            ))}
          </div>
        );

      case "sport":
        return (
          <div className="grid grid-cols-4 gap-2">
            {SPORTS.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => handleSportSelect(s.value, s.label)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl text-xs transition-all"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-xl">{s.emoji}</span>
                <span>{s.label}</span>
              </motion.button>
            ))}
          </div>
        );

      case "injuries":
        return (
          <div className="space-y-3">
            <motion.button
              onClick={handleNoInjuries}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--accent-primary)20",
                color: "var(--accent-primary)",
                border: "1px solid var(--accent-primary)40",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✅ No injuries - good to go!
            </motion.button>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Or describe any injuries..."
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-3 rounded-xl font-bebas tracking-wider transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                →
              </button>
            </form>
          </div>
        );

      case "personality":
        return (
          <div className="grid grid-cols-2 gap-3">
            {PERSONALITIES.map((p) => (
              <motion.button
                key={p.id}
                onClick={() => handlePersonalitySelect(p.id)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                }}
                whileHover={{
                  scale: 1.02,
                  borderColor: "var(--accent-primary)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl block mb-2">{p.emoji}</span>
                <span
                  className="font-bebas text-sm tracking-wider block"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.name.toUpperCase()}
                </span>
                <span className="text-xs block mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {p.description}
                </span>
                <span
                  className="text-xs block mt-2 italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  "{p.sample}"
                </span>
              </motion.button>
            ))}
          </div>
        );

      case "confirmation":
        return (
          <div className="flex gap-3">
            <motion.button
              onClick={handleEdit}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-default)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit something
            </motion.button>
            <motion.button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bebas tracking-wider transition-all"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              LOOKS GOOD!
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "var(--border-default)" }}>
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <ChatWolfAvatar size="md" isTyping={isTyping} />
          <div>
            <h1
              className="font-bebas text-lg tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              MEET WOLF
            </h1>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {isTyping ? "Wolf is typing..." : "Tell me about your athlete"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.sender === "parent" ? "flex-row-reverse" : ""}`}
              >
                {msg.sender === "wolf" && <ChatWolfAvatar size="sm" />}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === "wolf"
                      ? "rounded-tl-sm"
                      : "rounded-tr-sm"
                  }`}
                  style={{
                    backgroundColor:
                      msg.sender === "wolf"
                        ? "var(--bg-secondary)"
                        : "var(--accent-primary)",
                    color:
                      msg.sender === "wolf"
                        ? "var(--text-primary)"
                        : "var(--bg-primary)",
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <ChatWolfAvatar size="sm" isTyping />
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--text-tertiary)" }}
                      animate={{
                        y: [0, -6, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        className="p-4 border-t"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-primary)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-lg mx-auto">{renderInput()}</div>
      </motion.div>
    </div>
  );
}
