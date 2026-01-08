/**
 * AuthContext - Clerk-based Authentication
 *
 * This context wraps Clerk's hooks for convenience and
 * maintains backward compatibility with existing components.
 */

import { createContext, useContext } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerkAuth()

  const value = {
    // User data
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.firstName,
      imageUrl: user.imageUrl,
    } : null,

    // State
    loading: !isLoaded,
    isAuthenticated: isSignedIn,

    // Actions
    logout: signOut,

    // Clerk raw access
    clerkUser: user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
