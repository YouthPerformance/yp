// ═══════════════════════════════════════════════════════════
// BACK TO TOP BUTTON
// Floating button after 500px scroll
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";

interface BackToTopProps {
  /** Scroll threshold before button appears (default: 500) */
  threshold?: number;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Floating back-to-top button that appears after scrolling
 * Fixed bottom-left with smooth fade animation
 */
export function BackToTop({ threshold = 500, className = "" }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Check initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 left-6 z-40
        w-12 h-12 rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
        }
        ${className}
      `}
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
      aria-label="Back to top"
      aria-hidden={!isVisible}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--accent-primary)" }}
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
