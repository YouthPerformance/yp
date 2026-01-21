// ===================================================================
// DEMO: BULLETPROOF ANKLES
// Direct link to the ILM swipe experience
// ===================================================================

"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardSwiper, ModuleProgressV2, XpCounterV2 } from "@/components/modules";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    // User clicks "Day One" button to reset
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
      {/* Header - Premium V2 */}
      <header className="flex-none border-b border-white/5 bg-gradient-to-b from-[#1a1a1a] to-[#141414]">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Left: Exit button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            aria-label="Exit demo"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Center: Progress V2 */}
          <div className="flex-1 flex justify-center mx-4">
            <ModuleProgressV2
              sections={module.sections}
              currentSectionIndex={currentSectionIndex}
              currentCardIndex={currentCardIndex}
              sectionProgress={sectionProgress}
            />
          </div>

          {/* Right: XP Counter V2 */}
          <XpCounterV2 count={xpEarned} />
        </div>
      </header>

      {/* Card area */}
      <main className="flex-1 overflow-hidden">
        <CardSwiper
          module={module}
          sections={module.sections}
          mode="athlete"
          onComplete={handleComplete}
        />
      </main>

      {/* Exit confirmation modal - ShadCN Dialog */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Exit Demo?</DialogTitle>
            <DialogDescription>
              Return to the demo index.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowExitConfirm(false)}
              className="flex-1"
            >
              Keep Learning
            </Button>
            <Button
              variant="destructive"
              onClick={confirmExit}
              className="flex-1"
            >
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Completion overlay */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center px-6">
            <div className="text-6xl mb-4">🐺</div>
            <p className="text-3xl font-bebas text-cyan-400 mb-2">YOU'RE READY!</p>
            <p className="text-gray-400 mb-2">+{xpEarned} XP earned</p>
            <p className="text-white text-lg mb-6">Time to start the Barefoot Reset Challenge</p>
            <Button
              size="lg"
              onClick={() => {
                // Reset for replay in demo
                setIsCompleted(false);
                startModule(module.id, module.sections);
              }}
            >
              Day One →
            </Button>
            <p className="text-gray-600 text-xs mt-4">(Demo will reset)</p>
          </div>
        </div>
      )}
    </div>
  );
}
