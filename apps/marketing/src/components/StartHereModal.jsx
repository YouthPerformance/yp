import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../context/OnboardingContext'
import { Modal, Button, ProgressBar, RadioGroup, RadioCard } from './ui'
import InterestPillsGrid from './InterestPillsGrid'

// Icons for roles
const RoleIcons = {
  parent: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  athlete: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  coach: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
}

// Icons for sports
const SportIcons = {
  basketball: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20M4.93 4.93c4.08 4.08 4.08 10.66 0 14.14M19.07 4.93c-4.08 4.08-4.08 10.66 0 14.14" />
    </svg>
  ),
  barefoot: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 21c-3.5 0-6-2.5-6-6 0-2 1-4 2-5.5S10 6 10 4c0-1.5.5-2 2-2s2 .5 2 2c0 2 1 3 2 4.5s2 3.5 2 5.5c0 3.5-2.5 6-6 6z" />
    </svg>
  ),
  both: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 4l16 16M4 20L20 4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  other: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
}

// Icons for spaces
const SpaceIcons = {
  apartment: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  driveway: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  gym: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h2v8H4V8zm14 0h2v8h-2V8zM7 10h10v4H7v-4zM2 10h2v4H2v-4zm18 0h2v4h-2v-4z" />
    </svg>
  ),
  field: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16H4V4zm8 0v16M4 12h16" />
    </svg>
  ),
}

function StepIndicator({ current, total }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-dark-text-secondary">Step {current} of {total}</span>
      </div>
      <ProgressBar value={current} max={total} size="sm" />
    </div>
  )
}

// Step 1: Role Selection
function RoleStep() {
  const { data, updateField, nextStep } = useOnboarding()

  const handleSelect = (role) => {
    updateField('role', role)
    nextStep()
  }

  return (
    <div>
      <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
        Who are you?
      </h3>
      <p className="text-dark-text-secondary mb-6">
        This helps us personalize your experience.
      </p>

      <div className="space-y-3">
        <RadioGroup value={data.role} onChange={handleSelect} name="role" className="space-y-3">
          <RadioCard value="parent" icon={RoleIcons.parent}>
            <div className="font-medium text-white">Parent / Guardian</div>
            <div className="text-sm text-dark-text-secondary">Setting up for my child</div>
          </RadioCard>
          <RadioCard value="athlete" icon={RoleIcons.athlete}>
            <div className="font-medium text-white">Athlete</div>
            <div className="text-sm text-dark-text-secondary">I'm training myself</div>
          </RadioCard>
          <RadioCard value="coach" icon={RoleIcons.coach}>
            <div className="font-medium text-white">Coach</div>
            <div className="text-sm text-dark-text-secondary">Looking for team resources</div>
          </RadioCard>
        </RadioGroup>
      </div>
    </div>
  )
}

