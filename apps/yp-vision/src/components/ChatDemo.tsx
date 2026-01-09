"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { INVESTOR_QA } from "@/lib/constants";

const PROMPT_CHIPS = [
  { key: "retention", label: "What is your retention?" },
  { key: "cac", label: "What's your CAC/LTV?" },
  { key: "moat", label: "What's your moat?" },
  { key: "market", label: "How big is the market?" },
  { key: "team", label: "Tell me about the team" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="typing-cursor" />}
    </span>
  );
}

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePromptClick = (key: string, label: string) => {
    if (isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: label }]);
    setIsTyping(true);

    // Simulate delay before response
    setTimeout(() => {
      const response = INVESTOR_QA[key] || "I'd be happy to discuss that. Let's schedule a call.";
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  };

  return (
    <section className="section bg-gradient-to-b from-wolf-dark to-wolf-black relative">
      <div className="w-full max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-purple-400 font-mono text-sm tracking-[0.3em] uppercase mb-4">
            The Moat
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            ASK<span className="text-purple-400">YP</span>
          </h2>
          <p className="text-gray-400 text-lg">AI coaching that knows every athlete. Try it.</p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-wolf-gray/30 border border-gray-800 rounded-2xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-wolf-gray/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">AskYP</p>
              <p className="text-gray-500 text-xs">Investor Mode</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-wolf-neon rounded-full animate-pulse" />
              <span className="text-gray-500 text-xs">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Click a question below to start</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-purple-500/20 text-white rounded-br-md"
                        : "bg-wolf-gray text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" && i === messages.length - 1 ? (
                      <TypingText text={msg.content} onComplete={() => setIsTyping(false)} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Prompt Chips */}
          <div className="p-4 border-t border-gray-800 bg-wolf-gray/30">
            <div className="flex flex-wrap gap-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => handlePromptClick(chip.key, chip.label)}
                  disabled={isTyping}
                  className="px-4 py-2 rounded-full bg-wolf-gray border border-gray-700 text-sm text-gray-300 hover:border-purple-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 mt-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-white">12K+</p>
            <p className="text-gray-500 text-sm">Form Corrections/Day</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">2M+</p>
            <p className="text-gray-500 text-sm">Training Sessions Analyzed</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
