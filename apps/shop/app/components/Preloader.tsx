import {useEffect, useRef, useState} from 'react';

/**
 * YP Preloader - Cyan fill animation using CSS clip-path
 */
export function Preloader() {
  const [isHidden, setIsHidden] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fillPercent, setFillPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Skip on subsequent navigations (only show on initial load)
    if (typeof window !== 'undefined' && sessionStorage.getItem('yp-loaded')) {
      setIsHidden(true);
      return;
    }

    // Animate fill from 0 to 100
    let start: number;
    const duration = 1400; // 1.4 seconds

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setFillPercent(eased * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Fill complete, now fade out
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = '0';
          }
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('yp-loaded', 'true');
            }
            setIsHidden(true);
          }, 500);
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [isMounted]);

  // Don't render on server or after completion
  if (!isMounted || isHidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] transition-opacity duration-500"
      aria-hidden="true"
    >
      {/* YP Logo with CSS clip-path fill */}
      <div className="relative w-[200px] md:w-[280px] lg:w-[320px]">
        {/* Layer 1: Dark outline (always visible) */}
        <svg
          viewBox="0 0 456.1 276.4"
          className="w-full"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 246, 224, 0.3))',
          }}
        >
          <path
            d="M368.7,18.8H251.1h-1.6H218l-74.2,95.8L69.7,18.8c0,0-0.1-0.1-0.1-0.1H12.2L118,155.3c0.8,1,1.2,2.3,1.2,3.6v102.3h51.2V156.4c0-1.3,0.4-2.6,1.2-3.6L234,72.3c1.1-1.4,2.8-2.3,4.7-2.3h10.8h1.6h121c15.7,0,28.3,12.7,28.3,28.3s-12.7,28.3-28.3,28.3H243.9v134.4h51.2v-83.2h73.7c43.9,0,79.6-35.6,79.6-79.6v0C448.3,54.4,412.7,18.8,368.7,18.8z"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
          />
        </svg>

        {/* Layer 2: Cyan fill with clip-path animation */}
        <svg
          viewBox="0 0 456.1 276.4"
          className="absolute inset-0 w-full overflow-visible"
          style={{
            filter: fillPercent === 100
              ? 'drop-shadow(0 0 40px rgba(0, 246, 224, 0.8))'
              : 'drop-shadow(0 0 20px rgba(0, 246, 224, 0.4))',
            transition: 'filter 0.2s ease',
          }}
        >
          <defs>
            <clipPath id="fill-reveal">
              <rect
                x="0"
                y={276.4 * (1 - fillPercent / 100)}
                width="456.1"
                height="276.4"
              />
            </clipPath>
          </defs>
          <path
            d="M368.7,18.8H251.1h-1.6H218l-74.2,95.8L69.7,18.8c0,0-0.1-0.1-0.1-0.1H12.2L118,155.3c0.8,1,1.2,2.3,1.2,3.6v102.3h51.2V156.4c0-1.3,0.4-2.6,1.2-3.6L234,72.3c1.1-1.4,2.8-2.3,4.7-2.3h10.8h1.6h121c15.7,0,28.3,12.7,28.3,28.3s-12.7,28.3-28.3,28.3H243.9v134.4h51.2v-83.2h73.7c43.9,0,79.6-35.6,79.6-79.6v0C448.3,54.4,412.7,18.8,368.7,18.8z"
            fill="#00f6e0"
            clipPath="url(#fill-reveal)"
          />
        </svg>
      </div>

      {/* Loading text with percentage */}
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="font-mono text-sm text-[#00f6e0]/60 tracking-[0.3em] uppercase">
          Loading
        </span>
        <span
          className="text-lg text-[#00f6e0] tabular-nums"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
        >
          {Math.round(fillPercent)}%
        </span>
      </div>
    </div>
  );
}
