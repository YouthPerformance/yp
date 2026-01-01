import { Link } from 'react-router-dom'

/**
 * Wolf Sign-Off Footer
 * Dark, minimal, authoritative
 * Pure black #000000 with grey text
 */
function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* Left: YP Logo + Tagline */}
          <div className="flex flex-col w-40 md:w-48">
            <img
              src="/logo/yp-logo.png"
              alt="YouthPerformance"
              className="w-full h-auto mb-2"
            />
            <p className="font-bebas text-white text-sm md:text-base tracking-[0.15em] uppercase text-center">
              Lock In. Level Up.
            </p>
          </div>

          {/* Middle: The Manifesto Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-neutral-500 text-xs uppercase tracking-[0.3em] mb-6">
              The Manifesto
            </h4>
            <nav className="flex flex-col items-center gap-3">
              <Link
                to="/mission"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-300"
              >
                Mission
              </Link>
              <Link
                to="/start"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/library"
                className="text-neutral-400 hover:text-white text-sm transition-colors duration-300"
              >
                Library
              </Link>
            </nav>
          </div>

          {/* Right: Parent Portal Login */}
          <div className="flex flex-col items-end">
            <h4 className="text-neutral-500 text-xs uppercase tracking-[0.3em] mb-4">
              Already a member?
            </h4>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Parent Portal
            </Link>
          </div>
        </div>

        {/* Bottom: Tagline + Legal */}
        <div className="mt-16 pt-8 border-t border-neutral-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-xs uppercase tracking-[0.2em]">
              ELITE TRAINING FOR EVERY KID, EVERYWHERE.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-neutral-700 hover:text-neutral-500 text-xs transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-neutral-700 hover:text-neutral-500 text-xs transition-colors">
                Privacy
              </Link>
              <span className="text-neutral-800 text-xs">
                &copy; 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
