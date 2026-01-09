import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, ProgressBar } from "../../components/ui";

// Mock program data
const program = {
  id: "barefoot-reset",
  name: "Barefoot Reset",
  description:
    "Build your foundation with the 4-week protocol that fixes force leaks, improves absorption, and creates bulletproof ankles.",
  totalWeeks: 4,
  totalLessons: 20,
  weeks: [
    {
      number: 1,
      title: "Foundation",
      description: "Wake up your feet and build the tripod",
      lessons: [
        { id: "w1-d1", day: 1, title: "Tripod Activation", duration: "12 min", completed: true },
        { id: "w1-d2", day: 2, title: "Short Foot Mastery", duration: "10 min", completed: true },
        { id: "w1-d3", day: 3, title: "Single Leg Balance", duration: "12 min", completed: false },
        { id: "w1-d4", day: 4, title: "Ankle Mobility", duration: "10 min", completed: false },
        { id: "w1-d5", day: 5, title: "Week 1 Integration", duration: "15 min", completed: false },
      ],
    },
    {
      number: 2,
      title: "Stability",
      description: "Build control under load",
      lessons: [
        { id: "w2-d1", day: 1, title: "Loaded Balance", duration: "12 min", completed: false },
        { id: "w2-d2", day: 2, title: "Band Resistance", duration: "10 min", completed: false },
        { id: "w2-d3", day: 3, title: "Eccentric Control", duration: "12 min", completed: false },
        {
          id: "w2-d4",
          day: 4,
          title: "Multi-Plane Stability",
          duration: "10 min",
          completed: false,
        },
        { id: "w2-d5", day: 5, title: "Week 2 Integration", duration: "15 min", completed: false },
      ],
    },
    {
      number: 3,
      title: "Elasticity",
      description: "Unlock your spring",
      lessons: [
        { id: "w3-d1", day: 1, title: "Plyometric Prep", duration: "12 min", completed: false },
        { id: "w3-d2", day: 2, title: "Rebound Mechanics", duration: "10 min", completed: false },
        { id: "w3-d3", day: 3, title: "Hop Progressions", duration: "12 min", completed: false },
        { id: "w3-d4", day: 4, title: "Elastic Loading", duration: "10 min", completed: false },
        { id: "w3-d5", day: 5, title: "Week 3 Integration", duration: "15 min", completed: false },
      ],
    },
    {
      number: 4,
      title: "Integration",
      description: "Put it all together",
      lessons: [
        { id: "w4-d1", day: 1, title: "Sport Transfer", duration: "12 min", completed: false },
        { id: "w4-d2", day: 2, title: "Change of Direction", duration: "10 min", completed: false },
        { id: "w4-d3", day: 3, title: "Landing Mechanics", duration: "12 min", completed: false },
        { id: "w4-d4", day: 4, title: "Full Protocol", duration: "15 min", completed: false },
        {
          id: "w4-d5",
          day: 5,
          title: "Assessment & Next Steps",
          duration: "10 min",
          completed: false,
        },
      ],
    },
  ],
};

