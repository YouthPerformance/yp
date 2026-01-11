/**
 * Article Editor Page
 *
 * Voice-enabled content editor for James & Adam.
 * Features:
 * - Voice dictation (Groq/Deepgram/Browser)
 * - Live preview
 * - Auto-save to Convex
 * - Mobile-optimized
 * - CONTINUOUS LEARNING: Tracks corrections to improve over time
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { InlineVoiceEditor } from "@/components/voice/VoiceEditorButton";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type SectionType = "intro" | "body" | "drill" | "faq" | "cta";

interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  lastEditedAt?: number;
}

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  onUpdate,
  groqApiKey,
}: {
  section: Section;
  onUpdate: (content: string) => void;
  groqApiKey?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionIcons: Record<string, string> = {
    intro: "📝",
    body: "📄",
    drill: "🏃",
    faq: "❓",
    cta: "🎯",
  };

  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-bg-tertiary/50 transition-colors"
      >
        <span className="text-xl">{sectionIcons[section.type]}</span>
        <div className="flex-1 text-left">
          <div className="font-semibold text-text-primary">{section.title}</div>
          <div className="text-xs text-text-tertiary capitalize">{section.type}</div>
        </div>
        <div
          className={`w-6 h-6 flex items-center justify-center transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-tertiary">
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {section.content && (
          <span className="w-2 h-2 bg-green-500 rounded-full" title="Has content" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0">
          <InlineVoiceEditor
            value={section.content}
            onChange={onUpdate}
            placeholder={`Speak or type ${section.title.toLowerCase()}...`}
            provider={groqApiKey ? "groq" : "browser"}
            groqApiKey={groqApiKey}
          />

          {/* Section-specific hints */}
          {section.type === "drill" && (
            <div className="mt-2 p-3 bg-accent-primary/10 rounded-lg text-xs text-text-secondary">
              <strong>Drill format:</strong> Include steps, coaching cues, duration, and reps.
            </div>
          )}
          {section.type === "faq" && (
            <div className="mt-2 p-3 bg-accent-primary/10 rounded-lg text-xs text-text-secondary">
              <strong>FAQ format:</strong> Question on first line, answer below.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="text-text-tertiary text-sm">Loading article...</div>
      </div>
    </div>
  );
}

