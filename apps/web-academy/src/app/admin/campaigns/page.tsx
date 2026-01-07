// ═══════════════════════════════════════════════════════════
// ADMIN CAMPAIGNS PAGE
// List and manage content campaigns from GPT Uplink
// ═══════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@yp/alpha/convex/_generated/api';
import { Id } from '@yp/alpha/convex/_generated/dataModel';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Status badge colors
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'rgba(255, 193, 7, 0.2)', text: '#FFC107' },
  READY: { bg: 'rgba(0, 246, 224, 0.2)', text: '#00F6E0' },
  PUBLISHED: { bg: 'rgba(76, 175, 80, 0.2)', text: '#4CAF50' },
  FAILED: { bg: 'rgba(244, 67, 54, 0.2)', text: '#F44336' },
};

// Author badge colors
const AUTHOR_COLORS: Record<string, { bg: string; text: string }> = {
  ADAM: { bg: 'rgba(0, 246, 224, 0.2)', text: '#00F6E0' },
  JAMES: { bg: 'rgba(156, 39, 176, 0.2)', text: '#9C27B0' },
};

type StatusFilter = 'ALL' | 'DRAFT' | 'READY' | 'PUBLISHED' | 'FAILED';
type AuthorFilter = 'ALL' | 'ADAM' | 'JAMES';

// Campaign type for list items
interface Campaign {
  _id: Id<'campaigns'>;
  title: string;
  author: 'ADAM' | 'JAMES';
  status: 'DRAFT' | 'READY' | 'PUBLISHED' | 'FAILED';
  rawInput: string;
  createdAt: number;
  publishedAt?: number;
}

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [authorFilter, setAuthorFilter] = useState<AuthorFilter>('ALL');

  // Fetch campaigns with filters
  const campaigns = useQuery(api.campaigns.listCampaigns, {
    author: authorFilter === 'ALL' ? undefined : authorFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    limit: 100,
  });

  // Fetch stats
  const stats = useQuery(api.campaigns.getCampaignStats, {});

  // Delete mutation
  const deleteCampaign = useMutation(api.campaigns.deleteCampaign);

  const handleDelete = async (campaignId: Id<'campaigns'>) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await deleteCampaign({ campaignId });
    }
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-bebas text-3xl tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            CONTENT CAMPAIGNS
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Manage content from GPT Uplink
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={stats.total} color="#FFFFFF" />
          <StatCard label="Draft" value={stats.draft} color="#FFC107" />
          <StatCard label="Ready" value={stats.ready} color="#00F6E0" />
          <StatCard label="Published" value={stats.published} color="#4CAF50" />
          <StatCard label="Failed" value={stats.failed} color="#F44336" />
        </div>
      )}

      {/* Filters */}
      <div
        className="flex flex-wrap gap-4 p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Status:
          </span>
          <div className="flex gap-1">
            {(['ALL', 'DRAFT', 'READY', 'PUBLISHED', 'FAILED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor:
                    statusFilter === status
                      ? 'var(--accent-primary)'
                      : 'var(--bg-tertiary)',
                  color:
                    statusFilter === status
                      ? 'var(--bg-primary)'
                      : 'var(--text-secondary)',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Author Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Author:
          </span>
          <div className="flex gap-1">
            {(['ALL', 'ADAM', 'JAMES'] as const).map((author) => (
              <button
                key={author}
                onClick={() => setAuthorFilter(author)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor:
                    authorFilter === author
                      ? 'var(--accent-primary)'
                      : 'var(--bg-tertiary)',
                  color:
                    authorFilter === author
                      ? 'var(--bg-primary)'
                      : 'var(--text-secondary)',
                }}
              >
                {author}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns === undefined ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-8 h-8">
                <div
                  className="absolute inset-0 border-2 rounded-full"
                  style={{ borderColor: 'var(--accent-primary)', opacity: 0.2 }}
                />
                <div
                  className="absolute inset-0 border-2 border-transparent rounded-full animate-spin"
                  style={{ borderTopColor: 'var(--accent-primary)' }}
                />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Loading campaigns...
              </span>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          // Empty state
          <div
            className="flex flex-col items-center justify-center py-12 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span className="text-4xl mb-4">📭</span>
            <p
              className="font-bebas text-xl tracking-wider mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              NO CAMPAIGNS YET
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Campaigns created via GPT Uplink will appear here
            </p>
          </div>
        ) : (
          // Campaign cards
          campaigns.map((campaign: Campaign, index: number) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CampaignCard
                campaign={campaign}
                onDelete={() => handleDelete(campaign._id)}
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p
        className="text-2xl font-mono font-bold"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

function CampaignCard({
  campaign,
  onDelete,
  formatDate,
}: {
  campaign: Campaign;
  onDelete: () => void;
  formatDate: (ts: number) => string;
}) {
  const statusColors = STATUS_COLORS[campaign.status];
  const authorColors = AUTHOR_COLORS[campaign.author];

  return (
    <div
      className="p-4 rounded-xl transition-all hover:scale-[1.01]"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Author Badge */}
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: authorColors.bg,
                color: authorColors.text,
              }}
            >
              {campaign.author}
            </span>
            {/* Status Badge */}
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
              }}
            >
              {campaign.status}
            </span>
            {/* Date */}
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {formatDate(campaign.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bebas text-lg tracking-wider mb-1 truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {campaign.title}
          </h3>

          {/* Raw input preview */}
          <p
            className="text-sm line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {campaign.rawInput || 'No raw input'}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/campaigns/${campaign._id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            View
          </Link>
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
