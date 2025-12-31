// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// User settings and stats
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import {
  Settings,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Trophy,
  Flame,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

// Wolf color to hex mapping
const WOLF_COLORS: Record<string, string> = {
  cyan: '#00F6E0',
  gold: '#FFD700',
  purple: '#9B30FF',
  green: '#10B981',
  red: '#DC143C',
};

const RANK_CONFIG = {
  pup: { label: 'Pup', color: '#9CA3AF' },
  hunter: { label: 'Hunter', color: '#00F6E0' },
  alpha: { label: 'Alpha', color: '#FFD700' },
  apex: { label: 'Apex', color: '#EF4444' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, enrollment, level, isLoaded } = useUserContext();
  const { isLightMode, toggleLightDark } = useTheme();

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">🐺</span>
          <p style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // User data with fallbacks
  const userData = {
    name: user?.name || 'Athlete',
    avatarColor: WOLF_COLORS[user?.avatarColor || 'cyan'] || '#00F6E0',
    rank: user?.rank || 'pup',
    age: user?.age || 14,
    sport: user?.sport || 'Training',
    level: level,
    totalXP: user?.xpTotal || 0,
    daysCompleted: enrollment?.currentDay || 1,
    bestStreak: user?.streakBest || 0,
    subscriptionStatus: user?.subscriptionStatus || 'free',
  };

  const rankConfig = RANK_CONFIG[userData.rank as keyof typeof RANK_CONFIG] || RANK_CONFIG.pup;

  const menuItems = [
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: CreditCard, label: 'Subscription', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            backgroundColor: `${userData.avatarColor}20`,
            border: `3px solid ${rankConfig.color}`,
          }}
        >
          <span className="text-5xl">🐺</span>
        </div>

        <h1
          className="font-bebas text-3xl tracking-wider"
          style={{ color: 'var(--text-primary)' }}
        >
          {userData.name.toUpperCase()}
        </h1>

        <div className="flex items-center justify-center gap-2 mt-1">
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              backgroundColor: `${rankConfig.color}20`,
              color: rankConfig.color,
            }}
          >
            {rankConfig.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Level {userData.level}
          </span>
        </div>

        <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
          {userData.sport} · Age {userData.age}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        <StatCard
          icon={Trophy}
          value={userData.totalXP}
          label="Total XP"
          color="var(--accent-primary)"
        />
        <StatCard
          icon={Calendar}
          value={userData.daysCompleted}
          label="Days Done"
          color="var(--accent-gold)"
        />
        <StatCard
          icon={Flame}
          value={userData.bestStreak}
          label="Best Streak"
          color="#EF4444"
        />
      </motion.div>

      {/* Subscription Status */}
      {userData.subscriptionStatus === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-bebas tracking-wider"
                style={{ color: 'var(--accent-gold)' }}
              >
                FREE PLAN
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Upgrade to unlock all features
              </p>
            </div>
            <motion.button
              className="px-4 py-2 rounded-lg font-bebas tracking-wider"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              UPGRADE
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-4"
      >
        <motion.button
          onClick={toggleLightDark}
          className="w-full p-4 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            {isLightMode ? (
              <Moon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            ) : (
              <Sun className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
            )}
            <span style={{ color: 'var(--text-primary)' }}>
              {isLightMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div
            className="w-12 h-6 rounded-full relative transition-colors"
            style={{
              backgroundColor: isLightMode ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            }}
          >
            <motion.div
              className="w-5 h-5 rounded-full absolute top-0.5"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              animate={{ left: isLightMode ? '26px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
        </motion.button>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2 mb-8"
      >
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            className="w-full p-4 rounded-xl flex items-center justify-between"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
          </motion.button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full p-4 rounded-xl flex items-center justify-center gap-2"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--accent-error)',
          color: 'var(--accent-error)',
        }}
        onClick={async () => {
          localStorage.removeItem('barefoot_onboarding_state');
          await signOut({ redirectUrl: '/' });
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </motion.button>
    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
      <p className="font-mono text-xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
    </div>
  );
}
