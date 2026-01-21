// ═══════════════════════════════════════════════════════════
// CHAT WOLF AVATAR
// Smaller version of Wolf avatar for chat bubbles
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ChatWolfAvatarProps {
  size?: "sm" | "md" | "lg";
  isTyping?: boolean;
}

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
};

export function ChatWolfAvatar({ size = "md", isTyping = false }: ChatWolfAvatarProps) {
  const px = SIZES[size];

  return (
    <motion.div
      className="relative flex-shrink-0 rounded-full overflow-hidden"
      style={{
        width: px,
        height: px,
        background: "linear-gradient(135deg, rgba(0, 246, 224, 0.2) 0%, rgba(0, 246, 224, 0.05) 100%)",
      }}
      animate={
        isTyping
          ? {
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={{
        duration: 0.8,
        repeat: isTyping ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <Image
        src="/images/wolffront.webp"
        alt="Wolf"
        width={px}
        height={px}
        className="object-cover"
        style={{
          filter: "drop-shadow(0 0 8px rgba(0, 246, 224, 0.4))",
        }}
      />
    </motion.div>
  );
}
