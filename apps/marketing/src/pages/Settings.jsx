import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button, Card, Input, Badge } from '../components/ui'
import { useOnboarding } from '../context/OnboardingContext'
import { generateWolfPrompt, PILLS_CONFIG } from '../config/interestPills'

// Age band options
const AGE_BANDS = [
  { value: 'under8', label: 'Under 8', helper: 'Focus on play and movement' },
  { value: '8-12', label: '8-12 years', helper: 'Building foundations' },
  { value: '13+', label: '13+ years', helper: 'Performance training' },
]

// Space options
const SPACES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'driveway', label: 'Driveway / Backyard' },
  { value: 'gym', label: 'Gym / Court' },
  { value: 'field', label: 'Field' },
]

// Pain flag options
const PAIN_FLAGS = [
  { value: 'none', label: 'No pain' },
  { value: 'foot-ankle', label: 'Foot / Ankle' },
  { value: 'knee-hip-back', label: 'Knee / Hip / Back' },
  { value: 'not-sure', label: 'Not sure' },
]

function Settings() {
  const { user } = useUser()
  const { data, updateField } = useOnboarding()

  // Convex queries and mutations
  const email = user?.primaryEmailAddress?.emailAddress
  const profile = useQuery(api.users.getByEmail, email ? { email } : 'skip')
  const progressSummary = useQuery(
    api.progress.getProgressSummary,
    profile?._id ? { profileId: profile._id } : 'skip'
  )
  const updateProfile = useMutation(api.users.updateProfile)
  const updateWolfPrompt = useMutation(api.users.updateWolfPrompt)

  // Local state for form
  const [childNickname, setChildNickname] = useState(data.childNickname || '')
  const [ageBand, setAgeBand] = useState(data.ageBand || '8-12')
  const [space, setSpace] = useState(data.space || 'driveway')
  const [painFlag, setPainFlag] = useState(data.painFlag || 'none')
  const [wolfPrompt, setWolfPrompt] = useState('')
  const [trainingReminders, setTrainingReminders] = useState(true)
  const [progressReports, setProgressReports] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Sync from profile when loaded
  useEffect(() => {
    if (profile) {
      setChildNickname(profile.childNickname || data.childNickname || '')
      setAgeBand(profile.ageBand || data.ageBand || '8-12')
      setSpace(profile.space || data.space || 'driveway')
      setPainFlag(profile.painFlag || data.painFlag || 'none')
      setTrainingReminders(profile.trainingReminders ?? true)
      setProgressReports(profile.progressReports ?? true)
      if (profile.wolfPrompt) {
        setWolfPrompt(profile.wolfPrompt)
      }
    }
  }, [profile])

  // Generate Wolf prompt on mount or when data changes
  useEffect(() => {
    const prompt = generateWolfPrompt({
      ...data,
      childNickname: childNickname || 'your athlete',
      ageBand,
      space,
      painFlag,
    })
    setWolfPrompt(prompt)
  }, [data, childNickname, ageBand, space, painFlag])

  // Sync local state with context
  useEffect(() => {
    setChildNickname(data.childNickname || '')
    setAgeBand(data.ageBand || '8-12')
    setSpace(data.space || 'driveway')
    setPainFlag(data.painFlag || 'none')
  }, [data])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Update context
    updateField('childNickname', childNickname)
    updateField('ageBand', ageBand)
    updateField('space', space)
    updateField('painFlag', painFlag)

    try {
      // Save to Convex if we have a profile
      if (profile?._id) {
        await updateProfile({
          profileId: profile._id,
          childNickname: childNickname || undefined,
          ageBand,
          space,
          painFlag,
          wolfPrompt,
          trainingReminders,
          progressReports,
        })
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetWolfPrompt = () => {
    const defaultPrompt = generateWolfPrompt({
      ...data,
      childNickname: childNickname || 'your athlete',
      ageBand,
      space,
      painFlag,
    })
    setWolfPrompt(defaultPrompt)
  }

  // Progress data from Convex
  const progressData = {
    currentStreak: progressSummary?.currentStreak || 0,
    longestStreak: progressSummary?.longestStreak || 0,
    totalSessions: progressSummary?.totalSessions || 0,
    lastSessionDate: progressSummary?.lastSessionDate || null,
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-yp-display uppercase tracking-wide text-white mb-8">
          Settings
        </h1>

        {/* Child Profile Section */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-yp-display uppercase tracking-wide text-white">
              Athlete Profile
            </h2>
            {data.role === 'parent' && (
              <Badge variant="cyan" size="sm">Parent View</Badge>
            )}
          </div>

          <div className="space-y-4">
            {/* Child Nickname */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Child's Nickname
              </label>
              <Input
                type="text"
                placeholder="e.g., Kai"
                value={childNickname}
                onChange={(e) => setChildNickname(e.target.value)}
              />
              <p className="text-dark-text-tertiary text-xs mt-1">
                Used by Wolf coach for personalized responses
              </p>
            </div>

            {/* Age Band */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Age Group
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_BANDS.map((band) => (
                  <button
                    key={band.value}
                    onClick={() => setAgeBand(band.value)}
                    className={`
                      p-3 rounded-lg border text-left transition-colors
                      ${ageBand === band.value
                        ? 'border-cyan-500 bg-cyan-500/10 text-white'
                        : 'border-black-400 bg-black-100 text-dark-text-secondary hover:border-black-300'
                      }
                    `}
                  >
                    <p className="font-medium text-sm">{band.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Training Space */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Training Space
              </label>
              <select
                value={space}
                onChange={(e) => setSpace(e.target.value)}
                className="w-full bg-black-100 border border-black-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                {SPACES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Pain Flag */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Current Pain/Discomfort
              </label>
              <select
                value={painFlag}
                onChange={(e) => setPainFlag(e.target.value)}
                className="w-full bg-black-100 border border-black-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                {PAIN_FLAGS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <p className="text-dark-text-tertiary text-xs mt-1">
                We'll adjust training intensity based on this
              </p>
            </div>

            {/* Selected Goals Display */}
            {data.goals?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Current Goals
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.goals.map((goal) => (
                    <span
                      key={goal.id}
                      className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-500 rounded-full"
                    >
                      {goal.label}
                    </span>
                  ))}
                </div>
                <p className="text-dark-text-tertiary text-xs mt-2">
                  To change goals, retake the onboarding flow
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Wolf Coach Section */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-yp-display uppercase tracking-wide text-white">
              Wolf Coach
            </h2>
            <span className="text-2xl">🐺</span>
          </div>

          <p className="text-dark-text-secondary text-sm mb-4">
            This is what Wolf knows about your athlete. Edit to add context or preferences.
          </p>

          <div className="mb-4">
            <textarea
              value={wolfPrompt}
              onChange={(e) => setWolfPrompt(e.target.value)}
              rows={6}
              className="w-full bg-black-100 border border-black-400 rounded-lg px-4 py-3 text-white placeholder:text-dark-text-tertiary focus:outline-none focus:border-cyan-500 transition-colors resize-none text-sm"
            />
          </div>

          <button
            onClick={handleResetWolfPrompt}
            className="text-dark-text-tertiary hover:text-white text-sm transition-colors"
          >
            Reset to default →
          </button>
        </Card>

        {/* Progress Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Progress
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-black-100 rounded-lg">
              <p className="text-2xl font-yp-display text-cyan-500">{progressData.currentStreak}</p>
              <p className="text-xs text-dark-text-tertiary uppercase tracking-wide">Current Streak</p>
            </div>
            <div className="text-center p-4 bg-black-100 rounded-lg">
              <p className="text-2xl font-yp-display text-gold-500">{progressData.longestStreak}</p>
              <p className="text-xs text-dark-text-tertiary uppercase tracking-wide">Best Streak</p>
            </div>
            <div className="text-center p-4 bg-black-100 rounded-lg">
              <p className="text-2xl font-yp-display text-white">{progressData.totalSessions}</p>
              <p className="text-xs text-dark-text-tertiary uppercase tracking-wide">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-black-100 rounded-lg">
              <p className="text-lg font-medium text-white">
                {progressData.lastSessionDate
                  ? new Date(progressData.lastSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '--'
                }
              </p>
              <p className="text-xs text-dark-text-tertiary uppercase tracking-wide">Last Session</p>
            </div>
          </div>

          <p className="text-dark-text-tertiary text-sm">
            Consistency beats intensity. Keep showing up.
          </p>
        </Card>

        {/* Parent Account Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Parent Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Email
              </label>
              <Input
                type="email"
                value={user?.primaryEmailAddress?.emailAddress || ''}
                disabled
              />
              <p className="text-dark-text-tertiary text-xs mt-1">
                Email is managed through your account settings
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-white">Training reminders</span>
                <p className="text-dark-text-tertiary text-sm">Get notified about training sessions</p>
              </div>
              <button
                onClick={() => setTrainingReminders(!trainingReminders)}
                className={`w-12 h-6 rounded-full relative transition-colors ${trainingReminders ? 'bg-cyan-500' : 'bg-black-400'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${trainingReminders ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-white">Progress reports</span>
                <p className="text-dark-text-tertiary text-sm">Weekly summary of your child's training</p>
              </div>
              <button
                onClick={() => setProgressReports(!progressReports)}
                className={`w-12 h-6 rounded-full relative transition-colors ${progressReports ? 'bg-cyan-500' : 'bg-black-400'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${progressReports ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-white mb-4">
            Subscription
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Free Plan</p>
              <p className="text-dark-text-secondary text-sm">Bulletproof Ankles access</p>
            </div>
            <Badge variant="default">Free</Badge>
          </div>
          <div className="mt-4 pt-4 border-t border-black-400">
            <button className="text-cyan-500 hover:text-cyan-400 text-sm transition-colors">
              Upgrade to Barefoot Reset ($88) →
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="mb-6 border-error/30">
          <h2 className="text-xl font-yp-display uppercase tracking-wide text-error mb-4">
            Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Delete Account</p>
              <p className="text-dark-text-secondary text-sm">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={handleSave}
            loading={isSaving}
            className="shadow-glow-cyan"
          >
            {saveSuccess ? 'Saved!' : 'Save Changes'}
          </Button>

          {saveSuccess && (
            <p className="text-success text-center text-sm">
              Your changes have been saved.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
