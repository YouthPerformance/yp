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
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Section {
  id: string;
  type: string;
  title: string;
  content: string;
}

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

  const sectionTypeStyles: Record<string, string> = {
    intro: "border-l-blue-500",
    body: "border-l-purple-500",
    drill: "border-l-green-500",
    faq: "border-l-yellow-500",
    cta: "border-l-red-500",
  };

  // Reading mode
  if (!isActive) {
    return (
      <div
        onClick={onActivate}
        className={`group cursor-pointer py-6 px-4 -mx-4 rounded-lg transition-all hover:bg-bg-secondary/50 border-l-4 border-transparent hover:${sectionTypeStyles[section.type] || "border-l-accent-primary"}`}
      >
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs uppercase tracking-wider text-text-tertiary font-medium">
            {section.type}
          </span>
          <span className="text-xs text-text-muted">• tap to edit</span>
        </div>

        {/* Section title */}
        {section.title && section.type !== "body" && (
          <h2
            className="font-bold text-text-primary mb-3"
            style={{ fontSize: settings.heading }}
          >
            {section.title}
          </h2>
        )}

        {/* Content */}
        <div
          className="text-text-secondary whitespace-pre-wrap"
          style={{
            fontSize: settings.body,
            lineHeight: settings.lineHeight,
          }}
        >
          {section.content || (
            <span className="text-text-muted italic">
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
      className={`py-6 px-4 -mx-4 rounded-lg bg-bg-secondary border-l-4 ${sectionTypeStyles[section.type] || "border-l-accent-primary"}`}
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-accent-primary font-medium">
          Editing: {section.type}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={isRecording}
            className={`p-2 rounded-full transition-all ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-bg-tertiary text-text-secondary hover:bg-accent-primary hover:text-black"
            }`}
            title="Voice input"
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
          className="font-bold text-text-primary mb-3"
          style={{ fontSize: settings.heading }}
        >
          {section.title}
        </h2>
      )}

      {/* Editable textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-transparent text-text-primary resize-none focus:outline-none"
        style={{
          fontSize: settings.body,
          lineHeight: settings.lineHeight,
          minHeight: "100px",
        }}
        placeholder="Start typing or use voice..."
      />

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-accent-primary text-black font-semibold rounded-xl"
        >
          Save Section
        </button>
        <button
          onClick={() => {
            setContent(section.content);
            onSave(section.content); // Close without changing
          }}
          className="px-4 py-3 text-text-tertiary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          Listening... speak now
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
    <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-1">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            size === s
              ? "bg-bg-primary text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
          title={`${s} font`}
        >
          {s === "small" ? "A" : s === "medium" ? "A" : s === "large" ? "A" : "A"}
          <span
            className={
              s === "small"
                ? "text-[10px]"
                : s === "medium"
                  ? "text-[12px]"
                  : s === "large"
                    ? "text-[14px]"
                    : "text-[16px]"
            }
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
            className={`w-2 h-2 rounded-full transition-all ${
              isActive
                ? "w-4 bg-accent-primary"
                : hasContent
                  ? "bg-green-500"
                  : "bg-bg-tertiary"
            }`}
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Convex queries
  const brief = useQuery(api.contentStrategy.getBrief, { slug });
  const draft = useQuery(
    api.contentStrategy.getDraftByBrief,
    brief ? { briefId: brief._id } : "skip",
  );

  // Convex mutations
  const getOrCreateDraft = useMutation(api.contentStrategy.getOrCreateDraft);
  const updateSection = useMutation(api.contentStrategy.updateSection);

  // Initialize draft
  useEffect(() => {
    if (brief && !draft) {
      getOrCreateDraft({ briefId: brief._id });
    }
  }, [brief, draft, getOrCreateDraft]);

  // Load font preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("article-font-size") as FontSize;
    if (saved && FONT_SIZES[saved]) {
      setFontSize(saved);
    }
  }, []);

  // Save font preference
  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("article-font-size", size);
  };

  // Save section
  const handleSaveSection = useCallback(
    async (sectionId: string, content: string) => {
      if (!draft) return;

      setIsSaving(true);
      try {
        await updateSection({
          draftId: draft._id,
          sectionId,
          content,
        });
        setLastSaved(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Failed to save:", error);
      } finally {
        setIsSaving(false);
        setActiveSection(null);
      }
    },
    [draft, updateSection],
  );

  // Jump to section
  const handleJumpToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Loading
  if (brief === undefined || (brief && draft === undefined)) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (!brief) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Not Found</h2>
          <button
            onClick={() => router.push("/admin/content-strategy")}
            className="text-accent-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sections = draft?.sections || [];
  const wordCount = sections.reduce(
    (sum, s) => sum + (s.content?.split(/\s+/).filter(Boolean).length || 0),
    0,
  );
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/admin/content-strategy")}
              className="flex items-center gap-2 text-text-tertiary hover:text-text-primary"
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
        <div className="mb-8 pb-8 border-b border-border-subtle">
          <h1
            className="font-bold text-text-primary mb-3"
            style={{ fontSize: FONT_SIZES[fontSize].heading }}
          >
            {brief.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-tertiary">
            <span className="text-accent-primary">{brief.targetKeyword}</span>
            <span>•</span>
            <span>{brief.pillar}</span>
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-bg-secondary border border-border-default rounded-full px-4 py-2 shadow-lg flex items-center gap-3 text-sm">
        {isSaving ? (
          <>
            <div className="w-3 h-3 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-text-tertiary">Saving...</span>
          </>
        ) : lastSaved ? (
          <>
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-text-tertiary">Saved {lastSaved}</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-bg-tertiary rounded-full" />
            <span className="text-text-tertiary">Tap any section to edit</span>
          </>
        )}
      </div>
    </div>
  );
}
