"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Flame, Play, Trophy } from "lucide-react";
import { useState } from "react";

const WORKOUTS = [
  { name: "Vertical Jump 101", duration: "12 min", xp: 150 },
  { name: "Ball Handling Basics", duration: "8 min", xp: 100 },
  { name: "Chassis Strength", duration: "15 min", xp: 200 },
];

export function Software() {
  const [activeWorkout, setActiveWorkout] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="section bg-gradient-to-b from-wolf-black to-wolf-dark relative">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 text-center lg:text-left"
        >
          <p className="text-wolf-blue font-mono text-sm tracking-[0.3em] uppercase mb-4">
            The Software
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">YP ACADEMY</h2>
          <p className="text-gray-400 text-lg max-w-md">
            Hardware enters the home.
            <br />
            <span className="text-wolf-blue">Software keeps them there.</span>
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8 justify-center lg:justify-start">
            <div>
              <p className="text-3xl font-bold text-white">247</p>
              <p className="text-gray-500 text-sm">Training Videos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">88%</p>
              <p className="text-gray-500 text-sm">3-Month Retention</p>
            </div>
          </div>
        </motion.div>

        {/* iPhone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Phone Frame */}
          <div className="w-[280px] h-[580px] bg-wolf-gray rounded-[40px] p-3 shadow-2xl border border-gray-800">
            <div className="w-full h-full bg-wolf-black rounded-[32px] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-wolf-black rounded-b-2xl z-20" />

              {/* App Content */}
              <div className="pt-10 px-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-xs">Good morning</p>
                    <p className="text-white font-semibold">Athlete</p>
                  </div>
                  <div className="flex items-center gap-1 bg-wolf-orange/20 px-2 py-1 rounded-full">
                    <Flame className="w-3 h-3 text-wolf-orange" />
                    <span className="text-wolf-orange text-xs font-medium">7 day streak</span>
                  </div>
                </div>

                {/* Today's Stack */}
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
                  Today&apos;s Stack
                </p>

                <div className="space-y-2">
                  {WORKOUTS.map((workout, i) => (
                    <motion.button
                      key={workout.name}
                      onClick={() => {
                        setActiveWorkout(i);
                        setIsPlaying(true);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        activeWorkout === i
                          ? "bg-wolf-neon/10 border border-wolf-neon/30"
                          : "bg-wolf-gray/50 border border-transparent"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{workout.name}</p>
                          <p className="text-gray-500 text-xs">
                            {workout.duration} • {workout.xp} XP
                          </p>
                        </div>
                        {activeWorkout === i && isPlaying ? (
                          <CheckCircle className="w-5 h-5 text-wolf-neon" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* XP Bar */}
                <div className="mt-auto mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500">Level 12</span>
                    <span className="text-wolf-neon">2,450 / 3,000 XP</span>
                  </div>
                  <div className="h-2 bg-wolf-gray rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-wolf-neon to-wolf-blue"
                      initial={{ width: 0 }}
                      whileInView={{ width: "82%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating notification */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -right-4 top-32 bg-wolf-neon text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  +150 XP earned!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