// Step 2: Age Verification
function AgeStep() {
  const { data, updateField, nextStep, prevStep } = useOnboarding()

  if (data.role === 'athlete') {
    return (
      <div>
        <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
          Are you 13 or older?
        </h3>
        <p className="text-dark-text-secondary mb-6">
          We need to verify your age for account setup.
        </p>

        <div className="space-y-3 mb-6">
          <RadioGroup
            value={data.isThirteenPlus}
            onChange={(val) => {
              updateField('isThirteenPlus', val)
              if (val === false) {
                // Under 13 - show parent message
              } else {
                nextStep()
              }
            }}
            name="age"
            className="space-y-3"
          >
            <RadioCard value={true}>
              <div className="font-medium text-white">Yes, I'm 13+</div>
            </RadioCard>
            <RadioCard value={false}>
              <div className="font-medium text-white">No, I'm under 13</div>
            </RadioCard>
          </RadioGroup>
        </div>

        {data.isThirteenPlus === false && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 mb-6">
            <p className="text-gold-500 font-medium mb-2">Ask a parent to help!</p>
            <p className="text-dark-text-secondary text-sm">
              Have a parent or guardian set this up so we can save your plan safely.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={prevStep}>Back</Button>
        </div>
      </div>
    )
  }

  // Parent/Coach selecting child's age band
  return (
    <div>
      <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
        Athlete's age?
      </h3>
      <p className="text-dark-text-secondary mb-6">
        This helps us adjust the training intensity.
      </p>

      <div className="space-y-3 mb-6">
        <RadioGroup
          value={data.ageBand}
          onChange={(val) => {
            updateField('ageBand', val)
            nextStep()
          }}
          name="ageBand"
          className="space-y-3"
        >
          <RadioCard value="under8">
            <div className="font-medium text-white">Under 8</div>
            <div className="text-sm text-dark-text-secondary">Focus on play and movement</div>
          </RadioCard>
          <RadioCard value="8-12">
            <div className="font-medium text-white">8-12 years</div>
            <div className="text-sm text-dark-text-secondary">Building foundations</div>
          </RadioCard>
          <RadioCard value="13+">
            <div className="font-medium text-white">13+ years</div>
            <div className="text-sm text-dark-text-secondary">Performance training</div>
          </RadioCard>
        </RadioGroup>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
      </div>
    </div>
  )
}

// Step 3: Sport + Goals Selection (with Interest Pills)
function SportStep() {
  const { data, updateField, nextStep, prevStep } = useOnboarding()

  const handleGoalsChange = (newGoals) => {
    updateField('goals', newGoals)
  }

  const handleContinue = () => {
    if (data.sport) {
      nextStep()
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
        What are we building for?
      </h3>
      <p className="text-dark-text-secondary mb-6">
        Select sport and what you want most right now.
      </p>

      {/* Sport Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wide mb-3">
          Sport Focus
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <RadioGroup
            value={data.sport}
            onChange={(val) => updateField('sport', val)}
            name="sport"
            className="contents"
          >
            <RadioCard value="basketball" icon={SportIcons.basketball} compact>
              <div className="font-medium text-white text-sm">Basketball</div>
            </RadioCard>
            <RadioCard value="barefoot" icon={SportIcons.barefoot} compact>
              <div className="font-medium text-white text-sm">Barefoot</div>
            </RadioCard>
            <RadioCard value="both" icon={SportIcons.both} compact>
              <div className="font-medium text-white text-sm">Both</div>
            </RadioCard>
            <RadioCard value="other" icon={SportIcons.other} compact>
              <div className="font-medium text-white text-sm">Other</div>
            </RadioCard>
          </RadioGroup>
        </div>
      </div>

      {/* Interest Pills - Goals */}
      {data.sport && (
        <div className="mb-6">
          <InterestPillsGrid
            selectedPills={data.goals || []}
            onPillsChange={handleGoalsChange}
            sport={data.sport}
            space={data.space}
            painFlag={data.painFlag}
            enablePreselection={true}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        {data.sport && (
          <Button onClick={handleContinue} className="flex-1">
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}

// Step 4: Space Selection
function SpaceStep() {
  const { data, updateField, nextStep, prevStep } = useOnboarding()

  return (
    <div>
      <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
        Where will you train?
      </h3>
      <p className="text-dark-text-secondary mb-6">
        We'll adjust exercises for your space.
      </p>

      <div className="space-y-3 mb-6">
        <RadioGroup
          value={data.space}
          onChange={(val) => {
            updateField('space', val)
            nextStep()
          }}
          name="space"
          className="space-y-3"
        >
          <RadioCard value="apartment" icon={SpaceIcons.apartment}>
            <div className="font-medium text-white">Apartment</div>
            <div className="text-sm text-dark-text-secondary">Quiet, low-impact options</div>
          </RadioCard>
          <RadioCard value="driveway" icon={SpaceIcons.driveway}>
            <div className="font-medium text-white">Driveway / Backyard</div>
            <div className="text-sm text-dark-text-secondary">Outdoor home training</div>
          </RadioCard>
          <RadioCard value="gym" icon={SpaceIcons.gym}>
            <div className="font-medium text-white">Gym / Court</div>
            <div className="text-sm text-dark-text-secondary">Full facility access</div>
          </RadioCard>
          <RadioCard value="field" icon={SpaceIcons.field}>
            <div className="font-medium text-white">Field</div>
            <div className="text-sm text-dark-text-secondary">Open outdoor space</div>
          </RadioCard>
        </RadioGroup>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
      </div>
    </div>
  )
}

// Step 5: Pain Check
function PainStep() {
  const { data, updateField, prevStep, completeOnboarding } = useOnboarding()
  const navigate = useNavigate()

  const handleComplete = (painFlag) => {
    updateField('painFlag', painFlag)
    completeOnboarding()
    navigate('/plan-ready')
  }

  return (
    <div>
      <h3 className="text-2xl font-yp-display uppercase tracking-wide text-white mb-2">
        Any pain right now?
      </h3>
      <p className="text-dark-text-secondary mb-6">
        This helps us keep training safe.
      </p>

      <div className="space-y-3 mb-6">
        <RadioGroup
          value={data.painFlag}
          onChange={handleComplete}
          name="pain"
          className="space-y-3"
        >
          <RadioCard value="none">
            <div className="font-medium text-white">No pain</div>
            <div className="text-sm text-dark-text-secondary">Ready to go</div>
          </RadioCard>
          <RadioCard value="foot-ankle">
            <div className="font-medium text-white">Foot / Ankle</div>
            <div className="text-sm text-dark-text-secondary">We'll adjust intensity</div>
          </RadioCard>
          <RadioCard value="knee-hip-back">
            <div className="font-medium text-white">Knee / Hip / Back</div>
            <div className="text-sm text-dark-text-secondary">We'll flag modifications</div>
          </RadioCard>
          <RadioCard value="not-sure">
            <div className="font-medium text-white">Not sure</div>
            <div className="text-sm text-dark-text-secondary">We'll start easy</div>
          </RadioCard>
        </RadioGroup>
      </div>

      <div className="bg-black-200 rounded-xl p-4 mb-6">
        <p className="text-dark-text-tertiary text-sm">
          <span className="text-warning font-medium">Safety note:</span> If anything feels sharp or painful—stop the exercise and rest. This is not medical advice.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
      </div>
    </div>
  )
}

// Main Modal Component
function StartHereModal() {
  const { isModalOpen, closeModal, currentStep, getTotalSteps } = useOnboarding()

  const steps = {
    1: RoleStep,
    2: AgeStep,
    3: SportStep,
    4: SpaceStep,
    5: PainStep,
  }

  const CurrentStepComponent = steps[currentStep]

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Let's build your starter plan"
      size="md"
    >
      <StepIndicator current={currentStep} total={getTotalSteps()} />
      <CurrentStepComponent />
    </Modal>
  )
}

export default StartHereModal
