// ═══════════════════════════════════════════════════════════
// MODULE DETAIL / START PAGE
// Overview of module with start button
// ═══════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Zap, CheckCircle } from 'lucide-react';
import { moduleRegistry } from '@/data/modules/bulletproof-ankles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = Object.values(moduleRegistry).find((m) => m.slug === slug);

  if (!module) {
    return { title: 'Module Not Found | YP Academy' };
  }

  return {
    title: `${module.title} | YP Academy`,
    description: module.seo.description,
    openGraph: {
      title: module.seo.title,
      description: module.seo.description,
    },
  };
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const module = Object.values(moduleRegistry).find((m) => m.slug === slug);

  if (!module) {
    notFound();
  }

  const totalCards = module.sections.reduce(
    (sum, section) => sum + section.cards.length,
    0
  );
  const checkCards = module.sections.reduce(
    (sum, section) => sum + section.cards.filter((c) => c.type === 'Check').length,
    0
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Back link */}
      <div className="border-b border-border-subtle bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/playbook/modules"
            className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Modules
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-4xl mb-4">🦶</div>
          <h1 className="text-4xl md:text-5xl font-bebas uppercase tracking-wide text-white mb-4">
            {module.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            {module.shortDescription}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-5 h-5 text-accent-primary" />
              <span>{module.estimatedMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Zap className="w-5 h-5 text-accent-gold" />
              <span>{totalCards} cards</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle className="w-5 h-5 text-accent-primary" />
              <span>{checkCards} quick checks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bebas uppercase tracking-wide text-white mb-3">
            What You'll Learn
          </h2>
          <p className="text-text-secondary">{module.longDescription}</p>
        </div>

        {/* Sections overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bebas uppercase tracking-wide text-white mb-4">
            Module Sections
          </h2>
          <div className="space-y-3">
            {module.sections.map((section, idx) => (
              <div
                key={section.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border-default bg-bg-tertiary"
              >
                <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-bold text-text-tertiary">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{section.title}</p>
                  <p className="text-sm text-text-tertiary">
                    {section.cards.length} cards
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mode explanation */}
        <div className="mb-8 p-6 rounded-xl border border-border-default bg-bg-tertiary">
          <h2 className="text-xl font-bebas uppercase tracking-wide text-white mb-3">
            Two Ways to Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🏃</span>
                <span className="font-bold text-white">Athlete Mode</span>
              </div>
              <p className="text-sm text-text-secondary">
                Quick, action-focused content written for young athletes.
                Get straight to what you need to know.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👨‍👩‍👧</span>
                <span className="font-bold text-white">Parent Mode</span>
              </div>
              <p className="text-sm text-text-secondary">
                Deeper explanations with context for supporting your athlete.
                Toggle anytime while learning.
              </p>
            </div>
          </div>
        </div>

        {/* XP & Shards rewards */}
        <div className="mb-12 p-6 rounded-xl border border-accent-gold/30 bg-accent-gold/5">
          <h2 className="text-xl font-bebas uppercase tracking-wide text-accent-gold mb-3">
            Earn XP ⚡
          </h2>
          <p className="text-text-secondary mb-4">
            Answer quick check questions correctly to earn XP. Complete levels to earn shards that convert to crystals!
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• First try correct: +5 XP</li>
            <li>• Retry correct: +2 XP</li>
            <li>• Level completion: Bonus XP + Shards</li>
            <li>• 10 Shards = 1 Crystal 💎</li>
          </ul>
        </div>

        {/* Start button */}
        <div className="sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent">
          <Link
            href={`/playbook/modules/${module.slug}/play`}
            className="block w-full py-4 bg-accent-primary text-black font-bold uppercase tracking-wide text-center rounded-xl
                     hover:bg-accent-primary-hover transition-colors
                     shadow-[0_0_30px_rgba(0,246,224,0.3)]"
          >
            Start Module
          </Link>
        </div>
      </div>
    </div>
  );
}
