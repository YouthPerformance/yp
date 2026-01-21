// ═══════════════════════════════════════════════════════════
// QUICK REVIEW PAGE
// Voice-first rapid content review for James & Adam
// Features: Voice commands, swipe approval, quick templates
// ═══════════════════════════════════════════════════════════

"use client";

import { QuickReviewQueue } from "@/components/admin/QuickReviewQueue";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type AuthorFilter = "ALL" | "JAMES" | "ADAM";

export default function QuickReviewPage() {
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>("ALL");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-6 py-4"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/content-review"
              className="text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              ← Full Dashboard
            </Link>
            <h1
              className="font-bebas text-2xl tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              QUICK REVIEW
            </h1>
          </div>

          {/* Author Filter */}
          <div className="flex items-center gap-2">
            {(["ALL", "JAMES", "ADAM"] as const).map((author) => (
              <motion.button
                key={author}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthorFilter(author)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    authorFilter === author
                      ? author === "ADAM"
                        ? "rgba(0, 246, 224, 0.2)"
                        : author === "JAMES"
                          ? "rgba(156, 39, 176, 0.2)"
                          : "var(--accent-primary)"
                      : "var(--bg-tertiary)",
                  color:
                    authorFilter === author
                      ? author === "ADAM"
                        ? "#00F6E0"
                        : author === "JAMES"
                          ? "#9C27B0"
                          : "var(--bg-primary)"
                      : "var(--text-secondary)",
                }}
              >
                {author === "ALL" ? "All Authors" : author}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <QuickReviewQueue
          author={authorFilter === "ALL" ? undefined : authorFilter}
        />
      </div>

      {/* Help Overlay */}
      <div
        className="fixed bottom-6 right-6 p-4 rounded-xl max-w-xs"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <h3
          className="font-bebas text-lg tracking-wider mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          VOICE COMMANDS
        </h3>
        <ul className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          <li>🎤 &quot;Approve&quot; - Approve current content</li>
          <li>🎤 &quot;Needs work&quot; - Request changes</li>
          <li>🎤 &quot;Next&quot; - Skip to next item</li>
          <li>🎤 Or just speak your feedback</li>
        </ul>
      </div>
    </div>
  );
}
