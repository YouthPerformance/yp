"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What's the Blueprint?",
  "Tell me about NeoBall",
  "Your training philosophy?",
  "Who have you trained?",
];

// Placeholder responses until API is connected
const PLACEHOLDER_RESPONSES: Record<string, string> = {
  "what's the blueprint?":
    "Man, the Blueprint is everything I wish I had when I was coming up. It's the system—the exact footwork, balance principles, and release mechanics I've refined over 20 years with guys like KD and Jimmy. At the end of the day, it's about giving your kid the foundation to be efficient, not just talented.",
  "tell me about neoball":
    "Look, the NeoBall is about stealing reps. It's regulation weight, silent, so you can get 500 shots up in your bedroom at midnight without waking the house. Consistency happens in the dark, you know what I mean? That's where the real work gets done.",
  "your training philosophy?":
    "Balance. That's the holy grail. Everything starts with the feet—the foundation. I'm obsessive-compulsive about the details because that's where greatness lives. Not in the fancy drills, but in the fundamentals executed with intensity and consistency.",
  "who have you trained?":
    "I've been privileged to work with some incredible athletes—Kevin Durant during his MVP year, Jimmy Butler, Sabrina Ionescu, Spencer Dinwiddie, and many others. But listen, I didn't make them. They hired me to help refine their mechanics. The work was theirs.",
  default:
    "That's a great question. At the end of the day, everything we do at YouthPerformance comes back to balance and consistency. The details matter. If you want to dive deeper, that might be a great topic for a one-on-one consultation.",
};

export function AskAdamWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (question: string): string => {
    const lower = question.toLowerCase().trim();

    // Check for keyword matches
    for (const [key, response] of Object.entries(PLACEHOLDER_RESPONSES)) {
      if (key !== "default" && lower.includes(key.replace("?", ""))) {
        return response;
      }
    }

    // Check for partial matches
    if (lower.includes("blueprint")) return PLACEHOLDER_RESPONSES["what's the blueprint?"];
    if (lower.includes("neoball") || lower.includes("ball")) return PLACEHOLDER_RESPONSES["tell me about neoball"];
    if (lower.includes("philosophy") || lower.includes("train")) return PLACEHOLDER_RESPONSES["your training philosophy?"];
    if (lower.includes("who") || lower.includes("player") || lower.includes("athlete")) return PLACEHOLDER_RESPONSES["who have you trained?"];

    return PLACEHOLDER_RESPONSES.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = getResponse(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Collapsed Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-bg-elevated border border-accent-primary/30 rounded-full text-text-primary hover:border-accent-primary hover:shadow-glow-cyan transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium">Ask Adam</span>

            {/* Pulse animation */}
            <motion.span
              className="absolute inset-0 rounded-full border border-accent-primary"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[500px] bg-bg-elevated border border-border-default rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <span className="font-bebas text-accent-primary text-lg">AH</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">Ask The Architect</h3>
                  <p className="text-[10px] text-accent-primary uppercase tracking-wider">Adam Harrington AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-bg-elevated flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-text-tertiary text-sm mb-4">
                    Ask me about training, the Blueprint, or my journey.
                  </p>

                  {/* Quick Questions */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="px-3 py-1.5 text-xs bg-bg-secondary border border-border-default rounded-full text-text-secondary hover:border-accent-primary/50 hover:text-accent-primary transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                        message.role === "user"
                          ? "bg-accent-primary text-bg-secondary rounded-br-md"
                          : "bg-bg-secondary text-text-primary rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>

                      {/* Voice option for assistant messages */}
                      {message.role === "assistant" && (
                        <button
                          className="mt-2 flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent-primary transition-colors"
                          onClick={() => {
                            // TODO: Connect to voice API
                            console.log("Play voice:", message.content);
                          }}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Hear this</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2 text-text-tertiary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Adam is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border-default bg-bg-secondary">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Adam anything..."
                  className="flex-1 px-4 py-2.5 bg-bg-elevated border border-border-default rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-accent-primary text-bg-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-cyan transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
