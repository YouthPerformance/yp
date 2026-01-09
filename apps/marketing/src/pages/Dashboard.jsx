import { useUser } from "@clerk/clerk-react";

function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-yp-display uppercase tracking-wide text-white mb-2">
          Welcome back{user ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-dark-text-secondary mb-8">Continue your training journey</p>

        {/* Continue Watching */}
        <section className="mb-12">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Continue Training
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-black-50 border border-black-400 rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <div className="aspect-video bg-black-100 rounded-lg mb-4 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black-400 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${i * 30}%` }}></div>
                  </div>
                </div>
                <h3 className="font-semibold mb-1 text-white">Movement Foundations {i}</h3>
                <p className="text-dark-text-secondary text-sm">Session 5: Hip Mobility Flow</p>
              </div>
            ))}
          </div>
        </section>

        {/* My Programs */}
        <section className="mb-12">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            My Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "R3 Foundations", progress: 80 },
              { title: "Speed & Agility", progress: 45 },
              { title: "Foot Strength", progress: 60 },
              { title: "Jump Training", progress: 25 },
            ].map((program, i) => (
              <div
                key={i}
                className="bg-black-50 border border-black-400 rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <div className="aspect-video bg-black-100 rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2 text-sm text-white">{program.title}</h3>
                <div className="flex items-center justify-between text-xs text-dark-text-tertiary">
                  <span>{program.progress}% complete</span>
                  <span>{Math.floor(program.progress / 8)}/12 sessions</span>
                </div>
                <div className="mt-2 h-1 bg-black-400 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${program.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Your Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black-50 border border-black-400 rounded-xl p-6 text-center">
              <p className="text-3xl font-yp-display text-cyan-500 mb-1">12</p>
              <p className="text-dark-text-secondary text-sm">Hours Trained</p>
            </div>
            <div className="bg-black-50 border border-black-400 rounded-xl p-6 text-center">
              <p className="text-3xl font-yp-display text-cyan-500 mb-1">4</p>
              <p className="text-dark-text-secondary text-sm">Programs Started</p>
            </div>
            <div className="bg-black-50 border border-black-400 rounded-xl p-6 text-center">
              <p className="text-3xl font-yp-display text-cyan-500 mb-1">1</p>
              <p className="text-dark-text-secondary text-sm">Programs Completed</p>
            </div>
            <div className="bg-black-50 border border-black-400 rounded-xl p-6 text-center">
              <p className="text-3xl font-yp-display text-gold-500 mb-1">5</p>
              <p className="text-dark-text-secondary text-sm">Day Streak</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold p-4 rounded-xl transition-colors text-left">
              <span className="block text-lg mb-1">Start Today's Session</span>
              <span className="text-sm opacity-80">20 min • Release Flow</span>
            </button>
            <button className="bg-black-50 border border-black-400 hover:border-cyan-500/50 text-white p-4 rounded-xl transition-colors text-left">
              <span className="block text-lg mb-1">Browse Programs</span>
              <span className="text-sm text-dark-text-secondary">Explore the full library</span>
            </button>
            <button className="bg-black-50 border border-black-400 hover:border-cyan-500/50 text-white p-4 rounded-xl transition-colors text-left">
              <span className="block text-lg mb-1">Take Assessment</span>
              <span className="text-sm text-dark-text-secondary">Find your starting point</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
