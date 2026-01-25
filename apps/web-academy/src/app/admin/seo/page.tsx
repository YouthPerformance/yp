// ═══════════════════════════════════════════════════════════
// SEO COMMAND CENTER v2 - LIQUID GLASS MORPHISM
// Dark metallic aesthetic with glassmorphism 2026
// Design: Black base + #00f6e0 cyan accent + frosted glass
// ═══════════════════════════════════════════════════════════

"use client";

import { useQuery } from "convex/react";
import { api } from "@yp/alpha/convex/_generated/api";
import { loadAllPages, SEOPage } from "@/lib/seo-content";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface ClusterData {
  name: string;
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
  totalVolume: number;
}

interface TaskActivity {
  id: string;
  taskId: string;
  title: string;
  status: string;
  updatedAt: number;
  completedAt?: number;
  payload?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS - Liquid Glass System
// ─────────────────────────────────────────────────────────────

const glass = {
  // Glass surface styles
  panel: "backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] shadow-2xl",
  panelHover: "hover:bg-white/[0.06] hover:border-white/[0.12]",
  panelInner: "backdrop-blur-md bg-black/40 border border-white/[0.05]",

  // Accent colors
  cyan: "#00f6e0",
  cyanGlow: "shadow-[0_0_30px_rgba(0,246,224,0.15)]",
  cyanBorder: "border-[#00f6e0]/30",

  // Text hierarchy
  textPrimary: "text-white",
  textSecondary: "text-white/60",
  textTertiary: "text-white/40",
  textMuted: "text-white/25",
};

// ─────────────────────────────────────────────────────────────
// ANIMATED BACKGROUND COMPONENT
// ─────────────────────────────────────────────────────────────

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#030304]" />

