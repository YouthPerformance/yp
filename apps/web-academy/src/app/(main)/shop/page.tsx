// ═══════════════════════════════════════════════════════════
// SHOP PAGE
// Crystal store for purchasing items
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';

const shopItems = [
  {
    id: '1',
    name: 'Streak Saver',
    description: 'Protect your streak for one day',
    price: 50,
    icon: '🛡️',
  },
  {
    id: '2',
    name: 'XP Boost',
    description: '2x XP for your next workout',
    price: 100,
    icon: '⚡',
  },
  {
    id: '3',
    name: 'Card Pack',
    description: '3 random anime cards',
    price: 150,
    icon: '🎴',
  },
  {
    id: '4',
    name: 'Theme Pack',
    description: 'Unlock new wolf colors',
    price: 200,
    icon: '🎨',
  },
];

const crystalBundles = [
  { id: 'c1', amount: 100, price: '$0.99', bonus: '' },
  { id: 'c2', amount: 500, price: '$4.99', bonus: '+50 bonus' },
  { id: 'c3', amount: 1200, price: '$9.99', bonus: '+200 bonus' },
];

export default function ShopPage() {
  const { user } = useUserContext();
  const userCrystals = user?.crystals || 0;

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
            SHOP
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Spend your crystals wisely
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Gem className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
          <span
            className="font-mono font-bold"
            style={{ color: 'var(--accent-gold)' }}
          >
            {userCrystals}
          </span>
        </div>
      </motion.div>

      {/* Items Section */}
      <section className="mb-8">
        <h2
          className="font-bebas text-xl tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          POWER-UPS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {shopItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <span className="text-3xl block mb-2">{item.icon}</span>
              <h3
                className="font-bebas tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name.toUpperCase()}
              </h3>
              <p
                className="text-xs mb-3"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {item.description}
              </p>
              <motion.button
                className="w-full py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                style={{
                  backgroundColor:
                    userCrystals >= item.price
                      ? 'var(--accent-gold)'
                      : 'var(--bg-tertiary)',
                  color:
                    userCrystals >= item.price
                      ? 'var(--bg-primary)'
                      : 'var(--text-tertiary)',
                }}
                whileHover={userCrystals >= item.price ? { scale: 1.05 } : {}}
                whileTap={userCrystals >= item.price ? { scale: 0.95 } : {}}
              >
                <Gem className="w-4 h-4" />
                {item.price}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Crystal Bundles */}
      <section>
        <h2
          className="font-bebas text-xl tracking-wider mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          GET CRYSTALS
        </h2>
        <div className="space-y-3">
          {crystalBundles.map((bundle, i) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                >
                  <Gem className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                </div>
                <div>
                  <p
                    className="font-mono font-bold"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    {bundle.amount} Crystals
                  </p>
                  {bundle.bonus && (
                    <p className="text-xs" style={{ color: 'var(--accent-primary)' }}>
                      {bundle.bonus}
                    </p>
                  )}
                </div>
              </div>
              <motion.button
                className="px-4 py-2 rounded-lg font-bebas tracking-wider"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {bundle.price}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
