// ═══════════════════════════════════════════════════════════
// CONTENT STRATEGY DASHBOARD
// SEO metrics, keyword tracking, and content planning
// Mobile-optimized for James & Adam
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface KeywordMetric {
  keyword: string;
  volume: number;
  difficulty: number;
  position: number | null;
  trend: "up" | "down" | "stable";
  pillar: string;
}

interface ContentPiece {
  title: string;
  slug: string;
  status: "published" | "draft" | "planned";
  pillar: string;
  targetKeyword: string;
  volume: number;
  author: "james" | "adam";
  lastUpdated: string;
}

interface PillarMetric {
  name: string;
  articles: number;
  totalTraffic: number;
  avgPosition: number;
  topKeyword: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA (Replace with Convex queries)
// ─────────────────────────────────────────────────────────────

const PILLARS: PillarMetric[] = [
  { name: "Barefoot Training", articles: 5, totalTraffic: 2400, avgPosition: 12.3, topKeyword: "barefoot training", color: "#00F6E0" },
  { name: "Basketball", articles: 3, totalTraffic: 1800, avgPosition: 8.7, topKeyword: "youth basketball drills", color: "#F59E0B" },
  { name: "Speed Training", articles: 0, totalTraffic: 0, avgPosition: 0, topKeyword: "youth speed training", color: "#8B5CF6" },
  { name: "Agility Training", articles: 0, totalTraffic: 0, avgPosition: 0, topKeyword: "agility drills for kids", color: "#10B981" },
  { name: "Strength Training", articles: 0, totalTraffic: 0, avgPosition: 0, topKeyword: "youth strength training", color: "#EF4444" },
];

const KEYWORDS: KeywordMetric[] = [
  { keyword: "barefoot training", volume: 8400, difficulty: 32, position: 15, trend: "up", pillar: "Barefoot Training" },
  { keyword: "bulletproof ankles", volume: 200, difficulty: 8, position: 3, trend: "up", pillar: "Barefoot Training" },
  { keyword: "youth basketball drills", volume: 12100, difficulty: 45, position: 8, trend: "stable", pillar: "Basketball" },
  { keyword: "youth speed training", volume: 8100, difficulty: 38, position: null, trend: "stable", pillar: "Speed Training" },
  { keyword: "agility drills for kids", volume: 4800, difficulty: 28, position: null, trend: "stable", pillar: "Agility Training" },
  { keyword: "youth strength training", volume: 12100, difficulty: 52, position: null, trend: "stable", pillar: "Strength Training" },
  { keyword: "first step quickness", volume: 2100, difficulty: 18, position: null, trend: "stable", pillar: "Speed Training" },
  { keyword: "landing mechanics youth", volume: 800, difficulty: 12, position: null, trend: "stable", pillar: "Strength Training" },
];

const CONTENT: ContentPiece[] = [
  { title: "Bulletproof Ankles Protocol", slug: "/barefoot-training/injury-rehab/bulletproof-ankles", status: "published", pillar: "Barefoot Training", targetKeyword: "bulletproof ankles", volume: 200, author: "james", lastUpdated: "2025-01-10" },
  { title: "Barefoot Reset Guide", slug: "/barefoot-training", status: "published", pillar: "Barefoot Training", targetKeyword: "barefoot training", volume: 8400, author: "james", lastUpdated: "2025-01-05" },
  { title: "Youth Basketball Drills", slug: "/basketball/youth-basketball-drills", status: "published", pillar: "Basketball", targetKeyword: "youth basketball drills", volume: 12100, author: "adam", lastUpdated: "2025-01-02" },
  { title: "Speed Training for Youth Athletes", slug: "/speed-training", status: "planned", pillar: "Speed Training", targetKeyword: "youth speed training", volume: 8100, author: "james", lastUpdated: "" },
  { title: "First Step Quickness Protocol", slug: "/speed-training/first-step-quickness", status: "planned", pillar: "Speed Training", targetKeyword: "first step quickness", volume: 2100, author: "james", lastUpdated: "" },
  { title: "Agility Training Guide", slug: "/agility-training", status: "planned", pillar: "Agility Training", targetKeyword: "agility drills for kids", volume: 4800, author: "james", lastUpdated: "" },
  { title: "Youth Strength Training Guide", slug: "/strength-training", status: "planned", pillar: "Strength Training", targetKeyword: "youth strength training", volume: 12100, author: "james", lastUpdated: "" },
  { title: "Landing Mechanics Protocol", slug: "/strength-training/landing-mechanics", status: "planned", pillar: "Strength Training", targetKeyword: "landing mechanics youth", volume: 800, author: "james", lastUpdated: "" },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, subtext, trend }: { label: string; value: string | number; subtext?: string; trend?: "up" | "down" | "stable" }) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4 border border-border-default">
      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {trend && (
          <span className={`text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-text-tertiary"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtext && <div className="text-text-tertiary text-xs mt-1">{subtext}</div>}
    </div>
  );
}

function PillarCard({ pillar }: { pillar: PillarMetric }) {
  const hasContent = pillar.articles > 0;
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
          <div className={hasContent ? "text-text-primary" : "text-text-muted"}>{pillar.articles}</div>
        </div>
        <div>
          <div className="text-text-tertiary">Avg Pos</div>
          <div className={hasContent ? "text-text-primary" : "text-text-muted"}>
            {hasContent ? pillar.avgPosition.toFixed(1) : "—"}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-text-tertiary">Target</div>
          <div className="text-accent-primary text-xs truncate">{pillar.topKeyword}</div>
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

function KeywordRow({ kw }: { kw: KeywordMetric }) {
  const positionColor = kw.position ? (kw.position <= 3 ? "text-green-500" : kw.position <= 10 ? "text-yellow-500" : "text-text-secondary") : "text-text-muted";
  const difficultyColor = kw.difficulty <= 20 ? "text-green-500" : kw.difficulty <= 40 ? "text-yellow-500" : "text-red-500";

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
        <span className={`text-lg ${kw.trend === "up" ? "text-green-500" : kw.trend === "down" ? "text-red-500" : "text-text-tertiary"}`}>
          {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
        </span>
      </div>
    </div>
  );
}

function ContentRow({ content }: { content: ContentPiece }) {
  const statusStyles = {
    published: "bg-green-500/20 text-green-500",
    draft: "bg-yellow-500/20 text-yellow-500",
    planned: "bg-blue-500/20 text-blue-500",
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{content.title}</div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span>{content.pillar}</span>
          <span>•</span>
          <span className="text-accent-primary">{content.targetKeyword}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-text-secondary">{(content.volume / 1000).toFixed(1)}K</div>
      </div>
      <div className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[content.status]}`}>
        {content.status}
      </div>
      <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-semibold text-text-secondary uppercase">
        {content.author === "james" ? "JS" : "AH"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ContentStrategyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "content">("overview");

  // Calculate summary stats
  const totalKeywords = KEYWORDS.length;
  const rankingKeywords = KEYWORDS.filter(k => k.position !== null).length;
  const totalVolume = KEYWORDS.reduce((sum, k) => sum + k.volume, 0);
  const publishedContent = CONTENT.filter(c => c.status === "published").length;
  const plannedContent = CONTENT.filter(c => c.status === "planned").length;

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
            <button className="px-3 py-1.5 bg-accent-primary text-black text-sm font-semibold rounded-lg">
              + New Article
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
            {(["overview", "keywords", "content"] as const).map(tab => (
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
              <MetricCard label="Keywords Tracked" value={totalKeywords} subtext={`${rankingKeywords} ranking`} />
              <MetricCard label="Total Volume" value={`${(totalVolume / 1000).toFixed(0)}K`} subtext="monthly searches" />
              <MetricCard label="Published" value={publishedContent} subtext="articles live" trend="up" />
              <MetricCard label="In Pipeline" value={plannedContent} subtext="articles planned" />
            </div>

            {/* Pillars */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Content Pillars</h2>
              <div className="grid grid-cols-1 gap-3">
                {PILLARS.map(pillar => (
                  <PillarCard key={pillar.name} pillar={pillar} />
                ))}
              </div>
            </div>

            {/* Top Keywords */}
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
                  {KEYWORDS.slice(0, 5).map(kw => (
                    <KeywordRow key={kw.keyword} kw={kw} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button className="px-3 py-1.5 bg-accent-primary/20 text-accent-primary text-sm rounded-full whitespace-nowrap">
                All ({KEYWORDS.length})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Ranking ({rankingKeywords})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Not Ranking ({KEYWORDS.length - rankingKeywords})
              </button>
              <button className="px-3 py-1.5 bg-bg-secondary text-text-secondary text-sm rounded-full whitespace-nowrap">
                Low KD (&lt;30)
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
                {KEYWORDS.map(kw => (
                  <KeywordRow key={kw.keyword} kw={kw} />
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
              <button className="flex-1 py-2 bg-accent-primary/20 text-accent-primary text-sm rounded-lg">
                All Authors
              </button>
              <button className="flex-1 py-2 bg-bg-secondary text-text-secondary text-sm rounded-lg flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xs font-bold">JS</span>
                James
              </button>
              <button className="flex-1 py-2 bg-bg-secondary text-text-secondary text-sm rounded-lg flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">AH</span>
                Adam
              </button>
            </div>

            {/* Status Sections */}
            <div>
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Published ({CONTENT.filter(c => c.status === "published").length})
              </h3>
              <div className="bg-bg-secondary rounded-xl border border-border-default px-4">
                {CONTENT.filter(c => c.status === "published").map(content => (
                  <ContentRow key={content.slug} content={content} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                Planned ({CONTENT.filter(c => c.status === "planned").length})
              </h3>
              <div className="bg-bg-secondary rounded-xl border border-border-default px-4">
                {CONTENT.filter(c => c.status === "planned").map(content => (
                  <ContentRow key={content.slug} content={content} />
                ))}
              </div>
            </div>

            {/* Quick Add */}
            <button className="w-full py-3 bg-accent-primary text-black font-semibold rounded-xl">
              + Create New Article
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
