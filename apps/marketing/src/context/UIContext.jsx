import { createContext, useContext, useState, useEffect } from 'react'

const UIContext = createContext()

export function UIProvider({ children }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const toggleSearch = () => setSearchOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)
  const closeSearch = () => setSearchOpen(false)

  // Handle ESC key to close overlays
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Handle Cmd/Ctrl + K for search
  useEffect(() => {
    const handleSearchShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  // Prevent body scroll when overlays are open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, isSearchOpen])

  return (
    <UIContext.Provider value={{
      isMobileMenuOpen,
      isSearchOpen,
      setMobileMenuOpen,
      setSearchOpen,
      toggleMobileMenu,
      toggleSearch,
      closeMobileMenu,
      closeSearch,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
