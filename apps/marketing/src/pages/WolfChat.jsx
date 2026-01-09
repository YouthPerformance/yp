// WolfChat - First chat experience with Wolf AI coach
// E10-8: Chat with preloaded questions and block components

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { SafetyNote, SessionStack, WeekGrid } from "../components/wolf";
import { generateWolfFirstMessage, WOLF_SUGGESTED_QUESTIONS } from "../config/interestPills";
import { getStackForLane } from "../config/laneStacks";
import { generate7DayPlan } from "../config/weekPlans";
import { useOnboarding } from "../context/OnboardingContext";
import analytics, { EVENTS } from "../lib/analytics";

function WolfChat() {
  const navigate = useNavigate();
  const { data, getLaneOutput } = useOnboarding();
  const _laneOutput = getLaneOutput();
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // Get stack for current lane
  const stack = getStackForLane(data.lane || "base_lane");
  const plan = generate7DayPlan(data.lane || "base_lane", stack?.id);

  // Track page view
  useEffect(() => {
    analytics.trackPageView("wolf_chat");
  }, []);

  // Initialize with Wolf's first message
  useEffect(() => {
    const firstMessage = generateWolfFirstMessage({
      ...data,
      childNickname: data.childNickname || "your athlete",
    });

    // Simulate typing delay
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        {
          id: 1,
          role: "wolf",
          content: firstMessage,
          blocks: [{ type: "stack", data: stack }],
        },
      ]);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, stack]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSuggestedQuestion = (question) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: question.text,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Track question
    analytics.track(EVENTS.WOLF_QUESTION_ASKED, {
      question_id: question.id,
      question_text: question.text,
      category: question.category,
    });

    // Simulate Wolf response
    setIsTyping(true);
    setTimeout(() => {
      const response = getWolfResponse(question.id);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleShowPlan = () => {
    setShowPlan(true);

    // Add plan message
    const planMessage = {
      id: messages.length + 1,
      role: "wolf",
      content:
        "Here's your 7-day plan. Start today, and by the end of the week you'll feel the difference.",
      blocks: [{ type: "plan", data: plan }],
    };
    setMessages((prev) => [...prev, planMessage]);

    analytics.track(EVENTS.WOLF_PLAN_VIEWED, {
      lane: data.lane,
      plan_id: plan?.id,
    });
  };

  // Get Wolf response based on question
  const getWolfResponse = (questionId) => {
    const responses = {
      safety: {
        content: `Great question. Barefoot training is safe for most ages when done correctly. For ${data.childNickname || "your athlete"} in the ${data.ageBand || "youth"} age band, we start with foundational exercises — tripod activation, short foot holds, basic balance work. No high-impact jumping until the base is solid.`,
        blocks: [{ type: "safety", variant: "info" }],
      },
      frequency: {
        content:
          "3 times per week is the sweet spot. That's enough to build the habit without overdoing it. On off days, a quick 2-minute micro session keeps the pattern fresh.",
        blocks: [],
      },
      week1: {
        content:
          "Here's a safe Week 1 plan based on your goals. We start gentle and build from there.",
        blocks: [{ type: "plan", data: plan }],
      },
      pain: {
        content:
          "If there's any sharp pain or limping, stop immediately. That's the rule. Mild muscle soreness the next day is normal — that's your feet waking up. Sharp pain during an exercise means stop, rest, and try again tomorrow. No pushing through.",
        blocks: [{ type: "safety", variant: "warning" }],
      },
      progress: {
        content:
          "Look for these signs: Quieter landings during sports. Better balance on one leg. Less ankle rolling. Most parents notice a difference in 7-14 days of consistent practice. The key is 'consistent' — short sessions you repeat beat long sessions you skip.",
        blocks: [],
      },
    };

    const response = responses[questionId] || {
      content: "That's a great question. Let me help you with that.",
      blocks: [],
    };

    return {
      id: messages.length + 2,
      role: "wolf",
      ...response,
    };
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-black-400 bg-black sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-dark-text-secondary hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐺</span>
            <span className="font-yp-display uppercase text-white">Wolf</span>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-cyan-500/20 rounded-2xl rounded-br-sm"
                    : "bg-black-200 rounded-2xl rounded-bl-sm"
                } p-4`}
              >
                {/* Message content */}
                <p className="text-dark-text-secondary whitespace-pre-wrap mb-3">
                  {message.content}
                </p>

                {/* Blocks */}
                {message.blocks?.map((block, idx) => (
                  <div key={idx} className="mt-3">
                    {block.type === "stack" && <SessionStack stack={block.data} />}
                    {block.type === "plan" && <WeekGrid plan={block.data} currentDay={1} />}
                    {block.type === "safety" && (
                      <SafetyNote
                        type={block.variant || "info"}
                        title={block.variant === "warning" ? "Stop Rule" : "Safety First"}
                      >
                        Sharp pain or limping = stop and reset. No pushing through.
                      </SafetyNote>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black-200 rounded-2xl rounded-bl-sm p-4">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Suggested Questions */}
      <footer className="p-4 border-t border-black-400 bg-black">
        <div className="max-w-2xl mx-auto">
          {!showPlan && messages.length > 0 && (
            <Button onClick={handleShowPlan} fullWidth className="mb-3 shadow-glow-cyan">
              Yes, build my 7-day plan
            </Button>
          )}

          <p className="text-dark-text-tertiary text-xs mb-2">Suggested questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {WOLF_SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q.id}
                onClick={() => handleSuggestedQuestion(q)}
                disabled={isTyping}
                className="flex-shrink-0 px-3 py-2 bg-black-200 hover:bg-black-300 text-dark-text-secondary text-sm rounded-full transition-colors disabled:opacity-50"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WolfChat;
