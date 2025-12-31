// ═══════════════════════════════════════════════════════════
// PARENT SAFETY & NOTES SCREEN
// Eliminate parent anxiety - Pain flags, what's normal, coach notes
// "Sponsor Report" Theme - Same brand, calmer energy
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PainFlag {
  id: string;
  date: Date;
  location: string;
  severity: 'mild' | 'moderate' | 'severe';
  resolved: boolean;
  notes?: string;
}

interface CoachNote {
  id: string;
  date: Date;
  author: string;
  content: string;
  type: 'observation' | 'recommendation' | 'milestone';
}

interface ParentSafetyProps {
  athleteName: string;
  currentWeek: number;
  painFlags: PainFlag[];
  coachNotes: CoachNote[];
  onBack?: () => void;
  onContactSupport?: () => void;
}

export function ParentSafety({
  athleteName,
  currentWeek,
  painFlags,
  coachNotes,
  onBack,
  onContactSupport,
}: ParentSafetyProps) {
  // Separate active and resolved flags
  const { activeFlags, resolvedFlags } = useMemo(() => {
    return {
      activeFlags: painFlags.filter((f) => !f.resolved),
      resolvedFlags: painFlags.filter((f) => f.resolved),
    };
  }, [painFlags]);

  // Get "what's normal" content based on week
  const whatsNormal = useMemo(() => {
    if (currentWeek <= 2) {
      return {
        title: 'Weeks 1-2: Adaptation Phase',
        items: [
          'Mild foot fatigue after sessions is expected',
          'Some muscle soreness in calves and arches',
          'Temporary stiffness in ankles',
        ],
        whenToStop: [
          'Sharp or stabbing pain during exercises',
          'Pain that persists more than 24 hours',
          'Swelling or visible bruising',
        ],
      };
    }
    if (currentWeek <= 4) {
      return {
        title: 'Weeks 3-4: Building Phase',
        items: [
          'Fatigue should be decreasing',
          'Improved balance and stability',
          'Natural callus development on feet',
        ],
        whenToStop: [
          'Pain in specific spots that returns',
          'Difficulty completing basic movements',
          'Any joint pain (knees, hips)',
        ],
      };
    }
    return {
      title: 'Weeks 5-6: Peak Phase',
      items: [
        'Feet should feel stronger and more resilient',
        'Minimal soreness after sessions',
        'Improved proprioception',
      ],
      whenToStop: [
        'Return of early-stage symptoms',
        'New pain in any area',
        'Unusual fatigue or weakness',
      ],
    };
  }, [currentWeek]);

  return (
    <motion.div
      className="min-h-screen px-6 py-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <BackArrow />
        </button>
        <div>
          <h1
            className="font-bebas text-2xl tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            SAFETY & NOTES
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {athleteName}'s wellness tracking
          </p>
        </div>
      </header>

      {/* Active Pain Flags */}
      {activeFlags.length > 0 && (
        <section
          className="rounded-xl p-5 mb-6"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--accent-warning)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚠️</span>
            <h2
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--accent-warning)' }}
            >
              Active Flags ({activeFlags.length})
            </h2>
          </div>

          <div className="space-y-3">
            {activeFlags.map((flag) => (
              <PainFlagCard key={flag.id} flag={flag} />
            ))}
          </div>

          <button
            onClick={onContactSupport}
            className={cn(
              'w-full mt-4 py-3 rounded-lg text-sm font-medium',
              'transition-colors duration-200'
            )}
            style={{
              backgroundColor: 'var(--accent-warning)',
              color: 'var(--bg-primary)',
            }}
          >
            Contact Support Team
          </button>
        </section>
      )}

      {/* No Active Flags */}
      {activeFlags.length === 0 && (
        <section
          className="rounded-xl p-5 mb-6"
          style={{
            backgroundColor: 'rgba(0, 191, 176, 0.1)',
            border: '1px solid var(--accent-primary)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <h2
                className="font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                No Active Concerns
              </h2>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {athleteName} hasn't reported any pain this week
              </p>
            </div>
          </div>
        </section>
      )}

      {/* What's Normal This Week */}
      <section
        className="rounded-xl p-5 mb-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {whatsNormal.title}
        </h2>

        <div className="mb-4">
          <h3
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: 'var(--accent-primary)' }}
          >
            What's Normal
          </h3>
          <ul className="space-y-2">
            {whatsNormal.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--accent-primary)' }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="pt-4"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: 'var(--accent-error)' }}
          >
            Stop Rules
          </h3>
          <ul className="space-y-2">
            {whatsNormal.whenToStop.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--accent-error)' }}>✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Coach Notes */}
      <section
        className="rounded-xl p-5 mb-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Coach Notes
        </h2>

        {coachNotes.length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: 'var(--text-tertiary)' }}
          >
            No coach notes yet
          </p>
        ) : (
          <div className="space-y-4">
            {coachNotes.map((note, i) => (
              <CoachNoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Resolved Flags History */}
      {resolvedFlags.length > 0 && (
        <section
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Resolved Issues ({resolvedFlags.length})
          </h2>

          <div className="space-y-2">
            {resolvedFlags.slice(0, 5).map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {flag.location}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Resolved {formatDate(flag.date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAIN FLAG CARD
// ─────────────────────────────────────────────────────────────

interface PainFlagCardProps {
  flag: PainFlag;
}

function PainFlagCard({ flag }: PainFlagCardProps) {
  const severityColor = useMemo(() => {
    switch (flag.severity) {
      case 'mild':
        return 'var(--accent-gold)';
      case 'moderate':
        return 'var(--accent-warning)';
      case 'severe':
        return 'var(--accent-error)';
    }
  }, [flag.severity]);

  return (
    <div
      className="p-3 rounded-lg"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {flag.location}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full capitalize"
          style={{
            backgroundColor: `${severityColor}20`,
            color: severityColor,
          }}
        >
          {flag.severity}
        </span>
      </div>
      {flag.notes && (
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          "{flag.notes}"
        </p>
      )}
      <p
        className="text-xs mt-2"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Reported {formatDate(flag.date)}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COACH NOTE CARD
// ─────────────────────────────────────────────────────────────

interface CoachNoteCardProps {
  note: CoachNote;
  index: number;
}

function CoachNoteCard({ note, index }: CoachNoteCardProps) {
  const typeStyles = useMemo(() => {
    switch (note.type) {
      case 'observation':
        return { icon: '👁️', color: 'var(--text-secondary)' };
      case 'recommendation':
        return { icon: '💡', color: 'var(--accent-gold)' };
      case 'milestone':
        return { icon: '🏆', color: 'var(--accent-primary)' };
    }
  }, [note.type]);

  return (
    <motion.div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderLeft: `3px solid ${typeStyles.color}`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start gap-2">
        <span>{typeStyles.icon}</span>
        <div className="flex-1">
          <p
            className="text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            {note.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {note.author}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              · {formatDate(note.date)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function BackArrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ color: 'var(--text-primary)' }}
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ParentSafety;
