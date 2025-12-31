import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext'

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUI()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  // Clear on close
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('')
      setResults([])
    }
  }, [isSearchOpen])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))

      // Mock results
      const mockResults = [
        { id: 1, title: 'R3 Foundations', type: 'Program', url: '/courses/1' },
        { id: 2, title: 'Speed & Agility', type: 'Program', url: '/courses/2' },
        { id: 3, title: 'Foot Strength Basics', type: 'Session', url: '/courses/3' },
      ].filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )

      setResults(mockResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = () => {
    closeSearch()
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 p-4 pt-20 sm:pt-24 animate-slide-down">
        <div className="mx-auto max-w-2xl bg-black-50 border border-black-400 rounded-xl shadow-dark-xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-black-400">
            <svg
              className="w-5 h-5 text-dark-text-tertiary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
              <path d="m21 21-4.3-4.3" strokeWidth="1.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, sessions..."
              className="flex-1 bg-transparent font-yp-body text-dark-text-primary placeholder:text-dark-text-tertiary text-title-md focus:outline-none"
            />
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              )}
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-label-sm text-dark-text-tertiary bg-black-100 rounded-md">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.url}
                    onClick={handleResultClick}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-black-100 transition-colors duration-fast group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-cyan-500"
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
                        </svg>
                      </div>
                      <div>
                        <p className="font-yp-body text-yp-body-md text-dark-text-primary font-medium">{result.title}</p>
                        <p className="font-yp-body text-yp-body-sm text-dark-text-tertiary">{result.type}</p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-dark-text-tertiary group-hover:text-cyan-500 transition-colors duration-fast"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-yp-body text-yp-body-md text-dark-text-secondary">No results found for "{query}"</p>
              <p className="font-yp-body text-yp-body-sm text-dark-text-tertiary mt-1">Try a different search term</p>
            </div>
          )}

          {/* Quick links when empty */}
          {!query && (
            <div className="p-4">
              <p className="font-yp-body text-label-md text-dark-text-tertiary uppercase tracking-caps mb-3">Quick Links</p>
              <div className="space-y-1">
                <Link
                  to="/library"
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-black-100 transition-colors duration-fast font-yp-body text-yp-body-md text-dark-text-primary"
                >
                  <span>Browse Programs</span>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-black-100 transition-colors duration-fast font-yp-body text-yp-body-md text-dark-text-primary"
                >
                  <span>My Dashboard</span>
                </Link>
                <Link
                  to="/faq"
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-black-100 transition-colors duration-fast font-yp-body text-yp-body-md text-dark-text-primary"
                >
                  <span>FAQ</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
