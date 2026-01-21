import Link from 'next/link';
import {
  FOUNDATION_SCIENCE,
  FOUNDATION_DRILLS,
  FOUNDATION_WORKOUTS,
  FOUNDATION_PAGES,
} from '@/src/data/athletic-foundation-data';

export const metadata = {
  title: 'Athletic Foundation: The Ground Force System | YouthPerformance',
  description:
    'Build explosive athletic performance from the ground up. Your feet are springs, your ankles are your acceleration engine. Train them like the performance systems they are.',
  keywords: [
    'athletic foundation',
    'foot training athletes',
    'ankle power',
    'ground force',
    'youth athlete feet',
  ],
};

export default function AthleticFoundationPage() {
  const drills = Object.values(FOUNDATION_DRILLS);
  const workouts = Object.values(FOUNDATION_WORKOUTS);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/10" />
        <div className="max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Performance System
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Your Feet Are <span className="text-orange-400">Springs</span>.
            <br />
            Your Ankles Are Your{' '}
            <span className="text-amber-400">Acceleration Engine</span>.
          </h1>

          <p className="text-xl text-zinc-400 max-w-3xl mb-8">
            Every explosive first step, every sharp cut, every inch of vertical—it
            all starts from the ground. Yet most athletes train everything{' '}
            <em>except</em> the foundation that powers it all. This changes
            today.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#drills"
              className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors"
            >
              Explore Drills
            </a>
            <a
              href="#science"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              The Science
            </a>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            The Problem: Dead Feet Syndrome
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">
                What Most Kids Have
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  Feet weakened by years of cushioned shoes
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  Arches that collapse instead of spring
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  Ankles that wobble instead of stabilize
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  Slow first step despite working hard
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  Frequent ankle rolls and foot pain
                </li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                What We Build
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  Feet with active, responsive muscles
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  Arches that store and return energy
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  Ankles with explosive stiffness
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  Lightning first step in any direction
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  Bulletproof stability, zero pain
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section id="science" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The Science</h2>

          <div className="space-y-12">
            {/* Feet as Springs */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center text-3xl">
                  🦶
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {FOUNDATION_SCIENCE.feetAsSprings.title}
                  </h3>
                  <p className="text-orange-400">The Spring System</p>
                </div>
              </div>
              <p className="text-zinc-300 whitespace-pre-line mb-6">
                {FOUNDATION_SCIENCE.feetAsSprings.explanation}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {FOUNDATION_SCIENCE.feetAsSprings.keyStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-sm"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Ankle Acceleration */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {FOUNDATION_SCIENCE.ankleAcceleration.title}
                  </h3>
                  <p className="text-amber-400">The Acceleration Engine</p>
                </div>
              </div>
              <p className="text-zinc-300 whitespace-pre-line mb-6">
                {FOUNDATION_SCIENCE.ankleAcceleration.explanation}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {FOUNDATION_SCIENCE.ankleAcceleration.keyStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-sm"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Pain as Signal */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center text-3xl">
                  🔔
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {FOUNDATION_SCIENCE.painAsSignal.title}
                  </h3>
                  <p className="text-red-400">Not Random, Not Permanent</p>
                </div>
              </div>
              <p className="text-zinc-300 whitespace-pre-line mb-6">
                {FOUNDATION_SCIENCE.painAsSignal.explanation}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {FOUNDATION_SCIENCE.painAsSignal.keyStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drill Library */}
      <section id="drills" className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">The Drill Library</h2>
          <p className="text-zinc-400 mb-12">
            {drills.length} exercises to build your athletic foundation from the
            ground up.
          </p>

          {/* Feet as Springs */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-orange-400 flex items-center gap-2">
              🦶 Feet as Springs
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drills
                .filter((d) => d.targetSystem === 'feet-springs')
                .map((drill) => (
                  <div
                    key={drill.slug}
                    className="bg-zinc-800 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{drill.name}</h4>
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
                    <p className="text-sm text-zinc-400 mb-3">
                      {drill.purpose}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{drill.duration}</span>
                      <span>•</span>
                      <span>{drill.reps}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Ankle Acceleration */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
              ⚡ Ankle Acceleration
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drills
                .filter((d) => d.targetSystem === 'ankle-acceleration')
                .map((drill) => (
                  <div
                    key={drill.slug}
                    className="bg-zinc-800 border border-white/10 rounded-xl p-6 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{drill.name}</h4>
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
                    <p className="text-sm text-zinc-400 mb-3">
                      {drill.purpose}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{drill.duration}</span>
                      <span>•</span>
                      <span>{drill.reps}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Integrated */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
              🔗 Integrated System
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drills
                .filter((d) => d.targetSystem === 'integrated')
                .map((drill) => (
                  <div
                    key={drill.slug}
                    className="bg-zinc-800 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{drill.name}</h4>
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
                    <p className="text-sm text-zinc-400 mb-3">
                      {drill.purpose}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{drill.duration}</span>
                      <span>•</span>
                      <span>{drill.reps}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workouts */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready-to-Use Workouts</h2>
          <p className="text-zinc-400 mb-12">
            Structured routines that combine drills for specific goals.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.slug}
                className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{workout.name}</h3>
                  <span className="text-orange-400 font-mono text-sm">
                    {workout.duration}
                  </span>
                </div>
                <p className="text-zinc-400 mb-4">{workout.athleticGoal}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-zinc-500">Drills: </span>
                    <span className="text-zinc-300">
                      {workout.drills
                        .map((d) => FOUNDATION_DRILLS[d]?.name)
                        .filter(Boolean)
                        .join(' → ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specific Guides */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Specific Guides</h2>
          <p className="text-zinc-400 mb-12">
            Deep dives for your sport, age, or specific situation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOUNDATION_PAGES.map((page) => (
              <Link
                key={page.slug}
                href={`/athletic-foundation/${page.slug}`}
                className="group bg-zinc-800 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-orange-400 mb-3">
                  {page.sport && (
                    <span className="bg-orange-500/20 px-2 py-0.5 rounded">
                      {page.sport}
                    </span>
                  )}
                  {page.ageRange && (
                    <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-400">
                      Ages {page.ageRange}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  {page.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {page.performanceOutcome}
                </p>
                <div className="text-xs text-zinc-500">
                  {page.drills.length} drills • {page.workouts?.length || 0}{' '}
                  workouts
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Building Your Foundation Today
          </h2>
          <p className="text-zinc-400 mb-8">
            Pick one drill. Do it for 3 minutes a day. In 2 weeks, you'll feel
            the difference. In 8 weeks, everyone else will see it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#drills"
              className="px-8 py-4 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors"
            >
              Browse Drills
            </a>
            <Link
              href="/"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
