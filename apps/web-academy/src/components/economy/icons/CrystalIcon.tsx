'use client';

import { SVGProps } from 'react';

interface CrystalIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  variant?: 'default' | 'gold' | 'rare';
  glowing?: boolean;
}

/**
 * Crystal Icon - Full crystal (10 shards = 1 crystal)
 *
 * Design: Hexagonal gem with multiple facets
 * Colors: Purple/violet (#a855f7) default, gold for special
 */
export function CrystalIcon({
  size = 24,
  variant = 'default',
  glowing = true,
  className = '',
  ...props
}: CrystalIconProps) {
  const colors = {
    default: {
      primary: '#a855f7',
      secondary: '#c084fc',
      highlight: '#e879f9',
      shadow: '#7c3aed',
    },
    gold: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      highlight: '#fcd34d',
      shadow: '#d97706',
    },
    rare: {
      primary: '#06b6d4',
      secondary: '#22d3ee',
      highlight: '#67e8f9',
      shadow: '#0891b2',
    },
  };

  const c = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowing ? { filter: `drop-shadow(0 0 6px ${c.primary})` } : undefined}
      {...props}
    >
      {/* Outer hexagon shape */}
      <path
        d="M12 1L21 6V18L12 23L3 18V6L12 1Z"
        fill={c.primary}
        fillOpacity={0.9}
        stroke={c.secondary}
        strokeWidth="1"
      />

      {/* Top facet - brightest */}
      <path
        d="M12 1L21 6L12 9L3 6L12 1Z"
        fill={c.highlight}
        fillOpacity={0.8}
      />

      {/* Left facet */}
      <path
        d="M3 6L12 9V19L3 14V6Z"
        fill={c.primary}
        fillOpacity={0.7}
      />

      {/* Right facet - lighter */}
      <path
        d="M21 6L12 9V19L21 14V6Z"
        fill={c.secondary}
        fillOpacity={0.6}
      />

      {/* Bottom point */}
      <path
        d="M12 19L3 14L12 23L21 14L12 19Z"
        fill={c.shadow}
        fillOpacity={0.8}
      />

      {/* Center sparkle */}
      <circle
        cx="12"
        cy="10"
        r="1.5"
        fill="white"
        fillOpacity={0.6}
      />
      <circle
        cx="10"
        cy="8"
        r="0.75"
        fill="white"
        fillOpacity={0.4}
      />
    </svg>
  );
}

export default CrystalIcon;
