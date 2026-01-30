// ═══════════════════════════════════════════════════════════
// DRILL V3.1 TYPES
// "Skill Injector" - Extended types for drill detail pages
// TRAIN/GUIDE layer separation for dual-audience optimization
// ═══════════════════════════════════════════════════════════

import { Sport, DrillAuthor, DRILL_AUTHORS } from "./types";

// Re-export for convenience
export { DRILL_AUTHORS };
export type { Sport, DrillAuthor };

// ─────────────────────────────────────────────────────────────
// DRILL TAGS
// ─────────────────────────────────────────────────────────────

export type DrillTagType =
  | "silent"
  | "indoor"
  | "outdoor"
  | "no-hoop"
  | "no-equipment"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "solo"
  | "partner";

export interface DrillTag {
  type: DrillTagType;
  label: string;
  icon?: string;
}

export const DRILL_TAGS: Record<DrillTagType, DrillTag> = {
  silent: { type: "silent", label: "Silent", icon: "🤫" },
  indoor: { type: "indoor", label: "Indoor", icon: "🏠" },
  outdoor: { type: "outdoor", label: "Outdoor", icon: "🌳" },
  "no-hoop": { type: "no-hoop", label: "No Hoop", icon: "🚫" },
  "no-equipment": { type: "no-equipment", label: "No Equipment", icon: "✋" },
  beginner: { type: "beginner", label: "Beginner", icon: "🌱" },
  intermediate: { type: "intermediate", label: "Intermediate", icon: "⚡" },
  advanced: { type: "advanced", label: "Advanced", icon: "🔥" },
  solo: { type: "solo", label: "Solo", icon: "👤" },
  partner: { type: "partner", label: "Partner", icon: "👥" },
};

// ─────────────────────────────────────────────────────────────
// VIDEO CHAPTER
// ─────────────────────────────────────────────────────────────

export interface VideoChapter {
  timestamp: string; // "0:00", "1:30", etc.
  seconds: number; // Numeric for seeking
  title: string;
  description?: string;
}

// ─────────────────────────────────────────────────────────────
// DRILL STEP V3
// ─────────────────────────────────────────────────────────────

export interface DrillStepV3 {
  number: number;
  title: string;
  instruction: string;
  duration?: string; // "30 seconds", "10 reps"
  coachingCue: string; // "Focus on..."
  commonMistake: string; // "Athletes often..."
  errorFix?: string; // "Instead, try..."
}

// ─────────────────────────────────────────────────────────────
// DRILL MISTAKE V3
// ─────────────────────────────────────────────────────────────

export interface DrillMistakeV3 {
  id: string;
  ifStatement: string; // "If the ball bounces too high..."
  cause: string; // "You're likely pushing down too hard"
  fix: string; // "Focus on using your fingertips"
  relatedDrillSlug?: string; // Link to drill that helps
  relatedDrillTitle?: string;
}

// ─────────────────────────────────────────────────────────────
// DRILL BENCHMARK
// ─────────────────────────────────────────────────────────────

export type BenchmarkLevel = "beginner" | "intermediate" | "advanced" | "elite";

export interface DrillBenchmark {
  level: BenchmarkLevel;
  levelLabel: string;
  goal: string; // "50 consecutive pounds"
  sets: string; // "3 sets of 30 seconds"
  advanceWhen: string; // "Complete 3 sessions at goal"
}

// ─────────────────────────────────────────────────────────────
// DRILL LINKS
// ─────────────────────────────────────────────────────────────

export interface DrillLink {
  slug: string;
  title: string;
  thumbnail?: string;
}

export interface RelatedDrill extends DrillLink {
  relationship: "prerequisite" | "alternative" | "progression" | "similar";
  relationshipLabel: string; // "Master first", "Try instead", "Next step", "Similar drill"
}

export interface PillarLink {
  slug: string;
  title: string;
  sport: Sport;
  category: string;
  description?: string;
}

// ─────────────────────────────────────────────────────────────
// INTENSITY LEVEL
// ─────────────────────────────────────────────────────────────

export type IntensityLevel = "low" | "medium" | "high";

export const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const INTENSITY_COLORS: Record<IntensityLevel, string> = {
  low: "var(--drill-intensity-low)",
  medium: "var(--drill-intensity-medium)",
  high: "var(--drill-intensity-high)",
};

