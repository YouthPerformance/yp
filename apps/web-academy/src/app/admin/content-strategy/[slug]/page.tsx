/**
 * Article Reader/Editor
 *
 * Simple UX for James & Adam (44yo, iPhone Max):
 * - Large, comfortable text
 * - Tap any section to edit
 * - Voice input (🎤)
 * - Auto-save
 * - Progress dots
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type SectionType = "intro" | "body" | "drill" | "faq" | "cta";

interface Section {
  id: string;
  type: SectionType;
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
// SECTION COLORS
// ─────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<SectionType, { accent: string; label: string }> = {
  intro: { accent: "#3b82f6", label: "INTRO" },
  body: { accent: "#8b5cf6", label: "BODY" },
  drill: { accent: "#22c55e", label: "DRILL" },
  faq: { accent: "#eab308", label: "FAQ" },
  cta: { accent: "#ef4444", label: "CTA" },
};

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const MOCK_ARTICLES: Record<string, Article> = {
  "bulletproof-ankles-playbook": {
    slug: "bulletproof-ankles-playbook",
    title: "The Bulletproof Ankles Playbook",
    targetKeyword: "ankle injury prevention",
    pillar: "Barefoot Training",
    author: "Adam",
    sections: [
      {
        id: "intro-1",
        type: "intro",
        title: "Why Ankles Matter",
        content: "Your ankle isn't just a hinge—it's a sensory organ. Thousands of mechanoreceptors in the ligaments and joint capsule constantly feed information to your brain about position and load.",
      },
      {
        id: "body-1",
        type: "body",
        title: "The Three Systems",
        content: "Ankle stability comes from three systems working together: passive (ligaments), active (muscles), and neural (proprioception). Most rehab programs focus only on the first two.",
      },
      {
        id: "drill-1",
        type: "drill",
        title: "Single-Leg Balance",
        content: "Stand on one leg with eyes closed. You've removed visual input, forcing your proprioceptors to work harder. Start with 30 seconds. When that's easy, add perturbation.",
      },
      {
        id: "drill-2",
        type: "drill",
        title: "Controlled Hops",
        content: "Controlled hops, lateral bounds, and deceleration work. The key isn't going hard—it's going precise. 3 sets of 8 each direction, 2-3 times per week.",
      },
      {
        id: "faq-1",
        type: "faq",
        title: "Common Questions",
        content: "Q: How long until my ankle is 'fixed'?\nA: We don't fix ankles—we build capacity. Most athletes see improvement in 4-6 weeks.",
      },
      {
        id: "cta-1",
        type: "cta",
        title: "Your Next Step",
        content: "Ready to bulletproof your ankles? Download the complete 8-week protocol with video demonstrations.",
      },
    ],
  },
  "speed-training-youth-athletes": {
    slug: "speed-training-youth-athletes",
    title: "Speed Training for Youth Athletes",
    targetKeyword: "youth speed training",
    pillar: "Speed Training",
    author: "James",
    sections: [
      {
        id: "intro-1",
        type: "intro",
        title: "Speed Isn't Genetic",
        content: "Speed isn't something you're born with. It's something you build. Every elite athlete started exactly where your kid is now.",
      },
      {
        id: "body-1",
        type: "body",
        title: "The Three Pillars",
        content: "True speed comes from: force production (how hard you push), force direction (where that force goes), and ground contact time (how quickly you reapply force).",
      },
      {
        id: "drill-1",
        type: "drill",
        title: "A-Skip Progression",
        content: "Skip forward, driving the lead knee to hip height. Focus on: tall posture, quick ground contact, arm drive matching leg drive. 2 sets of 20 yards.",
      },
      {
        id: "drill-2",
        type: "drill",
        title: "Wall Drives",
        content: "Hands on wall, body at 45 degrees. Drive one knee up while pushing through the planted foot. Hold for 2 seconds. 3 sets of 8 each leg.",
      },
      {
        id: "cta-1",
        type: "cta",
        title: "Stack These Drills",
        content: "Stack these drills 3x per week. In 4 weeks, you'll see the difference in their first step.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PROGRESS DOTS
// ─────────────────────────────────────────────────────────────

function ProgressDots({
  sections,
  activeIndex,
}: {
  sections: Section[];
  activeIndex: number | null;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {sections.map((section, i) => {
        const hasContent = section.content.length > 10;
        const isActive = activeIndex === i;
        const colors = SECTION_COLORS[section.type];

        return (
          <div
            key={section.id}
            className="rounded-full transition-all duration-200"
            style={{
              width: isActive ? "20px" : "10px",
              height: "10px",
              backgroundColor: isActive ? "#00F6E0" : hasContent ? colors.accent : "#333",
            }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION EDITOR
// ─────────────────────────────────────────────────────────────

function SectionEditor({
  section,
  onSave,
}: {
  section: Section;
  onSave: (content: string) => void;
}) {
  const [content, setContent] = useState(section.content);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors = SECTION_COLORS[section.type];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 10) {
            stopRecording();
            return 10;
          }
          return t + 1;
        });
      }, 1000);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording();
        }
      }, 10000);
    } catch {
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!groqKey) {
        alert("Voice not configured. Type instead.");
        return;
      }

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-large-v3-turbo");
      formData.append("response_format", "json");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      if (data.text) {
        setContent((prev) => prev + (prev ? " " : "") + data.text);
      }
    } catch {
      alert("Voice failed. Type instead.");
    }
  };

  return (
    <div
      className="bg-[#111] rounded-2xl p-5 border-2"
      style={{ borderColor: colors.accent }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: colors.accent + "30", color: colors.accent }}
        >
          {colors.label}
        </span>

        {/* Voice Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-[#222] active:scale-95"
          }`}
        >
          {isRecording ? <span className="text-white text-lg">{recordingTime}s</span> : "🎤"}
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 mb-4 text-red-400">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          Listening...
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-black rounded-xl p-4 text-white text-lg leading-relaxed resize-none border border-[#333] focus:border-[#00F6E0] focus:outline-none"
        style={{ minHeight: "200px" }}
        placeholder="Type or tap 🎤..."
      />

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onSave(content)}
          className="flex-1 py-4 text-lg font-bold rounded-xl bg-[#00F6E0] text-black active:scale-98"
        >
          Save
        </button>
        <button
          onClick={() => onSave(section.content)}
          className="px-6 py-4 text-gray-400 rounded-xl bg-[#222]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION VIEW
// ─────────────────────────────────────────────────────────────

function SectionView({
  section,
  onTap,
}: {
  section: Section;
  onTap: () => void;
}) {
  const colors = SECTION_COLORS[section.type];

  return (
    <div
      onClick={onTap}
      className="rounded-xl p-4 border-l-4 active:bg-[#111] transition-colors cursor-pointer"
      style={{ borderLeftColor: colors.accent }}
    >
      {section.title && (
        <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
      )}
      <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
        {section.content || <span className="text-gray-600 italic">Tap to add...</span>}
      </p>
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

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState("");

  // Load article
  useEffect(() => {
    setTimeout(() => {
      setArticle(MOCK_ARTICLES[slug] || null);
      setLoading(false);
    }, 100);
  }, [slug]);

  // Save section
  const handleSave = useCallback(
    (sectionId: string, content: string) => {
      if (!article) return;

      setArticle((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === sectionId ? { ...s, content } : s
              ),
            }
          : null
      );

      setActiveSection(null);
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    },
    [article]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00F6E0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <div className="text-5xl mb-4">📭</div>
        <h1 className="text-2xl font-bold mb-4">Not Found</h1>
        <button
          onClick={() => router.push("/admin/content-strategy")}
          className="text-[#00F6E0] text-lg"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-[#222]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/content-strategy")}
            className="text-gray-400 text-lg"
          >
            ← Back
          </button>
          <ProgressDots sections={article.sections} activeIndex={activeSection} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
          <p className="text-gray-500">{article.targetKeyword} • {article.pillar}</p>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {article.sections.map((section, i) => (
            <div key={section.id}>
              {activeSection === i ? (
                <SectionEditor
                  section={section}
                  onSave={(content) => handleSave(section.id, content)}
                />
              ) : (
                <SectionView section={section} onTap={() => setActiveSection(i)} />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-[#222]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-gray-500">
            {lastSaved ? (
              <>
                <span className="text-green-500">●</span> Saved {lastSaved}
              </>
            ) : (
              "Tap section to edit"
            )}
          </span>
          <span className="text-gray-600">{article.author}</span>
        </div>
      </footer>
    </div>
  );
}
