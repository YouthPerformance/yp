import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button, Card, Input } from '../components/ui'
import { useOnboarding } from '../context/OnboardingContext'
import { generateWolfPrompt } from '../config/interestPills'
import analytics, { EVENTS } from '../lib/analytics'

function SaveProfile() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const { data, updateField, getLaneOutput } = useOnboarding()
  const laneOutput = getLaneOutput()

  // Convex mutation
  const saveProfileFromEmail = useMutation(api.users.saveProfileFromEmail)

  const [email, setEmail] = useState('')
  const [childNickname, setChildNickname] = useState(data.childNickname || '')
  const [isGuardian, setIsGuardian] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Pre-fill email if signed in
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress)
    }
  }, [isSignedIn, user])

  // Track page view
  useEffect(() => {
    analytics.trackPageView('save_profile')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email) {
      setError('Please enter your email.')
      return
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email.')
      return
    }
    if (!isGuardian) {
      setError('Please confirm you are a parent/guardian.')
      return
    }

    setIsSubmitting(true)

    try {
      // Generate Wolf prompt from data
      const wolfPrompt = generateWolfPrompt({
        ...data,
        childNickname: childNickname || 'your athlete',
      })

      // Update context with child nickname
      updateField('childNickname', childNickname)

      // Track email submission
      analytics.track(EVENTS.EMAIL_SUBMITTED, {
        email,
        source: 'save_profile',
        has_nickname: !!childNickname,
        lane: data.lane,
        goals: data.goals?.map(g => g.tag) || [],
      })
      analytics.identify(email, {
        role: data.role,
        child_nickname: childNickname,
        child_age_band: data.ageBand,
        sport: data.sport,
        lane: data.lane,
      })

      // Save to Convex
      await saveProfileFromEmail({
        email,
        childNickname: childNickname || undefined,
        role: data.role,
        ageBand: data.ageBand,
        sport: data.sport,
        space: data.space,
        painFlag: data.painFlag,
        goals: data.goals,
        lane: data.lane,
        wolfPrompt,
      })

      setIsSuccess(true)

      // Redirect after short delay
      setTimeout(() => {
        navigate('/offer/barefoot-reset')
      }, 2000)

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Save profile error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-yp-display uppercase text-white mb-2">
            Saved!
          </h1>
          <p className="text-dark-text-secondary mb-4">
            Your plan is in your inbox. Check your email for the 7-day plan.
          </p>
          <p className="text-dark-text-tertiary text-sm">
            Redirecting to your next step...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-3xl">🐺</span>
          </div>
          <h1 className="text-3xl font-yp-display uppercase text-white mb-2">
            Save your plan{childNickname ? ` for ${childNickname}` : ''}
          </h1>
          <p className="text-dark-text-secondary">
            We'll email the protocol link and save your progress.
          </p>
        </div>

        {/* Form */}
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Parent email
              </label>
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Child nickname */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Child nickname <span className="text-dark-text-tertiary">(optional)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., Kai"
                value={childNickname}
                onChange={(e) => setChildNickname(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-dark-text-tertiary text-xs mt-1">
                Makes the Wolf coach feel more personal
              </p>
            </div>

            {/* Guardian checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGuardian}
                onChange={(e) => setIsGuardian(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-black-400 bg-black-100 text-cyan-500 focus:ring-cyan-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-dark-text-secondary">
                I'm a parent/guardian setting this up for my child.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="text-error text-sm">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              className="shadow-glow-cyan"
            >
              Send + Create Profile
            </Button>
          </form>
        </Card>

        {/* What you'll get */}
        <Card className="mb-6 bg-black-100">
          <h3 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wide mb-3">
            What you'll get
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-dark-text-secondary">
              <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              7-day plan based on your goals
            </li>
            <li className="flex items-center gap-2 text-sm text-dark-text-secondary">
              <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Wolf coach personalized for your child
            </li>
            <li className="flex items-center gap-2 text-sm text-dark-text-secondary">
              <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Progress saved across devices
            </li>
          </ul>
        </Card>

        {/* Skip link */}
        <p className="text-center">
          <button
            onClick={() => navigate('/bulletproof-ankles')}
            className="text-dark-text-tertiary hover:text-dark-text-secondary text-sm transition-colors"
          >
            Not now (view only)
          </button>
        </p>
      </div>
    </div>
  )
}

export default SaveProfile
