// ═══════════════════════════════════════════════════════════
// CONTENT STRATEGY DASHBOARD
// SEO metrics, keyword tracking, and content planning
// Mobile-optimized for James & Adam
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type KeywordTrend = "up" | "down" | "stable";
type BriefStatus = "planned" | "assigned" | "in_progress" | "review" | "published";
type Author = "james" | "adam";

interface KeywordMetric {
  keyword: string;
  volume: number;
  difficulty: number;
  position: number | null;
  trend: KeywordTrend;
  pillar: string;
}

interface ContentPiece {
  _id: string;
  title: string;
  slug: string;
  status: BriefStatus;
  pillar: string;
  targetKeyword: string;
  targetVolume: number;
  author: Author;
}

interface PillarMetric {
  name: string;
  color: string;
  articleCount: number;
  avgPosition: number | null;
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const MOCK_PILLARS: PillarMetric[] = [
  { name: "Barefoot Training", color: "#00F6E0", articleCount: 2, avgPosition: 12.3 },
  { name: "Speed Training", color: "#8B5CF6", articleCount: 1, avgPosition: null },
  { name: "Agility Training", color: "#10B981", articleCount: 0, avgPosition: null },
  { name: "Strength Training", color: "#EF4444", articleCount: 0, avgPosition: null },
  { name: "Basketball", color: "#F59E0B", articleCount: 3, avgPosition: 8.7 },
];

const MOCK_KEYWORDS: KeywordMetric[] = [
  { keyword: "barefoot training", volume: 8400, difficulty: 32, position: 15, trend: "up", pillar: "Barefoot Training" },
  { keyword: "bulletproof ankles", volume: 200, difficulty: 8, position: 3, trend: "up", pillar: "Barefoot Training" },
  { keyword: "youth speed training", volume: 8100, difficulty: 38, position: null, trend: "stable", pillar: "Speed Training" },
  { keyword: "first step quickness", volume: 2100, difficulty: 18, position: null, trend: "stable", pillar: "Speed Training" },
  { keyword: "agility drills for kids", volume: 4800, difficulty: 28, position: null, trend: "stable", pillar: "Agility Training" },
  { keyword: "youth strength training", volume: 12100, difficulty: 52, position: null, trend: "stable", pillar: "Strength Training" },
  { keyword: "youth basketball drills", volume: 12100, difficulty: 45, position: 8, trend: "stable", pillar: "Basketball" },
];

const MOCK_ARTICLES: ContentPiece[] = [
  { _id: "1", title: "The Bulletproof Ankles Playbook", slug: "bulletproof-ankles-playbook", status: "published", pillar: "Barefoot Training", targetKeyword: "bulletproof ankles", targetVolume: 200, author: "adam" },
  { _id: "2", title: "Speed Training for Youth Athletes", slug: "speed-training-youth-athletes", status: "in_progress", pillar: "Speed Training", targetKeyword: "youth speed training", targetVolume: 8100, author: "james" },
  { _id: "3", title: "First Step Quickness Protocol", slug: "first-step-quickness", status: "planned", pillar: "Speed Training", targetKeyword: "first step quickness", targetVolume: 2100, author: "james" },
  { _id: "4", title: "Agility Training Guide", slug: "agility-training", status: "planned", pillar: "Agility Training", targetKeyword: "agility drills for kids", targetVolume: 4800, author: "adam" },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, subtext, trend }: {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: KeywordTrend;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a]">
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <span className={`text-sm ${
            trend === "up" ? "text-green-400" :
            trend === "down" ? "text-red-400" : "text-gray-400"
          }`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtext && <div className="text-gray-500 text-xs mt-1">{subtext}</div>}
    </div>
  );
}

