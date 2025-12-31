import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12">
      <div className="text-center px-4">
        <h1 className="text-8xl font-yp-display text-cyan-500 mb-4">404</h1>
        <h2 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-4">Page Not Found</h2>
        <p className="text-dark-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Try searching for what you need or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors">
            Back to Home
          </Link>
          <Link to="/library" className="border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Browse Library
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
