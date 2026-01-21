// ═══════════════════════════════════════════════════════════
// MODULE PROGRESS V2
// Premium athletic tech progress indicator
// Glassmorphism + glowing rings + mysterious locked sections
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import type { LearningSection } from "@/data/modules/types";

interface ModuleProgressV2Props {
  sections: LearningSection[];
  currentSectionIndex: number;
  currentCardIndex: number;
  sectionProgress: Record<string, boolean>;
  className?: string;
}

export function ModuleProgressV2({
  sections,
  currentSectionIndex,
  currentCardIndex,
  sectionProgress,
  className = "",
}: ModuleProgressV2Props) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {sections.map((section, idx) => {
        const isCompleted = idx < currentSectionIndex;
        const isCurrent = idx === currentSectionIndex;
        const isLocked = !sectionProgress[section.id] && idx > 0;

        return (
          <SectionIndicator
            key={section.id}
            index={idx}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            isLocked={isLocked}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION INDICATOR
// Individual section circle with premium effects
// ─────────────────────────────────────────────────────────────

interface SectionIndicatorProps {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

function SectionIndicator({
  index,
  isCompleted,
  isCurrent,
  isLocked,
}: SectionIndicatorProps) {
  return (
    <div className="relative">
      {/* Outer glow ring for current section */}
      {isCurrent && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 246, 224, 0.3) 0%, transparent 70%)",
          }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Locked pulse effect */}
      {isLocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white/5"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      )}

      {/* Main circle */}
      <motion.div
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center
          backdrop-blur-sm transition-all duration-300
          ${
            isCompleted
              ? "bg-gradient-to-br from-accent-primary to-accent-primary/70 shadow-[0_0_20px_rgba(0,246,224,0.4)]"
              : isCurrent
                ? "bg-bg-secondary/80 border-2 border-accent-primary shadow-[0_0_15px_rgba(0,246,224,0.3)]"
                : isLocked
                  ? "bg-bg-tertiary/60 border border-white/10"
                  : "bg-bg-secondary/80 border border-white/20"
          }
        `}
        initial={false}
        animate={
          isCurrent
            ? {
                borderColor: ["rgba(0, 246, 224, 1)", "rgba(0, 246, 224, 0.5)", "rgba(0, 246, 224, 1)"],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check className="w-5 h-5 text-bg-primary" strokeWidth={3} />
          </motion.div>
        ) : isLocked ? (
          <Lock className="w-4 h-4 text-white/30" />
        ) : (
          <span
            className={`text-sm font-bold tracking-tight ${
              isCurrent ? "text-accent-primary" : "text-white/50"
            }`}
          >
            {index + 1}
          </span>
        )}
      </motion.div>

      {/* Connecting line to next section */}
      {index < 6 && (
        <div
          className={`
            absolute top-1/2 left-full -translate-y-1/2 w-2 h-0.5
            ${isCompleted ? "bg-accent-primary/50" : "bg-white/10"}
          `}
        />
      )}
    </div>
  );
}

export default ModuleProgressV2;
