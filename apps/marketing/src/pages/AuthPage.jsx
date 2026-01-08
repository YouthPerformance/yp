/**
 * AuthPage - Unified "Sign In or Join Now"
 *
 * Clean, minimal design matching Academy.
 * Uses Clerk components with YP styling.
 */

import { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function AuthPage() {
  // Load Unicorn Studio for aurora background
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

  // Clerk appearance matching the simplified YP design
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
      card: 'bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl',
      headerTitle: 'text-xl font-semibold text-white',
      headerSubtitle: 'text-sm text-neutral-400',
      formFieldLabel: 'text-sm text-neutral-400',
      formFieldInput: 'w-full pl-4 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00f6e0] focus:ring-1 focus:ring-[#00f6e0]/50',
      formFieldInputShowPasswordButton: 'text-neutral-500 hover:text-neutral-300',
      formFieldErrorText: 'text-xs text-red-400 mt-1',
      formButtonPrimary: 'w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00f6e0] hover:bg-[#00dcc8] rounded-xl text-neutral-900 font-semibold transition-colors shadow-lg shadow-[#00f6e0]/20',
      socialButtonsBlockButton: 'w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white font-medium transition-colors',
      socialButtonsBlockButtonText: 'text-white',
      socialButtonsBlockButtonArrow: 'hidden',
      dividerLine: 'bg-neutral-800',
      dividerText: 'text-xs font-medium text-neutral-500 uppercase tracking-wide px-4',
      footerActionText: 'text-sm text-neutral-400',
      footerActionLink: 'text-neutral-300 hover:text-[#00f6e0] underline underline-offset-2',
      identityPreviewText: 'text-neutral-100',
      identityPreviewEditButton: 'text-[#00f6e0] hover:text-[#00dcc8]',
      alert: 'p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm',
      logoBox: 'hidden',
      otpCodeFieldInput: 'bg-neutral-800 border border-neutral-700 rounded-xl text-white text-center',
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Unicorn Studio Aurora (optional) */}
        <div
          data-us-project="bmaMERjX2VZDtPrh4Zwx"
          className="absolute inset-0"
        />
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-neutral-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f6e0]/10 via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00f6e0">
              <path d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"/>
              <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"/>
            </svg>
          </div>
        </div>

        {/* Clerk SignIn - handles both sign-in and sign-up */}
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/login"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />

        {/* Terms */}
        <p className="mt-6 text-xs text-neutral-500 text-center leading-relaxed">
          By clicking continue, you agree to our{' '}
          <a href="/terms" className="text-neutral-300 hover:text-[#00f6e0] underline underline-offset-2">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-neutral-300 hover:text-[#00f6e0] underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