// ─────────────────────────────────────────────────────────────
// DIFFICULTY LEVEL
// ─────────────────────────────────────────────────────────────

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export const DIFFICULTY_STARS: Record<DifficultyLevel, string> = {
  beginner: "★☆☆",
  intermediate: "★★☆",
  advanced: "★★★",
};

// ─────────────────────────────────────────────────────────────
// MAIN DRILL V3 INTERFACE
// ─────────────────────────────────────────────────────────────

export interface DrillV3 {
  // ═══════════════════════════════════════════════════════════
  // CORE IDENTITY
  // ═══════════════════════════════════════════════════════════
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  definition: string; // 40-60 words, answer-first for AI crawlers

  // Matrix Position
  sport: Sport;
  category: string; // "ball-handling", "shooting", etc.

  // ═══════════════════════════════════════════════════════════
  // TAGS (For filtering and display)
  // ═══════════════════════════════════════════════════════════
  tags: DrillTagType[];

  // ═══════════════════════════════════════════════════════════
  // QUICK FACTS (Bento strip data)
  // ═══════════════════════════════════════════════════════════
  duration: string; // "5-10 min"
  intensity: IntensityLevel;
  equipment: string[]; // ["Basketball"]
  space: string; // "3x3 ft", "Half court"
  level: DifficultyLevel;
  noiseLevel?: string; // "Silent", "Quiet", "Moderate"

  // ═══════════════════════════════════════════════════════════
  // QUICK SCAN (5-item holographic data feed)
  // ═══════════════════════════════════════════════════════════
  trains: string[]; // ["Ball control", "Hand strength", "Rhythm"]
  useWhen: string[]; // ["Limited space", "Early morning", "Apartment"]
  scale: string; // "Beginner → Advanced (add movement)"
  topMistake: string; // "Looking at the ball instead of up"

  // ═══════════════════════════════════════════════════════════
  // VIDEO (Optional - enhanced experience)
  // ═══════════════════════════════════════════════════════════
  videoUrl?: string;
  videoPoster?: string;
  chapters?: VideoChapter[];
  transcript?: string; // Full transcript for accessibility + SEO
  videoDuration?: string; // "2:30"

  // ═══════════════════════════════════════════════════════════
  // HOW TO PERFORM (Step-by-step instructions)
  // ═══════════════════════════════════════════════════════════
  steps: DrillStepV3[];

  // ═══════════════════════════════════════════════════════════
  // SUCCESS CRITERIA (Gamified unlock condition)
  // ═══════════════════════════════════════════════════════════
  successLooksLike: string; // "Ball stays below knee height..."
  advanceWhen: string; // "50 consecutive pounds without error"

  // ═══════════════════════════════════════════════════════════
  // CUES (Do / Don't / Focus trio)
  // ═══════════════════════════════════════════════════════════
  doThis: string; // Positive instruction
  dontDoThis: string; // Common error to avoid
  focusOn: string; // Key focus point

  // ═══════════════════════════════════════════════════════════
  // COMMON MISTAKES (If/Cause/Fix format)
  // ═══════════════════════════════════════════════════════════
  mistakes: DrillMistakeV3[];

  // ═══════════════════════════════════════════════════════════
  // BENCHMARKS (Coach-authored performance table)
  // ═══════════════════════════════════════════════════════════
  benchmarks: DrillBenchmark[];

  // ═══════════════════════════════════════════════════════════
  // PROGRESSIONS (Previous ← Current → Next)
  // ═══════════════════════════════════════════════════════════
  previousDrill?: DrillLink;
  nextDrill?: DrillLink;

  // ═══════════════════════════════════════════════════════════
  // RELATED DRILLS (2-4 with relationship labels)
  // ═══════════════════════════════════════════════════════════
  relatedDrills: RelatedDrill[];

  // ═══════════════════════════════════════════════════════════
  // PARENT PILLAR (Link back to pillar page)
  // ═══════════════════════════════════════════════════════════
  parentPillar: PillarLink;

  // ═══════════════════════════════════════════════════════════
  // EDITORIAL METADATA
  // ═══════════════════════════════════════════════════════════
  author: DrillAuthor;
  reviewedBy?: string;
  lastUpdated: string; // ISO date string
  publishedAt?: string;

