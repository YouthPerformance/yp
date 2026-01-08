// ═══════════════════════════════════════════════════════════
// WOLF AVATAR
// Animated wolf mascot that reacts to speaking/listening states
// Uses the YP Wolf mascot image with dynamic effects
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { WolfIdentity } from "@/hooks/useVoiceSorting";

interface WolfAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  identity: WolfIdentity | null;
  revealed: boolean;
}

const IDENTITY_COLORS: Record<WolfIdentity, { primary: string; glow: string; filter: string }> = {
  speed: {
    primary: "rgb(6, 182, 212)", // cyan-500
    glow: "rgba(6, 182, 212, 0.6)",
    filter:
      "drop-shadow(0 0 30px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.4))",
  },
  tank: {
    primary: "rgb(168, 85, 247)", // purple-500
    glow: "rgba(168, 85, 247, 0.6)",
    filter:
      "drop-shadow(0 0 30px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.4))",
  },
  air: {
    primary: "rgb(234, 179, 8)", // yellow-500
    glow: "rgba(234, 179, 8, 0.6)",
    filter:
      "drop-shadow(0 0 30px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 60px rgba(234, 179, 8, 0.4))",
  },
};

const DEFAULT_COLORS = {
  primary: "rgb(0, 246, 224)", // cyan brand
  glow: "rgba(0, 246, 224, 0.4)",
  filter: "drop-shadow(0 0 30px rgba(0, 246, 224, 0.8)) brightness(0.9) contrast(1.1)",
};

export function WolfAvatar({ isSpeaking, isListening, identity, revealed }: WolfAvatarProps) {
  const colors = identity ? IDENTITY_COLORS[identity] : DEFAULT_COLORS;

  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72">
      {/* Outer glow ring - breathing effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.08, 1] : [1, 1.06, 1],
          opacity: isSpeaking ? [0.5, 0.8, 0.5] : isListening ? [0.4, 0.6, 0.4] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isSpeaking ? 0.3 : isListening ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Secondary glow - breathing depth */}
      <motion.div
        className="absolute inset-8 rounded-full blur-2xl"
        animate={{
          scale: isSpeaking ? [1, 1.1, 1] : [1, 1.08, 1],
          opacity: isSpeaking ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: isSpeaking ? 0.2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: colors.glow }}
      />

      {/* Wolf mascot image */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: revealed ? [1, 1.05, 1] : isSpeaking ? [1, 1.02, 1] : 1,
          opacity: 1,
          y: isSpeaking ? [0, -4, 0] : isListening ? [0, -2, 0] : 0,
          rotate: isListening ? [0, -1, 0, 1, 0] : 0,
        }}
        transition={{
          scale: { duration: revealed ? 0.6 : 0.3, repeat: isSpeaking ? Infinity : 0 },
          opacity: { duration: 0.5 },
          y: {
            duration: isSpeaking ? 0.25 : 0.8,
            repeat: isSpeaking || isListening ? Infinity : 0,
          },
          rotate: { duration: 0.5, repeat: isListening ? Infinity : 0 },
        }}
      >
        <Image
          src="/images/wolffront_nobg.png"
          alt="YP Wolf"
          width={288}
          height={288}
          className="object-contain"
          style={{
            filter: revealed ? colors.filter : DEFAULT_COLORS.filter,
            transition: "filter 0.5s ease-out",
          }}
          priority
          unoptimized
        />
      </motion.div>

      {/* Cyan accent rings - tech/HUD effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* Speaking indicator - sound waves */}
      {isSpeaking && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                background: `linear-gradient(to top, #00f6e0, transparent)`,
              }}
              animate={{
                height: [8, 24 + Math.sin(i) * 8, 8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Listening indicator - pulsing mic waves */}
      {isListening && !isSpeaking && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ backgroundColor: "#00f6e0" }}
              animate={{
                height: [6, 16, 6],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Identity reveal flash effect */}
      {revealed && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
