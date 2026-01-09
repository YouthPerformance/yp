import { Link } from "react-router-dom";
import { Badge, Button, Card, ProgressBar } from "../../components/ui";

function AppHome() {
  // Mock user data
  const user = {
    name: "Athlete",
    currentProgram: {
      id: "barefoot-reset",
      name: "Barefoot Reset",
      progress: 40,
      currentLesson: {
        id: "w1-d3",
        title: "Single Leg Balance",
        week: 1,
        day: 3,
      },
    },
    streak: 3,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black-50 border-b border-black-400">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm">Welcome back,</p>
              <h1 className="text-2xl font-yp-display uppercase text-white">{user.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <p className="text-2xl font-yp-display text-cyan-500">{user.streak}</p>
                <p className="text-xs text-dark-text-tertiary">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Continue Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-yp-display uppercase text-white mb-4">Continue Training</h2>

        <Card variant="highlight" className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="cyan" size="sm">
                Current Program
              </Badge>
              <h3 className="text-xl font-yp-display uppercase text-white mt-2">
                {user.currentProgram.name}
              </h3>
              <p className="text-dark-text-secondary text-sm mt-1">
                Week {user.currentProgram.currentLesson.week} • Day{" "}
                {user.currentProgram.currentLesson.day}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-yp-display text-cyan-500">
                {user.currentProgram.progress}%
              </p>
              <p className="text-xs text-dark-text-tertiary">Complete</p>
            </div>
          </div>

          <ProgressBar value={user.currentProgram.progress} max={100} className="mb-4" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/app/lessons/${user.currentProgram.currentLesson.id}`} className="flex-1">
              <Button fullWidth>Continue: {user.currentProgram.currentLesson.title}</Button>
            </Link>
            <Link to="/app/programs/barefoot-reset">
              <Button variant="secondary">View Program</Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-yp-display uppercase text-white mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/app/stacks/bulletproof-ankles/run">
            <Card variant="interactive" className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="font-medium text-white">Quick Stack</p>
              <p className="text-sm text-dark-text-tertiary">8 min warmup</p>
            </Card>
          </Link>

          <Link to="/quiz/athlete-type">
            <Card variant="interactive" className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gold-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="font-medium text-white">Retake Quiz</p>
              <p className="text-sm text-dark-text-tertiary">Check progress</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Programs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-yp-display uppercase text-white">Your Programs</h2>
        </div>

        <div className="space-y-4">
          <Link to="/app/programs/barefoot-reset">
            <Card variant="interactive" className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🦶</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">Barefoot Reset</h3>
                <p className="text-sm text-dark-text-tertiary">4 weeks • 20 lessons</p>
                <ProgressBar value={40} max={100} size="sm" className="mt-2" />
              </div>
              <svg
                className="w-5 h-5 text-dark-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Card>
          </Link>

          {/* Locked Programs */}
          <Card className="flex items-center gap-4 opacity-60">
            <div className="w-16 h-16 rounded-xl bg-black-300 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-dark-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-dark-text-secondary">Court Ready</h3>
              <p className="text-sm text-dark-text-tertiary">Academy membership required</p>
            </div>
            <Badge variant="gold" size="sm">
              Upgrade
            </Badge>
          </Card>
        </div>
      </div>

      {/* Bottom Nav Placeholder */}
      <div className="h-20"></div>

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black-100 border-t border-black-400 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <Link to="/app" className="flex flex-col items-center gap-1 text-cyan-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/app/programs/barefoot-reset"
            className="flex flex-col items-center gap-1 text-dark-text-tertiary hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-xs">Programs</span>
          </Link>
          <Link
            to="/settings"
            className="flex flex-col items-center gap-1 text-dark-text-tertiary hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default AppHome;
