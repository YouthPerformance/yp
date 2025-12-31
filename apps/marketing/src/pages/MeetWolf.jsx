// MeetWolf - Curio-style prompt editor for Wolf AI coach
// E10-7: Create editable AI coach profile based on user inputs

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button, Card } from '../components/ui'
import { useOnboarding } from '../context/OnboardingContext'
import { generateWolfPrompt } from '../config/interestPills'
import analytics, { EVENTS } from '../lib/analytics'

function MeetWolf() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { data } = useOnboarding()

  // Convex queries and mutations
  const email = user?.primaryEmailAddress?.emailAddress
  const profile = useQuery(api.users.getByEmail, email ? { email } : 'skip')
  const updateWolfPromptMutation = useMutation(api.users.updateWolfPrompt)

  // Generate initial prompt from onboarding data
  const initialPrompt = generateWolfPrompt({
    ...data,
    childNickname: data.childNickname || 'your athlete',
  })

  const [prompt, setPrompt] = useState(initialPrompt)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved prompt from profile if available
  useEffect(() => {
    if (profile?.wolfPrompt) {
      setPrompt(profile.wolfPrompt)
    }
  }, [profile])

  // Track page view
  useEffect(() => {
    analytics.trackPageView('meet_wolf')
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    // Track prompt customization
    analytics.track(EVENTS.WOLF_PROMPT_SAVED, {
      was_edited: prompt !== initialPrompt,
      prompt_length: prompt.length,
    })

    try {
      // Save to Convex if we have a profile
      if (profile?._id) {
        await updateWolfPromptMutation({
          profileId: profile._id,
          wolfPrompt: prompt,
        })
      }
    } catch (err) {
      console.error('Error saving wolf prompt:', err)
    }

    setIsSaving(false)
    setIsEditing(false)

    // Navigate to chat
    navigate('/wolf-chat')
  }

  const handleReset = () => {
    setPrompt(initialPrompt)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-4xl">🐺</span>
          </div>
          <h1 className="text-3xl font-yp-display uppercase text-white mb-2">
            Meet Your Wolf
          </h1>
          <p className="text-dark-text-secondary">
            Wolf is your AI training buddy. Here's what Wolf knows about{' '}
            {data.childNickname || 'your athlete'}.
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-6 bg-black-100">
          <h2 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wide mb-3">
            Quick Profile
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-dark-text-tertiary">Name:</span>
              <span className="text-white ml-2">{data.childNickname || 'Your Athlete'}</span>
            </div>
            <div>
              <span className="text-dark-text-tertiary">Age:</span>
              <span className="text-white ml-2">{data.ageBand || 'Youth'}</span>
            </div>
            <div>
              <span className="text-dark-text-tertiary">Sport:</span>
              <span className="text-white ml-2 capitalize">{data.sport || 'Multi-sport'}</span>
            </div>
            <div>
              <span className="text-dark-text-tertiary">Space:</span>
              <span className="text-white ml-2 capitalize">{data.space || 'Home'}</span>
            </div>
          </div>
          {data.goals?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-black-400">
              <span className="text-dark-text-tertiary text-sm">Goals:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.goals.map((goal, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-500 rounded-full"
                  >
                    {goal.label || goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Wolf Prompt Editor */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wide">
              Wolf's Instructions
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-cyan-500 text-sm hover:text-cyan-400 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
                className="w-full bg-black-100 border border-black-400 rounded-lg p-3 text-dark-text-secondary text-sm resize-none focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-black-100 rounded-lg p-3 text-dark-text-secondary text-sm whitespace-pre-wrap">
              {prompt}
            </div>
          )}
        </Card>

        {/* Tip */}
        <Card className="mb-8 bg-cyan-500/10 border-cyan-500/30">
          <p className="text-dark-text-secondary text-sm">
            <span className="text-cyan-500 font-medium">Tip:</span> You can edit these instructions
            anytime in Settings. Wolf uses this to personalize advice.
          </p>
        </Card>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={handleSave}
            loading={isSaving}
            className="shadow-glow-cyan"
          >
            Start Chat with Wolf
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/settings')}
          >
            Edit Later in Settings
          </Button>
        </div>

        {/* Skip */}
        <p className="text-center mt-6">
          <button
            onClick={() => navigate('/bulletproof-ankles')}
            className="text-dark-text-tertiary hover:text-dark-text-secondary text-sm transition-colors"
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  )
}

export default MeetWolf
