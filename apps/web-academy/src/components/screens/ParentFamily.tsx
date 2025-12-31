// ═══════════════════════════════════════════════════════════
// PARENT FAMILY & BILLING SCREEN
// Easy family management - Athletes, subscriptions, exports
// "Sponsor Report" Theme - Same brand, calmer energy
// ═══════════════════════════════════════════════════════════

'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Athlete {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'paused' | 'completed';
  daysCompleted: number;
  totalDays: number;
}

interface Subscription {
  plan: 'monthly' | 'annual' | 'lifetime';
  status: 'active' | 'paused' | 'cancelled';
  renewDate?: Date;
  athleteSlots: number;
  usedSlots: number;
  price: number;
}

interface NotificationPrefs {
  weeklySummary: boolean;
  safetyAlerts: boolean;
}

interface ParentFamilyProps {
  athletes: Athlete[];
  subscription: Subscription;
  notificationPrefs: NotificationPrefs;
  onBack?: () => void;
  onAddAthlete?: () => void;
  onSelectAthlete?: (id: string) => void;
  onManageSubscription?: () => void;
  onPauseSubscription?: () => void;
  onGiftProgram?: () => void;
  onExportData?: () => void;
  onUpdateNotifications?: (prefs: NotificationPrefs) => void;
}

export function ParentFamily({
  athletes,
  subscription,
  notificationPrefs,
  onBack,
  onAddAthlete,
  onSelectAthlete,
  onManageSubscription,
  onPauseSubscription,
  onGiftProgram,
  onExportData,
  onUpdateNotifications,
}: ParentFamilyProps) {
  const [notifications, setNotifications] = useState(notificationPrefs);

  const handleNotificationToggle = (key: keyof NotificationPrefs) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    onUpdateNotifications?.(updated);
  };

  const canAddAthlete = useMemo(() => {
    return subscription.usedSlots < subscription.athleteSlots;
  }, [subscription]);

  const planLabel = useMemo(() => {
    switch (subscription.plan) {
      case 'monthly':
        return 'Monthly';
      case 'annual':
        return 'Annual';
      case 'lifetime':
        return 'Lifetime';
    }
  }, [subscription.plan]);

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
            FAMILY & BILLING
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Manage your athletes and subscription
          </p>
        </div>
      </header>

      {/* Athletes Section */}
      <section
        className="rounded-xl p-5 mb-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Athletes ({subscription.usedSlots}/{subscription.athleteSlots})
          </h2>
          {canAddAthlete && (
            <button
              onClick={onAddAthlete}
              className="text-sm font-medium"
              style={{ color: 'var(--accent-primary)' }}
            >
              + Add Athlete
            </button>
          )}
        </div>

        <div className="space-y-3">
          {athletes.map((athlete, i) => (
            <motion.button
              key={athlete.id}
              className={cn(
                'w-full p-4 rounded-lg text-left',
                'flex items-center justify-between',
                'transition-colors duration-200'
              )}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
              }}
              onClick={() => onSelectAthlete?.(athlete.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: 'var(--border-default)' }}
                >
                  {athlete.avatar || '🐺'}
                </div>
                <div>
                  <span
                    className="font-medium block"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {athlete.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Day {athlete.daysCompleted}/{athlete.totalDays}
                  </span>
                </div>
              </div>
              <AthleteStatusBadge status={athlete.status} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Subscription Section */}
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
          Subscription
        </h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span
              className="font-bebas text-xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {planLabel} Plan
            </span>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <span
            className="font-mono text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            ${subscription.price}/mo
          </span>
        </div>

        {subscription.renewDate && subscription.status === 'active' && (
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Renews {subscription.renewDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onManageSubscription}
            className={cn(
              'flex-1 py-3 rounded-lg text-sm font-medium',
              'transition-colors duration-200'
            )}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
          >
            Manage
          </button>
          {subscription.status === 'active' && (
            <button
              onClick={onPauseSubscription}
              className={cn(
                'flex-1 py-3 rounded-lg text-sm font-medium',
                'transition-colors duration-200'
              )}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              Pause
            </button>
          )}
        </div>
      </section>

      {/* Notifications Section */}
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
          Notifications
        </h2>

        <div className="space-y-4">
          <ToggleRow
            label="Weekly Summary"
            description="Sunday digest with progress overview"
            enabled={notifications.weeklySummary}
            onToggle={() => handleNotificationToggle('weeklySummary')}
          />
          <ToggleRow
            label="Safety Alerts"
            description="Pain reports and 5+ missed sessions"
            enabled={notifications.safetyAlerts}
            onToggle={() => handleNotificationToggle('safetyAlerts')}
          />
        </div>
      </section>

      {/* Actions Section */}
      <section className="space-y-3">
        <button
          onClick={onGiftProgram}
          className={cn(
            'w-full py-4 px-5 rounded-lg text-left',
            'flex items-center justify-between',
            'transition-colors duration-200'
          )}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎁</span>
            <span
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Gift a Program
            </span>
          </div>
          <ChevronRight />
        </button>

        <button
          onClick={onExportData}
          className={cn(
            'w-full py-4 px-5 rounded-lg text-left',
            'flex items-center justify-between',
            'transition-colors duration-200'
          )}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <span
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Export All Data
            </span>
          </div>
          <ChevronRight />
        </button>
      </section>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOGGLE ROW
// ─────────────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span
          className="font-medium block"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {description}
        </span>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'w-12 h-7 rounded-full transition-colors duration-200',
          'relative'
        )}
        style={{
          backgroundColor: enabled
            ? 'var(--accent-primary)'
            : 'var(--border-default)',
        }}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 rounded-full"
          style={{ backgroundColor: 'white' }}
          animate={{ left: enabled ? 26 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STATUS BADGES
// ─────────────────────────────────────────────────────────────

function AthleteStatusBadge({ status }: { status: Athlete['status'] }) {
  const styles = useMemo(() => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(0, 191, 176, 0.15)', color: 'var(--accent-primary)', text: 'Active' };
      case 'paused':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', text: 'Paused' };
      case 'completed':
        return { bg: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-gold)', text: 'Completed' };
    }
  }, [status]);

  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {styles.text}
    </span>
  );
}

function SubscriptionStatusBadge({ status }: { status: Subscription['status'] }) {
  const styles = useMemo(() => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(0, 191, 176, 0.15)', color: 'var(--accent-primary)', text: 'Active' };
      case 'paused':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', text: 'Paused' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', text: 'Cancelled' };
    }
  }, [status]);

  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium ml-2"
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {styles.text}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────

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

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ color: 'var(--text-tertiary)' }}
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ParentFamily;
