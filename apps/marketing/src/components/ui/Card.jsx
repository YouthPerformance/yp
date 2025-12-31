import { forwardRef } from 'react'

const variants = {
  default: 'bg-black-50 border border-black-400',
  elevated: 'bg-black-100 border border-black-400 shadow-dark-md',
  interactive: 'bg-black-50 border border-black-400 hover:border-cyan-500/50 hover:scale-[1.02] cursor-pointer transition-all duration-200',
  locked: 'bg-black-50 border border-black-400 opacity-60 relative overflow-hidden',
  highlight: 'bg-black-50 border border-cyan-500/30 shadow-glow-cyan',
}

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  locked = false,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const actualVariant = locked ? 'locked' : variant

  const classes = [
    'rounded-xl',
    variants[actualVariant],
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2 text-dark-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-dark-text-tertiary">Locked</span>
          </div>
        </div>
      )}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
