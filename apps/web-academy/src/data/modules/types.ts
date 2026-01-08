// ═══════════════════════════════════════════════════════════
// INTERACTIVE LEARNING MODULE TYPES
// Wolf Pack Protocol - Spec 003
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// CONTENT MODE
// ─────────────────────────────────────────────────────────────

export type ContentMode = 'athlete' | 'parent';

// ─────────────────────────────────────────────────────────────
// CARD CONTENT
// ─────────────────────────────────────────────────────────────

export interface CardContent {
  headline: string;
  body: string | null;
  mediaType?: 'image' | 'video' | null;
  mediaUrl?: string | null;
  caption?: string | null;
}

export interface DualModeContent {
  athlete: CardContent;
  parent: CardContent;
}

// ─────────────────────────────────────────────────────────────
// CARD TYPES
// ─────────────────────────────────────────────────────────────

export interface BaseLearningCard {
  id: string;
  sectionId: string;
  order: number;
  content: DualModeContent;
}

export interface LessonCard extends BaseLearningCard {
  type: 'Lesson';
}

export interface CheckOption {
  id: string;
  text: { athlete: string; parent: string };
  isCorrect: boolean;
  feedback: { athlete: string; parent: string };
}

export interface CheckCard extends BaseLearningCard {
  type: 'Check';
  question: { athlete: string; parent: string };
  options: CheckOption[];
  hintAvailable: boolean;
  hint?: { athlete: string; parent: string };
  // XP is calculated via calculateCardXp() - no static value needed
}

export interface UnlockedItem {
  type: 'DrillStack' | 'Program' | 'Product';
  id: string;
  title: string;
  description: string;
  duration?: string;
  ctaLabel?: string;
  handle?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CompletionCard extends BaseLearningCard {
  type: 'Completion';
  unlockedContent: UnlockedItem[];
  completionBadge: Badge;
}

export type LearningCard = LessonCard | CheckCard | CompletionCard;

// ─────────────────────────────────────────────────────────────
// SECTION & MODULE
// ─────────────────────────────────────────────────────────────

export interface LearningSection {
  id: string;
  order: number;
  title: string;
  level: 1 | 2 | 3 | 4; // Maps to LEVEL_REWARDS for XP + Shards
  unlockThreshold: number; // Cumulative correct answers required
  cards: LearningCard[];
}

export interface ModuleSEO {
  title: string;
  description: string;
  pillarSlug: string;
  clusterSlug: string;
  keywords?: string[];
  faqSchema?: Array<{ question: string; answer: string }>;
}

export interface ModuleAnalytics {
  expectedCompletionRate: number;
  targetAccuracyRange: [number, number];
  avgTimePerCard: number;
  dropoffWarningThreshold: number;
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  sport: 'Basketball' | 'Barefoot' | 'General';
  author: string;
  reviewedBy?: string;
  estimatedMinutes: number;
  // Economy v2: XP + Shards (10 shards = 1 crystal)
  maxXp: number;
  maxShards: number;
  thumbnailUrl: string;
  heroVideoUrl?: string | null;
  prerequisites: string[];
  unlocksContent: string[];
  sections: LearningSection[];
  seo: ModuleSEO;
  analytics?: ModuleAnalytics;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// PROGRESS TRACKING
// ─────────────────────────────────────────────────────────────

export interface CardHistoryEntry {
  cardId: string;
  viewedAt: number;
  answeredAt?: number;
  wasCorrect?: boolean;
  attemptsOnCard: number;
}

export interface ModuleProgress {
  moduleId: string;
  userId: string;
  startedAt: number;
  completedAt?: number;
  currentSectionId: string;
  currentCardId: string;
  totalCorrect: number;
  totalAttempts: number;
  // Economy v2
  xpEarned: number;
  shardsEarned: number;
  levelsCompleted: number[];
  sectionsUnlocked: string[];
  cardHistory: CardHistoryEntry[];
  mode: ContentMode;
}

// ─────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────

export type CardType = 'Lesson' | 'Check' | 'Completion';

export function isCheckCard(card: LearningCard): card is CheckCard {
  return card.type === 'Check';
}

export function isLessonCard(card: LearningCard): card is LessonCard {
  return card.type === 'Lesson';
}

export function isCompletionCard(card: LearningCard): card is CompletionCard {
  return card.type === 'Completion';
}

// ─────────────────────────────────────────────────────────────
// REWARD CALCULATION (XP + Shards Economy v2)
// See: .specify/specs/004-xp-crystal-economy/spec.md
// ─────────────────────────────────────────────────────────────

/**
 * XP rewards per card interaction
 * - First try correct: +5 XP
 * - Retry correct: +2 XP
 * - Lesson card view: +2 XP
 */
export function calculateCardXp(
  isCorrect: boolean,
  attemptNumber: number
): number {
  if (!isCorrect) return 0;
  if (attemptNumber === 1) return 5;
  return 2; // Retry XP
}

/**
 * Level completion rewards (XP + Shards)
 * - L1: 35 XP, 0 shards
 * - L2: 50 XP, 1 shard
 * - L3: 75 XP, 1 shard
 * - L4: 100 XP, 2 shards
 */
export const LEVEL_REWARDS = {
  1: { xp: 35, shards: 0 },
  2: { xp: 50, shards: 1 },
  3: { xp: 75, shards: 1 },
  4: { xp: 100, shards: 2 },
} as const;

/**
 * Completion bonus (requires ≥80% accuracy)
 */
export const COMPLETION_BONUS = {
  xp: 100,
  shards: 1,
  accuracyThreshold: 0.8,
} as const;

/**
 * Shard to Crystal conversion rate
 * 10 shards = 1 crystal
 */
export const SHARDS_PER_CRYSTAL = 10;

/**
 * Calculate total module rewards
 */
export function calculateModuleRewards(
  accuracy: number,
  levelsCompleted: number
): { xp: number; shards: number } {
  let xp = 0;
  let shards = 0;

  // Sum level rewards
  for (let i = 1; i <= levelsCompleted; i++) {
    const reward = LEVEL_REWARDS[i as keyof typeof LEVEL_REWARDS];
    if (reward) {
      xp += reward.xp;
      shards += reward.shards;
    }
  }

  // Add completion bonus if accuracy threshold met
  if (accuracy >= COMPLETION_BONUS.accuracyThreshold) {
    xp += COMPLETION_BONUS.xp;
    shards += COMPLETION_BONUS.shards;
  }

  return { xp, shards };
}

// Legacy function for backwards compatibility
// @deprecated Use calculateCardXp instead
export function calculateCrystalReward(
  isCorrect: boolean,
  attemptNumber: number,
  baseReward: number = 10
): number {
  console.warn('calculateCrystalReward is deprecated. Use calculateCardXp instead.');
  return calculateCardXp(isCorrect, attemptNumber);
}

// ─────────────────────────────────────────────────────────────
// SECTION UNLOCK LOGIC
// ─────────────────────────────────────────────────────────────

export function canUnlockSection(
  section: LearningSection,
  cumulativeCorrect: number
): boolean {
  return cumulativeCorrect >= section.unlockThreshold;
}

export function getModuleStats(module: LearningModule): {
  totalLessons: number;
  totalChecks: number;
  totalCards: number;
} {
  let totalLessons = 0;
  let totalChecks = 0;

  for (const section of module.sections) {
    for (const card of section.cards) {
      if (card.type === 'Lesson') totalLessons++;
      if (card.type === 'Check') totalChecks++;
    }
  }

  return {
    totalLessons,
    totalChecks,
    totalCards: totalLessons + totalChecks,
  };
}
