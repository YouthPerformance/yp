// ═══════════════════════════════════════════════════════════
// SCORE GAUGE
// Eight Sleep-inspired circular score display with ring indicator
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, label, sublabel, size = "lg" }: ScoreGaugeProps) {
  // Size configurations
  const sizes = {
    sm: { width: 120, stroke: 6, fontSize: "text-3xl" },
    md: { width: 160, stroke: 8, fontSize: "text-4xl" },
    lg: { width: 200, stroke: 10, fontSize: "text-6xl" },
  };

  const config = sizes[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 85) return "#22c55e"; // Green
    if (score >= 65) return "#3b82f6"; // Blue (Eight Sleep uses blue as primary)
    if (score >= 40) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const getStatus = () => {
    if (score >= 85) return "In range";
    if (score >= 65) return "Near range";
    if (score >= 40) return "Out of range";
    return "Critical";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.width}
          height={config.width}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={config.stroke}
          />
        </svg>

        {/* Progress ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.width}
          height={config.width}
        >
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${config.fontSize} font-light text-white`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-zinc-500 mt-1">{getStatus()}</span>
        </div>
      </div>

      {/* Labels */}
      {label && (
        <div className="mt-4 text-center">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">{label}</div>
          {sublabel && <div className="text-xs text-zinc-600 mt-0.5">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
