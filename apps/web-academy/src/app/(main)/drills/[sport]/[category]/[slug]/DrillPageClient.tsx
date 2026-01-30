"use client";

import { useState, useCallback } from "react";
import {
  DrillV3,
} from "@/data/drills/drill-v3-types";
import {
  DrillHero,
  DrillQuickFacts,
  DrillQuickScan,
  DrillTableOfContents,
  DrillHowToSteps,
  DrillUnlockCondition,
  DrillVideoCard,
  DrillCuesCards,
  DrillMistakesCards,
  DrillBenchmarks,
  DrillProgressions,
  DrillRelatedCards,
  DrillParentPillar,
  DrillEditorialMeta,
  DrillAIDevLinks,
  DrillStickyBar,
} from "@/components/drill";

// Import drill tokens
import "@/styles/drill-tokens.css";

export interface DrillPageClientProps {
  drill: DrillV3;
}

export function DrillPageClient({ drill }: DrillPageClientProps) {
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Action handlers
  const handleStartTimer = useCallback(() => {
    setIsTimerActive(true);
    // TODO: Implement timer functionality
    console.log("Timer started for:", drill.title);
  }, [drill.title]);

  const handleAddToPlan = useCallback(() => {
    // TODO: Implement add to plan functionality
    console.log("Added to plan:", drill.title);
  }, [drill.title]);

  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log("Saved drill:", drill.title);
  }, [drill.title]);

  return (
    <div className="drill-page pillar-page">
      {/* ═══════════════════════════════════════════════════════════
          TRAIN LAYER - Interactive features (JS-dependent)
          ═══════════════════════════════════════════════════════════ */}

      {/* Sticky Bar - Appears on scroll */}
      <DrillStickyBar
        drillId={drill.id}
        drillTitle={drill.title}
        onStartTimer={handleStartTimer}
        onAddToPlan={handleAddToPlan}
        onSave={handleSave}
      />

      {/* ═══════════════════════════════════════════════════════════
          GUIDE LAYER - Canonical content (always in DOM for crawlers)
          ═══════════════════════════════════════════════════════════ */}

      <article
        data-layer="guide"
        itemScope
        itemType="https://schema.org/Article"
      >
        {/* Hero Section with Video Background */}
        <DrillHero
          drill={drill}
          onStartTimer={handleStartTimer}
          onAddToPlan={handleAddToPlan}
          onSave={handleSave}
        />

        {/* Main Content Container */}
        <div className="pillar-container">
          {/* Quick Facts Bento Strip */}
          <DrillQuickFacts
            duration={drill.duration}
            intensity={drill.intensity}
            equipment={drill.equipment}
            space={drill.space}
            level={drill.level}
            noiseLevel={drill.noiseLevel}
          />

          {/* Table of Contents - Jump Links */}
          <DrillTableOfContents
            hasSteps={drill.steps?.length > 0}
            hasCues={Boolean(drill.doThis && drill.dontDoThis && drill.focusOn)}
            hasMistakes={drill.mistakes?.length > 0}
            hasBenchmarks={drill.benchmarks?.length > 0}
            hasProgression={Boolean(drill.previousDrill || drill.nextDrill)}
          />

          {/* Quick Scan - Holographic Data Feed */}
          <DrillQuickScan
            trains={drill.trains}
            useWhen={drill.useWhen}
            equipment={drill.equipment}
            scale={drill.scale}
            topMistake={drill.topMistake}
          />

          {/* Video Section (if available) */}
          {drill.videoUrl && (
            <DrillVideoCard
              videoUrl={drill.videoUrl}
              poster={drill.videoPoster}
              duration={drill.videoDuration}
              chapters={drill.chapters}
              transcript={drill.transcript}
              title={drill.title}
            />
          )}

          {/* How To Perform - Step by Step */}
          <DrillHowToSteps steps={drill.steps} drillTitle={drill.title} />

          {/* Unlock Condition - Gamified Success Criteria */}
          <DrillUnlockCondition
            successLooksLike={drill.successLooksLike}
            advanceWhen={drill.advanceWhen}
          />

          {/* Quick Cues - Do/Don't/Focus */}
          <DrillCuesCards
            doThis={drill.doThis}
            dontDoThis={drill.dontDoThis}
            focusOn={drill.focusOn}
          />

          {/* Common Mistakes - If/Cause/Fix */}
          <DrillMistakesCards
            mistakes={drill.mistakes}
            sport={drill.sport}
            category={drill.category}
          />

          {/* Performance Benchmarks */}
          <DrillBenchmarks benchmarks={drill.benchmarks} />

          {/* Drill Progression - Previous/Current/Next */}
          <DrillProgressions
            currentTitle={drill.title}
            previousDrill={drill.previousDrill}
            nextDrill={drill.nextDrill}
            sport={drill.sport}
            category={drill.category}
          />

          {/* Related Drills */}
          <DrillRelatedCards
            relatedDrills={drill.relatedDrills}
            sport={drill.sport}
            category={drill.category}
          />

          {/* Parent Pillar Link */}
          <DrillParentPillar pillar={drill.parentPillar} />

          {/* Editorial Metadata */}
          <DrillEditorialMeta
            author={drill.author}
            lastUpdated={drill.lastUpdated}
            reviewedBy={drill.reviewedBy}
          />

          {/* AI/Developer Resources */}
          <DrillAIDevLinks
            apiEndpoint={drill.apiEndpoint}
            markdownUrl={drill.markdownUrl}
            drillSlug={drill.slug}
          />
        </div>
      </article>

      <style jsx>{`
        .drill-page {
          min-height: 100vh;
          background: var(--pillar-surface-base);
        }

        /* Bottom padding to account for sticky bar */
        .pillar-container {
          padding-bottom: calc(var(--drill-sticky-bar-height, 64px) + var(--pillar-space-8));
        }

        @media (max-width: 768px) {
          .pillar-container {
            padding-bottom: calc(var(--drill-sticky-bar-height-mobile, 56px) + var(--pillar-space-6));
          }
        }
      `}</style>
    </div>
  );
}

export default DrillPageClient;
