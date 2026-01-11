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
  _id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  position?: number | null;
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
  _id: string;
  name: string;
  color: string;
  articleCount: number;
  avgPosition: number | null;
  primaryKeyword: string;
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const MOCK_PILLARS: PillarMetric[] = [
  { _id: "1", name: "Barefoot Training", color: "#00F6E0", articleCount: 2, avgPosition: 12.3, primaryKeyword: "barefoot training" },
  { _id: "2", name: "Speed Training", color: "#8B5CF6", articleCount: 0, avgPosition: null, primaryKeyword: "youth speed training" },
  { _id: "3", name: "Agility Training", color: "#10B981", articleCount: 0, avgPosition: null, primaryKeyword: "agility drills for kids" },
  { _id: "4", name: "Strength Training", color: "#EF4444", articleCount: 0, avgPosition: null, primaryKeyword: "youth strength training" },
  { _id: "5", name: "Basketball", color: "#F59E0B", articleCount: 1, avgPosition: 8.7, primaryKeyword: "youth basketball drills" },
];

const MOCK_KEYWORDS: KeywordMetric[] = [
  { _id: "1", keyword: "barefoot training", volume: 8400, difficulty: 32, position: 15, trend: "up", pillar: "Barefoot Training" },
  { _id: "2", keyword: "bulletproof ankles", volume: 200, difficulty: 8, position: 3, trend: "up", pillar: "Barefoot Training" },
  { _id: "3", keyword: "youth speed training", volume: 8100, difficulty: 38, position: null, trend: "stable", pillar: "Speed Training" },
  { _id: "4", keyword: "first step quickness", volume: 2100, difficulty: 18, position: null, trend: "stable", pillar: "Speed Training" },
  { _id: "5", keyword: "agility drills for kids", volume: 4800, difficulty: 28, position: null, trend: "stable", pillar: "Agility Training" },
  { _id: "6", keyword: "youth strength training", volume: 12100, difficulty: 52, position: null, trend: "stable", pillar: "Strength Training" },
  { _id: "7", keyword: "youth basketball drills", volume: 12100, difficulty: 45, position: 8, trend: "stable", pillar: "Basketball" },
];

