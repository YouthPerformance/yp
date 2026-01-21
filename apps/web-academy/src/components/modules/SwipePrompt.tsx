// ═══════════════════════════════════════════════════════════
// SWIPE PROMPT
// Premium animated swipe indicator with pagination
// Breathing animations + gradient effects + energy trail
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";

interface SwipePromptProps {
  currentIndex?: number;
  totalCount?: number;
  showPagination?: boolean;
  className?: string;
}

export function SwipePrompt({
  currentIndex = 0,
  totalCount = 4,
  showPagination = true,
  className = "",
}: SwipePromptProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Text with gradient */}
      <motion.p
        className="text-sm font-semibold tracking-[0.2em] uppercase"
        style={{
          background: "linear-gradient(90deg, rgba(0,246,224,0.6) 0%, rgba(0,246,224,1) 50%, rgba(0,246,224,0.6) 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        Swipe up to continue
      </motion.p>

      {/* Arrow with energy trail */}
      <div className="relative h-10 flex items-center justify-center">
        {/* Energy trail particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 rounded-full bg-accent-primary/30"
            style={{ height: 8 + i * 4 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: [20, -10],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main arrow */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-4, 4, -4] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent-primary"
          >
            {/* Glow filter */}
            <defs>
              <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#arrowGlow)"
            />
          </svg>
        </motion.div>

        {/* Pulse ring */}
        <motion.div
          className="absolute w-12 h-12 rounded-full border border-accent-primary/30"
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{
            scale: [0.5, 1.2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Pagination dots */}
      {showPagination && totalCount > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalCount }, (_, i) => {
            const isActive = i === currentIndex;
            const isPast = i < currentIndex;
            const distance = Math.abs(i - currentIndex);

            return (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  backgroundColor: isActive
                    ? "#00F6E0"
                    : isPast
                      ? "rgba(0, 246, 224, 0.4)"
                      : "rgba(255, 255, 255, 0.15)",
                  boxShadow: isActive ? "0 0 10px rgba(0, 246, 224, 0.5)" : "none",
                }}
                initial={false}
                animate={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  opacity: distance > 2 ? 0.3 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SwipePrompt;
