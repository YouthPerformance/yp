"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, FileText, TrendingUp, Target, Zap } from "lucide-react";

// Insight markers that appear on hover
const INSIGHTS = [
  {
    id: 1,
    label: "TREND ALERT",
    content: "Positionless Playmaking",
    x: "15%",
    y: "25%",
    icon: TrendingUp,
    delay: 0,
  },
  {
    id: 2,
    label: "SKILL GAP",
    content: "Off-Hand Finishing",
    x: "65%",
    y: "35%",
    icon: Target,
    delay: 0.1,
  },
  {
    id: 3,
    label: "2026 PRIORITY",
    content: "Perimeter Creation",
    x: "25%",
    y: "60%",
    icon: Zap,
    delay: 0.2,
  },
  {
    id: 4,
    label: "MACRO SHIFT",
    content: "Pace & Space 2.0",
    x: "70%",
    y: "70%",
    icon: TrendingUp,
    delay: 0.15,
  },
];

// Fake scouting report lines (blurred content)
const REPORT_LINES = [
  { width: "80%", indent: 0 },
  { width: "65%", indent: 0 },
  { width: "90%", indent: 0 },
  { width: "45%", indent: 20 },
  { width: "70%", indent: 20 },
  { width: "85%", indent: 0 },
  { width: "55%", indent: 0 },
  { width: "75%", indent: 20 },
  { width: "60%", indent: 20 },
  { width: "40%", indent: 0 },
  { width: "80%", indent: 0 },
  { width: "50%", indent: 20 },
];

// Audio waveform bars
const WAVEFORM_BARS = 32;