function NotFoundState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">📄</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Article Not Found</h2>
        <p className="text-text-tertiary text-sm mb-4">
          This article doesn&apos;t exist or hasn&apos;t been created yet.
        </p>
        <button
          onClick={() => router.push("/admin/content-strategy")}
          className="px-4 py-2 bg-accent-primary text-black font-semibold rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [localSections, setLocalSections] = useState<Section[] | null>(null);

  // Get Groq API key from env or localStorage
  const groqApiKey =
    typeof window !== "undefined"
      ? localStorage.getItem("GROQ_API_KEY") || process.env.NEXT_PUBLIC_GROQ_API_KEY
      : undefined;

  // Convex queries
  const brief = useQuery(api.contentStrategy.getBrief, { slug });
  const draft = useQuery(
    api.contentStrategy.getDraftByBrief,
    brief ? { briefId: brief._id } : "skip",
  );

  // Convex mutations
  const getOrCreateDraft = useMutation(api.contentStrategy.getOrCreateDraft);
  const updateSection = useMutation(api.contentStrategy.updateSection);
  const updateBriefStatus = useMutation(api.contentStrategy.updateBriefStatus);

  // Initialize draft when brief loads
  useEffect(() => {
    if (brief && !draft) {
      getOrCreateDraft({ briefId: brief._id }).catch(console.error);
    }
  }, [brief, draft, getOrCreateDraft]);

  // Sync local sections with draft
  useEffect(() => {
    if (draft && !localSections) {
      setLocalSections(draft.sections);
    }
  }, [draft, localSections]);

  // Update section locally and debounce save
  const handleSectionUpdate = useCallback(
    (sectionId: string, content: string) => {
      if (!localSections) return;

      setLocalSections((prev) =>
        prev ? prev.map((s) => (s.id === sectionId ? { ...s, content } : s)) : null,
      );
    },
    [localSections],
  );

  // Save to Convex
  const handleSave = useCallback(async () => {
    if (!draft || !localSections) return;

    setIsSaving(true);
    try {
      // Save each changed section
      for (const section of localSections) {
        const originalSection = draft.sections.find((s) => s.id === section.id);
        if (originalSection && originalSection.content !== section.content) {
          await updateSection({
            draftId: draft._id,
            sectionId: section.id,
            content: section.content,
          });
        }
      }
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [draft, localSections, updateSection]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [handleSave]);

  // Handle status change
  const handleStatusChange = async (status: "in_progress" | "review" | "published") => {
    if (!brief) return;

    try {
      await updateBriefStatus({ briefId: brief._id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Loading states
  if (brief === undefined) {
    return <LoadingState />;
  }

  if (brief === null) {
    return <NotFoundState />;
  }

  // Use local sections or draft sections
  const sections = localSections || draft?.sections || [];
  const filledSections = sections.filter((s) => s.content.length > 0).length;
  const totalSections = sections.length;
  const progress = totalSections > 0 ? Math.round((filledSections / totalSections) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
        <div className="px-4 py-4">
          {/* Back + Status */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
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
              <span className="text-sm">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <select
                value={brief.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as "in_progress" | "review" | "published")
                }
                className="px-2 py-1 rounded-full text-xs bg-bg-secondary border border-border-default text-text-secondary"
              >
                <option value="planned">Planned</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 bg-accent-primary text-black text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold mb-1">{brief.title}</h1>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="text-accent-primary">{brief.targetKeyword}</span>
            <span>•</span>
            <span>{brief.pillar}</span>
            <span>•</span>
            <span className="uppercase">{brief.author === "james" ? "JS" : "AH"}</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-tertiary mb-1">
              <span>Progress</span>
              <span>
                {filledSections}/{totalSections} sections
              </span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="px-4 py-4 space-y-3">
        {/* Voice Provider Toggle */}
        <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl border border-border-default">
          <div className="text-sm text-text-secondary">Voice Provider</div>
          <div className="flex items-center gap-2 text-xs">
            {groqApiKey ? (
              <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">Groq (Fast)</span>
            ) : (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded">Browser (Free)</span>
            )}
          </div>
        </div>

        {/* Brief Outline (if available) */}
        {brief.outline && (
          <div className="p-4 bg-bg-secondary rounded-xl border border-border-default">
            <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
              Article Outline
            </div>
            <div className="text-sm text-text-secondary whitespace-pre-wrap">{brief.outline}</div>
          </div>
        )}

        {/* Key Takeaways (if available) */}
        {brief.keyTakeaways && brief.keyTakeaways.length > 0 && (
          <div className="p-4 bg-bg-secondary rounded-xl border border-border-default">
            <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
              Key Takeaways
            </div>
            <ul className="text-sm text-text-secondary space-y-1">
              {brief.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent-primary">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Cards */}
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onUpdate={(content) => handleSectionUpdate(section.id, content)}
            groqApiKey={groqApiKey}
          />
        ))}

        {/* Add Section Button */}
        <button className="w-full py-3 border border-dashed border-border-default rounded-xl text-text-tertiary hover:text-text-secondary hover:border-border-subtle transition-colors">
          + Add Section
        </button>
      </main>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-default px-4 py-3">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>{lastSaved ? `Last saved ${lastSaved}` : "Not saved yet"}</span>
          <div className="flex items-center gap-3">
            {draft && (
              <span>
                {draft.wordCount} words • {Math.ceil(draft.wordCount / 200)} min read
              </span>
            )}
            <button className="text-accent-primary font-medium">Preview Article</button>
          </div>
        </div>
      </div>
    </div>
  );
}
