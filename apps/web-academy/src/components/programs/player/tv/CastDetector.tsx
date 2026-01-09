// ═══════════════════════════════════════════════════════════
// CastDetector Component
// Shows casting availability and connection status
// ═══════════════════════════════════════════════════════════

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cast, Smartphone, Tv } from "lucide-react";
import { useCastSession } from "@/hooks/useCastSession";

export interface CastDetectorProps {
  /** Theme color for accents */
  themeColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show label text */
  showLabel?: boolean;
  /** Callback when cast state changes */
  onCastStateChange?: (isConnected: boolean, isController: boolean) => void;
}

const sizeConfig = {
  sm: {
    button: "p-2",
    icon: "w-4 h-4",
    text: "text-xs",
  },
  md: {
    button: "p-3",
    icon: "w-5 h-5",
    text: "text-sm",
  },
  lg: {
    button: "p-4",
    icon: "w-6 h-6",
    text: "text-base",
  },
};

/**
 * CastDetector - Shows cast button and manages cast sessions
 *
 * Features:
 * - Auto-detects AirPlay/Chromecast availability
 * - Shows connection status
 * - One-tap to start/stop casting
 *
 * @example
 * ```tsx
 * <CastDetector
 *   themeColor="#FF6B00"
 *   onCastStateChange={(connected, controller) => {
 *     if (connected && controller) {
 *       // Show remote UI
 *     }
 *   }}
 * />
 * ```
 */
export function CastDetector({
  themeColor = "#00f6e0",
  size = "md",
  showLabel = false,
  onCastStateChange,
}: CastDetectorProps) {
  const { session, startCasting, stopCasting } = useCastSession();
  const config = sizeConfig[size];

  // Notify parent of cast state changes
  if (onCastStateChange) {
    const isConnected = session.state === "connected";
    onCastStateChange(isConnected, session.isController);
  }

  // Don't render if casting not available
  if (!session.isAvailable) {
    return null;
  }

  const handleClick = () => {
    if (session.state === "connected") {
      stopCasting();
    } else {
      startCasting();
    }
  };

  const getIcon = () => {
    if (session.state === "connected") {
      return session.isController ? (
        <Tv className={config.icon} style={{ color: themeColor }} />
      ) : (
        <Smartphone className={config.icon} style={{ color: themeColor }} />
      );
    }
    if (session.state === "connecting") {
      return (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Cast className={config.icon} style={{ color: "var(--text-tertiary)" }} />
        </motion.div>
      );
    }
    return <Cast className={config.icon} style={{ color: "var(--text-tertiary)" }} />;
  };

  const getLabel = () => {
    if (session.state === "connected") {
      if (session.deviceName) return session.deviceName;
      return session.isController ? "Connected" : "Receiving";
    }
    if (session.state === "connecting") return "Connecting...";
    return "Cast";
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${config.button} rounded-full flex items-center gap-2`}
      style={{
        backgroundColor:
          session.state === "connected" ? `${themeColor}20` : "rgba(255,255,255,0.1)",
        borderWidth: session.state === "connected" ? 2 : 0,
        borderColor: session.state === "connected" ? themeColor : "transparent",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
    >
      {getIcon()}

      {showLabel && (
        <span
          className={`${config.text} font-medium`}
          style={{
            color: session.state === "connected" ? themeColor : "var(--text-tertiary)",
          }}
        >
          {getLabel()}
        </span>
      )}

      {/* Connection indicator dot */}
      <AnimatePresence>
        {session.state === "connected" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: "#22c55e" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
