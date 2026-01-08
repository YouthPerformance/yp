import { useEffect, useRef } from 'react';

interface CircularTextProps {
  text?: string;
  className?: string;
  size?: number;
  duration?: number;
}

/**
 * CircularText - Rotating circular text like shopify.supply "SHOP ALL"
 */
export function CircularText({
  text = 'SHOP ALL ',
  className = '',
  size = 120,
  duration = 20,
}: CircularTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Repeat text to fill circle
  const repeatedText = text.repeat(4);
  const characters = repeatedText.split('');
  const angleStep = 360 / characters.length;
  const radius = size / 2 - 12; // Account for text size

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Rotating text container */}
      <div
        className="absolute inset-0 animate-spin"
        style={{
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
        }}
      >
        {characters.map((char, index) => {
          const angle = index * angleStep;
          const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius + size / 2;
          const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius + size / 2;

          return (
            <span
              key={index}
              className="absolute text-[10px] font-mono uppercase tracking-wider text-white/80"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                transformOrigin: 'center',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {/* Center circle (optional) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan/50"
      />
    </div>
  );
}

export default CircularText;