  // ═══════════════════════════════════════════════════════════
  // SEO & AI OPTIMIZATION
  // ═══════════════════════════════════════════════════════════
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;

  // Schema.org data
  schemaOrg?: {
    estimatedDuration?: string; // ISO 8601 duration "PT5M"
    skillLevel?: string;
  };

  // AI/Developer Resources
  apiEndpoint?: string; // "/api/drills/stationary-pound"
  markdownUrl?: string; // "/drills/stationary-pound.md"

  // ═══════════════════════════════════════════════════════════
  // STATUS
  // ═══════════════════════════════════════════════════════════
  status: "draft" | "published" | "archived";
}

// ─────────────────────────────────────────────────────────────
// DRILL PAGE PROPS (For the page component)
// ─────────────────────────────────────────────────────────────

export interface DrillPageProps {
  drill: DrillV3;
  breadcrumbs: { label: string; href: string }[];
}

// ─────────────────────────────────────────────────────────────
// SCHEMA.ORG TYPES (For structured data)
// ─────────────────────────────────────────────────────────────

export interface DrillSchemaOrg {
  "@context": "https://schema.org";
  "@graph": (BreadcrumbListSchema | ArticleSchema | VideoObjectSchema | ItemListSchema)[];
}

export interface BreadcrumbListSchema {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface ArticleSchema {
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
  };
  dateModified: string;
  datePublished?: string;
  mainEntityOfPage?: string;
}

export interface VideoObjectSchema {
  "@type": "VideoObject";
  name: string;
  description?: string;
  duration?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  contentUrl?: string;
}

export interface ItemListSchema {
  "@type": "ItemList";
  name: string;
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    url?: string;
  }[];
}

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function generateDrillUrl(drill: Pick<DrillV3, "sport" | "category" | "slug">): string {
  return `/drills/${drill.sport}/${drill.category}/${drill.slug}`;
}

export function generateDrillBreadcrumbs(
  drill: Pick<DrillV3, "sport" | "category" | "title" | "parentPillar">
): { label: string; href: string }[] {
  const sportName = drill.sport.charAt(0).toUpperCase() + drill.sport.slice(1);
  const categoryName = drill.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return [
    { label: sportName, href: `/${drill.sport}` },
    { label: drill.parentPillar.title, href: `/${drill.sport}/${drill.parentPillar.slug}` },
    { label: drill.title, href: "#" },
  ];
}

export function generateDrillSchemaOrg(drill: DrillV3): DrillSchemaOrg {
  const url = generateDrillUrl(drill);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: drill.sport.charAt(0).toUpperCase() + drill.sport.slice(1),
            item: `https://app.youthperformance.com/${drill.sport}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: drill.parentPillar.title,
            item: `https://app.youthperformance.com/${drill.sport}/${drill.parentPillar.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: drill.title,
          },
        ],
      },
      {
        "@type": "Article",
        headline: `${drill.title} — ${drill.parentPillar.title} Drill`,
        description: drill.definition,
        author: {
          "@type": "Person",
          name: drill.author.name,
        },
        dateModified: drill.lastUpdated,
        datePublished: drill.publishedAt,
        mainEntityOfPage: `https://app.youthperformance.com${url}`,
      },
      ...(drill.videoUrl
        ? [
            {
              "@type": "VideoObject" as const,
              name: `${drill.title} Demonstration`,
              description: drill.definition,
              duration: drill.schemaOrg?.estimatedDuration || "PT2M",
              thumbnailUrl: drill.videoPoster,
              contentUrl: drill.videoUrl,
            },
          ]
        : []),
      {
        "@type": "ItemList",
        name: "Related Drills",
        itemListElement: drill.relatedDrills.map((related, index) => ({
          "@type": "ListItem" as const,
          position: index + 1,
          name: related.title,
          url: `https://app.youthperformance.com/drills/${drill.sport}/${drill.category}/${related.slug}`,
        })),
      },
    ],
  };
}

export function getDifficultyStars(level: DifficultyLevel): string {
  return DIFFICULTY_STARS[level];
}

export function getIntensityColor(level: IntensityLevel): string {
  return INTENSITY_COLORS[level];
}

export function getTagData(type: DrillTagType): DrillTag {
  return DRILL_TAGS[type];
}