function WeekCard({ week, isActive, isLocked }) {
  const completedCount = week.lessons.filter((l) => l.completed).length;
  const progress = (completedCount / week.lessons.length) * 100;

  return (
    <Card
      variant={isActive ? "highlight" : isLocked ? "locked" : "interactive"}
      className={isLocked ? "opacity-60" : ""}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <Badge variant={isActive ? "cyan" : "default"} size="sm">
            Week {week.number}
          </Badge>
          <h3 className="text-lg font-yp-display uppercase text-white mt-2">{week.title}</h3>
        </div>
        {isLocked && (
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
      </div>
      <p className="text-dark-text-secondary text-sm mb-4">{week.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-dark-text-tertiary">
          {completedCount}/{week.lessons.length} lessons
        </span>
        <span className="text-cyan-500">{Math.round(progress)}%</span>
      </div>
      <ProgressBar value={completedCount} max={week.lessons.length} size="sm" className="mt-2" />
    </Card>
  );
}

function LessonRow({ lesson, weekNumber, isLocked }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => !isLocked && navigate(`/app/lessons/${lesson.id}`)}
      disabled={isLocked}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl transition-all
        ${
          isLocked
            ? "opacity-50 cursor-not-allowed bg-black-100"
            : lesson.completed
              ? "bg-black-100 hover:bg-black-200"
              : "bg-black-50 hover:bg-black-100 border border-black-400 hover:border-cyan-500/30"
        }
      `}
    >
      {/* Status icon */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${lesson.completed ? "bg-success/20" : isLocked ? "bg-black-300" : "bg-cyan-500/20"}
        `}
      >
        {lesson.completed ? (
          <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : isLocked ? (
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Lesson info */}
      <div className="flex-1 text-left">
        <p
          className={`font-medium ${lesson.completed ? "text-dark-text-secondary" : "text-white"}`}
        >
          Day {lesson.day}: {lesson.title}
        </p>
        <p className="text-sm text-dark-text-tertiary">{lesson.duration}</p>
      </div>

      {/* Arrow */}
      {!isLocked && (
        <svg
          className="w-5 h-5 text-dark-text-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

function ProgramHome() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Calculate overall progress
  const allLessons = program.weeks.flatMap((w) => w.lessons);
  const completedLessons = allLessons.filter((l) => l.completed).length;
  const overallProgress = (completedLessons / allLessons.length) * 100;

  // Find current lesson (first incomplete)
  const currentLesson = allLessons.find((l) => !l.completed);

  // Determine which weeks are unlocked (previous week must be 80%+ complete)
  const getWeekStatus = (weekNumber) => {
    if (weekNumber === 1) return { isLocked: false, isActive: selectedWeek === 1 };
    const prevWeek = program.weeks[weekNumber - 2];
    const prevProgress =
      prevWeek.lessons.filter((l) => l.completed).length / prevWeek.lessons.length;
    return {
      isLocked: prevProgress < 0.8,
      isActive: selectedWeek === weekNumber,
    };
  };

  const selectedWeekData = program.weeks[selectedWeek - 1];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black-50 border-b border-black-400">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            to="/app"
            className="text-dark-text-secondary hover:text-white text-sm mb-4 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <Badge variant="cyan" className="mb-2">
                Program
              </Badge>
              <h1 className="text-3xl font-yp-display uppercase text-white mb-2">{program.name}</h1>
              <p className="text-dark-text-secondary max-w-xl">{program.description}</p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-text-secondary text-sm">Overall Progress</span>
              <span className="text-cyan-500 font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <ProgressBar value={completedLessons} max={allLessons.length} />
          </div>
        </div>
      </header>

      {/* Continue Section */}
      {currentLesson && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card variant="highlight" className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-tertiary text-sm mb-1">Continue where you left off</p>
              <p className="text-white font-medium">{currentLesson.title}</p>
            </div>
            <Link to={`/app/lessons/${currentLesson.id}`}>
              <Button size="md">Continue</Button>
            </Link>
          </Card>
        </div>
      )}

      {/* Week Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-yp-display uppercase text-white mb-4">Weeks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {program.weeks.map((week) => {
            const status = getWeekStatus(week.number);
            return (
              <button
                key={week.number}
                onClick={() => !status.isLocked && setSelectedWeek(week.number)}
                disabled={status.isLocked}
              >
                <WeekCard week={week} {...status} />
              </button>
            );
          })}
        </div>

        {/* Selected Week Lessons */}
        <div>
          <h2 className="text-xl font-yp-display uppercase text-white mb-4">
            Week {selectedWeek}: {selectedWeekData.title}
          </h2>
          <div className="space-y-3">
            {selectedWeekData.lessons.map((lesson, idx) => {
              const weekStatus = getWeekStatus(selectedWeek);
              // Lessons are locked if week is locked OR if previous lesson in week isn't complete
              const prevLesson = idx > 0 ? selectedWeekData.lessons[idx - 1] : null;
              const isLessonLocked =
                weekStatus.isLocked || (prevLesson && !prevLesson.completed && !lesson.completed);

              return (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  weekNumber={selectedWeek}
                  isLocked={isLessonLocked}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center border-gold-500/30 bg-gradient-to-b from-black-100 to-black-50">
          <h3 className="text-xl font-yp-display uppercase text-white mb-2">Ready for more?</h3>
          <p className="text-dark-text-secondary mb-4">
            Unlock the full Academy with all programs and modules.
          </p>
          <Link to="/app/upgrade">
            <Button variant="gold">Upgrade to Academy — $29/mo</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default ProgramHome;
