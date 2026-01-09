// ═══════════════════════════════════════════════════════════
// MODULE PLAYER
// Interactive card-based learning experience
// Supports anonymous users for teaser modules
// ═══════════════════════════════════════════════════════════

"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { CardSwiper, ModeToggle, ModuleProgress, XpCounter } from "@/components/modules";
import { moduleRegistry } from "@/data/modules/bulletproof-ankles";
import { isTeaserModule } from "@/data/modules/types";
import { useAnonymousProgress } from "@/hooks";
import { useSession } from "@/lib/auth";
import { useModuleStore } from "@/stores/moduleStore";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ModulePlayerPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // Get module data
  const module = Object.values(moduleRegistry).find((m) => m.slug === slug);
  const isTeaser = module ? isTeaserModule(module) : false;

  // Auth state - check if user is logged in
  const { data: session } = useSession();
  const isAnonymous = !session?.user;

  // Anonymous progress for teaser modules
  const { saveTeaserCompletion, isLoaded: progressLoaded } = useAnonymousProgress();

  // Store state
  const {
    currentModule,
    mode,
    xpEarned,
    currentSectionIndex,
    currentCardIndex,
    startModule,
    toggleMode,
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

    // For teaser modules with anonymous users, save to localStorage
    if (isTeaser && isAnonymous && module) {
      saveTeaserCompletion(module.slug, {
        score: stats.score,
        totalChecks: stats.totalChecks,
        xpEarned: stats.xp,
        shardsEarned: stats.shards ?? 0,
        timeElapsed: stats.time,
      });
      console.log("[TeaserModule] Saved anonymous progress to localStorage");
    } else {
      // TODO: Save to Convex for authenticated users
      console.log("Module completed:", stats);
    }

    // Redirect after a short delay
    setTimeout(() => {
      router.push(`/playbook/modules/${slug}`);
    }, 3000);
  };

  // Handle exit
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    router.push(`/playbook/modules/${slug}`);
  };

  // Not found
  if (!module) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Module not found</p>
          <Link href="/playbook/modules" className="text-accent-primary hover:underline">
            Back to modules
          </Link>
        </div>
      </div>
    );
  }

  const sectionProgress = getSectionProgress();

  return (
    <div className="fixed inset-0 bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="flex-none border-b border-border-subtle bg-bg-secondary">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Exit button */}
          <button
            onClick={handleExit}
            className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            aria-label="Exit module"
          >
            <X className="w-5 h-5 text-text-tertiary" />
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

        {/* Mode toggle */}
        <div className="flex justify-center pb-3">
          <ModeToggle mode={mode} onToggle={toggleMode} />
        </div>
      </header>

      {/* Card area */}
      <main className="flex-1 overflow-hidden">
        <CardSwiper
          module={module}
          sections={module.sections}
          mode={mode}
          onComplete={handleComplete}
        />
      </main>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-bg-secondary border border-border-default rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-xl font-bebas uppercase tracking-wide text-white mb-2">
              Exit Module?
            </h3>
            <p className="text-text-secondary mb-6">
              Your progress will be saved. You can continue where you left off later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary
                         hover:border-accent-primary/50 hover:text-white transition-all"
              >
                Keep Learning
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 rounded-xl bg-bg-tertiary text-white font-medium
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
          <div className="text-center animate-pulse">
            <p className="text-xl text-accent-primary">Saving your progress...</p>
          </div>
        </div>
      )}
    </div>
  );
}
