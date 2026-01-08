'use client';

import { useState } from 'react';
import {
  ShardIcon,
  CrystalIcon,
  XpIcon,
  CreditIcon,
  ShardMeter,
  CrystalBadge,
  ShardReward,
  XpReward,
} from '@/components/economy';

/**
 * Economy Preview Page
 *
 * Demo page to preview all economy assets and animations.
 * Route: /economy-preview
 *
 * Remove this page before production or gate behind dev mode.
 */
export default function EconomyPreviewPage() {
  const [shards, setShards] = useState(3);
  const [crystals, setCrystals] = useState(7);
  const [showShardReward, setShowShardReward] = useState(false);
  const [showXpReward, setShowXpReward] = useState(false);

  const handleAddShard = () => {
    if (shards >= 9) {
      setShards(0);
      setCrystals((c) => c + 1);
    } else {
      setShards((s) => s + 1);
    }
    setShowShardReward(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-cyan-400">
            Economy v2 Asset Preview
          </h1>
          <p className="mt-2 text-slate-400">
            Placeholder SVGs and components for Wolf Pack Economy
          </p>
        </header>

        {/* Icons Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Icons</h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Shard Icon */}
            <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-900 p-4">
              <div className="flex gap-2">
                <ShardIcon size={32} filled />
                <ShardIcon size={32} filled={false} />
              </div>
              <span className="text-sm text-slate-400">Shard</span>
              <span className="text-xs text-slate-500">Filled / Empty</span>
            </div>

            {/* Crystal Icon */}
            <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-900 p-4">
              <div className="flex gap-2">
                <CrystalIcon size={32} variant="default" />
                <CrystalIcon size={32} variant="gold" />
                <CrystalIcon size={32} variant="rare" />
              </div>
              <span className="text-sm text-slate-400">Crystal</span>
              <span className="text-xs text-slate-500">Default / Gold / Rare</span>
            </div>

            {/* XP Icon */}
            <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-900 p-4">
              <div className="flex gap-2">
                <XpIcon size={32} variant="bolt" />
                <XpIcon size={32} variant="star" />
              </div>
              <span className="text-sm text-slate-400">XP</span>
              <span className="text-xs text-slate-500">Bolt / Star</span>
            </div>

            {/* Credit Icon */}
            <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-900 p-4">
              <div className="flex gap-2">
                <CreditIcon size={32} />
                <CreditIcon size={32} glowing />
              </div>
              <span className="text-sm text-slate-400">Credit</span>
              <span className="text-xs text-slate-500">Default / Glowing</span>
            </div>
          </div>
        </section>

        {/* Icon Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Icon Sizes</h2>

          <div className="flex flex-wrap items-end gap-4 rounded-lg bg-slate-900 p-4">
            <div className="flex flex-col items-center gap-1">
              <ShardIcon size={16} filled />
              <span className="text-xs text-slate-500">16px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShardIcon size={24} filled />
              <span className="text-xs text-slate-500">24px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShardIcon size={32} filled />
              <span className="text-xs text-slate-500">32px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShardIcon size={48} filled glowing />
              <span className="text-xs text-slate-500">48px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShardIcon size={64} filled glowing />
              <span className="text-xs text-slate-500">64px</span>
            </div>
          </div>
        </section>

        {/* Shard Meter */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Shard Meter</h2>

          <div className="space-y-6 rounded-lg bg-slate-900 p-6">
            <div>
              <p className="mb-2 text-sm text-slate-400">Default Size</p>
              <ShardMeter shards={shards} crystals={crystals} />
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">Compact (for nav)</p>
              <ShardMeter shards={shards} crystals={crystals} compact />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddShard}
                className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-500"
              >
                + Add Shard
              </button>
              <button
                onClick={() => setShards(0)}
                className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white transition hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Crystal Badge */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">Crystal Badge</h2>

          <div className="flex flex-wrap gap-4 rounded-lg bg-slate-900 p-6">
            <div className="flex flex-col gap-2">
              <CrystalBadge count={crystals} />
              <span className="text-xs text-slate-500">Default</span>
            </div>
            <div className="flex flex-col gap-2">
              <CrystalBadge count={crystals} compact />
              <span className="text-xs text-slate-500">Compact</span>
            </div>
            <div className="flex flex-col gap-2">
              <CrystalBadge count={crystals} showChange={5} />
              <span className="text-xs text-slate-500">With +5 change</span>
            </div>
            <div className="flex flex-col gap-2">
              <CrystalBadge count={crystals} variant="gold" />
              <span className="text-xs text-slate-500">Gold variant</span>
            </div>
          </div>
        </section>

        {/* Reward Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">
            Reward Animations
          </h2>

          <div className="flex gap-4 rounded-lg bg-slate-900 p-6">
            <button
              onClick={() => setShowShardReward(true)}
              className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-500"
            >
              Trigger +1 Shard
            </button>
            <button
              onClick={() => setShowXpReward(true)}
              className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white transition hover:bg-yellow-500"
            >
              Trigger +50 XP
            </button>
          </div>

          <ShardReward
            amount={1}
            show={showShardReward}
            onComplete={() => setShowShardReward(false)}
          />
          <XpReward
            amount={50}
            show={showXpReward}
            onComplete={() => setShowXpReward(false)}
            position="center"
          />
        </section>

        {/* Color Reference */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-400">
            Color Reference
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="h-12 rounded bg-[#00f0ff]" />
              <span className="text-xs text-slate-400">
                Shard Cyan<br />#00f0ff
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-12 rounded bg-[#a855f7]" />
              <span className="text-xs text-slate-400">
                Crystal Purple<br />#a855f7
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-12 rounded bg-[#facc15]" />
              <span className="text-xs text-slate-400">
                XP Yellow<br />#facc15
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-12 rounded bg-[#3b82f6]" />
              <span className="text-xs text-slate-400">
                Credit Blue<br />#3b82f6
              </span>
            </div>
          </div>
        </section>

        {/* Usage Notes */}
        <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-purple-400">
            Developer Notes
          </h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              <strong className="text-white">Import:</strong>{' '}
              <code className="rounded bg-slate-800 px-1">
                {'import { ShardIcon, CrystalBadge } from "@/components/economy"'}
              </code>
            </p>
            <p>
              <strong className="text-white">Files:</strong>{' '}
              <code className="rounded bg-slate-800 px-1">
                src/components/economy/
              </code>
            </p>
            <p>
              <strong className="text-white">Status:</strong> Placeholder SVGs.
              Replace with designer assets when ready.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
