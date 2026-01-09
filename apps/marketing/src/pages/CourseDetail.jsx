import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:3010/api";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchLectures();
  }, [fetchCourse, fetchLectures]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`);
      if (!res.ok) throw new Error("Course not found");
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}/lectures`);
      const data = await res.json();
      setLectures(data);
      if (data.length > 0) {
        setSelectedLecture(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch lectures:", error);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins} min`;
  };

  const formatTotalDuration = (minutes) => {
    if (!minutes) return "0 hours";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours} hours ${mins} min` : `${hours} hours`;
    }
    return `${mins} minutes`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-black-100 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-black-100 rounded-xl mb-6"></div>
                <div className="h-8 bg-black-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-black-100 rounded w-24 mb-6"></div>
                <div className="h-20 bg-black-100 rounded mb-6"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-40 bg-black-100 rounded-xl mb-6"></div>
                <div className="h-48 bg-black-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-4">
            Program Not Found
          </h1>
          <p className="text-dark-text-secondary mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/library"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Browse Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-dark-text-tertiary mb-8 flex items-center flex-wrap gap-2">
          <Link to="/library" className="hover:text-cyan-500 transition-colors">
            Library
          </Link>
          <span className="mx-1">/</span>
          {course.disciplines && course.disciplines.length > 0 && (
            <>
              <span className="text-cyan-500">{course.disciplines[0].name}</span>
              <span className="mx-1">/</span>
            </>
          )}
          <span className="text-white">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Hero / Video Preview */}
            <div className="aspect-video bg-black-50 rounded-xl mb-6 relative overflow-hidden group border border-black-400">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black-100 to-black">
                  <svg
                    className="w-20 h-20 text-dark-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-cyan-500/90 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-glow-cyan">
                  <svg
                    className="w-10 h-10 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-yp-display uppercase tracking-wide text-white mb-2">
                  {course.title}
                </h1>
                <p className="text-cyan-500 font-mono text-sm">{course.course_code}</p>
              </div>
              {course.is_featured && (
                <span className="bg-cyan-500/20 text-cyan-500 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Discipline Tags */}
            {course.disciplines && course.disciplines.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {course.disciplines.map((discipline) => (
                  <span
                    key={discipline.id}
                    className="px-3 py-1 rounded-full text-xs border border-black-400 bg-black-50 text-dark-text-secondary"
                  >
                    {discipline.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-dark-text-secondary mb-6 leading-relaxed">{course.description}</p>

            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors mb-8 flex items-center gap-2 shadow-glow-cyan">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Program
            </button>

            {/* Session List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-yp-display uppercase tracking-wide text-white">
                  Sessions
                </h2>
                <span className="text-dark-text-tertiary text-sm">
                  {lectures.length} sessions • {formatTotalDuration(course.total_duration_minutes)}
                </span>
              </div>
              <div className="space-y-2">
                {lectures.map((lecture, index) => (
                  <div
                    key={lecture.id}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedLecture?.id === lecture.id
                        ? "bg-cyan-500/10 border-cyan-500"
                        : "bg-black-50 border-black-400 hover:border-cyan-500/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedLecture?.id === lecture.id
                            ? "bg-cyan-500 text-black"
                            : "bg-black-100 text-dark-text-tertiary"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <span
                          className={`block ${selectedLecture?.id === lecture.id ? "text-cyan-500" : "text-white"}`}
                        >
                          {lecture.title}
                        </span>
                        {lecture.description && (
                          <span className="text-dark-text-tertiary text-sm line-clamp-1">
                            {lecture.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-dark-text-tertiary text-sm">
                        {formatDuration(lecture.duration_minutes)}
                      </span>
                      <svg
                        className="w-5 h-5 text-dark-text-tertiary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Learn */}
            {course.learning_objectives && (
              <div className="mb-8">
                <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learning_objectives
                    .split("\n")
                    .filter((obj) => obj.trim())
                    .map((objective, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-dark-text-secondary">
                          {objective.replace(/^[-•]\s*/, "")}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Instructor Card */}
            <Link
              to={`/instructors/${course.instructor_id}`}
              className="bg-black-50 border border-black-400 rounded-xl p-6 mb-6 block hover:border-cyan-500/50 transition-colors"
            >
              <h3 className="font-medium mb-4 text-dark-text-tertiary text-sm uppercase tracking-wide">
                Coach
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-black-100 rounded-full overflow-hidden flex-shrink-0">
                  {course.instructor_photo ? (
                    <img
                      src={course.instructor_photo}
                      alt={course.instructor_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-tertiary">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-cyan-500">{course.instructor_name}</p>
                  {course.instructor_title && (
                    <p className="text-dark-text-secondary text-sm">{course.instructor_title}</p>
                  )}
                </div>
              </div>
              {course.instructor_bio && (
                <p className="text-dark-text-tertiary text-sm mt-4 line-clamp-3">
                  {course.instructor_bio}
                </p>
              )}
              <div className="mt-4 flex items-center text-cyan-500 text-sm">
                View Profile
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Course Info */}
            <div className="bg-black-50 border border-black-400 rounded-xl p-6 mb-6">
              <h3 className="font-medium mb-4 text-dark-text-tertiary text-sm uppercase tracking-wide">
                Program Info
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-dark-text-secondary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Duration
                  </span>
                  <span className="font-medium text-white">
                    {formatTotalDuration(course.total_duration_minutes)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-dark-text-secondary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Sessions
                  </span>
                  <span className="font-medium text-white">
                    {course.lecture_count || lectures.length}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-dark-text-secondary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Category
                  </span>
                  <span className="font-medium text-white">
                    {course.disciplines?.[0]?.name || "General"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-dark-text-secondary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Progress Tracking
                  </span>
                  <span className="font-medium text-cyan-500">Included</span>
                </li>
              </ul>
            </div>

            {/* Enroll CTA */}
            <div className="bg-black-50 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Ready to start training?</h3>
              <p className="text-dark-text-secondary text-sm mb-4">
                Get unlimited access to this program and all others on the Campus.
              </p>
              <Link
                to="/pricing"
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-lg transition-colors w-full text-center block shadow-glow-cyan"
              >
                Join the Campus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