export function ConsultantDesk() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate audio playback (replace with real audio later)
  const toggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      setIsPlaying(true);
      // Simulate 30 second audio
      progressInterval.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
            return 0;
          }
          return prev + (100 / 300); // 30 seconds at 100ms intervals
        });
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Generate random heights for waveform bars
  const getWaveformHeight = (index: number) => {
    if (!isPlaying) return 20;
    // Create pseudo-random but consistent pattern
    const base = Math.sin(index * 0.5 + audioProgress * 0.1) * 30 + 50;
    const variation = Math.cos(index * 0.3 + audioProgress * 0.15) * 20;
    return Math.max(15, Math.min(85, base + variation));
  };

  return (
    <section
      id="intelligence"
      className="blueprint-theme py-24 px-6 lg:px-16"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #0F1D32 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "#00F6E0",
                boxShadow: "0 0 10px rgba(0, 246, 224, 0.6)",
              }}
            />
            <span
              className="bp-mono text-xs tracking-[0.3em] uppercase"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              Strategic Intelligence
            </span>
          </div>
          <h2
            className="bp-display text-4xl lg:text-5xl mb-4"
            style={{ color: "rgba(255, 255, 255, 0.95)" }}
          >
            The Consultant&apos;s{" "}
            <span style={{ color: "#00F6E0" }}>Desk</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            Real-time insights from the front office. Hover to reveal the trends
            shaping tomorrow&apos;s game.
          </p>
        </motion.div>

        {/* Main Widget Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Scouting Report Document */}
          <div
            className="lg:col-span-3 relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="bp-glass-panel relative overflow-hidden"
              style={{ minHeight: "450px" }}
            >
              {/* Document Header */}
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <FileText
                  className="w-5 h-5"
                  style={{ color: "#00F6E0" }}
                />
                <div>
                  <p
                    className="bp-mono text-sm font-semibold"
                    style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  >
                    SCOUTING_REPORT_2026.pdf
                  </p>
                  <p
                    className="bp-mono text-[10px]"
                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                  >
                    CLASSIFICATION: STRATEGIC • LAST UPDATED: 48H AGO
                  </p>
                </div>
                <div
                  className="ml-auto px-2 py-1 rounded text-[10px] bp-mono"
                  style={{
                    background: "rgba(0, 246, 224, 0.15)",
                    color: "#00F6E0",
                  }}
                >
                  LIVE
                </div>
              </div>

              {/* Blurred Document Content */}
              <div className="relative p-6">
                <div
                  className={`transition-all duration-500 ${
                    isHovered ? "blur-[2px] opacity-40" : "blur-[4px] opacity-60"
                  }`}
                >
                  {/* Fake report title */}
                  <div
                    className="h-6 rounded mb-6"
                    style={{
                      width: "60%",
                      background: "rgba(255, 255, 255, 0.15)",
                    }}
                  />

                  {/* Fake report lines */}
                  <div className="space-y-3">
                    {REPORT_LINES.map((line, i) => (
                      <div
                        key={i}
                        className="h-3 rounded"
                        style={{
                          width: line.width,
                          marginLeft: line.indent,
                          background: "rgba(255, 255, 255, 0.08)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Fake chart */}
                  <div
                    className="mt-8 h-24 rounded"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 246, 224, 0.1) 0%, rgba(0, 246, 224, 0.05) 100%)",
                      border: "1px solid rgba(0, 246, 224, 0.1)",
                    }}
                  />
                </div>

                {/* Insight Markers - Appear on Hover */}
                <AnimatePresence>
                  {isHovered &&
                    INSIGHTS.map((insight) => {
                      const Icon = insight.icon;
                      return (
                        <motion.div
                          key={insight.id}
                          className="absolute"
                          style={{ left: insight.x, top: insight.y }}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{
                            duration: 0.3,
                            delay: insight.delay,
                            ease: "easeOut",
                          }}
                        >
                          <div
                            className="bp-glass px-4 py-3 rounded-lg"
                            style={{
                              background: "rgba(10, 22, 40, 0.95)",
                              border: "1px solid rgba(0, 246, 224, 0.3)",
                              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 246, 224, 0.15)",
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon
                                className="w-3 h-3"
                                style={{ color: "#00F6E0" }}
                              />
                              <span
                                className="bp-mono text-[9px] tracking-wider"
                                style={{ color: "#00F6E0" }}
                              >
                                {insight.label}
                              </span>
                            </div>
                            <p
                              className="bp-mono text-sm font-medium"
                              style={{ color: "rgba(255, 255, 255, 0.95)" }}
                            >
                              {insight.content}
                            </p>
                          </div>

                          {/* Connector dot */}
                          <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                            style={{
                              background: "#00F6E0",
                              boxShadow: "0 0 10px rgba(0, 246, 224, 0.6)",
                            }}
                          />
                        </motion.div>
                      );
                    })}
                </AnimatePresence>

                {/* Hover Prompt */}
                <AnimatePresence>
                  {!isHovered && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="bp-glass px-6 py-4 rounded-lg text-center"
                        style={{
                          background: "rgba(10, 22, 40, 0.9)",
                          border: "1px solid rgba(0, 246, 224, 0.2)",
                        }}
                      >
                        <p
                          className="bp-mono text-xs mb-1"
                          style={{ color: "rgba(255, 255, 255, 0.5)" }}
                        >
                          CLASSIFIED INTELLIGENCE
                        </p>
                        <p
                          className="bp-mono text-sm"
                          style={{ color: "#00F6E0" }}
                        >
                          Hover to reveal insights
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AR Corner Brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2" style={{ borderColor: "rgba(0, 246, 224, 0.4)" }} />
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2" style={{ borderColor: "rgba(0, 246, 224, 0.4)" }} />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2" style={{ borderColor: "rgba(0, 246, 224, 0.4)" }} />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2" style={{ borderColor: "rgba(0, 246, 224, 0.4)" }} />
            </div>
          </div>

          {/* Audio Note Panel */}
          <div className="lg:col-span-2">
            <div
              className="bp-glass-panel h-full p-6 flex flex-col"
              style={{ minHeight: "450px" }}
            >
              {/* Audio Header */}
              <div className="flex items-center gap-3 mb-6">
                <Volume2
                  className="w-5 h-5"
                  style={{ color: "#00F6E0" }}
                />
                <div>
                  <p
                    className="bp-mono text-sm font-semibold"
                    style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  >
                    VOICE NOTE
                  </p>
                  <p
                    className="bp-mono text-[10px]"
                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                  >
                    ADAM HARRINGTON • 0:30
                  </p>
                </div>
              </div>

              {/* Waveform Visualization */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full">
                  {/* Waveform bars */}
                  <div className="flex items-center justify-center gap-[3px] h-24 mb-6">
                    {Array.from({ length: WAVEFORM_BARS }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-[6px] rounded-full"
                        style={{
                          background: i / WAVEFORM_BARS < audioProgress / 100
                            ? "#00F6E0"
                            : "rgba(0, 246, 224, 0.3)",
                          boxShadow: i / WAVEFORM_BARS < audioProgress / 100
                            ? "0 0 8px rgba(0, 246, 224, 0.5)"
                            : "none",
                        }}
                        animate={{
                          height: `${getWaveformHeight(i)}%`,
                        }}
                        transition={{
                          duration: 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div
                    className="h-1 rounded-full overflow-hidden mb-2"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#00F6E0" }}
                      animate={{ width: `${audioProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>

                  {/* Time */}
                  <div className="flex justify-between">
                    <span
                      className="bp-mono text-[10px]"
                      style={{ color: "rgba(255, 255, 255, 0.4)" }}
                    >
                      {Math.floor((audioProgress / 100) * 30)}s
                    </span>
                    <span
                      className="bp-mono text-[10px]"
                      style={{ color: "rgba(255, 255, 255, 0.4)" }}
                    >
                      0:30
                    </span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={toggleAudio}
                className="w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-lg transition-all duration-200"
                style={{
                  background: isPlaying
                    ? "rgba(0, 246, 224, 0.15)"
                    : "rgba(0, 246, 224, 1)",
                  color: isPlaying ? "#00F6E0" : "#0A1628",
                  border: isPlaying ? "1px solid rgba(0, 246, 224, 0.3)" : "none",
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span className="bp-mono text-sm font-semibold tracking-wider">
                      PAUSE
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 ml-0.5" />
                    <span className="bp-mono text-sm font-semibold tracking-wider">
                      PLAY PHILOSOPHY
                    </span>
                  </>
                )}
              </button>

              {/* Quote Preview */}
              <div
                className="mt-6 pt-6"
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  &ldquo;The game moves in cycles. The teams that win are the
                  ones who see the next cycle coming...&rdquo;
                </p>
                <p
                  className="bp-mono text-[10px] mt-3"
                  style={{ color: "rgba(255, 255, 255, 0.4)" }}
                >
                  — EXCERPT FROM AUDIO NOTE
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: "TREND ACCURACY", value: "94%", sublabel: "3-YEAR AVG" },
            { label: "DRAFT HITS", value: "12/15", sublabel: "SINCE 2020" },
            { label: "SKILL FORECASTS", value: "200+", sublabel: "DELIVERED" },
            { label: "FRONT OFFICE CLIENTS", value: "6", sublabel: "NBA TEAMS" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bp-glass-panel p-5 text-center"
            >
              <p className="bp-readout text-[10px] mb-2">{stat.label}</p>
              <p className="bp-readout-value bp-readout-accent text-3xl">
                {stat.value}
              </p>
              <p
                className="bp-mono text-[10px] mt-1"
                style={{ color: "rgba(255, 255, 255, 0.4)" }}
              >
                {stat.sublabel}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
