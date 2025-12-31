import { createContext, useContext } from 'react'

const RadioGroupContext = createContext()

export function RadioGroup({
  value,
  onChange,
  name,
  children,
  className = '',
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, name }}>
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioCard({
  value,
  children,
  icon,
  disabled = false,
  compact = false,
}) {
  const context = useContext(RadioGroupContext)
  const isSelected = context?.value === value

  return (
    <label
      className={`
        relative flex items-center cursor-pointer rounded-xl border
        transition-all duration-200
        ${compact ? 'gap-2 p-3' : 'gap-4 p-4'}
        ${isSelected
          ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan'
          : 'border-black-400 bg-black-50 hover:border-black-300 hover:bg-black-100'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="radio"
        name={context?.name}
        value={value}
        checked={isSelected}
        onChange={() => !disabled && context?.onChange(value)}
        disabled={disabled}
        className="sr-only"
      />
      {icon && (
        <div className={`${compact ? 'text-xl' : 'text-2xl'} ${isSelected ? 'text-cyan-500' : 'text-dark-text-secondary'}`}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {!compact && (
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors duration-200
          ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-black-400'}
        `}>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-black" />
          )}
        </div>
      )}
    </label>
  )
}

export default RadioGroup
