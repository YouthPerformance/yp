// ═══════════════════════════════════════════════════════════
// Spider Chart - Neon Trinity Radar Visualization
// Shows balance across Volt (cyan), Forge (orange), Flow (purple)
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface SpiderChartProps {
  volt: number;   // 0-100 normalized
  forge: number;  // 0-100 normalized
  flow: number;   // 0-100 normalized
  size?: number;
  showLabels?: boolean;
  animated?: boolean;
  glowing?: boolean;
}

const NEON_COLORS = {
  Volt: "#00FFFF",   // Cyan
  Forge: "#FF6B35",  // Orange
  Flow: "#A855F7",   // Purple
};

export function SpiderChart({
  volt,
  forge,
  flow,
  size = 200,
  showLabels = true,
  animated = true,
  glowing = false,
}: SpiderChartProps) {
  const center = size / 2;
  const maxRadius = size * 0.4;

  // Calculate points for each axis (120° apart)
  const points = useMemo(() => {
    // Volt at top (270°), Forge at bottom-left (150°), Flow at bottom-right (30°)
    const angles = {
      volt: -90,    // Top
      forge: 150,   // Bottom-left
      flow: 30,     // Bottom-right
    };

    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const getPoint = (value: number, angle: number) => {
      const r = (value / 100) * maxRadius;
      return {
        x: center + r * Math.cos(toRadians(angle)),
        y: center + r * Math.sin(toRadians(angle)),
      };
    };

    return {
      volt: getPoint(volt, angles.volt),
      forge: getPoint(forge, angles.forge),
      flow: getPoint(flow, angles.flow),
      // Axis endpoints (100%)
      voltMax: getPoint(100, angles.volt),
      forgeMax: getPoint(100, angles.forge),
      flowMax: getPoint(100, angles.flow),
    };
  }, [volt, forge, flow, center, maxRadius]);

  // Create the filled polygon path
  const polygonPath = `M ${points.volt.x},${points.volt.y} L ${points.forge.x},${points.forge.y} L ${points.flow.x},${points.flow.y} Z`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Glow filter */}
        {glowing && (
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {/* Background grid rings */}
        {[25, 50, 75, 100].map((ring) => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={(ring / 100) * maxRadius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        <line
          x1={center}
          y1={center}
          x2={points.voltMax.x}
          y2={points.voltMax.y}
          stroke={NEON_COLORS.Volt}
          strokeWidth={1}
          opacity={0.3}
        />
        <line
          x1={center}
          y1={center}
          x2={points.forgeMax.x}
          y2={points.forgeMax.y}
          stroke={NEON_COLORS.Forge}
          strokeWidth={1}
          opacity={0.3}
        />
        <line
          x1={center}
          y1={center}
          x2={points.flowMax.x}
          y2={points.flowMax.y}
          stroke={NEON_COLORS.Flow}
          strokeWidth={1}
          opacity={0.3}
        />

        {/* Filled area */}
        <motion.path
          d={polygonPath}
          fill="url(#triangleGradient)"
          fillOpacity={0.3}
          stroke="white"
          strokeWidth={2}
          filter={glowing ? "url(#glow)" : undefined}
          initial={animated ? { opacity: 0, scale: 0.5 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={NEON_COLORS.Volt} />
            <stop offset="50%" stopColor={NEON_COLORS.Forge} />
            <stop offset="100%" stopColor={NEON_COLORS.Flow} />
          </linearGradient>
        </defs>

        {/* Data points */}
        <motion.circle
          cx={points.volt.x}
          cy={points.volt.y}
          r={6}
          fill={NEON_COLORS.Volt}
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.circle
          cx={points.forge.x}
          cy={points.forge.y}
          r={6}
          fill={NEON_COLORS.Forge}
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.circle
          cx={points.flow.x}
          cy={points.flow.y}
          r={6}
          fill={NEON_COLORS.Flow}
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
      </svg>

      {/* Labels */}
      {showLabels && (
        <>
          <div
            className="absolute text-xs font-bold text-center"
            style={{
              top: 0,
              left: "50%",
              transform: "translateX(-50%) translateY(-100%)",
              color: NEON_COLORS.Volt,
            }}
          >
            VOLT
            <div className="text-[10px] opacity-70">{volt}%</div>
          </div>
          <div
            className="absolute text-xs font-bold"
            style={{
              bottom: "5%",
              left: "5%",
              color: NEON_COLORS.Forge,
            }}
          >
            FORGE
            <div className="text-[10px] opacity-70">{forge}%</div>
          </div>
          <div
            className="absolute text-xs font-bold text-right"
            style={{
              bottom: "5%",
              right: "5%",
              color: NEON_COLORS.Flow,
            }}
          >
            FLOW
            <div className="text-[10px] opacity-70">{flow}%</div>
          </div>
        </>
      )}
    </div>
  );
}
