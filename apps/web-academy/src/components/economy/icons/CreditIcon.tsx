"use client";

import type { SVGProps } from "react";

interface CreditIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  glowing?: boolean;
}

/**
 * Credit Icon - AI compute currency
 *
 * Design: Futuristic coin with circuit/AI pattern
 * Color: Blue/electric (#3b82f6)
 */
export function CreditIcon({
  size = 24,
  glowing = false,
  className = "",
  ...props
}: CreditIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowing ? { filter: "drop-shadow(0 0 4px #3b82f6)" } : undefined}
      {...props}
    >
      {/* Outer circle - coin edge */}
      <circle cx="12" cy="12" r="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Inner circle */}
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="#1e40af"
        fillOpacity={0.6}
        stroke="#60a5fa"
        strokeWidth="1"
      />

      {/* AI brain/circuit pattern */}
      <path
        d="M12 6V8M12 16V18M6 12H8M16 12H18"
        stroke="#93c5fd"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center node */}
      <circle cx="12" cy="12" r="2" fill="#60a5fa" />

      {/* Corner nodes */}
      <circle cx="9" cy="9" r="1" fill="#93c5fd" fillOpacity={0.8} />
      <circle cx="15" cy="9" r="1" fill="#93c5fd" fillOpacity={0.8} />
      <circle cx="9" cy="15" r="1" fill="#93c5fd" fillOpacity={0.8} />
      <circle cx="15" cy="15" r="1" fill="#93c5fd" fillOpacity={0.8} />

      {/* Connection lines */}
      <path
        d="M9 9L12 12L15 9M9 15L12 12L15 15"
        stroke="#60a5fa"
        strokeWidth="0.75"
        strokeOpacity={0.6}
      />
    </svg>
  );
}

export default CreditIcon;
