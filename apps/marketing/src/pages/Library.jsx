import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3010/api";

function Library() {
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchDisciplines();
    fetchCourses();
  }, [fetchCourses, fetchDisciplines]);

  const fetchDisciplines = async () => {
    try {
      const res = await fetch(`${API_URL}/disciplines`);
      const data = await res.json();
      setDisciplines(data);
    } catch (error) {
      console.error("Failed to fetch disciplines:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/courses?sort=${sort}`;
      if (selectedDiscipline) {
        url += `&discipline=${selectedDiscipline}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-yp-display uppercase tracking-wide text-white mb-2">
          Program Library
        </h1>
        <p className="text-dark-text-secondary mb-8">Browse all training programs and playbooks</p>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-black-50 border border-black-400 rounded-lg px-4 py-3 text-white placeholder:text-dark-text-tertiary focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <select
            className="bg-black-50 border border-black-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
          >
            <option value="">All Categories</option>
            {disciplines.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            className="bg-black-50 border border-black-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="popular">Sort by: Popular</option>
            <option value="az">Sort by: A-Z</option>
          </select>
          <button
            type="submit"
            className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-black-50 border border-black-400 rounded-xl p-4 animate-pulse"
              >
                <div className="aspect-video bg-black-100 rounded-lg mb-4"></div>
                <div className="h-5 bg-black-100 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-black-100 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-black-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-text-secondary text-lg">No programs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="bg-black-50 border border-black-400 rounded-xl p-4 hover:border-cyan-500/50 transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="aspect-video bg-black-100 rounded-lg mb-4 relative overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-tertiary">
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
                    <div className="w-16 h-16 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-glow-cyan">
                      <svg
                        className="w-8 h-8 text-black ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-white">{course.title}</h3>
                <p className="text-dark-text-secondary text-sm mb-2">{course.instructor_name}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {course.disciplines?.map((d) => (
                    <span
                      key={d.id}
                      className="text-xs px-2 py-1 rounded-full bg-black-100 text-dark-text-tertiary border border-black-400"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>
                <p className="text-dark-text-tertiary text-xs">
                  {course.course_code} • {formatDuration(course.total_duration_minutes)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
