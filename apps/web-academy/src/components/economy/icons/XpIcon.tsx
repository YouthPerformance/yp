"use client";

import type { SVGProps } from "react";

interface XpIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  variant?: "bolt" | "star";
  animated?: boolean;
}

/**
 * XP Icon - Experience points (always flowing)
 *
 * Design: Lightning bolt (energy, power) or star (achievement)
 * Color: Electric yellow/gold (#facc15)
 */
export function XpIcon({
  size = 24,
  variant = "bolt",
  animated = false,
  className = "",
  ...props
}: XpIconProps) {
  const animationStyle = animated
    ? {
        animation: "xp-pulse 1.5s ease-in-out infinite",
      }
    : {};

  if (variant === "star") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: "drop-shadow(0 0 3px #facc15)", ...animationStyle }}
        {...props}
      >
        {/* 4-pointed star */}
        <path
          d="M12 2L14 9H21L15.5 13L17.5 21L12 16L6.5 21L8.5 13L3 9H10L12 2Z"
          fill="#facc15"
          stroke="#eab308"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Inner highlight */}
        <path
          d="M12 6L13 9.5H16L13.5 12L14.5 16L12 13.5L9.5 16L10.5 12L8 9.5H11L12 6Z"
          fill="#fef08a"
          fillOpacity={0.8}
        />
      </svg>
    );
  }

  // Default: Lightning bolt
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: "drop-shadow(0 0 3px #facc15)", ...animationStyle }}
      {...props}
    >
      {/* Lightning bolt main shape */}
      <path
        d="M13 2L4 14H11L10 22L20 10H13L14 2H13Z"
        fill="#facc15"
        stroke="#eab308"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Highlight streak */}
      <path d="M12 4L7 12H10L9 18L15 11H12L13 4H12Z" fill="#fef9c3" fillOpacity={0.6} />
    </svg>
  );
}

export default XpIcon;
