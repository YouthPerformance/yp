// ═══════════════════════════════════════════════════════════
// ADMIN CAMPAIGN DETAIL PAGE
// View and edit a single content campaign
// ═══════════════════════════════════════════════════════════

"use client";

import { api } from "@yp/alpha/convex/_generated/api";
import type { Id } from "@yp/alpha/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Platform icons/labels
const PLATFORMS = {
  BLOG: { icon: "📝", label: "Blog Post", color: "#4CAF50" },
  LINKEDIN: { icon: "💼", label: "LinkedIn", color: "#0077B5" },
  TWITTER: { icon: "🐦", label: "Twitter/X", color: "#1DA1F2" },
  INSTAGRAM: { icon: "📸", label: "Instagram", color: "#E4405F" },
};

// Status colors
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "rgba(255, 193, 7, 0.2)", text: "#FFC107" },
  READY: { bg: "rgba(0, 246, 224, 0.2)", text: "#00F6E0" },
  PUBLISHED: { bg: "rgba(76, 175, 80, 0.2)", text: "#4CAF50" },
  FAILED: { bg: "rgba(244, 67, 54, 0.2)", text: "#F44336" },
};

type Platform = "BLOG" | "LINKEDIN" | "TWITTER" | "INSTAGRAM";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as Id<"campaigns">;

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("BLOG");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  // Fetch campaign with assets
  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });

  // Mutations
  const updateStatus = useMutation(api.campaigns.updateStatus);
  const updateAsset = useMutation(api.campaigns.updateAsset);
  const deleteCampaign = useMutation(api.campaigns.deleteCampaign);

  // Handle status change
  const handleStatusChange = async (newStatus: "DRAFT" | "READY" | "PUBLISHED" | "FAILED") => {
    await updateStatus({ campaignId, status: newStatus });
  };

  // Handle content edit
  const handleStartEdit = () => {
    const currentAsset = campaign?.assets[selectedPlatform];
    if (currentAsset) {
      setEditedContent(currentAsset.body);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    const currentAsset = campaign?.assets[selectedPlatform];
    if (currentAsset) {
      await updateAsset({
        assetId: currentAsset._id,
        body: editedContent,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  // Handle delete
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this campaign? This cannot be undone.")) {
      await deleteCampaign({ campaignId });
      router.push("/admin/campaigns");
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    const currentAsset = campaign?.assets[selectedPlatform];
    if (currentAsset) {
      navigator.clipboard.writeText(currentAsset.body);
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (campaign === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
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
            Loading campaign...
          </span>
        </div>
      </div>
    );
  }

  // Not found state
  if (campaign === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <span className="text-4xl mb-4">🔍</span>
        <p
          className="font-bebas text-xl tracking-wider mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          CAMPAIGN NOT FOUND
        </p>
        <Link
          href="/admin/campaigns"
          className="text-sm"
          style={{ color: "var(--accent-primary)" }}
        >
          ← Back to Campaigns
        </Link>
      </div>
    );
  }

  const statusColors = STATUS_COLORS[campaign.status];
  const currentAsset = campaign.assets[selectedPlatform];
  const platformConfig = PLATFORMS[selectedPlatform];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-2 text-sm"
        style={{ color: "var(--text-tertiary)" }}
      >
        ← Back to Campaigns
      </Link>

      {/* Header */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor:
                    campaign.author === "ADAM"
                      ? "rgba(0, 246, 224, 0.2)"
                      : "rgba(156, 39, 176, 0.2)",
                  color: campaign.author === "ADAM" ? "#00F6E0" : "#9C27B0",
                }}
              >
                {campaign.author}
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                }}
              >
                {campaign.status}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-bebas text-3xl tracking-wider mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {campaign.title}
            </h1>

            {/* Meta */}
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Created {formatDate(campaign.createdAt)}
              {campaign.publishedAt && ` • Published ${formatDate(campaign.publishedAt)}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Status Selector */}
            <select
              value={campaign.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <option value="DRAFT">Draft</option>
              <option value="READY">Ready</option>
              <option value="PUBLISHED">Published</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: "rgba(244, 67, 54, 0.2)",
                color: "#F44336",
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Raw Input */}
        {campaign.rawInput && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
              Original Input
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {campaign.rawInput}
            </p>
          </div>
        )}
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(PLATFORMS) as Platform[]).map((platform) => {
          const config = PLATFORMS[platform];
          const isActive = selectedPlatform === platform;
          return (
            <button
              key={platform}
              onClick={() => {
                setSelectedPlatform(platform);
                setIsEditing(false);
              }}
              className="px-4 py-3 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
                border: `1px solid ${isActive ? config.color : "var(--border-default)"}`,
                color: isActive ? config.color : "var(--text-secondary)",
              }}
            >
              <span>{config.icon}</span>
              <span className="text-sm font-medium">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panel */}
      <motion.div
        key={selectedPlatform}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: `1px solid ${platformConfig.color}`,
        }}
      >
        {/* Panel Header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderBottom: `1px solid var(--border-default)`,
          }}
        >
          <div className="flex items-center gap-2">
            <span>{platformConfig.icon}</span>
            <span className="font-bebas tracking-wider" style={{ color: platformConfig.color }}>
              {platformConfig.label.toUpperCase()}
            </span>
            {currentAsset?.title && (
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                • {currentAsset.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: platformConfig.color,
                    color: "white",
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: platformConfig.color,
                    color: "white",
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {currentAsset ? (
            isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-96 p-4 rounded-lg text-sm resize-none"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
              />
            ) : (
              <pre
                className="whitespace-pre-wrap text-sm font-sans"
                style={{ color: "var(--text-primary)" }}
              >
                {currentAsset.body}
              </pre>
            )
          ) : (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              No content available for this platform
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
