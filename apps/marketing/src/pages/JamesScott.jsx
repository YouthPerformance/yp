import { Link } from "react-router-dom";

// Static data for James Scott
const james = {
  name: "James Scott",
  tagline: "Weak Feet Don't Eat",
  title: "Movement Specialist & Foot Performance Coach",
  credentials: [
    "Creator of Weak Feet Don't Eat",
    "Barefoot Reset Developer",
    "R3 Method Founder",
  ],
  bio: `James Scott is a movement specialist who has trained some of the world's top athletes, including NBA stars Jimmy Butler and NFL players like Josh Oliver. His philosophy is simple: your feet are your foundation—if they're weak, you're leaking power at every step.

James developed the R3 Method (Release, Restore, Re-Engineer) after years of working with elite athletes and seeing the same pattern: weak feet leading to ankle injuries, poor balance, and lost explosiveness. The method has since become a cornerstone of foot performance training used by professionals across multiple sports.

His "Weak Feet Don't Eat" brand has grown into a movement—literally—helping thousands of athletes from youth to pro levels rebuild their foundations and unlock their athletic potential.`,
  socialLinks: {
    instagram: "https://www.instagram.com/weakfeetdonteat/",
    twitter: "https://twitter.com/weakfeetdonteat",
  },
  stats: {
    proAthletes: "50+",
    method: "R3",
    programs: "3",
    followers: "100K+",
  },
};

// Related content / programs
const programs = [
  {
    title: "Barefoot Training Guide",
    description: "The complete R3 Method guide for stronger, faster feet",
    url: "https://playbook.youthperformance.com/barefoot-training/",
    icon: "🦶",
    badge: "Flagship",
  },
  {
    title: "Bulletproof Ankles Protocol",
    description: "Pro stability routine for steel ankles",
    url: "/bulletproof-ankles",
    icon: "⚡",
    badge: "Popular",
  },
  {
    title: "42-Day R3 Protocol",
    description: "The full 6-week barefoot reset program",
    url: "https://academy.youthperformance.com/programs/barefoot-reset",
    icon: "📅",
    badge: "Program",
  },
];

function JamesScott() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">James Scott</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          {/* Photo */}
          <div className="w-40 h-40 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex-shrink-0 overflow-hidden border-4 border-primary/20 flex items-center justify-center">
            <span className="text-5xl font-bold text-primary">JS</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold">
                {james.name}
              </h1>
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                {james.tagline}
              </span>
            </div>

            <p className="text-primary text-lg mb-4">{james.title}</p>

            {/* Credentials */}
            <div className="flex flex-wrap gap-2 mb-4">
              {james.credentials.map((cred, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-background-surface text-text-secondary text-sm rounded-full border border-border-default"
                >
                  {cred}
                </span>
              ))}
            </div>

            {/* Bio */}
            <div className="text-text-secondary max-w-3xl leading-relaxed mb-6 space-y-4">
              {james.bio.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {james.socialLinks.instagram && (
                <a
                  href={james.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-sm">@weakfeetdonteat</span>
                </a>
              )}
              {james.socialLinks.twitter && (
                <a
                  href={james.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm">@weakfeetdonteat</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{james.stats.proAthletes}</p>
            <p className="text-text-secondary text-sm">Pro Athletes Trained</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{james.stats.method}</p>
            <p className="text-text-secondary text-sm">The R3 Method</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{james.stats.programs}</p>
            <p className="text-text-secondary text-sm">Training Programs</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{james.stats.followers}</p>
            <p className="text-text-secondary text-sm">Community Members</p>
          </div>
        </div>

        {/* R3 Method Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6">The R3 Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-6 border-l-4 border-cyan-500">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 bg-cyan-500 text-black rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  R1
                </span>
                <h3 className="font-semibold text-lg">RELEASE</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Restore range of motion and eliminate restrictions. Wake up dormant muscles that have been sleeping in supportive shoes.
              </p>
            </div>
            <div className="card p-6 border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  R2
                </span>
                <h3 className="font-semibold text-lg">RESTORE</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Build structural integrity and load capacity. Develop "steel ankles" that can handle force without breaking down.
              </p>
            </div>
            <div className="card p-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 bg-red-500 text-black rounded-full flex items-center justify-center font-mono font-bold text-sm">
                  R3
                </span>
                <h3 className="font-semibold text-lg">RE-ENGINEER</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Explosive power and sport transfer. First-step quickness, reactive stability, and game-ready performance.
              </p>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6">Programs & Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <a
                key={i}
                href={program.url}
                target={program.url.startsWith("http") ? "_blank" : undefined}
                rel={program.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="card p-6 hover:border-primary transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{program.icon}</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    {program.badge}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-text-primary group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-text-muted text-sm">{program.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="card p-8 bg-gradient-to-br from-primary/10 to-background-surface border-primary/30 mb-12">
          <blockquote className="text-xl md:text-2xl font-serif italic text-center max-w-3xl mx-auto mb-4">
            "Weak feet don't eat. That's not just a saying—it's biomechanics. If your feet can't stabilize, absorb, and produce force, you're leaking power at every step."
          </blockquote>
          <p className="text-center text-primary font-medium">— James Scott</p>
        </div>

        {/* CTA */}
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Train with James Scott</h3>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Start the R3 Method today and build the foundation for elite athletic performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://playbook.youthperformance.com/barefoot-training/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Read the Barefoot Training Guide
            </a>
            <Link to="/bulletproof-ankles" className="btn-secondary inline-block">
              Try Bulletproof Ankles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JamesScott;
