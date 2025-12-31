import { useEffect } from 'react'
import { useOnboarding } from '../context/OnboardingContext'

// Fallback page if modal is blocked
function Start() {
  const { openModal, isModalOpen } = useOnboarding()

  useEffect(() => {
    if (!isModalOpen) {
      openModal()
    }
  }, [openModal, isModalOpen])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-dark-text-secondary">Loading your starter plan...</p>
      </div>
    </div>
  )
}

export default Start
