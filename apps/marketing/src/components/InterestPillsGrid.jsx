import { useMemo, useEffect, useRef } from 'react'
import InterestPill from './ui/InterestPill'
import { PILLS_CONFIG, getRecommendedPills, getPreselectedPills } from '../config/interestPills'

function InterestPillsGrid({
  selectedPills = [],
  onPillsChange,
  sport = null,
  space = null,
  painFlag = null,
  maxPills = PILLS_CONFIG.maxPills,
  enablePreselection = false, // E12-3: Auto-preselect recommended pills
}) {
  const hasPreselected = useRef(false)

  // Get recommended pills based on context
  const recommendedTags = useMemo(
    () => getRecommendedPills(sport, space, painFlag),
    [sport, space, painFlag]
  )

  // Get preselected pills (E12-3)
  const preselectedPills = useMemo(
    () => enablePreselection ? getPreselectedPills(sport, space, painFlag) : [],
    [sport, space, painFlag, enablePreselection]
  )

  // Auto-preselect pills on first render if enabled
  useEffect(() => {
    if (
      enablePreselection &&
      !hasPreselected.current &&
      preselectedPills.length > 0 &&
      selectedPills.length === 0
    ) {
      hasPreselected.current = true
      onPillsChange(preselectedPills)
    }
  }, [enablePreselection, preselectedPills, selectedPills.length, onPillsChange])

  // Check if a pill is selected
  const isPillSelected = (pillId) => selectedPills.some(p => p.id === pillId)

  // Check if max reached
  const isMaxReached = selectedPills.length >= maxPills

  // Handle pill toggle
  const handlePillClick = (pill) => {
    if (isPillSelected(pill.id)) {
      // Remove pill
      onPillsChange(selectedPills.filter(p => p.id !== pill.id))
    } else if (!isMaxReached) {
      // Add pill
      onPillsChange([...selectedPills, pill])
    }
  }

  // Determine which categories to show
  const categories = useMemo(() => {
    const cats = [...PILLS_CONFIG.categories]

    // Add basketball add-ons if sport is basketball
    if (sport === 'basketball' || sport === 'both') {
      cats.push({
        id: 'basketball',
        label: PILLS_CONFIG.basketballAddOns.label,
        pills: PILLS_CONFIG.basketballAddOns.pills,
      })
    }

    return cats
  }, [sport])

  return (
    <div className="space-y-6">
      {/* Selection counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-text-tertiary">
          Pick up to {maxPills} goals
        </p>
        <p className={`text-sm font-medium ${selectedPills.length === maxPills ? 'text-cyan-500' : 'text-dark-text-secondary'}`}>
          {selectedPills.length} / {maxPills} selected
        </p>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.id}>
          <h4 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wide mb-3">
            {category.label}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {category.pills.map((pill) => {
              const isSelected = isPillSelected(pill.id)
              const isRecommended = recommendedTags.includes(pill.tag)
              const isDisabled = !isSelected && isMaxReached

              return (
                <InterestPill
                  key={pill.id}
                  label={pill.label}
                  helper={pill.helper}
                  selected={isSelected}
                  recommended={isRecommended}
                  disabled={isDisabled}
                  onClick={() => handlePillClick(pill)}
                />
              )
            })}
          </div>
        </div>
      ))}

      {/* Helper text */}
      {selectedPills.length > 0 && (
        <p className="text-sm text-dark-text-tertiary text-center">
          We'll tailor the plan and your Wolf coach to these goals.
        </p>
      )}
    </div>
  )
}

export default InterestPillsGrid
