import { createContext, useContext, useState, useEffect } from 'react'
import analytics, { EVENTS } from '../lib/analytics'
import { determineLane, LANE_OUTPUTS } from '../config/interestPills'

const OnboardingContext = createContext()

const STORAGE_KEY = 'yp_onboarding'

const initialState = {
  role: 'parent',      // 'parent' | 'athlete' | 'coach' - default to parent
  isThirteenPlus: null, // boolean (for athletes)
  ageBand: null,       // 'under8' | '8-12' | '13+' (for parent's child)
  sport: null,         // 'basketball' | 'barefoot' | 'both' | 'other'
  goals: [],           // Interest pills - max 3 selected
  space: null,         // 'apartment' | 'driveway' | 'gym' | 'field'
  painFlag: null,      // 'none' | 'foot-ankle' | 'knee-hip-back' | 'not-sure'
  lane: null,          // Computed lane based on goals/context
  childNickname: null, // For Wolf personalization
  completed: false,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
}

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...initialState, ...JSON.parse(stored) } : initialState
    } catch {
      return initialState
    }
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Capture UTM params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source')
    const utmMedium = params.get('utm_medium')
    const utmCampaign = params.get('utm_campaign')

    if (utmSource || utmMedium || utmCampaign) {
      setData(prev => ({
        ...prev,
        utmSource,
        utmMedium,
        utmCampaign,
      }))
    }
  }, [])

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, 5)
    setCurrentStep(newStep)
    // Track step progression
    analytics.track(EVENTS.ONBOARDING_STEP, {
      step: newStep,
      previous_step: currentStep,
      data: data,
    })
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const completeOnboarding = () => {
    // Compute lane based on goals and context
    const lane = determineLane(data.goals, data.space, data.painFlag)
    const laneOutput = LANE_OUTPUTS[lane]

    setData(prev => ({ ...prev, completed: true, lane }))
    setIsModalOpen(false)

    // Track onboarding complete
    analytics.track(EVENTS.ONBOARDING_COMPLETE, {
      role: data.role,
      sport: data.sport,
      space: data.space,
      pain_flag: data.painFlag,
      goals: data.goals.map(g => g.tag || g),
      lane: lane,
    })
  }

  // Get lane output based on current data
  const getLaneOutput = () => {
    const lane = data.lane || determineLane(data.goals, data.space, data.painFlag)
    return LANE_OUTPUTS[lane] || LANE_OUTPUTS['base_lane']
  }

  const resetOnboarding = () => {
    setData(initialState)
    setCurrentStep(1)
  }

  const openModal = () => {
    setIsModalOpen(true)
    setCurrentStep(1)
    // Track onboarding start
    analytics.track(EVENTS.ONBOARDING_START)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Track onboarding skip if not completed
    if (!data.completed) {
      analytics.track(EVENTS.ONBOARDING_SKIP, {
        step: currentStep,
        data: data,
      })
    }
  }

  // Determine total steps based on role
  const getTotalSteps = () => 5

  // Check if athlete is under 13
  const isUnderThirteen = data.role === 'athlete' && data.isThirteenPlus === false

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateField,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        completeOnboarding,
        resetOnboarding,
        isModalOpen,
        openModal,
        closeModal,
        getTotalSteps,
        isUnderThirteen,
        getLaneOutput,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

export default OnboardingContext
