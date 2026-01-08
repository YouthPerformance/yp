/**
 * ClaimPage - Golden Ticket Redemption
 * The "ACTIVATE TRAINING" experience
 *
 * URL: /claim/:token
 *
 * Flow:
 * 1. Validate token → Show product info
 * 2. User creates YP ID or locks in
 * 3. Token redeemed → Entitlement granted
 * 4. Redirect to training
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

// Demo mode - simulates Convex calls
const DEMO_MODE = true

// Demo ticket data (simulates Convex response)
const DEMO_TICKETS = {
  'SPEEDPACK2024': {
    valid: true,
    productSlug: 'speed-pack',
    productName: 'Speed Pack',
    expiresAt: Date.now() + 48 * 60 * 60 * 1000,
  },
  'FOUNDATION42': {
    valid: true,
    productSlug: 'foundation-42',
    productName: '42-Day Foundation',
    expiresAt: Date.now() + 48 * 60 * 60 * 1000,
  },
}

// Product imagery/icons (could be expanded)
const PRODUCT_ICONS = {
  'speed-pack': (
    <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
      <circle cx="24" cy="24" r="22" stroke="#00f6e0" strokeWidth="2" opacity="0.3"/>
      <path d="M24 12L30 20H26V28L18 20H22V12H24Z" fill="#00f6e0"/>
      <circle cx="24" cy="36" r="4" fill="#00f6e0" opacity="0.5"/>
    </svg>
  ),
  'foundation-42': (
    <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
      <circle cx="24" cy="24" r="22" stroke="#00f6e0" strokeWidth="2" opacity="0.3"/>
      <text x="24" y="30" textAnchor="middle" fill="#00f6e0" fontSize="16" fontWeight="bold">42</text>
    </svg>
  ),
  'default': (
    <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
      <circle cx="24" cy="24" r="22" stroke="#00f6e0" strokeWidth="2" opacity="0.3"/>
      <path d="M24 14L28 22H20L24 14Z" fill="#00f6e0"/>
      <rect x="20" y="24" width="8" height="10" fill="#00f6e0" opacity="0.7"/>
    </svg>
  ),
}

// Claim states
const STATES = {
  LOADING: 'loading',
  INVALID: 'invalid',
  EXPIRED: 'expired',
  ALREADY_CLAIMED: 'already_claimed',
  READY: 'ready',
  AUTH_REQUIRED: 'auth_required',
  CLAIMING: 'claiming',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function ClaimPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [state, setState] = useState(STATES.LOADING)
  const [ticketData, setTicketData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Demo: always false initially

  // Validate token on mount
  useEffect(() => {
    validateToken()
  }, [token])

  // Load Unicorn Studio background
  useEffect(() => {
    if (!window.UnicornStudio && !document.querySelector('script[src*="unicornStudio.umd.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js'
      script.async = true
      script.onload = () => window.UnicornStudio?.init?.()
      document.head.appendChild(script)
    } else {
      window.UnicornStudio?.init?.()
    }
  }, [])

  const validateToken = async () => {
    setState(STATES.LOADING)

    // Demo mode
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 1000))

      const demoTicket = DEMO_TICKETS[token?.toUpperCase()]
      if (demoTicket) {
        setTicketData(demoTicket)
        setState(isAuthenticated ? STATES.READY : STATES.AUTH_REQUIRED)
      } else if (token === 'EXPIRED') {
        setState(STATES.EXPIRED)
      } else if (token === 'CLAIMED') {
        setState(STATES.ALREADY_CLAIMED)
      } else {
        setState(STATES.INVALID)
      }
      return
    }

    // TODO: Real Convex query
    // const result = await convex.query(api.tickets.getByToken, { token })
  }

  const handleClaim = async () => {
    setState(STATES.CLAIMING)

    // Demo mode
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 2500))
      setState(STATES.SUCCESS)
      return
    }

    // TODO: Real Convex mutation
    // try {
    //   await convex.mutation(api.tickets.redeem, { token })
    //   setState(STATES.SUCCESS)
    // } catch (e) {
    //   setErrorMessage(e.message)
    //   setState(STATES.ERROR)
    // }
  }

  const handleAuthComplete = () => {
    // Called after user creates YP ID or logs in
    setIsAuthenticated(true)
    setState(STATES.READY)
  }

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!ticketData?.expiresAt) return null
    const diff = ticketData.expiresAt - Date.now()
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m remaining`
  }

  const productIcon = PRODUCT_ICONS[ticketData?.productSlug] || PRODUCT_ICONS.default

  return (
    <div className="min-h-screen antialiased flex items-center justify-center text-neutral-100 bg-black px-4 overflow-hidden relative">
      {/* Aurora Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}
      >
        <div data-us-project="bmaMERjX2VZDtPrh4Zwx" className="absolute inset-0" />
      </div>

      <div className="w-full max-w-lg mx-auto my-8 relative">
        {/* Card */}
        <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 border-neutral-800 border rounded-3xl p-8 sm:p-10 relative shadow-2xl">

          {/* === LOADING STATE === */}
          {state === STATES.LOADING && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-neutral-800" />
                <div className="absolute inset-0 rounded-full border-2 border-[#00f6e0] border-t-transparent animate-spin" />
              </div>
              <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
                Validating Access Code...
              </p>
            </div>
          )}

          {/* === INVALID TOKEN === */}
          {state === STATES.INVALID && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Invalid Access Code</h1>
              <p className="text-neutral-400 mb-6">
                This code doesn't exist or has already been used.
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Code: <span className="font-mono text-neutral-300">{token}</span>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#00f6e0] hover:text-white transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Home
              </Link>
            </div>
          )}

          {/* === EXPIRED TOKEN === */}
          {state === STATES.EXPIRED && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Code Expired</h1>
              <p className="text-neutral-400 mb-6">
                This access code has expired. Ask the purchaser to contact support for a new one.
              </p>
              <a
                href="mailto:support@youthperformance.com"
                className="inline-flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 px-6 py-3 text-sm font-medium transition"
              >
                Contact Support
              </a>
            </div>
          )}

          {/* === ALREADY CLAIMED === */}
          {state === STATES.ALREADY_CLAIMED && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Already Activated</h1>
              <p className="text-neutral-400 mb-6">
                This pack has already been activated on another account.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#00f6e0] hover:bg-[#00f6e0]/90 px-6 py-3 text-sm font-bold uppercase tracking-widest text-neutral-900 transition"
              >
                Lock In to Your Account
              </Link>
            </div>
          )}

          {/* === AUTH REQUIRED (Create YP ID) === */}
          {state === STATES.AUTH_REQUIRED && ticketData && (
            <div className="text-center">
              {/* Product Badge */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-[#00f6e0]/10 blur-xl" />
                  <div className="relative bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
                    {productIcon}
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#00f6e0]/10 text-[#00f6e0] text-xs font-mono uppercase tracking-widest">
                  Golden Ticket
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                {ticketData.productName}
              </h1>

              <p className="text-neutral-400 mb-2">
                Your training pack is ready to activate.
              </p>

              {getTimeRemaining() && (
                <p className="text-sm text-amber-400 font-mono mb-8">
                  {getTimeRemaining()}
                </p>
              )}

              {/* Create YP ID CTA */}
              <div className="space-y-4">
                <Link
                  to={`/login?claim=true&redirect=/claim/${token}`}
                  className="block w-full"
                >
                  <button className="w-full inline-flex items-center justify-center rounded-full bg-[#00f6e0] px-6 py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 shadow-[0_14px_35px_rgba(0,246,224,0.3)] hover:bg-[#00f6e0]/90 transition">
                    CLAIM YOUR YP ID
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </button>
                </Link>

                <p className="text-sm text-neutral-500">
                  Already have a YP ID?{' '}
                  <Link to={`/login?redirect=/claim/${token}`} className="text-[#00f6e0] hover:underline">
                    Lock In
                  </Link>
                </p>
              </div>

              {/* Demo: Quick auth bypass for testing */}
              {DEMO_MODE && (
                <button
                  onClick={handleAuthComplete}
                  className="mt-6 text-xs text-neutral-600 hover:text-neutral-400 transition"
                >
                  [Demo: Skip Auth]
                </button>
              )}
            </div>
          )}

          {/* === READY TO CLAIM (Authenticated) === */}
          {state === STATES.READY && ticketData && (
            <div className="text-center">
              {/* Product Badge */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-[#00f6e0]/10 blur-xl animate-pulse" />
                  <div className="relative bg-neutral-900 rounded-2xl p-4 border border-[#00f6e0]/30">
                    {productIcon}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono uppercase tracking-widest">
                  Ready to Activate
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                {ticketData.productName}
              </h1>

              <p className="text-neutral-400 mb-8">
                One tap to unlock your training.
              </p>

              {/* Activate Button */}
              <button
                onClick={handleClaim}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#00f6e0] px-6 py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 shadow-[0_14px_35px_rgba(0,246,224,0.3)] hover:bg-[#00f6e0]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                ACTIVATE TRAINING
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          )}

          {/* === CLAIMING (Processing) === */}
          {state === STATES.CLAIMING && (
            <div className="text-center py-8">
              {/* Wolf Eye Animation */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-[#00f6e0]/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-[#00f6e0]/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-[#00f6e0]/30" />
                <div className="absolute inset-6 rounded-full bg-[#00f6e0]/50" />
                <div className="absolute inset-8 rounded-full bg-[#00f6e0] shadow-[0_0_40px_#00f6e0]" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                ACTIVATING...
              </h2>

              <div className="space-y-2 text-neutral-400">
                <p className="animate-pulse">Unlocking your training...</p>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 relative h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00f6e0] to-[#00f6e0]/50"
                  style={{ animation: 'claim-progress 2.5s ease-out forwards' }}
                />
              </div>
              <style>{`
                @keyframes claim-progress {
                  0% { width: 0%; }
                  20% { width: 20%; }
                  50% { width: 60%; }
                  80% { width: 85%; }
                  100% { width: 100%; }
                }
              `}</style>
            </div>
          )}

          {/* === SUCCESS === */}
          {state === STATES.SUCCESS && ticketData && (
            <div className="text-center py-4">
              {/* Success Animation */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-green-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" className="animate-draw" style={{
                      strokeDasharray: 30,
                      strokeDashoffset: 30,
                      animation: 'draw-check 0.5s ease-out 0.2s forwards'
                    }}/>
                  </svg>
                </div>
              </div>
              <style>{`
                @keyframes draw-check {
                  to { stroke-dashoffset: 0; }
                }
              `}</style>

              <h1 className="text-3xl font-bold text-white mb-2">
                TRAINING UNLOCKED
              </h1>

              <p className="text-neutral-400 mb-2">
                <span className="text-[#00f6e0] font-semibold">{ticketData.productName}</span> is now active.
              </p>

              <p className="text-sm text-neutral-500 mb-8">
                Time to get after it.
              </p>

              {/* Start Training CTA */}
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#00f6e0] px-6 py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 shadow-[0_14px_35px_rgba(0,246,224,0.3)] hover:bg-[#00f6e0]/90 transition"
              >
                START TRAINING
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-2">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>

              {/* Confetti-like particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#00f6e0', '#22c55e', '#facc15', '#ec4899'][i % 4],
                      left: `${10 + (i * 7)}%`,
                      top: '50%',
                      animation: `confetti-${i % 3} 1s ease-out forwards`,
                      animationDelay: `${i * 0.05}s`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes confetti-0 {
                  0% { transform: translateY(0) scale(0); opacity: 1; }
                  100% { transform: translateY(-100px) translateX(-20px) scale(1) rotate(180deg); opacity: 0; }
                }
                @keyframes confetti-1 {
                  0% { transform: translateY(0) scale(0); opacity: 1; }
                  100% { transform: translateY(-120px) translateX(30px) scale(1) rotate(-180deg); opacity: 0; }
                }
                @keyframes confetti-2 {
                  0% { transform: translateY(0) scale(0); opacity: 1; }
                  100% { transform: translateY(-80px) translateX(10px) scale(1) rotate(90deg); opacity: 0; }
                }
              `}</style>
            </div>
          )}

          {/* === ERROR === */}
          {state === STATES.ERROR && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Activation Failed</h1>
              <p className="text-neutral-400 mb-6">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => setState(STATES.READY)}
                className="inline-flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 px-6 py-3 text-sm font-medium transition"
              >
                Try Again
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-6">
          Need help?{' '}
          <a href="mailto:support@youthperformance.com" className="text-neutral-400 hover:text-white transition">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