const MOCK_BRIEFS: ContentPiece[] = [
  { _id: "1", title: "The Bulletproof Ankles Playbook", slug: "bulletproof-ankles-playbook", status: "published", pillar: "Injury Prevention", targetKeyword: "ankle injury prevention youth sports", targetVolume: 200, author: "adam" },
  { _id: "2", title: "Speed Training for Youth Athletes: The Complete Guide", slug: "speed-training-youth-athletes", status: "in_progress", pillar: "Speed & Agility", targetKeyword: "youth speed training", targetVolume: 8100, author: "james" },
  { _id: "3", title: "First Step Quickness Protocol", slug: "first-step-quickness", status: "planned", pillar: "Speed Training", targetKeyword: "first step quickness", targetVolume: 2100, author: "james" },
  { _id: "4", title: "Agility Training Guide", slug: "agility-training", status: "planned", pillar: "Agility Training", targetKeyword: "agility drills for kids", targetVolume: 4800, author: "adam" },
  { _id: "5", title: "Youth Strength Training Guide", slug: "strength-training", status: "planned", pillar: "Strength Training", targetKeyword: "youth strength training", targetVolume: 12100, author: "james" },
];

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
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a]">
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <span className={`text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtext && <div className="text-gray-500 text-xs mt-1">{subtext}</div>}
    </div>
  );
}

function PillarCard({ pillar }: { pillar: PillarMetric }) {
  const hasContent = pillar.articleCount > 0;
  return (
    <div className={`rounded-xl p-4 border ${hasContent ? "border-[#2a2a4a] bg-[#1a1a2e]" : "border-dashed border-[#2a2a4a] bg-[#0f0f1a]/50"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
        <div className="font-semibold text-white">{pillar.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-gray-500">Articles</div>
          <div className={hasContent ? "text-white" : "text-gray-600"}>{pillar.articleCount}</div>
        </div>
        <div>
          <div className="text-gray-500">Avg Pos</div>
          <div className={hasContent ? "text-white" : "text-gray-600"}>
            {pillar.avgPosition ? pillar.avgPosition.toFixed(1) : "—"}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-gray-500">Target</div>
          <div className="text-cyan-400 text-xs truncate">{pillar.primaryKeyword}</div>
        </div>
      </div>
    </div>
  );
}

function KeywordRow({ kw }: { kw: KeywordMetric }) {
  const positionColor = kw.position
    ? kw.position <= 3 ? "text-green-500" : kw.position <= 10 ? "text-yellow-500" : "text-gray-400"
    : "text-gray-600";
  const difficultyColor = kw.difficulty <= 20 ? "text-green-500" : kw.difficulty <= 40 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#2a2a4a] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">{kw.keyword}</div>
        <div className="text-xs text-gray-500">{kw.pillar}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-300">{(kw.volume / 1000).toFixed(1)}K</div>
        <div className="text-xs text-gray-500">vol</div>
      </div>
      <div className="text-right w-12">
        <div className={`text-sm ${difficultyColor}`}>{kw.difficulty}</div>
        <div className="text-xs text-gray-500">KD</div>
      </div>
      <div className="text-right w-12">
        <div className={`text-sm font-semibold ${positionColor}`}>{kw.position || "—"}</div>
        <div className="text-xs text-gray-500">pos</div>
      </div>
      <div className="w-6">
        <span className={`text-lg ${kw.trend === "up" ? "text-green-500" : kw.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
          {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
        </span>
      </div>
    </div>
  );
}

function ContentRow({ content }: { content: ContentPiece }) {
  const statusStyles: Record<BriefStatus, string> = {
    published: "bg-green-500/20 text-green-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    review: "bg-purple-500/20 text-purple-400",
    assigned: "bg-blue-500/20 text-blue-400",
    planned: "bg-gray-500/20 text-gray-400",
  };

  return (
    <Link
      href={`/admin/content-strategy/${content.slug}`}
      className="flex items-center gap-3 py-3 border-b border-[#2a2a4a] last:border-0 hover:bg-[#1a1a2e]/50 -mx-4 px-4 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">{content.title}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{content.pillar}</span>
          <span>•</span>
          <span className="text-cyan-400">{content.targetKeyword}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-300">{(content.targetVolume / 1000).toFixed(1)}K</div>
      </div>
      <div className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[content.status]}`}>
        {content.status.replace("_", " ")}
      </div>
      <div className="w-8 h-8 rounded-full bg-[#2a2a4a] flex items-center justify-center text-xs font-semibold text-gray-400 uppercase">
        {content.author === "james" ? "JS" : "AH"}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ContentStrategyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "content">("overview");
  const [authorFilter, setAuthorFilter] = useState<Author | "all">("all");

  // Use mock data
  const pillars = MOCK_PILLARS;
  const keywords = MOCK_KEYWORDS;
  const briefs = authorFilter === "all"
    ? MOCK_BRIEFS
    : MOCK_BRIEFS.filter(b => b.author === authorFilter);

  // Stats
  const totalKeywords = keywords.length;
  const rankingKeywords = keywords.filter(k => k.position !== null).length;
  const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
  const publishedBriefs = briefs.filter(b => b.status === "published");
  const plannedBriefs = briefs.filter(b => b.status === "planned" || b.status === "assigned");

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a14]/95 backdrop-blur-sm border-b border-[#2a2a4a]">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Content Strategy</h1>
              <p className="text-sm text-gray-500">SEO Performance & Planning</p>
            </div>
            <Link
              href="/admin/content-strategy/new"
              className="px-3 py-1.5 bg-cyan-400 text-black text-sm font-semibold rounded-lg"
            >
              + New Article
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#1a1a2e] rounded-lg p-1">
            {(["overview", "keywords", "content"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-[#0a0a14] text-white"
                    : "text-gray-500 hover:text-gray-300"
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
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Keywords Tracked" value={totalKeywords} subtext={`${rankingKeywords} ranking`} />
              <MetricCard label="Total Volume" value={`${(totalVolume / 1000).toFixed(0)}K`} subtext="monthly searches" />
              <MetricCard label="Published" value={publishedBriefs.length} subtext="articles live" trend="up" />
              <MetricCard label="In Pipeline" value={plannedBriefs.length} subtext="articles planned" />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Content Pillars</h2>
              <div className="grid grid-cols-1 gap-3">
                {pillars.map((pillar) => (
                  <PillarCard key={pillar._id} pillar={pillar} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Top Keywords</h2>
              <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4a]">
                <div className="px-4">
                  {keywords.slice(0, 5).map((kw) => (
                    <KeywordRow key={kw._id} kw={kw} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4a]">
              <div className="px-4">
                {keywords.map((kw) => (
                  <KeywordRow key={kw._id} kw={kw} />
                ))}
              </div>
            </div>
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
                  authorFilter === "all" ? "bg-cyan-400/20 text-cyan-400" : "bg-[#1a1a2e] text-gray-400"
                }`}
              >
                All Authors
              </button>
              <button
                onClick={() => setAuthorFilter("james")}
                className={`flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-2 ${
                  authorFilter === "james" ? "bg-cyan-400/20 text-cyan-400" : "bg-[#1a1a2e] text-gray-400"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">JS</span>
                James
              </button>
              <button
                onClick={() => setAuthorFilter("adam")}
                className={`flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-2 ${
                  authorFilter === "adam" ? "bg-cyan-400/20 text-cyan-400" : "bg-[#1a1a2e] text-gray-400"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">AH</span>
                Adam
              </button>
            </div>

            {/* Published */}
            {publishedBriefs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Published ({publishedBriefs.length})
                </h3>
                <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] px-4">
                  {publishedBriefs.map((content) => (
                    <ContentRow key={content._id} content={content} />
                  ))}
                </div>
              </div>
            )}

            {/* Planned */}
            {plannedBriefs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Planned ({plannedBriefs.length})
                </h3>
                <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] px-4">
                  {plannedBriefs.map((content) => (
                    <ContentRow key={content._id} content={content} />
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/admin/content-strategy/new"
              className="block w-full py-3 bg-cyan-400 text-black font-semibold rounded-xl text-center"
            >
              + Create New Article
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
