// ===================================================================
// DEMO: BULLETPROOF ANKLES
// Direct link to the ILM swipe experience
// ===================================================================

"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardSwiper, ModuleProgress, XpCounter } from "@/components/modules";
import { bulletproofAnklesModule } from "@/data/modules/bulletproof-ankles";
import { useModuleStore } from "@/stores/moduleStore";

export default function DemoBulletproofAnklesPage() {
  const router = useRouter();
  const module = bulletproofAnklesModule;

  // Store state
  const {
    currentModule,
    xpEarned,
    currentSectionIndex,
    currentCardIndex,
    startModule,
    getSectionProgress,
  } = useModuleStore();

  // UI state
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize module on mount
  useEffect(() => {
    if (module && currentModule !== module.id) {
      startModule(module.id, module.sections);
    }
  }, [module, currentModule, startModule]);

  // Handle module completion
  const handleComplete = async (stats: {
    score: number;
    totalChecks: number;
    xp: number;
    time: number;
    shards?: number;
  }) => {
    setIsCompleted(true);
    console.log("[Demo] Module completed:", stats);

    // Stay on completion screen
    setTimeout(() => {
      setIsCompleted(false);
      // Reset for replay
      startModule(module.id, module.sections);
    }, 3000);
  };

  // Handle exit
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    router.push("/demo");
  };

  const sectionProgress = getSectionProgress();

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex-none border-b border-gray-800 bg-[#1a1a1a]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Exit button */}
          <button
            onClick={handleExit}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Exit demo"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Center: Progress */}
          <div className="flex-1 max-w-sm mx-4">
            <ModuleProgress
              sections={module.sections}
              currentSectionIndex={currentSectionIndex}
              currentCardIndex={currentCardIndex}
              sectionProgress={sectionProgress}
            />
          </div>

          {/* Right: XP Counter */}
          <XpCounter count={xpEarned} />
        </div>
      </header>

      {/* Card area */}
      <main className="flex-1 overflow-hidden">
        <CardSwiper
          module={module}
          sections={module.sections}
          onComplete={handleComplete}
        />
      </main>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-xl font-bebas uppercase tracking-wide text-white mb-2">
              Exit Demo?
            </h3>
            <p className="text-gray-400 mb-6">
              Return to the demo index.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300
                         hover:border-cyan-500/50 hover:text-white transition-all"
              >
                Keep Learning
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-medium
                         hover:bg-red-900/30 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion overlay */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center">
            <div className="text-6xl mb-4">🐺</div>
            <p className="text-2xl font-bebas text-cyan-400 mb-2">NICE WORK!</p>
            <p className="text-gray-400">+{xpEarned} XP earned</p>
            <p className="text-gray-500 text-sm mt-4">Resetting demo...</p>
          </div>
        </div>
      )}
    </div>
  );
}
