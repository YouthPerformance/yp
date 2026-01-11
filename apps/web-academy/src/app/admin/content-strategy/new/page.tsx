/**
 * New Article Brief Page
 *
 * Create a new article brief for James or Adam.
 * Mobile-optimized form with voice-friendly input.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Author = "james" | "adam";
type ContentType = "pillar" | "cluster" | "support";

interface FormData {
  title: string;
  slug: string;
  targetKeyword: string;
  targetVolume: number;
  pillar: string;
  contentType: ContentType;
  author: Author;
  outline: string;
}

// ─────────────────────────────────────────────────────────────
// CONTENT TYPE INFO
// ─────────────────────────────────────────────────────────────

const CONTENT_TYPES: Record<ContentType, { label: string; words: string; desc: string }> = {
  pillar: {
    label: "Pillar",
    words: "2,500-4,000",
    desc: "Comprehensive guide covering the main topic",
  },
  cluster: {
    label: "Cluster",
    words: "1,200-2,000",
    desc: "Deep dive into a specific subtopic",
  },
  support: {
    label: "Support",
    words: "800-1,200",
    desc: "Quick guide or FAQ-style content",
  },
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    targetKeyword: "",
    targetVolume: 1000,
    pillar: "",
    contentType: "cluster",
    author: "james",
    outline: "",
  });

  // Get pillars for dropdown
  const pillars = useQuery(api.contentStrategy.listPillars);

  // Create brief mutation
  const createBrief = useMutation(api.contentStrategy.createBrief);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetKeyword || !formData.pillar) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBrief({
        title: formData.title,
        slug: formData.slug,
        targetKeyword: formData.targetKeyword,
        targetVolume: formData.targetVolume,
        pillar: formData.pillar,
        contentType: formData.contentType,
        author: formData.author,
        outline: formData.outline || undefined,
      });

      // Navigate to the new article editor
      router.push(`/admin/content-strategy/${formData.slug}`);
    } catch (error) {
      console.error("Failed to create article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
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
              <span className="text-sm">Cancel</span>
            </button>
            <h1 className="text-lg font-bold">New Article</h1>
            <div className="w-16" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Article Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Speed Training for Youth Athletes"
            className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            required
          />
          {formData.slug && (
            <div className="mt-2 text-xs text-text-tertiary">
              URL: /playbook/{formData.slug}
            </div>
          )}
        </div>

        {/* Target Keyword */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Target Keyword *
          </label>
          <input
            type="text"
            value={formData.targetKeyword}
            onChange={(e) => setFormData((prev) => ({ ...prev, targetKeyword: e.target.value }))}
            placeholder="e.g., youth speed training"
            className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            required
          />
        </div>

        {/* Search Volume */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Monthly Search Volume
          </label>
          <input
            type="number"
            value={formData.targetVolume}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, targetVolume: parseInt(e.target.value) || 0 }))
            }
            placeholder="1000"
            className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Pillar Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Content Pillar *
          </label>
          <select
            value={formData.pillar}
            onChange={(e) => setFormData((prev) => ({ ...prev, pillar: e.target.value }))}
            className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-accent-primary"
            required
          >
            <option value="">Select a pillar...</option>
            {pillars?.map((pillar) => (
              <option key={pillar._id} value={pillar.name}>
                {pillar.name}
              </option>
            ))}
            <option value="General">General</option>
          </select>
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Content Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(CONTENT_TYPES) as ContentType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, contentType: type }))}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  formData.contentType === type
                    ? "border-accent-primary bg-accent-primary/10"
                    : "border-border-default bg-bg-secondary"
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    formData.contentType === type ? "text-accent-primary" : "text-text-primary"
                  }`}
                >
                  {CONTENT_TYPES[type].label}
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  {CONTENT_TYPES[type].words} words
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Author Assignment */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Assign to Author
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, author: "james" }))}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                formData.author === "james"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-border-default bg-bg-secondary"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  formData.author === "james"
                    ? "bg-cyan-500/20 text-cyan-500"
                    : "bg-bg-tertiary text-text-secondary"
                }`}
              >
                JS
              </span>
              <span
                className={formData.author === "james" ? "text-cyan-500" : "text-text-secondary"}
              >
                James
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, author: "adam" }))}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                formData.author === "adam"
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-border-default bg-bg-secondary"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  formData.author === "adam"
                    ? "bg-orange-500/20 text-orange-500"
                    : "bg-bg-tertiary text-text-secondary"
                }`}
              >
                AH
              </span>
              <span
                className={formData.author === "adam" ? "text-orange-500" : "text-text-secondary"}
              >
                Adam
              </span>
            </button>
          </div>
        </div>

        {/* Outline (Optional) */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Article Outline (Optional)
          </label>
          <textarea
            value={formData.outline}
            onChange={(e) => setFormData((prev) => ({ ...prev, outline: e.target.value }))}
            placeholder="Add a brief outline or key points to cover..."
            rows={4}
            className="w-full px-4 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.targetKeyword || !formData.pillar}
          className="w-full py-4 bg-accent-primary text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Article & Start Writing"}
        </button>
      </form>
    </div>
  );
}
