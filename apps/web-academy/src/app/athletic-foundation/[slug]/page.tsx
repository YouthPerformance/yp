import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  FOUNDATION_PAGES,
  FOUNDATION_DRILLS,
  FOUNDATION_WORKOUTS,
  getFoundationPageBySlug,
} from '@/src/data/athletic-foundation-data';

export async function generateStaticParams() {
  return FOUNDATION_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFoundationPageBySlug(slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  return {
    title: `${page.title} | YouthPerformance`,
    description: page.metaDescription,
    keywords: page.targetKeywords,
  };
}

export default async function FoundationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFoundationPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const drills = page.drills
    .map((drillSlug) => FOUNDATION_DRILLS[drillSlug])
    .filter(Boolean);

  const workouts =
    page.workouts
      ?.map((workoutSlug) => FOUNDATION_WORKOUTS[workoutSlug])
      .filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/athletic-foundation"
              className="hover:text-white transition-colors"
            >
              Athletic Foundation
            </Link>
            <span>/</span>
            <span className="text-orange-400">{page.title}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {page.sport && (
              <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                {page.sport}
              </span>
            )}
            {page.ageRange && (
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                Ages {page.ageRange}
              </span>
            )}
            <span className="bg-white/10 text-zinc-400 px-3 py-1 rounded-full text-sm">
              {page.athleteType}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6">
            {page.title}
          </h1>

          <p className="text-xl text-zinc-400 mb-8">{page.metaDescription}</p>

          {/* Problem -> Solution */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="font-bold text-red-400 mb-2">The Problem</h3>
              <p className="text-zinc-300">{page.problemSolved}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-green-400 mb-2">The Outcome</h3>
              <p className="text-zinc-300">{page.performanceOutcome}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Drills */}
      <section className="py-16 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Your Drill Program</h2>

          <div className="space-y-6">
            {drills.map((drill, index) => (
              <div
                key={drill.slug}
                className="bg-zinc-800 border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Drill Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-orange-500 text-black font-bold rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold">{drill.name}</h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        drill.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : drill.difficulty === 'intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {drill.difficulty}
                    </span>
                  </div>
                  <p className="text-zinc-400">{drill.purpose}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                    <span>⏱️ {drill.duration}</span>
                    <span>🔄 {drill.reps}</span>
                    {drill.equipment.length > 0 && (
                      <span>🎒 {drill.equipment.join(', ')}</span>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-6 border-b border-white/10">
                  <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-wide mb-4">
                    How To Do It
                  </h4>
                  <ol className="space-y-2">
                    {drill.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-zinc-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Coaching Cues */}
                <div className="p-6 bg-orange-500/5">
                  <h4 className="font-bold text-sm text-orange-400 uppercase tracking-wide mb-3">
                    Coach's Cues
                  </h4>
                  <div className="space-y-2">
                    {drill.coachingCues.map((cue, i) => (
                      <p key={i} className="text-zinc-300 italic">
                        {cue}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="p-6 border-t border-white/10">
                  <h4 className="font-bold text-sm text-red-400 uppercase tracking-wide mb-3">
                    Avoid These Mistakes
                  </h4>
                  <ul className="space-y-1">
                    {drill.commonMistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-zinc-400 text-sm"
                      >
                        <span className="text-red-500">✗</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Science Note */}
                {drill.scienceNote && (
                  <div className="px-6 py-4 bg-cyan-500/10 border-t border-cyan-500/30">
                    <p className="text-cyan-400 text-sm">
                      <span className="font-bold">Science Note:</span>{' '}
                      {drill.scienceNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workouts */}
      {workouts.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Recommended Workouts</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {workouts.map((workout) => (
                <div
                  key={workout.slug}
                  className="bg-zinc-900 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{workout.name}</h3>
                    <span className="text-orange-400 font-mono">
                      {workout.duration}
                    </span>
                  </div>
                  <p className="text-zinc-400 mb-4">{workout.athleticGoal}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-zinc-500 font-bold mb-2">
                        Warmup
                      </h4>
                      <ul className="text-sm text-zinc-400">
                        {workout.warmup.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm text-zinc-500 font-bold mb-2">
                        Main Work
                      </h4>
                      <ul className="text-sm text-zinc-400">
                        {workout.drills.map((drillSlug, i) => (
                          <li key={i}>
                            • {FOUNDATION_DRILLS[drillSlug]?.name || drillSlug}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm text-zinc-500 font-bold mb-2">
                        Cooldown
                      </h4>
                      <ul className="text-sm text-zinc-400">
                        {workout.cooldown.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Guides */}
      <section className="py-16 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Related Guides</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {FOUNDATION_PAGES.filter((p) => p.slug !== page.slug)
              .slice(0, 4)
              .map((relatedPage) => (
                <Link
                  key={relatedPage.slug}
                  href={`/athletic-foundation/${relatedPage.slug}`}
                  className="bg-zinc-800 border border-white/10 rounded-xl p-4 hover:border-orange-500/50 transition-colors"
                >
                  <h3 className="font-bold mb-1 hover:text-orange-400 transition-colors">
                    {relatedPage.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {relatedPage.athleteType}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Build Your Foundation?
          </h2>
          <p className="text-zinc-400 mb-8">
            Start with the first drill. 3 minutes a day. Feel the difference in
            2 weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/athletic-foundation"
              className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors"
            >
              Back to All Guides
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
