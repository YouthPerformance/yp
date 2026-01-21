// ═══════════════════════════════════════════════════════════
// WOLF EVOLUTION COMPONENT
// Visual progression: base → headband (7) → chain (14) →
// sleeves (21) → legendary (30)
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export type EvolutionTier = "base" | "headband" | "chain" | "sleeves" | "legendary";

interface WolfEvolutionProps {
  tier: EvolutionTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
}

type Accessory = "headband" | "chain" | "sleeves" | "crown";

const TIER_CONFIG: Record<
  EvolutionTier,
  { label: string; level: number; color: string; glow: boolean; accessories: Accessory[] }
> = {
  base: {
    label: "Pup",
    level: 0,
    color: "var(--text-tertiary)",
    glow: false,
    accessories: [],
  },
  headband: {
    label: "Focused",
    level: 7,
    color: "var(--accent-primary)",
    glow: true,
    accessories: ["headband"],
  },
  chain: {
    label: "Committed",
    level: 14,
    color: "#FFD700",
    glow: true,
    accessories: ["headband", "chain"],
  },
  sleeves: {
    label: "Elite",
    level: 21,
    color: "#9C27B0",
    glow: true,
    accessories: ["headband", "chain", "sleeves"],
  },
  legendary: {
    label: "Legendary",
    level: 30,
    color: "#FF6B6B",
    glow: true,
    accessories: ["headband", "chain", "sleeves", "crown"],
  },
};

const SIZE_CONFIG = {
  sm: { container: "w-12 h-12", image: 48 },
  md: { container: "w-20 h-20", image: 80 },
  lg: { container: "w-32 h-32", image: 128 },
};

export function WolfEvolution({
  tier,
  size = "md",
  showLabel = false,
  animate = true,
}: WolfEvolutionProps) {
  const config = TIER_CONFIG[tier];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Wolf Container */}
      <motion.div
        className={`relative ${sizeConfig.container} rounded-xl overflow-hidden`}
        initial={animate ? { scale: 0.8, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          boxShadow: config.glow ? `0 0 20px ${config.color}40` : undefined,
        }}
      >
        {/* Base Wolf Image */}
        <Image
          src="/images/wolffront.webp"
          alt={`Wolf - ${config.label}`}
          width={sizeConfig.image}
          height={sizeConfig.image}
          className="w-full h-full object-cover"
        />

        {/* Overlay accessories (CSS-based for now, can be replaced with actual assets) */}
        {config.accessories.includes("headband") && (
          <div
            className="absolute top-[15%] left-[10%] right-[10%] h-[8%] rounded-full"
            style={{ backgroundColor: "var(--accent-primary)", opacity: 0.9 }}
          />
        )}

        {config.accessories.includes("chain") && (
          <div
            className="absolute bottom-[25%] left-[20%] right-[20%] h-[6%] rounded-full"
            style={{ backgroundColor: "#FFD700", opacity: 0.9 }}
          />
        )}

        {config.accessories.includes("crown") && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-lg">👑</span>
          </motion.div>
        )}

        {/* Glow overlay for higher tiers */}
        {config.glow && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${config.color}20 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Label */}
      {showLabel && (
        <motion.div
          className="mt-2 text-center"
          initial={animate ? { opacity: 0, y: 5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span
            className="font-bebas text-sm tracking-wider block"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            Level {config.level}+
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Evolution timeline for milestone celebrations
export function WolfEvolutionTimeline({
  currentTier,
}: {
  currentTier: EvolutionTier;
}) {
  const tiers: EvolutionTier[] = ["base", "headband", "chain", "sleeves", "legendary"];
  const currentIndex = tiers.indexOf(currentTier);

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      {tiers.map((tier, index) => {
        const config = TIER_CONFIG[tier];
        const isUnlocked = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={tier} className="flex-1 flex flex-col items-center">
            {/* Connector line */}
            {index > 0 && (
              <div
                className="absolute h-0.5 -ml-[50%] w-full top-4"
                style={{
                  backgroundColor: isUnlocked
                    ? "var(--accent-primary)"
                    : "var(--bg-tertiary)",
                }}
              />
            )}

            {/* Tier circle */}
            <motion.div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                isCurrent ? "ring-2 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: isUnlocked ? config.color : "var(--bg-tertiary)",
                color: isUnlocked ? "var(--bg-primary)" : "var(--text-tertiary)",
                // Ring colors via CSS custom properties (Tailwind picks these up)
                "--tw-ring-color": isCurrent ? config.color : "transparent",
                "--tw-ring-offset-color": "var(--bg-primary)",
              } as React.CSSProperties}
              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {config.level || "0"}
            </motion.div>

            {/* Label */}
            <span
              className="text-xs mt-1"
              style={{
                color: isUnlocked ? "var(--text-secondary)" : "var(--text-tertiary)",
              }}
            >
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default WolfEvolution;
