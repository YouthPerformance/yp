"use client";

import { useState, useCallback } from "react";
import type { SEOPage, TocItem } from "@/lib/seo-content";
import {
  PillarTopBar,
  PillarHero,
  SessionBuilder,
  ProtocolSummary,
  ProgressionPath,
  KeyIntelGrid,
  DrillInventory,
  TextListFallback,
  GuideSection,
  TacticalBriefing,
  TakeawaysList,
  MistakesFixes,
  FAQAccordion,
  SafetyBox,
  PillarFooter,
  StickyBottomBar,
  StickyTOC,
  type Breadcrumb,
  type Metric,
  type Expert,
  type RelatedPillar,
  type DrillData,
  type SessionBuilderState,
  type ProtocolDrill,
  type ProgressionNode,
  type IntelCard,
  type MistakeFix,
  type FAQItem,
} from "@/components/pillar";
import { useAthleteMode } from "@/hooks/useAthleteMode";
import { ReadingProgressBar, BackToTop } from "@/components/seo";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface PillarPageClientProps {
  page: SEOPage;
  expert?: Expert;
  isPillar: boolean;
  breadcrumbs: Breadcrumb[];
  metrics: Metric[];
  contentHtml: string;
  toc: TocItem[];
  wordCount: number;
  relatedPillars: RelatedPillar[];
}

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA
// For pages without explicit V7 data
// ═══════════════════════════════════════════════════════════

const DEFAULT_DRILLS: DrillData[] = [
  { slug: "stationary-pound", title: "Stationary Pound", duration: "3:00", noiseLevel: "<35dB", difficulty: "beginner", xp: 50 },
  { slug: "crossover-holds", title: "Crossover Holds", duration: "4:00", noiseLevel: "<38dB", difficulty: "beginner", xp: 60 },
  { slug: "figure-8-control", title: "Figure 8 Control", duration: "5:00", noiseLevel: "<40dB", difficulty: "intermediate", xp: 75 },
  { slug: "pocket-dribble", title: "Pocket Dribble", duration: "3:00", noiseLevel: "<35dB", difficulty: "intermediate", xp: 65 },
  { slug: "hesitation-freeze", title: "Hesitation Freeze", duration: "4:00", noiseLevel: "<38dB", difficulty: "intermediate", xp: 70 },
  { slug: "between-legs-static", title: "Between Legs Static", duration: "5:00", noiseLevel: "<42dB", difficulty: "advanced", xp: 85 },
];

const DEFAULT_PROGRESSION: ProgressionNode[] = [
  { id: "foundation", title: "Foundation", status: "complete" },
  { id: "control", title: "Control", status: "current", criteria: "5 drills mastered" },
  { id: "fluidity", title: "Fluidity", status: "locked" },
  { id: "mastery", title: "Mastery", status: "locked" },
];

const DEFAULT_INTEL: IntelCard[] = [
  { type: "objective", emoji: "\uD83C\uDFAF", title: "Objective", content: "Build ball control and muscle memory without disturbing others. Focus on soft touches and controlled movements." },
  { type: "avoid", emoji: "\u26A0\uFE0F", title: "Avoid", content: "Hard slaps against the ball, bouncing on hard floors without padding, or training during quiet hours." },
  { type: "tip", emoji: "\uD83D\uDCA1", title: "Pro Tip", content: "Use a carpet or training mat to further reduce noise. Start with 10-minute sessions and build up." },
  { type: "safety", emoji: "\uD83D\uDEE1\uFE0F", title: "Safety", content: "Ensure adequate space, remove fragile items, and always warm up your hands before intense drills." },
];

const DEFAULT_TAKEAWAYS = [
  "Silent training is possible with the right equipment and technique",
  "Soft floor surfaces reduce noise by 40-60%",
  "Start with stationary drills before moving to dynamic movements",
  "Consistency beats intensity for skill development",
  "10-15 minutes daily is more effective than 1 hour weekly",
];

const DEFAULT_MISTAKES: MistakeFix[] = [
  { if: "Ball makes loud slapping sounds", cause: "Hitting ball with palm instead of fingertips", fix: "Focus on fingertip control, keep palms off the ball", drillLink: "/drills/fingertip-control" },
  { if: "Neighbors complain about bouncing", cause: "Training on hard floors without dampening", fix: "Use carpet, yoga mat, or dedicated training mat", drillLink: "/drills/mat-setup" },
  { if: "Can't maintain control quietly", cause: "Dribbling too high or too fast", fix: "Lower your dribble height, slow down movements", drillLink: "/drills/low-dribble" },
];

const DEFAULT_FAQ: FAQItem[] = [
  { question: "Can I really train basketball indoors without making noise?", answer: "Yes! With proper technique, appropriate equipment like a silent basketball, and soft flooring, you can train effectively while keeping noise under 40dB - quieter than normal conversation." },
  { question: "What drills work best for silent training?", answer: "Stationary ball control, crossover holds, figure-8 drills, and fingertip exercises are ideal. Avoid high bounces and explosive movements initially." },
  { question: "How long should silent training sessions be?", answer: "Start with 10-15 minute sessions. This is enough to build muscle memory without fatigue. You can increase to 20-30 minutes as you develop control." },
];

