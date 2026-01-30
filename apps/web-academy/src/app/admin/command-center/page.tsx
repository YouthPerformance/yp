// ═══════════════════════════════════════════════════════════
// VOICE COMMAND CENTER
// Eight Sleep-inspired design: minimal, dark, data-focused
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import { Doc } from "@yp/alpha/convex/_generated/dataModel";
import { AnimatePresence, motion } from "framer-motion";
import { ScoreGauge } from "@/components/admin/ScoreGauge";
import { ContentCard } from "@/components/admin/ContentCard";
import { ReaderPanel } from "@/components/admin/ReaderPanel";
import { MobileCardStack } from "@/components/admin/MobileCardStack";

type TierFilter = "all" | "green" | "yellow" | "red";
type ViewMode = "grid" | "list";

export default function CommandCenterPage() {
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedContent, setSelectedContent] = useState<Doc<"playbook_content"> | null>(null);
  const [expert] = useState<"JAMES" | "ADAM">("JAMES");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch content for review
  const reviewData = useQuery(api.playbook.listContentForReview, {
    approvalTier: tierFilter === "all" ? undefined : tierFilter,
    limit: 24,
  });
  const contents = reviewData?.content;

  // Fetch review stats
  const stats = useQuery(api.playbook.getReviewStats);

  // Mutations
  const updateContent = useMutation(api.playbook.updatePlaybookContent);

  // Paginate to 8 cards for display
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const displayedContents = useMemo(() => {
    if (!contents) return [];
    return contents.slice(page * pageSize, (page + 1) * pageSize);
  }, [contents, page]);

  const totalPages = contents ? Math.ceil(contents.length / pageSize) : 0;

  // Calculate average score
  const avgScore = useMemo(() => {
    if (!contents || contents.length === 0) return 0;
    const scores = contents
      .map(c => c.voiceComplianceScore)
      .filter((s): s is number => s !== undefined);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [contents]);

  // Handle approve
  const handleApprove = async (content: Doc<"playbook_content">) => {
    await updateContent({
      id: content._id,
      status: "published",
      approvalTier: "green",
    });
    setSelectedContent(null);
  };

  // Handle reject
  const handleReject = async (content: Doc<"playbook_content">) => {
    await updateContent({
      id: content._id,
      status: "rejected",
    });
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-lg font-medium">Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{expert}</span>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Score Overview */}
        <section className="flex flex-col items-center py-8">
          <ScoreGauge
            score={avgScore}
            label="VOICE COMPLIANCE SCORE"
            sublabel="Queue Average"
          />

          {/* Score breakdown */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-light text-white">
                {stats?.byTier.green || 0}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Green</div>
            </div>
            <div className="w-px h-8 bg-[#1a1a1a]" />
            <div className="text-center">
              <div className="text-2xl font-light text-white">
                {stats?.byTier.yellow || 0}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Yellow</div>
            </div>
            <div className="w-px h-8 bg-[#1a1a1a]" />
            <div className="text-center">
              <div className="text-2xl font-light text-white">
                {stats?.byTier.red || 0}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Red</div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="flex justify-center">
          <div className="inline-flex items-center bg-[#0a0a0a] rounded-full p-1 border border-[#1a1a1a]">
            {(["all", "green", "yellow", "red"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  setTierFilter(tier);
                  setPage(0);
                }}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  tierFilter === tier
                    ? "bg-[#1a1a1a] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tier === "all" ? "All" : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Stats Row */}
        <section className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">PENDING REVIEW</div>
              <div className="text-2xl font-light">{stats?.pending || 0}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">APPROVED TODAY</div>
              <div className="text-2xl font-light">{stats?.today || 0}</div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        {!contents ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] animate-pulse"
              />
            ))}
          </section>
        ) : contents.length === 0 ? (
          <section className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-white mb-1">Queue is clear</h2>
            <p className="text-sm text-zinc-500">No content matching the filter</p>
          </section>
        ) : isMobile ? (
          <MobileCardStack
            contents={contents}
            onApprove={handleApprove}
            onReject={handleReject}
            onOpen={setSelectedContent}
          />
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedContents.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <section className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-6 py-3 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-sm font-medium text-zinc-400 hover:text-white hover:border-[#2a2a2a] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-500">
                  {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-6 py-3 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-sm font-medium text-zinc-400 hover:text-white hover:border-[#2a2a2a] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </section>
            )}
          </>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
          <button className="flex-1 max-w-[160px] py-3 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-sm font-medium text-zinc-400 hover:text-white hover:border-[#2a2a2a] transition-all">
            Settings
          </button>
          <button className="flex-1 max-w-[160px] py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all">
            Start Review
          </button>
        </div>
      </div>

      {/* Reader Panel */}
      <AnimatePresence>
        {selectedContent && (
          <ReaderPanel
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
            onApprove={() => handleApprove(selectedContent)}
            onReject={() => handleReject(selectedContent)}
            expert={expert}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
