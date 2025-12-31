import { forwardRef } from 'react'

const InterestPill = forwardRef(function InterestPill(
  {
    label,
    helper,
    selected = false,
    recommended = false,
    disabled = false,
    onClick,
    className = '',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group px-4 py-3 rounded-xl text-left transition-all duration-200
        ${selected
          ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
          : disabled
          ? 'bg-black-200 border border-black-400 text-dark-text-tertiary cursor-not-allowed opacity-50'
          : 'bg-black-100 border border-black-300 text-dark-text-secondary hover:border-cyan-500/50 hover:bg-black-200'
        }
        ${className}
      `}
      {...props}
    >
      {/* Recommended badge */}
      {recommended && !selected && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold bg-gold-500 text-black rounded-full">
          Recommended
        </span>
      )}

      {/* Checkmark when selected */}
      {selected && (
        <span className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}

      <div className="pr-6">
        <p className={`font-medium ${selected ? 'text-white' : ''}`}>
          {label}
        </p>
        {helper && (
          <p className={`text-sm mt-0.5 ${selected ? 'text-cyan-500/80' : 'text-dark-text-tertiary'}`}>
            {helper}
          </p>
        )}
      </div>
    </button>
  )
})

export default InterestPill
