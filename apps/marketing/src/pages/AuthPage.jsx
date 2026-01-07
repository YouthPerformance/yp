/**
 * AuthPage - Full-screen login with YP design + Clerk auth
 *
 * Uses Clerk components with custom YP styling.
 * Matches the Academy auth design for unified experience.
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Check URL params for signup mode
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setIsSignUp(true)
    }
  }, [searchParams])

  // Load Unicorn Studio
  useEffect(() => {
    if (!window.UnicornStudio && !document.querySelector('script[src*="unicornStudio.umd.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js'
      script.async = true
      script.onload = () => {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init()
        }
      }
      document.head.appendChild(script)
    } else {
      const checkAndInit = () => {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init()
        }
      }
      checkAndInit()
      const interval = setInterval(checkAndInit, 500)
      setTimeout(() => clearInterval(interval), 3000)
    }
  }, [])

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
      // Root card styling - match AuthCard design
      rootBox: 'mx-auto',
      card: `
        bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800
        border border-neutral-800
        rounded-3xl
        shadow-xl
        px-6 py-8 sm:px-10 sm:py-10
      `,

      // Header
      headerTitle: 'text-[22px] font-semibold text-neutral-50 text-center',
      headerSubtitle: 'text-sm text-neutral-400 text-center',

      // Form fields - match AuthInput design
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

      // Primary button - match AuthSubmitButton design
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

      // Social buttons - match SocialButton design
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
      socialButtonsProviderIcon: 'text-[#00f6e0]',

      // Divider
      dividerLine: 'bg-neutral-800/80',
      dividerText: 'text-xs font-medium text-neutral-500 px-4',

      // Footer links
      footerActionText: 'text-sm text-neutral-400',
      footerActionLink: 'font-medium text-[#00f6e0] hover:text-[#00f6e0]/80',

      // Identity preview
      identityPreviewText: 'text-neutral-100',
      identityPreviewEditButton: 'text-[#00f6e0] hover:text-[#00f6e0]/80',

      // Alert/error messages
      alert: 'p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center',

      // Logo placeholder
      logoBox: 'flex justify-center mb-6',
      logoImage: 'hidden',

      // OTP input
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
    <div className="min-h-screen antialiased flex items-center justify-center text-neutral-100 bg-transparent px-4 overflow-hidden relative">
      {/* Unicorn Studio Aurora Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}
      >
        <div
          data-us-project="bmaMERjX2VZDtPrh4Zwx"
          className="absolute inset-0"
        />
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f6e0]/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Circuit decorations */}
      <CircuitDecorations />

      <div className="w-full max-w-5xl mx-auto my-8 relative">
        <div className="max-w-md mx-auto">
          {/* YP Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-neutral-900 w-14 h-14 rounded-2xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
              <div className="flex bg-neutral-950 w-10 h-10 rounded-2xl items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
                  <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
                  <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                !isSignUp
                  ? 'bg-[#00f6e0] text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                isSignUp
                  ? 'bg-[#00f6e0] text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Clerk Auth Component */}
          {isSignUp ? (
            <SignUp
              appearance={clerkAppearance}
              routing="path"
              path="/auth"
              signInUrl="/auth"
              afterSignUpUrl="/dashboard"
            />
          ) : (
            <SignIn
              appearance={clerkAppearance}
              routing="path"
              path="/auth"
              signUpUrl="/auth?signup=true"
              afterSignInUrl="/dashboard"
            />
          )}

          {/* Terms */}
          <p className="mt-6 text-[11px] leading-relaxed text-neutral-500 text-center">
            By continuing, you agree to the YP{' '}
            <a href="/terms" className="font-medium text-neutral-200 hover:text-[#00f6e0]">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="font-medium text-neutral-200 hover:text-[#00f6e0]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

function CircuitDecorations() {
  return (
    <div className="pointer-events-none hidden md:block fixed inset-0">
      <div className="absolute left-4 top-1/4 flex items-center gap-2 text-neutral-700">
        <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
        <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="h-1 w-10 rounded-full bg-neutral-700" />
          <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px w-12 bg-neutral-800" />
      </div>
      <div className="absolute left-10 bottom-10 flex items-center gap-2 text-neutral-700">
        <div className="h-px flex-1 bg-neutral-800 translate-x-2" />
        <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="flex gap-1">
            <span className="h-1 w-2 rounded bg-neutral-700" />
            <span className="h-1 w-2 rounded bg-neutral-700/60" />
            <span className="h-1 w-2 rounded bg-neutral-700/40" />
          </div>
          <span className="absolute -left-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px w-16 bg-neutral-800" />
      </div>
      <div className="absolute right-4 top-[20%] flex items-center gap-2 text-neutral-700">
        <div className="h-px w-16 bg-neutral-800" />
        <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <span className="h-1 w-6 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0]" />
          <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
      </div>
      <div className="absolute right-8 bottom-16 flex items-center gap-2 text-neutral-700">
        <div className="h-px w-10 bg-neutral-800" />
        <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
          <div className="h-1 w-8 rounded-full bg-neutral-700" />
          <span className="absolute -right-1 h-1 w-1 rounded-full bg-[#00f6e0] shadow-[0_0_12px_#00f6e0] animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-neutral-800 -translate-x-2" />
      </div>
    </div>
  )
}
