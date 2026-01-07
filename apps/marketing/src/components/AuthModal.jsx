/**
 * AuthModal - Modal auth with unified "Sign In or Join" flow
 *
 * Clean, minimal design matching the full-page auth.
 */

import { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'

function AuthModal({ isOpen, onClose }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const clerkAppearance = {
    variables: {
      colorPrimary: '#00f6e0',
      colorBackground: '#171717',
      colorInputBackground: '#262626',
      colorInputText: '#ffffff',
      colorText: '#ffffff',
      colorTextSecondary: '#a3a3a3',
      colorDanger: '#f87171',
      borderRadius: '12px',
    },
    elements: {
      rootBox: 'mx-auto',
      card: 'bg-neutral-900/95 backdrop-blur border border-neutral-800 rounded-2xl p-6 shadow-2xl',
      headerTitle: 'text-lg font-semibold text-white',
      headerSubtitle: 'text-sm text-neutral-400',
      formFieldLabel: 'text-sm text-neutral-400',
      formFieldInput: 'w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0]',
      formButtonPrimary: 'w-full px-4 py-2.5 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold text-sm transition-colors',
      socialButtonsBlockButton: 'w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white text-sm font-medium transition-colors',
      socialButtonsBlockButtonText: 'text-white',
      dividerLine: 'bg-neutral-800',
      dividerText: 'text-xs text-neutral-500 uppercase px-3',
      footerActionText: 'text-sm text-neutral-400',
      footerActionLink: 'text-neutral-300 hover:text-[#00f6e0]',
      alert: 'p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm',
      logoBox: 'hidden',
    },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#00f6e0">
              <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
              <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
            </svg>
          </div>
        </div>

        {/* Clerk SignIn */}
        <SignIn
          appearance={clerkAppearance}
          routing="virtual"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  )
}

export default AuthModal
