// ═══════════════════════════════════════════════════════════
// SEO COMMAND CENTER
// Real-time analytics dashboard with voice review access
// CEO Dashboard + Coach Quick Actions
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
// HERO STATS COMPONENT
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
    },
    {
      label: "VOLUME/MO",
      value: totalVolume.toLocaleString(),
      subtext: "Search volume captured",
      color: "#00F6E0",
    },
    {
      label: "PIPELINE",
      value: taskStats?.total || 0,
      subtext: `${taskStats?.completed || 0} completed`,
      color: "#8B5CF6",
    },
    {
      label: "IN PROGRESS",
      value: taskStats?.in_progress || 0,
      subtext: `${taskStats?.pending || 0} pending`,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#1a1a2e] rounded-xl p-4 border border-[#2a2a4a] relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: stat.color }}
          />
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-white">{stat.value}</div>
          <div className="text-gray-500 text-xs mt-1">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PIPELINE PROGRESS BAR
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
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🔄</span> CONTENT PIPELINE
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">Real-time</span>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">Completed</span>
          <span className="text-white font-medium">{completed}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">In Progress</span>
          <span className="text-white font-medium">{inProgress}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-gray-400">Pending</span>
          <span className="text-white font-medium">{pending}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-[#0a0a14] rounded-full overflow-hidden flex">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${completedPercent}%` }}
        />
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${inProgressPercent}%` }}
        />
      </div>

      <div className="mt-2 text-right text-sm text-gray-400">
        {completedPercent.toFixed(1)}% complete
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLUSTER GRID COMPONENT
// ─────────────────────────────────────────────────────────────

function ClusterGrid({ clusters }: { clusters: ClusterData[] | undefined }) {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a] text-center text-gray-400">
        No cluster data available
      </div>
    );
  }

  const clusterColors: Record<string, string> = {
    "silent-training": "#00F6E0",
    "silent-basketball": "#00F6E0",
    "home-training": "#8B5CF6",
    "home-basketball-training": "#8B5CF6",
    "uncategorized": "#6b7280",
  };

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold mb-4">📊 CONTENT CLUSTERS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => {
          const color = clusterColors[cluster.name] || "#6b7280";
          const progress = cluster.total > 0
            ? (cluster.completed / cluster.total) * 100
            : 0;

          return (
            <div
              key={cluster.name}
              className="bg-[#0a0a14] rounded-lg p-4 border-l-4"
              style={{ borderLeftColor: color }}
            >
              <div className="font-semibold text-white capitalize mb-2">
                {cluster.name.replace(/-/g, " ")}
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{cluster.total} pages</span>
                <span>{cluster.totalVolume.toLocaleString()} vol</span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {cluster.completed}/{cluster.total} completed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY FEED COMPONENT
// ─────────────────────────────────────────────────────────────

function ActivityFeed({ activities }: { activities: TaskActivity[] | undefined }) {
  const statusIcons: Record<string, string> = {
    completed: "🟢",
    in_progress: "🔵",
    pending: "⚪",
    blocked: "🟡",
    cancelled: "🔴",
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a] text-center text-gray-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold mb-4">📝 RECENT ACTIVITY</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-2 border-b border-[#2a2a4a] last:border-0"
          >
            <div className="flex items-center gap-3">
              <span>{statusIcons[activity.status] || "⚪"}</span>
              <div>
                <div className="text-white text-sm font-medium truncate max-w-[200px] md:max-w-[400px]">
                  {activity.title}
                </div>
                <div className="text-gray-500 text-xs">
                  {activity.taskId}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 capitalize">
                {activity.status.replace("_", " ")}
              </div>
              <div className="text-xs text-gray-500">
                {formatTimeAgo(activity.updatedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUICK ACTIONS PANEL
// Fast access to voice review and content management
// ─────────────────────────────────────────────────────────────

function QuickActionsPanel({ pendingReviews }: { pendingReviews: number }) {
  const actions = [
    {
      href: "/admin/quick-review",
      label: "Voice Review",
      description: "Review content with voice commands",
      icon: "🎙️",
      color: "#00F6E0",
      badge: pendingReviews > 0 ? pendingReviews : null,
    },
    {
      href: "/admin/content-review",
      label: "Content Queue",
      description: "View all content drafts",
      icon: "📚",
      color: "#8B5CF6",
    },
    {
      href: "/admin/campaigns",
      label: "Campaigns",
      description: "Manage content campaigns",
      icon: "📝",
      color: "#F59E0B",
    },
  ];

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
      <h2 className="text-lg font-semibold mb-4">⚡ QUICK ACTIONS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="relative bg-[#0a0a14] rounded-lg p-4 border border-[#2a2a4a] hover:border-[#00F6E0]/50 transition-all group"
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {action.badge}
              </span>
            )}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{action.icon}</span>
              <span
                className="font-semibold text-white group-hover:text-[#00F6E0] transition-colors"
              >
                {action.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LIVE PAGES TABLE
// ─────────────────────────────────────────────────────────────

function LivePagesTable({ pages }: { pages: SEOPage[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayPages = showAll ? pages : pages.slice(0, 5);

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4a]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">✅ LIVE PAGES ({pages.length})</h2>
        {pages.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-[#00F6E0] hover:underline"
          >
            {showAll ? "Show less" : "Show all"}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {displayPages.map((page) => {
          const volume = page.knowledge_graph?.total_volume ||
                        page.knowledge_graph?.total_cluster_volume || 0;
          const isPillar = page.knowledge_graph?.type === "pillar";

          return (
            <div
              key={page.slug}
              className="flex items-center justify-between py-2 border-b border-[#2a2a4a] last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <div>
                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm hover:text-[#00F6E0] transition-colors"
                  >
                    {page.title}
                  </a>
                  <div className="text-xs text-gray-500">{page.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isPillar && (
                  <span className="px-2 py-0.5 rounded text-xs bg-[#00F6E0]/20 text-[#00F6E0]">
                    PILLAR
                  </span>
                )}
                <span className="text-gray-400 text-sm">
                  {volume.toLocaleString()} vol
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
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

    // Calculate total volume
    const volume = allPages.reduce((sum, page) => {
      return sum + (page.knowledge_graph?.total_volume ||
                   page.knowledge_graph?.total_cluster_volume || 0);
    }, 0);
    setTotalVolume(volume);
  }, []);

  // Count items needing review
  const pendingReviews = (contentStats?.draft || 0) + (contentStats?.inReview || 0);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <span>🐺</span> SEO COMMAND CENTER
          </h1>
          <p className="text-gray-400 text-sm">Real-time content analytics & pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/quick-review"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "#00F6E0",
              color: "#0a0a14",
            }}
          >
            <span>🎙️</span> Voice Review
            {pendingReviews > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
                {pendingReviews}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Hero Stats */}
        <HeroStats
          pagesLive={pages.length}
          totalVolume={totalVolume}
          taskStats={taskStats}
        />

        {/* Quick Actions for Coaches */}
        <QuickActionsPanel pendingReviews={pendingReviews} />

        {/* Pipeline Progress */}
        <PipelineProgress
          completed={taskStats?.completed || 0}
          inProgress={taskStats?.in_progress || 0}
          pending={taskStats?.pending || 0}
          total={taskStats?.total || 0}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cluster Grid */}
          <ClusterGrid clusters={clusters} />

          {/* Activity Feed */}
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Live Pages */}
        <LivePagesTable pages={pages} />
      </div>
    </div>
  );
}
