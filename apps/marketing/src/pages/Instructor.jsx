import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:3010/api";

function Instructor() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructor();
    fetchCourses();
  }, [fetchCourses, fetchInstructor]);

  const fetchInstructor = async () => {
    try {
      const res = await fetch(`${API_URL}/instructors/${id}`);
      if (!res.ok) throw new Error("Instructor not found");
      const data = await res.json();
      setInstructor(data);
    } catch (error) {
      console.error("Failed to fetch instructor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/instructors/${id}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
              <div className="w-32 h-32 bg-background-surface rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-8 bg-background-surface rounded w-64 mb-4"></div>
                <div className="h-4 bg-background-surface rounded w-48 mb-2"></div>
                <div className="h-4 bg-background-surface rounded w-32 mb-4"></div>
                <div className="h-24 bg-background-surface rounded w-full max-w-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Instructor Not Found</h1>
          <p className="text-text-secondary mb-6">
            The instructor you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/library" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-8">
          <Link to="/library" className="hover:text-primary transition-colors">
            Library
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{instructor.name}</span>
        </nav>

        {/* Instructor Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          {/* Photo */}
          <div className="w-40 h-40 bg-background-surface rounded-full flex-shrink-0 overflow-hidden border-4 border-primary/20">
            {instructor.photo_url ? (
              <img
                src={instructor.photo_url}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">
              {instructor.name}
            </h1>
            {instructor.title && <p className="text-primary text-lg mb-2">{instructor.title}</p>}

            {/* University Affiliations */}
            {instructor.university_affiliations &&
              instructor.university_affiliations.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {instructor.university_affiliations.map((uni, i) => (
                    <span key={i} className="flex items-center gap-1 text-text-secondary">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {uni}
                      {i < instructor.university_affiliations.length - 1 && (
                        <span className="mx-2">•</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

            {/* Credentials */}
            {instructor.credentials && (
              <p className="text-text-muted text-sm mb-4 italic">{instructor.credentials}</p>
            )}

            {/* Biography */}
            <p className="text-text-secondary max-w-3xl leading-relaxed mb-6">
              {instructor.biography}
            </p>

            {/* Social Links */}
            {instructor.social_links && Object.keys(instructor.social_links).length > 0 && (
              <div className="flex items-center gap-4">
                {instructor.social_links.twitter && (
                  <a
                    href={instructor.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {instructor.social_links.website && (
                  <a
                    href={instructor.social_links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors"
                    aria-label="Website"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </a>
                )}
                {instructor.social_links.youtube && (
                  <a
                    href={instructor.social_links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {instructor.social_links.linkedin && (
                  <a
                    href={instructor.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{courses.length}</p>
            <p className="text-text-secondary text-sm">Courses</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {courses.reduce((sum, c) => sum + (c.lecture_count || 0), 0) || courses.length * 8}
            </p>
            <p className="text-text-secondary text-sm">Lectures</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {Math.round(
                courses.reduce((sum, c) => sum + (c.total_duration_minutes || 0), 0) / 60,
              ) || courses.length * 6}
            </p>
            <p className="text-text-secondary text-sm">Hours of Content</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {(
                courses.reduce((sum, c) => sum + (c.total_duration_minutes || 0), 0) /
                  60 /
                  courses.length || 6
              ).toFixed(1)}
            </p>
            <p className="text-text-secondary text-sm">Avg Hours/Course</p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6">
            Courses by {instructor.name.split(" ").pop()}
          </h2>

          {courses.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-text-muted">No courses available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="card p-4 hover:border-primary transition-all hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="aspect-video bg-background-surface rounded mb-4 relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-background ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Featured badge */}
                    {course.is_featured && (
                      <div className="absolute top-2 right-2 bg-primary text-background text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 text-text-primary group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-text-muted text-xs">
                    {course.course_code} • {formatDuration(course.total_duration_minutes)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="card p-8 bg-gradient-to-br from-primary/10 to-background-surface border-primary/30 text-center">
          <h3 className="text-xl font-semibold mb-2">Learn from {instructor.name}</h3>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Get unlimited access to all courses by {instructor.name.split(" ")[0]} and 40+ other
            world-class professors.
          </p>
          <Link to="/pricing" className="btn-primary inline-block">
            Join the Academy - $399/year
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Instructor;
