// ═══════════════════════════════════════════════════════════
// DRILL MATRIX TYPES
// Programmatic SEO for youth sports drills
// Matrix: [Sport] × [Category] × [Age] × [Constraint]
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// CORE DIMENSIONS (The Matrix)
// ─────────────────────────────────────────────────────────────

export const SPORTS = [
  "basketball",
  "soccer",
  "baseball",
  "football",
  "volleyball",
  "tennis",
  "golf",
  "lacrosse",
  "track",
  "general",
] as const;

export type Sport = (typeof SPORTS)[number];

export const CATEGORIES = {
  basketball: [
    "shooting",
    "ball-handling",
    "passing",
    "defense",
    "footwork",
    "conditioning",
    "agility",
    "vertical-jump",
    "strength",
  ],
  soccer: [
    "dribbling",
    "passing",
    "shooting",
    "defense",
    "footwork",
    "conditioning",
    "agility",
    "first-touch",
    "heading",
  ],
  baseball: [
    "hitting",
    "pitching",
    "fielding",
    "throwing",
    "catching",
    "base-running",
    "agility",
    "arm-strength",
  ],
  football: [
    "throwing",
    "catching",
    "footwork",
    "agility",
    "speed",
    "tackling",
    "blocking",
    "conditioning",
  ],
  volleyball: [
    "serving",
    "passing",
    "setting",
    "hitting",
    "blocking",
    "digging",
    "footwork",
    "vertical-jump",
  ],
  tennis: [
    "forehand",
    "backhand",
    "serve",
    "volley",
    "footwork",
    "agility",
    "conditioning",
  ],
  golf: [
    "driving",
    "iron-play",
    "short-game",
    "putting",
    "flexibility",
    "balance",
    "core-strength",
  ],
  lacrosse: [
    "cradling",
    "passing",
    "shooting",
    "ground-balls",
    "defense",
    "footwork",
    "conditioning",
  ],
  track: [
    "sprinting",
    "distance",
    "jumping",
    "throwing",
    "starts",
    "hurdles",
    "conditioning",
  ],
  general: [
    "ankle-mobility",
    "hip-mobility",
    "core-strength",
    "balance",
    "coordination",
    "speed",
    "agility",
    "flexibility",
    "plyometrics",
    "barefoot-training",
  ],
} as const;

export type CategoryMap = typeof CATEGORIES;
export type Category<S extends Sport> = CategoryMap[S][number];