function PillarCard({ pillar }: { pillar: PillarMetric }) {
  return (
    <div
      className="bg-[#1a1a2e] rounded-xl p-4 border-l-4"
      style={{ borderLeftColor: pillar.color }}
    >
      <div className="font-semibold text-white mb-2">{pillar.name}</div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{pillar.articleCount} articles</span>
        <span className="text-gray-400">
          {pillar.avgPosition ? `#${pillar.avgPosition.toFixed(0)}` : "—"}
        </span>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: ContentPiece }) {
  const statusColors: Record<BriefStatus, string> = {
    planned: "#6b7280",
    assigned: "#f59e0b",
    in_progress: "#3b82f6",
    review: "#8b5cf6",
    published: "#22c55e",
  };

  const authorColors: Record<Author, string> = {
    james: "#8B5CF6",
    adam: "#00F6E0",
  };

  return (
    <Link href={`/admin/content-strategy/${article.slug}`}>
      <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a] hover:border-[#00F6E0]/50 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{article.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{article.targetKeyword} • {article.targetVolume.toLocaleString()}/mo</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${statusColors[article.status]}20`,
                color: statusColors[article.status]
              }}
            >
              {article.status.replace("_", " ")}
            </span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${authorColors[article.author]}20`,
                color: authorColors[article.author]
              }}
            >
              {article.author.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function KeywordRow({ kw }: { kw: KeywordMetric }) {
  const trendIcon = kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→";
  const trendColor = kw.trend === "up" ? "text-green-400" : kw.trend === "down" ? "text-red-400" : "text-gray-400";

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#2a2a4a] last:border-0">
      <div>
        <span className="text-white">{kw.keyword}</span>
        <span className="text-gray-500 text-xs ml-2">{kw.pillar}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">{kw.volume.toLocaleString()}</span>
        <span className="text-gray-400 w-8 text-center">KD {kw.difficulty}</span>
        <span className={`w-10 text-center ${kw.position ? "text-white" : "text-gray-500"}`}>
          {kw.position ? `#${kw.position}` : "—"}
        </span>
        <span className={trendColor}>{trendIcon}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function ContentStrategyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "content">("overview");
  const [authorFilter, setAuthorFilter] = useState<"all" | Author>("all");

  const filteredArticles = MOCK_ARTICLES.filter(
    a => authorFilter === "all" || a.author === authorFilter
  );

  const rankingKeywords = MOCK_KEYWORDS.filter(k => k.position !== null).length;
  const totalVolume = MOCK_KEYWORDS.reduce((sum, k) => sum + k.volume, 0);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Content Strategy</h1>
        <p className="text-gray-400 text-sm">SEO metrics & content planning</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1a1a2e] p-1 rounded-lg w-fit">
        {(["overview", "keywords", "content"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#0a0a14] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Keywords Tracked" value={MOCK_KEYWORDS.length} subtext={`${rankingKeywords} ranking`} />
            <MetricCard label="Total Volume" value={`${(totalVolume/1000).toFixed(1)}K`} subtext="monthly searches" />
            <MetricCard label="Articles" value={MOCK_ARTICLES.length} subtext={`${MOCK_ARTICLES.filter(a => a.status === "published").length} published`} />
            <MetricCard label="Avg Position" value="9.2" trend="up" />
          </div>

          {/* Pillars */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Content Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MOCK_PILLARS.map(pillar => (
                <PillarCard key={pillar.name} pillar={pillar} />
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Top Keywords</h2>
            <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a]">
              {MOCK_KEYWORDS.slice(0, 5).map(kw => (
                <KeywordRow key={kw.keyword} kw={kw} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === "keywords" && (
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">All Keywords</h2>
            <span className="text-gray-400 text-sm">{MOCK_KEYWORDS.length} tracked</span>
          </div>
          {MOCK_KEYWORDS.map(kw => (
            <KeywordRow key={kw.keyword} kw={kw} />
          ))}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="space-y-4">
          {/* Author Filter */}
          <div className="flex gap-2">
            {(["all", "james", "adam"] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setAuthorFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  authorFilter === filter
                    ? "bg-[#00F6E0] text-black"
                    : "bg-[#1a1a2e] text-gray-400 hover:text-white"
                }`}
              >
                {filter === "all" ? "All" : filter.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Articles */}
          <div className="space-y-3">
            {filteredArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
