// ═══════════════════════════════════════════════════════════
// WOLF ICON - Animated AI presence indicator
// Uses Rive animation when available, SVG fallback
// Three states: Idle, Processing, Success
// ═══════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Lazy load Rive to avoid SSR issues
let RiveComponent: any = null;
let useRiveModule: any = null;

interface WolfIconProps {
  state: "idle" | "processing" | "success";
  size?: "sm" | "md" | "lg";
  useRive?: boolean;
}

const SIZES = {
  sm: 32,
  md: 48,
  lg: 64,
};

// State to animation name mapping for Rive
const STATE_TO_ANIMATION: Record<string, string> = {
  idle: "idle",
  processing: "thinking",
  success: "celebrate",
};

export function WolfIcon({ state, size = "lg", useRive: enableRive = true }: WolfIconProps) {
  const dimension = SIZES[size];
  const [riveReady, setRiveReady] = useState(false);
  const [riveError, setRiveError] = useState(false);

  // Dynamically import Rive on client
  useEffect(() => {
    if (!enableRive) return;

    import("@rive-app/react-canvas")
      .then((module) => {
        RiveComponent = module.default;
        useRiveModule = module.useRive;
        setRiveReady(true);
      })
      .catch(() => {
        setRiveError(true);
      });
  }, [enableRive]);

  // Use Rive if available
  if (riveReady && !riveError && enableRive) {
    return (
      <RiveWolf
        state={state}
        dimension={dimension}
      />
    );
  }

  // SVG Fallback with Framer Motion animations
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
      animate={state}
      variants={{
        idle: {
          scale: 1,
          filter: "drop-shadow(0 0 0px rgba(0,246,224,0))",
        },
        processing: {
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0 0 8px rgba(0,246,224,0.3))",
            "drop-shadow(0 0 16px rgba(0,246,224,0.6))",
            "drop-shadow(0 0 8px rgba(0,246,224,0.3))",
          ],
          transition: { repeat: Infinity, duration: 1.5 },
        },
        success: {
          rotate: [0, -5, 5, 0],
          y: [0, -2, 2, 0],
          transition: { duration: 0.4 },
        },
      }}
    >
      {/* Abstract Wolf - Geometric representation */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wolf head shape - triangular/diamond */}
        <path
          d="M32 4L8 36L32 60L56 36L32 4Z"
          fill="rgba(0, 246, 224, 0.1)"
          stroke="#00F6E0"
          strokeWidth="1.5"
        />
        {/* Center line */}
        <path d="M32 60V36" stroke="#00F6E0" strokeWidth="1.5" />
        {/* Brow line */}
        <path d="M8 36L32 24L56 36" stroke="#00F6E0" strokeWidth="1.5" />
        {/* Eyes */}
        <motion.circle
          cx="24"
          cy="32"
          r="3"
          fill="#00F6E0"
          animate={state === "processing" ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
        <motion.circle
          cx="40"
          cy="32"
          r="3"
          fill="#00F6E0"
          animate={state === "processing" ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
        />
      </svg>
    </motion.div>
  );
}

// Rive-powered Wolf component
function RiveWolf({ state, dimension }: { state: string; dimension: number }) {
  const [riveInstance, setRiveInstance] = useState<any>(null);

  useEffect(() => {
    if (!useRiveModule) return;

    // This will be used when Rive file is added
    // For now, just set up the hook structure
  }, []);

  // Placeholder while Rive loads
  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="flex items-center justify-center"
    >
      {/* Rive canvas will be rendered here once .riv file is added */}
      {/* For now, show a simple animated placeholder */}
      <motion.div
        className="w-full h-full rounded-full bg-gradient-to-br from-[#00F6E0]/20 to-[#00F6E0]/5 border border-[#00F6E0]/30 flex items-center justify-center"
        animate={
          state === "processing"
            ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(0, 246, 224, 0)",
                  "0 0 20px 5px rgba(0, 246, 224, 0.3)",
                  "0 0 0 0 rgba(0, 246, 224, 0)",
                ],
              }
            : state === "success"
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }
              : {}
        }
        transition={
          state === "processing"
            ? { repeat: Infinity, duration: 1.5 }
            : { duration: 0.5 }
        }
      >
        <span className="text-2xl">🐺</span>
      </motion.div>
    </div>
  );
}

// Export a version that explicitly uses SVG (no Rive)
export function WolfIconSVG(props: Omit<WolfIconProps, "useRive">) {
  return <WolfIcon {...props} useRive={false} />;
}
