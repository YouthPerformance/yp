// ═══════════════════════════════════════════════════════════
// CONTENT STRATEGY DASHBOARD
// SEO metrics, keyword tracking, and content planning
// Mobile-optimized for James & Adam
// Wired to Convex for live data
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type KeywordTrend = "up" | "down" | "stable";
type BriefStatus = "planned" | "assigned" | "in_progress" | "review" | "published";
type Author = "james" | "adam";

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  subtext,
  trend,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: KeywordTrend;
}) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 border border-border-default">
      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {trend && (
          <span
            className={`text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-text-tertiary"}`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtext && <div className="text-text-tertiary text-xs mt-1">{subtext}</div>}
    </div>
  );
}

function PillarCard({
  pillar,
}: {
  pillar: {
    _id: Id<"content_pillars">;
    name: string;
    color: string;
    articleCount: number;
    avgPosition: number | null;
    primaryKeyword: string;
  };
}) {
  const hasContent = pillar.articleCount > 0;
  return (
    <div
      className={`rounded-xl p-4 border ${hasContent ? "border-border-default bg-bg-secondary" : "border-dashed border-border-subtle bg-bg-tertiary/50"}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
        <div className="font-semibold text-text-primary">{pillar.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-text-tertiary">Articles</div>
          <div className={hasContent ? "text-text-primary" : "text-text-muted"}>
            {pillar.articleCount}
          </div>
        </div>
        <div>
          <div className="text-text-tertiary">Avg Pos</div>
          <div className={hasContent ? "text-text-primary" : "text-text-muted"}>
            {pillar.avgPosition ? pillar.avgPosition.toFixed(1) : "—"}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-text-tertiary">Target</div>
          <div className="text-accent-primary text-xs truncate">{pillar.primaryKeyword}</div>
        </div>
      </div>
      {!hasContent && (
        <button className="mt-3 w-full py-1.5 bg-accent-primary/10 text-accent-primary text-sm rounded-lg hover:bg-accent-primary/20 transition-colors">
          + Create Pillar
        </button>
      )}
    </div>
  );
}

function KeywordRow({
  kw,
}: {
  kw: {
    _id: Id<"seo_keywords">;
    keyword: string;
    pillar: string;
    volume: number;
    difficulty: number;
    position?: number | null;
    trend: KeywordTrend;
  };
}) {
  const positionColor = kw.position
    ? kw.position <= 3
      ? "text-green-500"
      : kw.position <= 10
        ? "text-yellow-500"
        : "text-text-secondary"
    : "text-text-muted";
  const difficultyColor =
    kw.difficulty <= 20
      ? "text-green-500"
      : kw.difficulty <= 40
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{kw.keyword}</div>
        <div className="text-xs text-text-tertiary">{kw.pillar}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-text-secondary">{(kw.volume / 1000).toFixed(1)}K</div>
        <div className="text-xs text-text-tertiary">vol</div>
      </div>
      <div className="text-right w-12">
        <div className={`text-sm ${difficultyColor}`}>{kw.difficulty}</div>
        <div className="text-xs text-text-tertiary">KD</div>
      </div>
      <div className="text-right w-12">
        <div className={`text-sm font-semibold ${positionColor}`}>{kw.position || "—"}</div>
        <div className="text-xs text-text-tertiary">pos</div>
      </div>
      <div className="w-6">
        <span
          className={`text-lg ${kw.trend === "up" ? "text-green-500" : kw.trend === "down" ? "text-red-500" : "text-text-tertiary"}`}
        >
          {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
        </span>
      </div>
    </div>
  );
}

function ContentRow({
  content,
}: {
  content: {
    _id: Id<"article_briefs">;
    title: string;
    slug: string;
    status: BriefStatus;
    pillar: string;
    targetKeyword: string;
    targetVolume: number;
    author: Author;
  };
}) {
  const statusStyles: Record<BriefStatus, string> = {
    published: "bg-green-500/20 text-green-500",
    in_progress: "bg-yellow-500/20 text-yellow-500",
    review: "bg-purple-500/20 text-purple-500",
    assigned: "bg-blue-500/20 text-blue-500",
    planned: "bg-gray-500/20 text-gray-400",
  };

  return (
    <Link
      href={`/admin/content-strategy/${content.slug}`}
      className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-tertiary/50 -mx-4 px-4 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{content.title}</div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span>{content.pillar}</span>
          <span>•</span>
          <span className="text-accent-primary">{content.targetKeyword}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-text-secondary">
          {(content.targetVolume / 1000).toFixed(1)}K
        </div>
      </div>
      <div className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[content.status]}`}>
        {content.status.replace("_", " ")}
      </div>
      <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-semibold text-text-secondary uppercase">
        {content.author === "james" ? "JS" : "AH"}
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <div className="text-text-tertiary text-sm">Loading content strategy...</div>
      </div>
    </div>
  );
}

