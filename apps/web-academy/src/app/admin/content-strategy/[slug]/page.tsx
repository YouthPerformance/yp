/**
 * Article Reader/Editor
 *
 * Optimized for editing LONG articles:
 * - Full-screen readable view (like reading the published article)
 * - Large, comfortable typography
 * - Tap any section to edit inline
 * - Voice button appears on edit
 * - Smooth transitions
 * - Auto-save
 *
 * NOTE: Using mock data for testing without Convex
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Section {
  id: string;
  type: string;
  title: string;
  content: string;
}

interface Article {
  slug: string;
  title: string;
  targetKeyword: string;
  pillar: string;
  author: string;
  sections: Section[];
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const MOCK_ARTICLES: Record<string, Article> = {
  "bulletproof-ankles-playbook": {
    slug: "bulletproof-ankles-playbook",
    title: "The Bulletproof Ankles Playbook",
    targetKeyword: "ankle injury prevention youth sports",
    pillar: "Injury Prevention",
    author: "Adam Harris",
    sections: [
      {
        id: "intro-1",
        type: "intro",
        title: "Why Ankles Matter",
        content:
          "Your ankle isn't just a hinge—it's a sensory organ. Thousands of mechanoreceptors in the ligaments and joint capsule constantly feed information to your brain about position and load. When you sprain an ankle, you don't just stretch ligaments. You disrupt that communication system. That's why 'it feels weak' even after the swelling goes down. The tissue healed, but the sensors need recalibration.",
      },
      {
        id: "body-1",
        type: "body",
        title: "The Science of Ankle Stability",
        content:
          "Ankle stability comes from three systems working together: passive (ligaments), active (muscles), and neural (proprioception). Most rehab programs focus only on the first two. We focus on all three—especially the neural component that most programs miss.",
      },
      {
        id: "drill-1",
        type: "drill",
        title: "Phase 1: Foundation Drills",
        content:
          "Single-leg balance with eyes closed. Sounds simple, but here's what's happening: you've removed visual input, forcing your proprioceptors to work harder. Your brain is literally rewiring the ankle-to-brain connection. Start with 30 seconds. When that's easy, add a perturbation—catch a ball, turn your head. Build complexity progressively.",
      },
      {
        id: "drill-2",
        type: "drill",
        title: "Phase 2: Load Introduction",
        content:
          "Now we add force. Controlled hops, lateral bounds, and deceleration work. The key isn't going hard—it's going precise. Quality reps build quality patterns. 3 sets of 8 each direction, 2-3 times per week.",
      },
      {
        id: "drill-3",
        type: "drill",
        title: "Phase 3: Sport-Specific",
        content:
          "This is where we introduce chaos. Reactive cuts, unexpected perturbations, game-like scenarios. The ankle has to handle what sport throws at it. Progress here means the ankle responds automatically—no conscious thought required.",
      },
      {
        id: "faq-1",
        type: "faq",
        title: "Common Questions",
        content:
          "Q: How long until my ankle is 'fixed'?\nA: We don't fix ankles—we build capacity. Most athletes see significant improvement in 4-6 weeks with consistent work. But maintenance is forever.\n\nQ: Can I still play while doing this?\nA: Usually yes, but it depends on severity. The drills complement sport—they don't replace it.",
      },
      {
        id: "cta-1",
        type: "cta",
        title: "Your Next Step",
        content:
          "Ready to bulletproof your ankles? Download the complete 8-week protocol with video demonstrations. Or join YouthPerformance Premium for coached progressions.",
      },
    ],
  },
  "speed-training-youth-athletes": {
    slug: "speed-training-youth-athletes",
    title: "Speed Training for Youth Athletes: The Complete Guide",
    targetKeyword: "youth speed training",
    pillar: "Speed & Agility",
    author: "James Scott",
    sections: [
      {
        id: "intro-1",
        type: "intro",
        title: "Speed Isn't Genetic",
        content:
          "Speed isn't genetic. It's built. Every elite athlete you watch on TV started exactly where your kid is now. The difference? They learned to move smarter, not just faster. Here's how to build that same foundation.",
      },
      {
        id: "body-1",
        type: "body",
        title: "The Three Pillars of Speed",
        content:
          "True speed comes from three components: force production (how hard you push), force direction (where that force goes), and ground contact time (how quickly you can reapply force). Most young athletes only train the first one. We train all three.",
      },
      {
        id: "drill-1",
        type: "drill",
        title: "A-Skip Progression",
        content:
          "No equipment. Start at one end of a 20-yard lane. Skip forward, driving the lead knee to hip height on each rep. Focus on: tall posture, quick ground contact, arm drive matching leg drive. 2 sets of 20 yards. Rest 30 seconds between.",
      },
      {
        id: "drill-2",
        type: "drill",
        title: "Wall Drives",
        content:
          "Hands on wall, body at 45-degree angle. Drive one knee up while pushing through the planted foot. Hold the drive position for 2 seconds. This builds the motor pattern for acceleration. 3 sets of 8 each leg.",
      },
      {
        id: "cta-1",
        type: "cta",
        title: "Stack These Drills",
        content:
          "Stack these drills 3x per week. In 4 weeks, you'll see the difference in their first step. Ready for the next level? Check out our Speed Chassis program for the complete system.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// READING SETTINGS
// ─────────────────────────────────────────────────────────────

const FONT_SIZES = {
  small: { body: "16px", heading: "24px", lineHeight: "1.6" },
  medium: { body: "18px", heading: "28px", lineHeight: "1.7" },
  large: { body: "20px", heading: "32px", lineHeight: "1.8" },
  xlarge: { body: "22px", heading: "36px", lineHeight: "1.9" },
};

type FontSize = keyof typeof FONT_SIZES;

// ─────────────────────────────────────────────────────────────
// EDITABLE SECTION (Tap to Edit)
// ─────────────────────────────────────────────────────────────

function EditableSection({
  section,
  isActive,
  onActivate,
  onSave,
  fontSize,
}: {
  section: Section;
  isActive: boolean;
  onActivate: () => void;
  onSave: (content: string) => void;
  fontSize: FontSize;
}) {
  const [content, setContent] = useState(section.content);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const settings = FONT_SIZES[fontSize];

  // Sync content when section changes
  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isActive) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content, isActive]);

  // Focus textarea when activated
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  const handleVoiceInput = async () => {
    // Try Groq first, fall back to browser
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (groqKey) {
      // Use Groq Whisper API
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        setIsRecording(true);

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");
          formData.append("model", "whisper-large-v3-turbo");
          formData.append("response_format", "text");

          try {
            const response = await fetch(
              "https://api.groq.com/openai/v1/audio/transcriptions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${groqKey}`,
                },
                body: formData,
              }
            );
            const transcript = await response.text();
            setContent((prev) => (prev ? prev + " " + transcript : transcript));
          } catch (error) {
            console.error("Groq transcription failed:", error);
          }

          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
        };

        mediaRecorder.start();

        // Stop after 10 seconds
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 10000);

        return;
      } catch (error) {
        console.error("Microphone access failed:", error);
      }
    }

    // Fallback to browser speech recognition
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice not supported");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => (prev ? prev + " " + transcript : transcript));
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSave = () => {
    onSave(content);
  };

  // Hardcoded colors for section types (no CSS vars)
  const sectionTypeColors: Record<string, string> = {
    intro: "#3b82f6",
    body: "#a855f7",
    drill: "#22c55e",
    faq: "#eab308",
    cta: "#ef4444",
  };

  const borderColor = sectionTypeColors[section.type] || "#00d4aa";

  // Reading mode
  if (!isActive) {
    return (
      <div
        onClick={onActivate}
        className="group cursor-pointer py-6 px-4 -mx-4 rounded-lg transition-all"
        style={{
          borderLeft: "4px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(26, 26, 46, 0.5)";
          e.currentTarget.style.borderLeftColor = borderColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderLeftColor = "transparent";
        }}
      >
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            className="text-xs uppercase tracking-wider font-medium"
            style={{ color: "#6b7280" }}
          >
            {section.type}
          </span>
          <span className="text-xs" style={{ color: "#4b5563" }}>
            • tap to edit
          </span>
        </div>

        {/* Section title */}
        {section.title && section.type !== "body" && (
          <h2
            className="font-bold mb-3"
            style={{ fontSize: settings.heading, color: "#f3f4f6" }}
          >
            {section.title}
          </h2>
        )}

        {/* Content */}
        <div
          className="whitespace-pre-wrap"
          style={{
            fontSize: settings.body,
            lineHeight: settings.lineHeight,
            color: "#d1d5db",
          }}
        >
          {section.content || (
            <span style={{ color: "#6b7280", fontStyle: "italic" }}>
              No content yet. Tap to add...
            </span>
          )}
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div
      className="py-6 px-4 -mx-4 rounded-lg"
      style={{
        backgroundColor: "#1a1a2e",
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: "#00d4aa" }}
        >
          Editing: {section.type}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={isRecording}
            className="p-2 rounded-full transition-all"
            style={{
              backgroundColor: isRecording ? "#ef4444" : "#2a2a4a",
              color: isRecording ? "white" : "#9ca3af",
            }}
            title="Voice input (Groq Whisper)"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3z" />
              <path d="M5 9a1 1 0 00-2 0 7 7 0 0014 0 1 1 0 10-2 0 5 5 0 01-10 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section title (if applicable) */}
      {section.title && section.type !== "body" && (
        <h2
          className="font-bold mb-3"
          style={{ fontSize: settings.heading, color: "#f3f4f6" }}
        >
          {section.title}
        </h2>
      )}

      {/* Editable textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-transparent resize-none focus:outline-none"
        style={{
          fontSize: settings.body,
          lineHeight: settings.lineHeight,
          minHeight: "100px",
          color: "#f3f4f6",
        }}
        placeholder="Start typing or use voice..."
      />

      {/* Action buttons */}
      <div
        className="flex items-center gap-3 mt-4 pt-4"
        style={{ borderTop: "1px solid #2a2a4a" }}
      >
        <button
          onClick={handleSave}
          className="flex-1 py-3 font-semibold rounded-xl"
          style={{ backgroundColor: "#00d4aa", color: "black" }}
        >
          Save Section
        </button>
        <button
          onClick={() => {
            setContent(section.content);
            onSave(section.content); // Close without changing
          }}
          className="px-4 py-3"
          style={{ color: "#6b7280" }}
        >
          Cancel
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div
          className="mt-3 flex items-center gap-2 text-sm"
          style={{ color: "#ef4444" }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: "#ef4444" }}
          />
          Listening... speak now (10s max)
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FONT SIZE TOGGLE
// ─────────────────────────────────────────────────────────────

