'use client';

import { SVGProps } from 'react';

interface ShardIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  filled?: boolean;
  glowing?: boolean;
}

/**
 * Shard Icon - Crystal fragment (1/10 of a full crystal)
 *
 * Design: Angular fragment with faceted edges
 * Colors: Cyan (#00f0ff) when filled, dark (#1a1a2e) when empty
 */
export function ShardIcon({
  size = 24,
  filled = true,
  glowing = false,
  className = '',
  ...props
}: ShardIconProps) {
  const fillColor = filled ? '#00f0ff' : '#1a1a2e';
  const strokeColor = filled ? '#00f0ff' : '#3a3a4e';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowing && filled ? { filter: 'drop-shadow(0 0 4px #00f0ff)' } : undefined}
      {...props}
    >
      {/* Main shard body - angular crystal fragment */}
      <path
        d="M12 2L6 8L8 14L12 22L16 14L18 8L12 2Z"
        fill={fillColor}
        fillOpacity={filled ? 0.8 : 0.3}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner facet - left */}
      <path
        d="M12 2L8 8L12 12L12 2Z"
        fill={filled ? '#00d4e6' : '#2a2a3e'}
        fillOpacity={filled ? 0.9 : 0.4}
      />

      {/* Inner facet - right highlight */}
      <path
        d="M12 2L16 8L12 12L12 2Z"
        fill={filled ? '#40ffff' : '#2a2a3e'}
        fillOpacity={filled ? 0.6 : 0.2}
      />

      {/* Bottom point highlight */}
      <path
        d="M12 12L8 14L12 22L12 12Z"
        fill={filled ? '#00b8cc' : '#1a1a2e'}
        fillOpacity={filled ? 0.7 : 0.3}
      />
    </svg>
  );
}

export default ShardIcon;
