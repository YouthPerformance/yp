/**
 * AuthModal - Modal auth component with Clerk + YP design
 *
 * Uses Clerk components for authentication while matching
 * the YP NeoBall design system aesthetics.
 */

import { useEffect } from 'react'
import { SignIn, SignUp } from '@clerk/clerk-react'

function AuthModal({ isOpen, onClose, initialTab = 'signin' }) {
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

  // Custom Clerk appearance to match YP design
  const clerkAppearance = {
    variables: {
      colorPrimary: '#00f6e0',
      colorBackground: 'transparent',
      colorInputBackground: 'rgba(10, 10, 10, 0.6)',
      colorInputText: '#f5f5f5',
      colorText: '#f5f5f5',
      colorTextSecondary: '#a3a3a3',
      colorDanger: '#f87171',
      borderRadius: '12px',
    },
    elements: {
      rootBox: 'mx-auto',
      card: `
        bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800
        border border-neutral-800
        rounded-3xl
        shadow-xl
        px-6 py-8 sm:px-10 sm:py-10
      `,
      headerTitle: 'text-[22px] font-semibold text-neutral-50 text-center',
      headerSubtitle: 'text-sm text-neutral-400 text-center',
      formFieldLabel: 'text-xs font-medium uppercase tracking-[0.16em] text-neutral-400',
      formFieldInput: `
        rounded-xl
        border border-neutral-800
        bg-neutral-950/60
        px-3 py-2.5
        text-sm text-neutral-100
        shadow-inner shadow-black/40
        placeholder:text-neutral-600
        focus:border-[#00f6e0]
        focus:ring-1 focus:ring-[#00f6e0]/70
      `,
      formFieldInputShowPasswordButton: 'text-neutral-500 hover:text-neutral-300',
      formFieldErrorText: 'text-xs text-red-400 mt-1',
      formButtonPrimary: `
        w-full
        inline-flex items-center justify-center
        rounded-full
        bg-[#00f6e0]
        px-4 py-2.5
        text-sm font-semibold text-neutral-900
        shadow-[0_14px_35px_rgba(0,246,224,0.3)]
        hover:bg-[#00f6e0]/90
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
      socialButtonsBlockButton: `
        flex items-center justify-center
        rounded-xl
        border border-neutral-800
        bg-neutral-900
        px-2 py-2.5
        text-xs font-medium text-neutral-200
        hover:border-neutral-700
        hover:bg-neutral-800/80
        transition
      `,
      socialButtonsBlockButtonText: 'text-neutral-200',
      socialButtonsBlockButtonArrow: 'hidden',
      dividerLine: 'bg-neutral-800/80',
      dividerText: 'text-xs font-medium text-neutral-500 px-4',
      footerActionText: 'text-sm text-neutral-400',
      footerActionLink: 'font-medium text-[#00f6e0] hover:text-[#00f6e0]/80',
      identityPreviewText: 'text-neutral-100',
      identityPreviewEditButton: 'text-[#00f6e0] hover:text-[#00f6e0]/80',
      alert: 'p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center',
      logoBox: 'hidden',
      otpCodeFieldInput: `
        rounded-xl
        border border-neutral-800
        bg-neutral-950/60
        text-neutral-100
        text-center
        focus:border-[#00f6e0]
        focus:ring-1 focus:ring-[#00f6e0]/70
      `,
    },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-neutral-100 transition-colors rounded-full hover:bg-white/5"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* YP Logo */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-neutral-900 w-14 h-14 rounded-2xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
            <div className="flex bg-neutral-950 w-10 h-10 rounded-2xl items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Clerk Component */}
        {initialTab === 'signup' ? (
          <SignUp
            appearance={clerkAppearance}
            routing="virtual"
            afterSignUpUrl="/dashboard"
          />
        ) : (
          <SignIn
            appearance={clerkAppearance}
            routing="virtual"
            afterSignInUrl="/dashboard"
          />
        )}
      </div>
    </div>
  )
}

export default AuthModal
