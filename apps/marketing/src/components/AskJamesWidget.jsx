/**
 * Ask James Widget
 *
 * Interactive chat widget for James Scott's profile page.
 * Placeholder AI responses using James's R3 philosophy and voice.
 *
 * Voice: Direct, evidence-based, biomechanics-focused
 * Philosophy: "Weak feet don't eat" / R3 Method
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_QUESTIONS = [
  "What's 'weak feet don't eat'?",
  "How do I start barefoot?",
  "What's the R3 Method?",
  "Can kids do this?",
];

// Placeholder responses matching James's voice from james-scott.ts
const PLACEHOLDER_RESPONSES = {
  "weak feet": `Weak feet don't eat. That's not a saying—it's biomechanics. If your feet can't stabilize, absorb, and produce force, you're leaking power at every step. Your feet have 26 bones, 33 joints, and over 100 muscles. They need training too. The truth is, most modern shoes have been lying to you—turning your foundation into a passenger instead of a driver.`,

  barefoot: `Here's what I've observed in thousands of athletes: rushing barefoot training leads to injury. Your feet have been in shoes for years—they need time to adapt. Start with 2 weeks of simple activation drills. Short toe yoga, marble pickups, 5 minutes a day. Your nervous system needs time to rebuild those pathways. Two weeks of this and you'll feel muscles you didn't know existed.`,

  r3: `The R3 Method is the system I developed after training pro athletes across multiple sports. Release, Restore, Re-Engineer. Week 1-2: Release—wake up dormant muscles, restore range of motion. Week 3-4: Restore—build steel ankles, develop load capacity. Week 5-6: Re-Engineer—explosive power, sport-ready performance. 42 days to rebuild your foundation. Same protocol I use with Jimmy Butler and NFL pros.`,

  kids: `Absolutely—in fact, kids need this more than anyone. I have two sons, and watching youth sports made me angry. The same broken patterns I fix in pros are starting at age 8. Weak feet, bad mechanics. The difference is kids adapt faster. Their nervous systems are more plastic. Start them with the fundamentals now, and you prevent 10 years of compensation patterns. Age-appropriate modifications are built into every drill.`,

  philosophy: `The foundation matters because the feet are the first domino. When they fall, everything upstream collapses. Biomechanically speaking, every force you produce starts at the ground. Weak feet mean leaked power, compensated movement, and eventually injury. In my experience coaching pro athletes, the ones with foot problems always have movement problems. Fix the feet, fix everything upstream.`,

  athlete: `I've been privileged to work with some incredible athletes—Jimmy Butler for over 6 years, LeBron James on the Nike RISE Tour, trained alongside Kobe at Mamba Academy. NFL pro bowlers, Premier League players, Olympic athletes. The pattern is always the same—the ones who invest in their foundation outperform their talent level. The ones who skip it? They're always dealing with something.`,

  default: `The truth is, everything starts with the foundation. Your feet are your first contact with the ground, the origin point of every athletic movement. If you want specifics about barefoot training, the R3 Method, or how to get started, ask away. I don't do generic fitness advice—I do biomechanics.`,
};

// Icons as inline SVG to avoid dependency issues
const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const VolumeIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
  </svg>
);

const LoaderIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function AskJamesWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (question) => {
    const lower = question.toLowerCase().trim();

    // Check for keyword matches
    if (lower.includes("weak feet") || lower.includes("don't eat") || lower.includes("dont eat")) {
      return PLACEHOLDER_RESPONSES["weak feet"];
    }
    if (lower.includes("barefoot") || lower.includes("start") || lower.includes("begin")) {
      return PLACEHOLDER_RESPONSES["barefoot"];
    }
    if (lower.includes("r3") || lower.includes("method") || lower.includes("system")) {
      return PLACEHOLDER_RESPONSES["r3"];
    }
    if (lower.includes("kid") || lower.includes("child") || lower.includes("son") || lower.includes("daughter") || lower.includes("youth")) {
      return PLACEHOLDER_RESPONSES["kids"];
    }
    if (lower.includes("philosophy") || lower.includes("approach") || lower.includes("why")) {
      return PLACEHOLDER_RESPONSES["philosophy"];
    }
    if (lower.includes("who") || lower.includes("athlete") || lower.includes("trained") || lower.includes("jimmy") || lower.includes("lebron")) {
      return PLACEHOLDER_RESPONSES["athlete"];
    }

    return PLACEHOLDER_RESPONSES.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    const response = getResponse(userMessage.content);

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Set input before calling handleSend for quick questions
  useEffect(() => {
    if (input && messages.length === 0) {
      // Don't auto-send, let handleQuickQuestion handle it
    }
  }, [input, messages.length]);

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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-[#111] border border-cyan-500/30 rounded-full text-white hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,246,224,0.3)] transition-all duration-300"
          >
            <span className="text-cyan-400">
              <MessageIcon />
            </span>
            <span className="text-sm font-medium">Ask James</span>

            {/* Pulse animation */}
            <motion.span
              className="absolute inset-0 rounded-full border border-cyan-500"
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[500px] bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="font-bold text-cyan-400 text-lg">JS</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Ask James</h3>
                  <p className="text-[10px] text-cyan-400 uppercase tracking-wider">
                    Movement Specialist AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-white/40 text-sm mb-4">
                    Ask me about barefoot training, the R3 Method, or foot performance.
                  </p>

                  {/* Quick Questions */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="px-3 py-1.5 text-xs bg-[#0a0a0a] border border-white/10 rounded-full text-white/60 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
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
                          ? "bg-cyan-500 text-black rounded-br-md"
                          : "bg-[#1a1a1a] text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>

                      {/* Voice option for assistant messages */}
                      {message.role === "assistant" && (
                        <button
                          className="mt-2 flex items-center gap-1 text-[10px] text-white/40 hover:text-cyan-400 transition-colors"
                          onClick={() => {
                            // TODO: Connect to voice API
                            console.log("Play voice:", message.content);
                          }}
                        >
                          <VolumeIcon />
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
                  <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2 text-white/40">
                      <LoaderIcon />
                      <span className="text-sm">James is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-[#0a0a0a]">
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
                  placeholder="Ask James anything..."
                  className="flex-1 px-4 py-2.5 bg-[#111] border border-white/10 rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,246,224,0.3)] transition-all"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