function FontSizeToggle({
  size,
  onChange,
}: {
  size: FontSize;
  onChange: (size: FontSize) => void;
}) {
  const sizes: FontSize[] = ["small", "medium", "large", "xlarge"];

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1"
      style={{ backgroundColor: "#2a2a4a" }}
    >
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className="px-2 py-1 rounded text-xs transition-colors"
          style={{
            backgroundColor: size === s ? "#0a0a14" : "transparent",
            color: size === s ? "#f3f4f6" : "#6b7280",
          }}
          title={`${s} font`}
        >
          A
          <span
            style={{
              fontSize:
                s === "small"
                  ? "10px"
                  : s === "medium"
                    ? "12px"
                    : s === "large"
                      ? "14px"
                      : "16px",
            }}
          >
            a
          </span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESS INDICATOR
// ─────────────────────────────────────────────────────────────

function ProgressIndicator({
  sections,
  activeIndex,
  onJump,
}: {
  sections: Section[];
  activeIndex: number | null;
  onJump: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {sections.map((section, i) => {
        const hasContent = section.content && section.content.length > 0;
        const isActive = activeIndex === i;

        return (
          <button
            key={section.id}
            onClick={() => onJump(i)}
            className="rounded-full transition-all"
            style={{
              width: isActive ? "16px" : "8px",
              height: "8px",
              backgroundColor: isActive
                ? "#00d4aa"
                : hasContent
                  ? "#22c55e"
                  : "#2a2a4a",
            }}
            title={section.title || section.type}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function ArticleReaderEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load article from mock data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundArticle = MOCK_ARTICLES[slug];
      setArticle(foundArticle || null);
      setLoading(false);
    }, 300);
  }, [slug]);

  // Load font preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("article-font-size") as FontSize;
      if (saved && FONT_SIZES[saved]) {
        setFontSize(saved);
      }
    }
  }, []);

  // Save font preference
  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("article-font-size", size);
  };

  // Save section (mock - just updates local state)
  const handleSaveSection = useCallback(
    async (sectionId: string, content: string) => {
      if (!article) return;

      setIsSaving(true);

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setArticle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, content } : s
          ),
        };
      });

      setLastSaved(new Date().toLocaleTimeString());
      setIsSaving(false);
      setActiveSection(null);
    },
    [article]
  );

  // Jump to section
  const handleJumpToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Loading
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0a0a14" }}
      >
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#00d4aa", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Not found
  if (!article) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0a0a14" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "#f3f4f6" }}
          >
            Article Not Found
          </h2>
          <p className="mb-4" style={{ color: "#6b7280" }}>
            No article with slug "{slug}"
          </p>
          <p className="mb-4 text-sm" style={{ color: "#4b5563" }}>
            Available: {Object.keys(MOCK_ARTICLES).join(", ")}
          </p>
          <button
            onClick={() => router.push("/admin/content-strategy")}
            style={{ color: "#00d4aa" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sections = article.sections;
  const wordCount = sections.reduce(
    (sum, s) => sum + (s.content?.split(/\s+/).filter(Boolean).length || 0),
    0
  );
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a14" }}>
      {/* Floating Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(10, 10, 20, 0.95)",
          borderBottom: "1px solid #2a2a4a",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/admin/content-strategy")}
              className="flex items-center gap-2 transition-colors"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 4L6 10L12 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm hidden sm:inline">Back</span>
            </button>

            <ProgressIndicator
              sections={sections}
              activeIndex={activeSection}
              onJump={handleJumpToSection}
            />

            <FontSizeToggle size={fontSize} onChange={handleFontSizeChange} />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div
          className="mb-8 pb-8"
          style={{ borderBottom: "1px solid #2a2a4a" }}
        >
          <h1
            className="font-bold mb-3"
            style={{
              fontSize: FONT_SIZES[fontSize].heading,
              color: "#f3f4f6",
            }}
          >
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: "#6b7280" }}>
            <span style={{ color: "#00d4aa" }}>{article.targetKeyword}</span>
            <span>•</span>
            <span>{article.pillar}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
            >
              <EditableSection
                section={section}
                isActive={activeSection === index}
                onActivate={() => setActiveSection(index)}
                onSave={(content) => handleSaveSection(section.id, content)}
                fontSize={fontSize}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Floating Save Indicator */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 shadow-lg flex items-center gap-3 text-sm"
        style={{
          backgroundColor: "#1a1a2e",
          border: "1px solid #2a2a4a",
        }}
      >
        {isSaving ? (
          <>
            <div
              className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#00d4aa", borderTopColor: "transparent" }}
            />
            <span style={{ color: "#6b7280" }}>Saving...</span>
          </>
        ) : lastSaved ? (
          <>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            />
            <span style={{ color: "#6b7280" }}>Saved {lastSaved}</span>
          </>
        ) : (
          <>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#2a2a4a" }}
            />
            <span style={{ color: "#6b7280" }}>Tap any section to edit</span>
          </>
        )}
      </div>
    </div>
  );
}
