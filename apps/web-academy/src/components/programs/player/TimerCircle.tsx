// ═══════════════════════════════════════════════════════════
// TimerCircle Component
// Circular progress timer visualization
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';

interface TimerCircleProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
  strokeWidth?: number;
}

export function TimerCircle({
  timeLeft,
  totalTime,
  size = 128,
  strokeWidth = 3,
}: TimerCircleProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG Circle */}
      <svg className="absolute w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--accent-primary)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 0 }}
          animate={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference * (1 - progress),
          }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>

      {/* Time Display */}
      <span
        className="font-bebas text-4xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
