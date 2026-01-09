// ═══════════════════════════════════════════════════════════
// CONTENT REVIEW DASHBOARD
// Review and approve AI-generated Playbook content with voice iteration
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "rgba(255, 193, 7, 0.2)", text: "#FFC107" },
  IN_REVIEW: { bg: "rgba(33, 150, 243, 0.2)", text: "#2196F3" },
  CHANGES_REQUESTED: { bg: "rgba(255, 152, 0, 0.2)", text: "#FF9800" },
  APPROVED: { bg: "rgba(0, 246, 224, 0.2)", text: "#00F6E0" },
  PUBLISHED: { bg: "rgba(76, 175, 80, 0.2)", text: "#4CAF50" },
};

// Author badge colors
const AUTHOR_COLORS: Record<string, { bg: string; text: string }> = {
  ADAM: { bg: "rgba(0, 246, 224, 0.2)", text: "#00F6E0" },
  JAMES: { bg: "rgba(156, 39, 176, 0.2)", text: "#9C27B0" },
  YP: { bg: "rgba(255, 255, 255, 0.2)", text: "#FFFFFF" },
  TEAM_YP: { bg: "rgba(255, 215, 0, 0.2)", text: "#FFD700" },
};

// Content type icons
const CONTENT_TYPE_ICONS: Record<string, string> = {
  pillar: "📖",
  topic: "📄",
  qa: "❓",
  drill: "🏋️",
};

type StatusFilter = "ALL" | "DRAFT" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "PUBLISHED";
type AuthorFilter = "ALL" | "ADAM" | "JAMES" | "TEAM_YP";
type ContentTypeFilter = "ALL" | "pillar" | "topic" | "qa" | "drill";

// Content type from Convex
interface PlaybookContent {
  _id: Id<"playbook_content">;
  slug: string;
  contentType: "pillar" | "topic" | "qa" | "drill";
  author: "JAMES" | "ADAM" | "YP" | "TEAM_YP";
  category: string;
  subcategory?: string;
  title: string;
  body: string;
  status: "DRAFT" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "PUBLISHED";
  version: number;
  createdAt: number;
  updatedAt: number;
  approvedAt?: number;
}

export default function ContentReviewPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>("ALL");
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>("ALL");

  // Fetch content with filters
  const content = useQuery(api.playbook.listContent, {
    author: authorFilter === "ALL" ? undefined : authorFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    contentType: contentTypeFilter === "ALL" ? undefined : contentTypeFilter,
    limit: 100,
  });

  // Fetch stats
  const stats = useQuery(api.playbook.getContentStats, {});

  // Delete mutation
  const deleteContent = useMutation(api.playbook.deleteContent);

  const handleDelete = async (contentId: Id<"playbook_content">) => {
    if (confirm("Are you sure you want to delete this content?")) {
      await deleteContent({ contentId });
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-bebas text-3xl tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            CONTENT REVIEW
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Review and approve AI-generated Playbook content
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} color="#FFFFFF" />
          <StatCard label="Draft" value={stats.draft} color="#FFC107" />
          <StatCard label="In Review" value={stats.inReview} color="#2196F3" />
          <StatCard label="Changes" value={stats.changesRequested} color="#FF9800" />
          <StatCard label="Approved" value={stats.approved} color="#00F6E0" />
          <StatCard label="Published" value={stats.published} color="#4CAF50" />
        </div>
      )}

      {/* Filters */}
      <div
        className="flex flex-wrap gap-4 p-4 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Status:
          </span>
          <div className="flex gap-1 flex-wrap">
            {(["ALL", "DRAFT", "IN_REVIEW", "CHANGES_REQUESTED", "APPROVED", "PUBLISHED"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor:
                      statusFilter === status ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    color: statusFilter === status ? "var(--bg-primary)" : "var(--text-secondary)",
                  }}
                >
                  {status.replace("_", " ")}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Author Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Author:
          </span>
          <div className="flex gap-1">
            {(["ALL", "TEAM_YP", "ADAM", "JAMES"] as const).map((author) => (
              <button
                key={author}
                onClick={() => setAuthorFilter(author)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor:
                    authorFilter === author ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: authorFilter === author ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                {author === "TEAM_YP" ? "Team YP" : author}
              </button>
            ))}
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Type:
          </span>
          <div className="flex gap-1">
            {(["ALL", "pillar", "topic", "qa", "drill"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setContentTypeFilter(type)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor:
                    contentTypeFilter === type ? "var(--accent-primary)" : "var(--bg-tertiary)",
                  color: contentTypeFilter === type ? "var(--bg-primary)" : "var(--text-secondary)",
                }}
              >
                {type === "ALL" ? "ALL" : `${CONTENT_TYPE_ICONS[type]} ${type.toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {content === undefined ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-8 h-8">
                <div
                  className="absolute inset-0 border-2 rounded-full"
                  style={{ borderColor: "var(--accent-primary)", opacity: 0.2 }}
                />
                <div
                  className="absolute inset-0 border-2 border-transparent rounded-full animate-spin"
                  style={{ borderTopColor: "var(--accent-primary)" }}
                />
              </div>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Loading content...
              </span>
            </div>
          </div>
        ) : content.length === 0 ? (
          // Empty state
          <div
            className="flex flex-col items-center justify-center py-12 rounded-xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="text-4xl mb-4">📭</span>
            <p
              className="font-bebas text-xl tracking-wider mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              NO CONTENT YET
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              AI-generated content will appear here for review
            </p>
          </div>
        ) : (
          // Content cards
          content.map((item: PlaybookContent, index: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContentCard
                content={item}
                onDelete={() => handleDelete(item._id)}
                formatDate={formatDate}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      <p className="text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      <p className="text-2xl font-mono font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ContentCard({
  content,
  onDelete,
  formatDate,
}: {
  content: PlaybookContent;
  onDelete: () => void;
  formatDate: (ts: number) => string;
}) {
  const statusColors = STATUS_COLORS[content.status];
  const authorColors = AUTHOR_COLORS[content.author];
  const typeIcon = CONTENT_TYPE_ICONS[content.contentType];

  return (
    <div
      className="p-4 rounded-xl transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* Content Type Icon */}
            <span className="text-lg">{typeIcon}</span>
            {/* Author Badge */}
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: authorColors.bg,
                color: authorColors.text,
              }}
            >
              {content.author === "TEAM_YP" ? "Team YP" : content.author}
            </span>
            {/* Status Badge */}
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
              }}
            >
              {content.status.replace("_", " ")}
            </span>
            {/* Category Badge */}
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {content.category}
            </span>
            {/* Version */}
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              v{content.version}
            </span>
            {/* Date */}
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {formatDate(content.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bebas text-lg tracking-wider mb-1 truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {content.title}
          </h3>

          {/* Body preview */}
          <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {content.body.substring(0, 200)}...
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/content-review/${content._id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-primary)",
            }}
          >
            Review
          </Link>
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