const DEFAULT_SAFETY = [
  "Ensure you have at least 6 feet of clearance in all directions",
  "Remove breakable items from the training area",
  "Warm up your hands and wrists before intense drills",
  "Stop immediately if you feel any pain or discomfort",
];

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function PillarPageClient({
  page,
  expert,
  isPillar,
  breadcrumbs,
  metrics,
  contentHtml,
  toc,
  wordCount,
  relatedPillars,
}: PillarPageClientProps) {
  const { isAthleteMode } = useAthleteMode();

  // Protocol generation state
  const [generatedDrills, setGeneratedDrills] = useState<ProtocolDrill[]>([]);
  const [sessionMeta, setSessionMeta] = useState("");
  const [showProtocol, setShowProtocol] = useState(false);

  // Use page data or defaults
  const drills = page.drills || DEFAULT_DRILLS;
  const progression = page.progression || DEFAULT_PROGRESSION;
  const intel = page.intel || DEFAULT_INTEL;
  const takeaways = page.takeaways || DEFAULT_TAKEAWAYS;
  const mistakes = page.mistakes || DEFAULT_MISTAKES;
  const faq = page.faq || DEFAULT_FAQ;
  const safety = page.safety || DEFAULT_SAFETY;

  // Handle session builder generation
  const handleGenerate = useCallback(
    (state: SessionBuilderState) => {
      const targetMinutes = parseInt(state.duration, 10);

      // Parse noise levels for filtering
      const parseNoiseLevel = (noiseStr: string): number => {
        const match = noiseStr.match(/\d+/);
        return match ? parseInt(match[0], 10) : 50;
      };

      // Filter and select drills
      const eligible = drills.filter((d) => parseNoiseLevel(d.noiseLevel) <= state.noiseCap);
      const selected: ProtocolDrill[] = [];
      let totalMinutes = 0;

      for (const drill of eligible) {
        const drillMinutes = parseInt(drill.duration, 10) || 3;
        if (totalMinutes + drillMinutes <= targetMinutes) {
          selected.push({
            slug: drill.slug,
            title: drill.title,
            duration: drill.duration,
            noiseLevel: drill.noiseLevel,
          });
          totalMinutes += drillMinutes;
        }
        if (totalMinutes >= targetMinutes) break;
      }

      setGeneratedDrills(selected);
      setSessionMeta(`${state.duration}m \xB7 ${state.floor.charAt(0).toUpperCase() + state.floor.slice(1)} \xB7 <${state.noiseCap}dB`);
      setShowProtocol(true);
    },
    [drills]
  );

  // Handle start session
  const handleStartSession = useCallback(() => {
    // TODO: Navigate to training player or start session
    console.log("Starting session with:", generatedDrills);
  }, [generatedDrills]);

  // Handle save protocol
  const handleSaveProtocol = useCallback(() => {
    // TODO: Save to user's saved protocols
    console.log("Saving protocol:", generatedDrills);
  }, [generatedDrills]);

  // Build definition text from meta description
  const definitionText = page.meta_description.replace(
    /silent training/gi,
    "<strong>silent training</strong>"
  );

  return (
    <div className="pillar-page">
      <ReadingProgressBar />

      <PillarTopBar
        breadcrumbs={breadcrumbs}
        updatedDate={new Date(page.generated_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })}
        xpProgress={
          isAthleteMode
            ? { level: 3, currentXP: 750, nextLevelXP: 1000, totalXP: 2750 }
            : undefined
        }
        isAthleteMode={isAthleteMode}
      />

      <main>
        <div className="pillar-container">
          {/* ════════════════════════════════════════════════════════════
              HERO SECTION
              ════════════════════════════════════════════════════════════ */}
          <PillarHero
            title={page.title}
            definition={definitionText}
            expert={expert}
            metrics={metrics}
            isPillar={isPillar}
            noiseLevel={page.metrics?.noiseLevel || "<40dB"}
            videoXP={50}
            primaryCTA={{ label: "Start Training", href: "#train" }}
            secondaryCTA={{ label: "Read Guide", href: "#guide" }}
          />

          {/* ════════════════════════════════════════════════════════════
              MAIN CONTENT WITH DESKTOP SIDEBAR
              ════════════════════════════════════════════════════════════ */}
          <div className="pillar-content-layout">
            <div className="pillar-main-content">
              {/* ════════════════════════════════════════════════════════════
                  TRAIN LAYER
                  ════════════════════════════════════════════════════════════ */}
              <section id="train" className="pillar-section">
                <SessionBuilder onGenerate={handleGenerate} />

                <ProtocolSummary
                  drills={generatedDrills}
                  visible={showProtocol}
                  sessionMeta={sessionMeta}
                  onStartSession={handleStartSession}
                  onSaveProtocol={handleSaveProtocol}
                />

                <ProgressionPath nodes={progression} className="athlete-only" />

                <KeyIntelGrid cards={intel} />

                <DrillInventory
                  drills={drills}
                  title="Drill Inventory"
                  showFilters={true}
                  showProgress={isAthleteMode}
                />

                <TextListFallback drills={drills} />
              </section>

              {/* ════════════════════════════════════════════════════════════
                  GUIDE LAYER (Canonical for AI/SEO)
                  V7.2 Structure: Quick facts visible, deep content collapsed
                  ════════════════════════════════════════════════════════════ */}
              <GuideSection title={`Complete Guide: ${page.title}`}>
                {/* Quick Answer Box - Always Visible */}
                {page.quick_answer && page.quick_answer.length > 0 && (
                  <div className="pillar-quick-answer">
                    <h3 className="quick-answer-title">
                      <span>\u26A1</span> Quick Answer
                    </h3>
                    <ul className="quick-answer-list">
                      {page.quick_answer.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Takeaways - Always Visible (Glass Card) */}
                <TakeawaysList items={takeaways} />

                {/* Tactical Briefing - Collapsed Deep SEO Content */}
                <TacticalBriefing label="TACTICAL BRIEFING">
                  {/* Main content from markdown */}
                  <article
                    className="pillar-article-content"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                  <MistakesFixes items={mistakes} />
                </TacticalBriefing>

                {/* Bento Row: Safety + FAQ */}
                <div className="bento-row-2">
                  <SafetyBox notes={safety} />
                  <FAQAccordion items={faq} />
                </div>
              </GuideSection>
            </div>

            {/* Desktop Sticky TOC Sidebar */}
            <aside className="pillar-sidebar">
              <StickyTOC toc={toc} />
            </aside>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            FOOTER
            ════════════════════════════════════════════════════════════ */}
        <PillarFooter
          relatedPillars={relatedPillars}
          showAIDisclosure={true}
          showMachineAccess={true}
          pageSlug={page.slug}
        />
      </main>

      {/* ════════════════════════════════════════════════════════════
          MOBILE STICKY BAR
          ════════════════════════════════════════════════════════════ */}
      <StickyBottomBar
        title={page.title}
        meta={isPillar ? "Complete Guide" : "Training Guide"}
        ctaLabel="Start Training"
        ctaHref="#train"
        showOnMobileOnly={true}
      />

      <BackToTop />

      <style jsx>{`
        .pillar-quick-answer {
          padding: var(--pillar-space-6);
          background: var(--pillar-brand-cyan-dim);
          border: 1px solid var(--pillar-brand-cyan);
          border-radius: 12px;
          margin-bottom: var(--pillar-space-8);
        }

        .quick-answer-title {
          display: flex;
          align-items: center;
          gap: var(--pillar-space-2);
          font-family: var(--pillar-font-display);
          font-size: 18px;
          color: var(--pillar-brand-cyan);
          margin-bottom: var(--pillar-space-4);
        }

        .quick-answer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quick-answer-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--pillar-space-3);
          font-size: 15px;
          color: var(--pillar-text-secondary);
          margin-bottom: var(--pillar-space-2);
        }

        .quick-answer-list li::before {
          content: '\u2713';
          color: var(--pillar-brand-cyan);
          font-weight: bold;
          flex-shrink: 0;
        }

        .pillar-article-content {
          font-size: 16px;
          line-height: 1.8;
          color: var(--pillar-text-secondary);
        }

        .pillar-article-content :global(h2) {
          font-family: var(--pillar-font-display);
          font-size: 28px;
          color: var(--pillar-text-primary);
          margin-top: var(--pillar-space-10);
          margin-bottom: var(--pillar-space-4);
        }

        .pillar-article-content :global(h3) {
          font-family: var(--pillar-font-display);
          font-size: 22px;
          color: var(--pillar-text-primary);
          margin-top: var(--pillar-space-8);
          margin-bottom: var(--pillar-space-3);
        }

        .pillar-article-content :global(p) {
          margin-bottom: var(--pillar-space-4);
        }

        .pillar-article-content :global(a) {
          color: var(--pillar-brand-cyan);
        }

        .pillar-article-content :global(strong) {
          color: var(--pillar-text-primary);
          font-weight: 600;
        }

        .pillar-article-content :global(ul),
        .pillar-article-content :global(ol) {
          margin-bottom: var(--pillar-space-4);
          padding-left: var(--pillar-space-6);
        }

        .pillar-article-content :global(li) {
          margin-bottom: var(--pillar-space-2);
        }

        .pillar-article-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: var(--pillar-space-6);
        }

        .pillar-article-content :global(th),
        .pillar-article-content :global(td) {
          padding: var(--pillar-space-3) var(--pillar-space-4);
          border: 1px solid var(--pillar-border-subtle);
          text-align: left;
        }

        .pillar-article-content :global(th) {
          background: var(--pillar-surface-raised);
          font-weight: 600;
          color: var(--pillar-text-primary);
        }

        /* Desktop layout with sidebar */
        .pillar-content-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--pillar-space-8);
        }

        @media (min-width: 1200px) {
          .pillar-content-layout {
            grid-template-columns: 1fr 240px;
          }
        }

        .pillar-main-content {
          min-width: 0;
        }

        .pillar-sidebar {
          display: none;
        }

        @media (min-width: 1200px) {
          .pillar-sidebar {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default PillarPageClient;
