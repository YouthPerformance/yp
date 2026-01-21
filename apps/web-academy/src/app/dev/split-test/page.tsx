// ═══════════════════════════════════════════════════════════
// DEV TEST PAGE - Split Screen Player
// Access at /dev/split-test (no auth required)
// DELETE THIS FILE BEFORE PRODUCTION
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { SplitScreenPlayer } from "@/components/programs/player";
import type { Exercise } from "@/data/programs/basketball-chassis/types";

// Mock exercise with split-screen videos
const MOCK_EXERCISE: Exercise = {
  id: "test-split-1",
  name: "Ankle Circles",
  duration: 60,
  sets: 1,
  side: "both",
  equipment: [],
  videoUrl:
    "https://customer-tuqbcyjvhe5ykkrx.cloudflarestream.com/6b649a4d6f4cd4042cb2b577d9768d4d/manifest/video.m3u8",
  demoVideoUrl:
    "https://customer-tuqbcyjvhe5ykkrx.cloudflarestream.com/2abab0f03a4fce3728c40b9e238e1580/manifest/video.m3u8",
  thumbnailUrl:
    "https://customer-tuqbcyjvhe5ykkrx.cloudflarestream.com/2abab0f03a4fce3728c40b9e238e1580/thumbnails/thumbnail.jpg",
  cue: "Full range, controlled tempo",
  tips: ["Keep knee stable", "Circle in both directions"],
};

const EXERCISES: Exercise[] = [
  MOCK_EXERCISE,
  {
    ...MOCK_EXERCISE,
    id: "test-split-2",
    name: "90/90 Hip Switches",
    duration: 45,
    cue: "Control the rotation",
  },
  {
    ...MOCK_EXERCISE,
    id: "test-split-3",
    name: "World's Greatest Stretch",
    duration: 30,
    cue: "Open up through the chest",
  },
];

export default function SplitTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleExit = () => {
    setCurrentIndex(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">✅ Test Complete!</h1>
          <p className="text-gray-400 mb-6">All exercises finished</p>
          <button
            onClick={handleExit}
            className="px-6 py-3 bg-cyan-500 rounded-full font-semibold"
          >
            Restart Test
          </button>
        </div>
      </main>
    );
  }

  return (
    <SplitScreenPlayer
      exercise={EXERCISES[currentIndex]}
      exerciseIndex={currentIndex}
      totalExercises={EXERCISES.length}
      onComplete={handleComplete}
      onSkip={handleSkip}
      onExit={handleExit}
      themeColor="#00f6e0"
    />
  );
}
