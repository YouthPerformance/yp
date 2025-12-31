// SmoothScroll - Lenis wrapper for buttery smooth scrolling
// E14-1: Foundation Setup

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis with premium settings
    lenisRef.current = new Lenis({
      lerp: 0.1, // Linear interpolation - lower = heavier/smoother
      duration: 1.5,
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
    })

    // RAF loop
    function raf(time) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return children
}

// Hook to access Lenis instance
export function useLenis() {
  // This would need context for full implementation
  return null
}

export default SmoothScroll