      {/* Metallic grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle cyan glow - top right */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #00f6e0 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle purple accent - bottom left */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GLASS CARD COMPONENT
// ─────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden
        backdrop-blur-xl bg-white/[0.03]
        border border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300 ease-out
        hover:bg-white/[0.05] hover:border-white/[0.12]
        ${glow ? "shadow-[0_0_40px_rgba(0,246,224,0.1)]" : ""}
        ${className}
      `}
    >
      {/* Inner highlight edge */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO STATS - Liquid Glass Cards
// ─────────────────────────────────────────────────────────────

function HeroStats({
  pagesLive,
  totalVolume,
  taskStats
}: {
  pagesLive: number;
  totalVolume: number;
  taskStats: { total: number; completed: number; pending: number; in_progress: number } | undefined;
}) {
  const stats = [
    {
      label: "PAGES LIVE",
      value: pagesLive,
      subtext: "Published",
      color: "#22c55e",
      icon: "◉",
    },
    {
      label: "VOLUME/MO",
      value: totalVolume.toLocaleString(),
      subtext: "Search volume",
      color: "#00f6e0",
      icon: "◈",
    },
    {
      label: "PIPELINE",
      value: taskStats?.total || 0,
      subtext: `${taskStats?.completed || 0} completed`,
      color: "#8b5cf6",
      icon: "◇",
    },
    {
      label: "IN PROGRESS",
      value: taskStats?.in_progress || 0,
      subtext: `${taskStats?.pending || 0} pending`,
      color: "#f59e0b",
      icon: "○",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <GlassCard key={stat.label} glow={index === 1}>
          <div className="p-5 relative">
            {/* Accent line */}
            <div
              className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full"
              style={{ backgroundColor: stat.color, opacity: 0.8 }}
            />

            {/* Content */}
            <div className="pl-4">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs opacity-60"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
                  {stat.label}
                </span>
              </div>

              <div
                className="text-3xl font-light tracking-tight mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>

              <div className="text-xs text-white/30">
                {stat.subtext}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PIPELINE PROGRESS - Glass Bar
// ─────────────────────────────────────────────────────────────

function PipelineProgress({
  completed,
  inProgress,
  pending,
  total
}: {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}) {
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;

  return (
    <GlassCard>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <span className="text-sm">⟳</span>
            </div>
            <div>
              <h2 className="text-sm font-medium text-white/90 tracking-wide">
                Content Pipeline
              </h2>
              <p className="text-xs text-white/30">Real-time sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f6e0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f6e0]" />
            </span>
            <span className="text-[10px] tracking-wider text-white/40 uppercase">Live</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-4 mb-5">
          {[
            { label: "Completed", value: completed, color: "#22c55e" },
            { label: "In Progress", value: inProgress, color: "#3b82f6" },
            { label: "Pending", value: pending, color: "#6b7280" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-white/50">{item.label}</span>
              <span className="text-xs font-medium text-white/80">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar - Liquid Glass Style */}
        <div className="relative h-3 rounded-full bg-black/40 overflow-hidden border border-white/[0.05]">
          {/* Completed segment */}
          <div
            className="absolute h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${completedPercent}%`,
              background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
            }}
          />
          {/* In Progress segment */}
          <div
            className="absolute h-full rounded-full transition-all duration-700 ease-out"
            style={{
              left: `${completedPercent}%`,
              width: `${inProgressPercent}%`,
              background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            }}
          />
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/2" />
        </div>

        {/* Percentage */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-white/30">Progress</span>
          <span className="text-sm font-light text-[#00f6e0]">
            {completedPercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// CLUSTER GRID - Glass Cards with Metallic Accents
// ─────────────────────────────────────────────────────────────

function ClusterGrid({ clusters }: { clusters: ClusterData[] | undefined }) {
  if (!clusters || clusters.length === 0) {
    return (
      <GlassCard>
        <div className="p-8 text-center text-white/40">
          No cluster data available
        </div>
      </GlassCard>
    );
  }

  const clusterColors: Record<string, string> = {
    "silent-training": "#00f6e0",
    "silent-basketball": "#00f6e0",
    "home-training": "#8b5cf6",
    "home-basketball-training": "#8b5cf6",
    "uncategorized": "#6b7280",
  };

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <span className="text-sm">◫</span>
          </div>
          <h2 className="text-sm font-medium text-white/90 tracking-wide">
            Content Clusters
          </h2>
        </div>

        <div className="space-y-3">
          {clusters.map((cluster) => {
            const color = clusterColors[cluster.name] || "#6b7280";
            const progress = cluster.total > 0
              ? (cluster.completed / cluster.total) * 100
              : 0;

            return (
              <div
                key={cluster.name}
                className="p-4 rounded-xl bg-black/30 border border-white/[0.04] hover:border-white/[0.08] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-white/80 capitalize">
                      {cluster.name.replace(/-/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">
                    {cluster.totalVolume.toLocaleString()} vol
                  </span>
                </div>

                {/* Mini progress bar */}
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}40`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/30">
                    {cluster.completed}/{cluster.total} pages
                  </span>
                  <span style={{ color }} className="font-medium">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY FEED - Glass Stream
// ─────────────────────────────────────────────────────────────

function ActivityFeed({ activities }: { activities: TaskActivity[] | undefined }) {
  const statusColors: Record<string, string> = {
    completed: "#22c55e",
    in_progress: "#3b82f6",
    pending: "#6b7280",
    blocked: "#f59e0b",
    cancelled: "#ef4444",
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  if (!activities || activities.length === 0) {
    return (
      <GlassCard>
        <div className="p-8 text-center text-white/40">
          No recent activity
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
            <span className="text-sm">◌</span>
          </div>
          <h2 className="text-sm font-medium text-white/90 tracking-wide">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 -mx-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
            >
              {/* Status indicator */}
              <div className="relative">
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColors[activity.status] || "#6b7280" }}
                />
                {index !== activities.length - 1 && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-white/[0.05]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 truncate group-hover:text-white/90 transition-colors">
                  {activity.title}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">
                  {activity.taskId}
                </p>
              </div>

              {/* Time */}
              <div className="text-right shrink-0">
                <span className="text-[10px] text-white/40">
                  {formatTimeAgo(activity.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// QUICK ACTIONS - Glass Buttons
// ─────────────────────────────────────────────────────────────

function QuickActionsPanel({ pendingReviews }: { pendingReviews: number }) {
  const actions = [
    {
      href: "/admin/quick-review",
      label: "Voice Review",
      description: "Review with voice",
      icon: "◉",
      color: "#00f6e0",
      badge: pendingReviews > 0 ? pendingReviews : null,
    },
    {
      href: "/admin/content-review",
      label: "Content Queue",
      description: "View drafts",
      icon: "◫",
      color: "#8b5cf6",
    },
    {
      href: "/admin/campaigns",
      label: "Campaigns",
      description: "Manage content",
      icon: "◇",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <GlassCard className="group cursor-pointer">
            <div className="p-5 relative">
              {/* Badge */}
              {action.badge && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium shadow-lg shadow-red-500/30">
                  {action.badge}
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                  }}
                >
                  {action.icon}
                </div>
                <div>
                  <h3
                    className="text-sm font-medium text-white/90 group-hover:text-[#00f6e0] transition-colors"
                  >
                    {action.label}
                  </h3>
                  <p className="text-xs text-white/40">{action.description}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIVE PAGES TABLE - Glass List
// ─────────────────────────────────────────────────────────────

function LivePagesTable({ pages }: { pages: SEOPage[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayPages = showAll ? pages : pages.slice(0, 5);

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
              <span className="text-sm text-[#22c55e]">✓</span>
            </div>
            <div>
              <h2 className="text-sm font-medium text-white/90 tracking-wide">
                Live Pages
              </h2>
              <p className="text-xs text-white/30">{pages.length} published</p>
            </div>
          </div>

          {pages.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-[#00f6e0] hover:text-[#00f6e0]/80 transition-colors"
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          )}
        </div>

        <div className="space-y-1">
          {displayPages.map((page) => {
            const volume = page.knowledge_graph?.total_volume ||
                          page.knowledge_graph?.total_cluster_volume || 0;
            const isPillar = page.knowledge_graph?.type === "pillar";

            return (
              <div
                key={page.slug}
                className="flex items-center justify-between p-3 -mx-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <div className="min-w-0">
                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/70 hover:text-[#00f6e0] transition-colors truncate block"
                    >
                      {page.title}
                    </a>
                    <span className="text-[10px] text-white/30 truncate block">
                      {page.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isPillar && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#00f6e0]/10 text-[#00f6e0] border border-[#00f6e0]/20">
                      PILLAR
                    </span>
                  )}
                  <span className="text-xs text-white/40 tabular-nums">
                    {volume.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE - SEO Command Center v2
// ─────────────────────────────────────────────────────────────

export default function SEOCommandCenter() {
  // Convex real-time queries
  const taskStats = useQuery(api.seoAnalytics.getSeoTaskStats);
  const clusters = useQuery(api.seoAnalytics.getTasksByCluster);
  const recentActivity = useQuery(api.seoAnalytics.getRecentActivity, { limit: 10 });
  const contentStats = useQuery(api.playbook.getContentStats, {});

  // Static content data
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    const allPages = loadAllPages();
    setPages(allPages);

    const volume = allPages.reduce((sum, page) => {
      return sum + (page.knowledge_graph?.total_volume ||
                   page.knowledge_graph?.total_cluster_volume || 0);
    }, 0);
    setTotalVolume(volume);
  }, []);

  const pendingReviews = (contentStats?.draft || 0) + (contentStats?.inReview || 0);

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />

      {/* Main Container */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f6e0]/20 to-[#00f6e0]/5 flex items-center justify-center border border-[#00f6e0]/20">
                <span className="text-xl">🐺</span>
              </div>
              <h1 className="text-2xl font-light tracking-tight text-white">
                SEO Command Center
              </h1>
            </div>
            <p className="text-sm text-white/40 ml-[52px]">
              Real-time content analytics & pipeline
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Voice Review CTA */}
            <Link
              href="/admin/quick-review"
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #00f6e0 0%, #00d4c4 100%)",
                color: "#030304",
                boxShadow: "0 0 30px rgba(0,246,224,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span>◉</span>
              <span>Voice Review</span>
              {pendingReviews > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium shadow-lg">
                  {pendingReviews}
                </span>
              )}
            </Link>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
              </span>
              <span className="text-[10px] tracking-wider text-white/50 uppercase">Live</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="space-y-6">

          {/* Hero Stats Row */}
          <HeroStats
            pagesLive={pages.length}
            totalVolume={totalVolume}
            taskStats={taskStats}
          />

          {/* Quick Actions */}
          <QuickActionsPanel pendingReviews={pendingReviews} />

          {/* Pipeline Progress */}
          <PipelineProgress
            completed={taskStats?.completed || 0}
            inProgress={taskStats?.in_progress || 0}
            pending={taskStats?.pending || 0}
            total={taskStats?.total || 0}
          />

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClusterGrid clusters={clusters} />
            <ActivityFeed activities={recentActivity} />
          </div>

          {/* Live Pages */}
          <LivePagesTable pages={pages} />

        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-xs text-white/20">
            YouthPerformance SEO Infrastructure · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
