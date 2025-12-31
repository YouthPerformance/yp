// ═══════════════════════════════════════════════════════════
// CARDS PAGE
// Anime card collection
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';

// Mock card data
const mockCards = [
  { id: '1', name: 'Swift Paw', rarity: 'rare', unlocked: true },
  { id: '2', name: 'Balance Master', rarity: 'uncommon', unlocked: true },
  { id: '3', name: 'Ground Force', rarity: 'common', unlocked: true },
  { id: '4', name: 'Midnight Predator', rarity: 'legendary', unlocked: false },
  { id: '5', name: 'Spring Warrior', rarity: 'rare', unlocked: false },
  { id: '6', name: 'Foundation King', rarity: 'epic', unlocked: false },
  { id: '7', name: 'Ankle Guardian', rarity: 'common', unlocked: false },
  { id: '8', name: 'Release Phoenix', rarity: 'legendary', unlocked: false },
];

const RARITY_CONFIG = {
  common: { color: '#9CA3AF', glow: 'none' },
  uncommon: { color: '#10B981', glow: '0 0 10px rgba(16, 185, 129, 0.3)' },
  rare: { color: '#3B82F6', glow: '0 0 15px rgba(59, 130, 246, 0.4)' },
  epic: { color: '#8B5CF6', glow: '0 0 20px rgba(139, 92, 246, 0.5)' },
  legendary: { color: '#FFD700', glow: '0 0 25px rgba(255, 215, 0, 0.6)' },
};

export default function CardsPage() {
  const unlockedCount = mockCards.filter((c) => c.unlocked).length;

  return (
    <main className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1
            className="font-bebas text-3xl tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            CARD COLLECTION
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {unlockedCount} of {mockCards.length} cards unlocked
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
          <span className="text-sm font-mono" style={{ color: 'var(--accent-gold)' }}>
            {unlockedCount}/{mockCards.length}
          </span>
        </div>
      </motion.div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockCards.map((card, i) => {
          const rarity = RARITY_CONFIG[card.rarity as keyof typeof RARITY_CONFIG];
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-[3/4] rounded-xl relative overflow-hidden"
              style={{
                backgroundColor: card.unlocked ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                border: `2px solid ${card.unlocked ? rarity.color : 'var(--border-default)'}`,
                boxShadow: card.unlocked ? rarity.glow : 'none',
                opacity: card.unlocked ? 1 : 0.5,
              }}
            >
              {/* Card Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {card.unlocked ? (
                  <>
                    {/* Card Art Placeholder */}
                    <div
                      className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${rarity.color}20` }}
                    >
                      <span className="text-4xl">🐺</span>
                    </div>
                    <p
                      className="font-bebas text-sm tracking-wider text-center"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {card.name.toUpperCase()}
                    </p>
                    <span
                      className="text-[10px] uppercase tracking-wider mt-1"
                      style={{ color: rarity.color }}
                    >
                      {card.rarity}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 mb-2" style={{ color: 'var(--text-tertiary)' }} />
                    <p
                      className="text-xs text-center"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Complete workouts to unlock
                    </p>
                  </>
                )}
              </div>

              {/* Shine effect for unlocked cards */}
              {card.unlocked && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
        }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Rarity Tiers
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
            <div key={rarity} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                {rarity}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