function EmptyState({
  onSeedData,
  isSeeding,
}: {
  onSeedData: () => void;
  isSeeding: boolean;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">No Content Strategy Data</h2>
        <p className="text-text-tertiary text-sm mb-4">
          Get started by importing keywords from Ahrefs or seed with example data.
        </p>
        <button
          onClick={onSeedData}
          disabled={isSeeding}
          className="px-4 py-2 bg-accent-primary text-black font-semibold rounded-lg disabled:opacity-50"
        >
          {isSeeding ? "Seeding..." : "Seed Example Data"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ContentStrategyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "content">("overview");
  const [authorFilter, setAuthorFilter] = useState<Author | "all">("all");
  const [isSeeding, setIsSeeding] = useState(false);

  // Convex queries
  const stats = useQuery(api.contentStrategy.getDashboardStats);
  const keywords = useQuery(api.contentStrategy.listKeywords, {});
  const briefs = useQuery(api.contentStrategy.listBriefs, {
    author: authorFilter === "all" ? undefined : authorFilter,
  });
  const pillars = useQuery(api.contentStrategy.listPillars);

  // Mutations
  const createPillar = useMutation(api.contentStrategy.createPillar);
  const addKeyword = useMutation(api.contentStrategy.addKeyword);
  const createBrief = useMutation(api.contentStrategy.createBrief);

  // Seed example data
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      // Create pillars
      const pillarData = [
        {
          name: "Barefoot Training",
          slug: "barefoot-training",
          color: "#00F6E0",
          primaryKeyword: "barefoot training",
          primaryKeywordVolume: 8400,
        },
        {
          name: "Speed Training",
          slug: "speed-training",
          color: "#8B5CF6",
          primaryKeyword: "youth speed training",
          primaryKeywordVolume: 8100,
        },
        {
          name: "Agility Training",
          slug: "agility-training",
          color: "#10B981",
          primaryKeyword: "agility drills for kids",
          primaryKeywordVolume: 4800,
        },
        {
          name: "Strength Training",
          slug: "strength-training",
          color: "#EF4444",
          primaryKeyword: "youth strength training",
          primaryKeywordVolume: 12100,
        },
        {
          name: "Basketball",
          slug: "basketball",
          color: "#F59E0B",
          primaryKeyword: "youth basketball drills",
          primaryKeywordVolume: 12100,
        },
      ];

      for (const pillar of pillarData) {
        await createPillar(pillar);
      }

      // Create keywords
      const keywordData = [
        {
          keyword: "barefoot training",
          pillar: "Barefoot Training",
          volume: 8400,
          difficulty: 32,
          priority: "high" as const,
        },
        {
          keyword: "bulletproof ankles",
          pillar: "Barefoot Training",
          volume: 200,
          difficulty: 8,
          position: 3,
          priority: "high" as const,
        },
        {
          keyword: "youth speed training",
          pillar: "Speed Training",
          volume: 8100,
          difficulty: 38,
          priority: "high" as const,
        },
        {
          keyword: "first step quickness",
          pillar: "Speed Training",
          volume: 2100,
          difficulty: 18,
          priority: "medium" as const,
        },
        {
          keyword: "agility drills for kids",
          pillar: "Agility Training",
          volume: 4800,
          difficulty: 28,
          priority: "high" as const,
        },
        {
          keyword: "youth strength training",
          pillar: "Strength Training",
          volume: 12100,
          difficulty: 52,
          priority: "high" as const,
        },
        {
          keyword: "landing mechanics youth",
          pillar: "Strength Training",
          volume: 800,
          difficulty: 12,
          priority: "medium" as const,
        },
        {
          keyword: "youth basketball drills",
          pillar: "Basketball",
          volume: 12100,
          difficulty: 45,
          position: 8,
          priority: "high" as const,
        },
      ];

      for (const kw of keywordData) {
        await addKeyword(kw);
      }

      // Create article briefs
      const briefData = [
        {
          title: "Speed Training for Youth Athletes",
          slug: "speed-training",
          targetKeyword: "youth speed training",
          targetVolume: 8100,
          pillar: "Speed Training",
          contentType: "pillar" as const,
          author: "james" as const,
        },
        {
          title: "First Step Quickness Protocol",
          slug: "first-step-quickness",
          targetKeyword: "first step quickness",
          targetVolume: 2100,
          pillar: "Speed Training",
          contentType: "cluster" as const,
          author: "james" as const,
        },
        {
          title: "Agility Training Guide",
          slug: "agility-training",
          targetKeyword: "agility drills for kids",
          targetVolume: 4800,
          pillar: "Agility Training",
          contentType: "pillar" as const,
          author: "james" as const,
        },
        {
          title: "Youth Strength Training Guide",
          slug: "strength-training",
          targetKeyword: "youth strength training",
          targetVolume: 12100,
          pillar: "Strength Training",
          contentType: "pillar" as const,
          author: "james" as const,
        },
        {
          title: "Landing Mechanics Protocol",
          slug: "landing-mechanics",
          targetKeyword: "landing mechanics youth",
          targetVolume: 800,
          pillar: "Strength Training",
          contentType: "cluster" as const,
          author: "adam" as const,
        },
      ];

      for (const brief of briefData) {
        await createBrief(brief);
      }
    } catch (error) {
      console.error("Failed to seed data:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  // Loading state
  if (stats === undefined || keywords === undefined || briefs === undefined) {
    return <LoadingState />;
  }

  // Empty state
  const isEmpty = stats.keywords.total === 0 && stats.content.total === 0;
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Content Strategy</h1>
            <p className="text-sm text-text-tertiary">SEO Performance & Planning</p>
          </div>
        </header>
        <EmptyState onSeedData={handleSeedData} isSeeding={isSeeding} />
      </div>
    );
  }

  // Group briefs by status
  const publishedBriefs = briefs.filter((b) => b.status === "published");
  const plannedBriefs = briefs.filter((b) => b.status === "planned" || b.status === "assigned");
  const inProgressBriefs = briefs.filter(
    (b) => b.status === "in_progress" || b.status === "review",
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Content Strategy</h1>
              <p className="text-sm text-text-tertiary">SEO Performance & Planning</p>
            </div>
            <Link
              href="/admin/content-strategy/new"
              className="px-3 py-1.5 bg-accent-primary text-black text-sm font-semibold rounded-lg"
            >
              + New Article
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
            {(["overview", "keywords", "content"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-bg-primary text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Keywords Tracked"
                value={stats.keywords.total}
                subtext={`${stats.keywords.ranking} ranking`}
              />
              <MetricCard
                label="Total Volume"
                value={`${(stats.keywords.totalVolume / 1000).toFixed(0)}K`}
                subtext="monthly searches"
              />
              <MetricCard
                label="Published"
                value={stats.content.published}
                subtext="articles live"
                trend="up"
              />
              <MetricCard
                label="In Pipeline"
                value={stats.content.planned + stats.content.inProgress}
                subtext="articles planned"
              />
            </div>

            {/* Pillars */}
            {pillars && pillars.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Content Pillars</h2>
                <div className="grid grid-cols-1 gap-3">
                  {stats.pillars.map((pillar) => (
                    <PillarCard key={pillar._id} pillar={pillar} />
                  ))}
                </div>
              </div>
            )}

            {/* Top Keywords */}
            {keywords.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Top Keywords</h2>
                <div className="bg-bg-secondary rounded-xl border border-border-default">
                  <div className="px-4 py-2 border-b border-border-subtle flex items-center gap-3 text-xs text-text-tertiary uppercase">
                    <div className="flex-1">Keyword</div>
                    <div className="w-12 text-right">Vol</div>
                    <div className="w-12 text-right">KD</div>
                    <div className="w-12 text-right">Pos</div>
                    <div className="w-6"></div>
                  </div>
                  <div className="px-4">
                    {keywords.slice(0, 5).map((kw) => (
                      <KeywordRow key={kw._id} kw={kw} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button className="px-3 py-1.5 bg-accent-primary/20 text-accent-primary text-sm rounded-full whitespace-nowrap">
                All ({keywords.length})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Ranking ({stats.keywords.ranking})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Not Ranking ({keywords.length - stats.keywords.ranking})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Opportunities ({stats.keywords.opportunities})
              </button>
            </div>

            {/* Keywords List */}
            <div className="bg-bg-secondary rounded-xl border border-border-default">
              <div className="px-4 py-2 border-b border-border-subtle flex items-center gap-3 text-xs text-text-tertiary uppercase">
                <div className="flex-1">Keyword</div>
                <div className="w-12 text-right">Vol</div>
                <div className="w-12 text-right">KD</div>
                <div className="w-12 text-right">Pos</div>
                <div className="w-6"></div>
              </div>
              <div className="px-4">
                {keywords.map((kw) => (
                  <KeywordRow key={kw._id} kw={kw} />
                ))}
              </div>
            </div>

            {/* Add Keyword */}
            <button className="w-full py-3 border border-dashed border-border-default rounded-xl text-text-tertiary hover:text-text-secondary hover:border-border-subtle transition-colors">
              + Add Keyword to Track
            </button>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-4">
            {/* Author Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setAuthorFilter("all")}
                className={`flex-1 py-2 text-sm rounded-lg ${
                  authorFilter === "all"
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "bg-bg-secondary text-text-secondary"
                }`}
              >
                All Authors
              </button>
              <button
                onClick={() => setAuthorFilter("james")}
                className={`flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-2 ${
                  authorFilter === "james"
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "bg-bg-secondary text-text-secondary"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xs font-bold">
                  JS
                </span>
                James
              </button>
              <button
                onClick={() => setAuthorFilter("adam")}
                className={`flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-2 ${
                  authorFilter === "adam"
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "bg-bg-secondary text-text-secondary"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">
                  AH
                </span>
                Adam
              </button>
            </div>

            {/* In Progress */}
            {inProgressBriefs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  In Progress ({inProgressBriefs.length})
                </h3>
                <div className="bg-bg-secondary rounded-xl border border-border-default px-4">
                  {inProgressBriefs.map((content) => (
                    <ContentRow key={content._id} content={content} />
                  ))}
                </div>
              </div>
            )}

            {/* Published */}
            {publishedBriefs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  Published ({publishedBriefs.length})
                </h3>
                <div className="bg-bg-secondary rounded-xl border border-border-default px-4">
                  {publishedBriefs.map((content) => (
                    <ContentRow key={content._id} content={content} />
                  ))}
                </div>
              </div>
            )}

            {/* Planned */}
            {plannedBriefs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  Planned ({plannedBriefs.length})
                </h3>
                <div className="bg-bg-secondary rounded-xl border border-border-default px-4">
                  {plannedBriefs.map((content) => (
                    <ContentRow key={content._id} content={content} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Add */}
            <Link
              href="/admin/content-strategy/new"
              className="block w-full py-3 bg-accent-primary text-black font-semibold rounded-xl text-center"
            >
              + Create New Article
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
