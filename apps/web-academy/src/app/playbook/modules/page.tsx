// ═══════════════════════════════════════════════════════════
// MODULES LIST
// All available learning modules
// ═══════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle, Lock } from 'lucide-react';
import { moduleRegistry } from '@/data/modules/bulletproof-ankles';

export const metadata: Metadata = {
  title: 'Learning Modules | YP Academy',
  description: 'Interactive micro-courses to master athletic performance concepts.',
};

export default function ModulesPage() {
  const modules = Object.values(moduleRegistry);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bebas uppercase tracking-wide text-white mb-4">
            Learning Modules
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            Interactive micro-courses designed to build your knowledge of athletic performance.
            Swipe through lessons, test your understanding, and earn crystals along the way.
          </p>
        </div>
      </div>

      {/* Module list */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-12 p-8 rounded-2xl border border-border-subtle bg-bg-secondary text-center">
          <Lock className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-bebas uppercase tracking-wide text-white mb-2">
            More Modules Coming Soon
          </h3>
          <p className="text-text-secondary">
            We're constantly building new learning experiences. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MODULE CARD
// ─────────────────────────────────────────────────────────────

interface ModuleCardProps {
  module: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    estimatedMinutes: number;
    sections: Array<{ cards: unknown[] }>;
  };
}

function ModuleCard({ module }: ModuleCardProps) {
  const totalCards = module.sections.reduce(
    (sum, section) => sum + section.cards.length,
    0
  );

  // TODO: Get actual progress from Convex
  const isCompleted = false;
  const isStarted = false;

  return (
    <Link
      href={`/playbook/modules/${module.slug}`}
      className="block p-6 rounded-2xl border border-border-default bg-bg-tertiary
                 hover:border-accent-primary/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Status indicator */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${
              isCompleted
                ? 'bg-accent-primary text-black'
                : 'bg-bg-secondary border border-border-default'
            }
          `}
        >
          {isCompleted ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <span className="text-2xl">🦶</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bebas uppercase tracking-wide text-white mb-1 group-hover:text-accent-primary transition-colors">
            {module.title}
          </h2>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {module.shortDescription}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {module.estimatedMinutes} min
            </span>
            <span>•</span>
            <span>{totalCards} cards</span>
            <span>•</span>
            <span>{module.sections.length} sections</span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary transition-colors" />
      </div>

      {/* Progress bar (if started) */}
      {isStarted && !isCompleted && (
        <div className="mt-4 h-1 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-primary rounded-full"
            style={{ width: '35%' }}
          />
        </div>
      )}
    </Link>
  );
}