export const AGE_GROUPS = [
  "6-8",
  "8-10",
  "10-12",
  "12-14",
  "14-16",
  "16-18",
  "adult",
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const CONSTRAINTS = [
  "no-equipment",
  "indoor",
  "outdoor",
  "solo",
  "partner",
  "team",
  "5-minutes",
  "10-minutes",
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type Constraint = (typeof CONSTRAINTS)[number];

// ─────────────────────────────────────────────────────────────
// DRILL ENTITY
// ─────────────────────────────────────────────────────────────

export interface DrillAuthor {
  id: "JAMES" | "ADAM" | "TEAM_YP";
  name: string;
  title: string;
  icon: string;
  avatarUrl?: string;
}

export const DRILL_AUTHORS: Record<string, DrillAuthor> = {
  JAMES: {
    id: "JAMES",
    name: "James Scott",
    title: "Barefoot & Biomechanics Expert",
    icon: "🦶",
    avatarUrl: "/authors/james-scott.jpg",
  },
  ADAM: {
    id: "ADAM",
    name: "Adam Harrington",
    title: "Elite Basketball Coach",
    icon: "🏀",
    avatarUrl: "/authors/adam-harrington.jpg",
  },
  TEAM_YP: {
    id: "TEAM_YP",
    name: "Team YP",
    title: "YouthPerformance Coaching Staff",
    icon: "🐺",
    avatarUrl: "/authors/team-yp.jpg",
  },
};

export interface DrillStep {
  order: number;
  instruction: string;
  duration?: string; // "30 seconds", "10 reps", etc.
  coachingCue?: string;
  commonMistake?: string;
}

export interface DrillVariation {
  name: string;
  description: string;
  difficulty: "easier" | "harder";
}

export interface Drill {
  // Identity
  id: string;
  slug: string;
  title: string;
  subtitle?: string;

  // Matrix dimensions
  sport: Sport;
  category: string;
  ageGroups: AgeGroup[];
  constraints: Constraint[];

  // Content
  description: string;
  benefits: string[];
  equipment: string[];
  duration: string; // "5-10 minutes"
  difficulty: "beginner" | "intermediate" | "advanced";

  // Steps
  warmup?: string;
  steps: DrillStep[];
  cooldown?: string;

  // Variations
  variations?: DrillVariation[];

  // Media
  thumbnailUrl?: string;
  videoUrl?: string;
  gifUrl?: string;

  // Author & E-E-A-T
  author: DrillAuthor["id"];
  reviewedBy?: string;
  sources?: string[];

  // Related
  relatedDrills?: string[]; // Drill IDs
  parentProtocol?: string; // Protocol ID if part of larger program

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];

  // Status
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// PAGE TYPES (For programmatic SEO)
// ─────────────────────────────────────────────────────────────

export interface DrillMatrixPage {
  // URL structure: /drills/[sport]/[category]?age=X&constraint=Y
  sport: Sport;
  category: string;
  ageGroup?: AgeGroup;
  constraint?: Constraint;

  // SEO
  title: string;
  description: string;
  h1: string;
  intro: string;

  // Content
  drills: Drill[];
  relatedCategories: string[];
  breadcrumbs: { label: string; href: string }[];

  // Schema.org
  faqSchema?: { question: string; answer: string }[];
}

export interface DrillIndexPage {
  sport: Sport;
  categories: {
    slug: string;
    name: string;
    description: string;
    drillCount: number;
  }[];
}

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

export function sportDisplayName(sport: Sport): string {
  const names: Record<Sport, string> = {
    basketball: "Basketball",
    soccer: "Soccer",
    baseball: "Baseball",
    football: "Football",
    volleyball: "Volleyball",
    tennis: "Tennis",
    golf: "Golf",
    lacrosse: "Lacrosse",
    track: "Track & Field",
    general: "General Athletic",
  };
  return names[sport];
}

export function categoryDisplayName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ageGroupDisplayName(ageGroup: AgeGroup): string {
  if (ageGroup === "adult") return "Adult (18+)";
  return `Ages ${ageGroup}`;
}

export function constraintDisplayName(constraint: Constraint): string {
  const names: Record<Constraint, string> = {
    "no-equipment": "No Equipment",
    indoor: "Indoor",
    outdoor: "Outdoor",
    solo: "Solo Practice",
    partner: "Partner Required",
    team: "Team Drill",
    "5-minutes": "5 Minute Drill",
    "10-minutes": "10 Minute Drill",
    beginner: "Beginner Friendly",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return names[constraint];
}

export function generateDrillSlug(drill: Pick<Drill, "sport" | "category" | "title">): string {
  const titleSlug = drill.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${drill.sport}-${drill.category}-${titleSlug}`;
}

export function generateMatrixPageSlug(
  sport: Sport,
  category: string,
  ageGroup?: AgeGroup,
  constraint?: Constraint
): string {
  let slug = `/drills/${sport}/${category}`;
  const params: string[] = [];
  if (ageGroup) params.push(`age=${ageGroup}`);
  if (constraint) params.push(`constraint=${constraint}`);
  if (params.length > 0) slug += `?${params.join("&")}`;
  return slug;
}

// ─────────────────────────────────────────────────────────────
// SEO HELPERS
// ─────────────────────────────────────────────────────────────

export function generateMetaTitle(
  sport: Sport,
  category: string,
  ageGroup?: AgeGroup,
  constraint?: Constraint
): string {
  const sportName = sportDisplayName(sport);
  const categoryName = categoryDisplayName(category);

  let title = `${sportName} ${categoryName} Drills`;

  if (ageGroup) {
    title = `${categoryName} Drills for ${ageGroupDisplayName(ageGroup)} ${sportName} Players`;
  }

  if (constraint) {
    title += ` - ${constraintDisplayName(constraint)}`;
  }

  return `${title} | YouthPerformance`;
}

export function generateMetaDescription(
  sport: Sport,
  category: string,
  ageGroup?: AgeGroup,
  constraint?: Constraint,
  drillCount?: number
): string {
  const sportName = sportDisplayName(sport);
  const categoryName = categoryDisplayName(category).toLowerCase();

  let desc = `Expert-designed ${sportName.toLowerCase()} ${categoryName} drills`;

  if (ageGroup) {
    desc += ` for ${ageGroupDisplayName(ageGroup).toLowerCase()}`;
  }

  if (constraint) {
    desc += `. ${constraintDisplayName(constraint)} options available`;
  }

  if (drillCount) {
    desc = `${drillCount}+ ${desc}`;
  }

  desc += ". Step-by-step instructions, video demos, and coaching cues from elite trainers.";

  return desc;
}

export function generateH1(
  sport: Sport,
  category: string,
  ageGroup?: AgeGroup,
  constraint?: Constraint
): string {
  const sportName = sportDisplayName(sport);
  const categoryName = categoryDisplayName(category);

  if (ageGroup && constraint) {
    return `${constraintDisplayName(constraint)} ${categoryName} Drills for ${ageGroupDisplayName(ageGroup)} ${sportName} Players`;
  }

  if (ageGroup) {
    return `${categoryName} Drills for ${ageGroupDisplayName(ageGroup)} ${sportName} Players`;
  }

  if (constraint) {
    return `${constraintDisplayName(constraint)} ${sportName} ${categoryName} Drills`;
  }

  return `${sportName} ${categoryName} Drills`;
}

export function generateIntro(
  sport: Sport,
  category: string,
  ageGroup?: AgeGroup
): string {
  const sportName = sportDisplayName(sport);
  const categoryName = categoryDisplayName(category).toLowerCase();

  let intro = `Master ${categoryName} with our library of ${sportName.toLowerCase()} drills`;

  if (ageGroup) {
    intro += ` specifically designed for ${ageGroupDisplayName(ageGroup).toLowerCase()}`;
  }

  intro += ". Each drill includes step-by-step instructions, coaching cues, and common mistakes to avoid.";

  return intro;
}
