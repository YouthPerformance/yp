/**
 * Internal queries for Answer Engine vector search
 * Called by actions in answerEngine.ts
 */

import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

// ─────────────────────────────────────────────────────────────
// TYPES (matching answerEngine.ts)
// ─────────────────────────────────────────────────────────────

interface DrillApiResponse {
  _id: Id<"drills">;
  slug: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  ageMin: number;
  ageMax: number;
  difficulty: string;
  duration: string;
  reps?: string;
  equipment: string[];
  tags: string[];
  constraints: string[];
  steps: {
    order: number;
    title?: string;
    instruction: string;
    duration?: string;
    durationSeconds?: number;
    coachingCue?: string;
  }[];
  coachingCues: string[];
  commonMistake?: string;
  mistakeFix?: string;
  author: {
    _id: Id<"authors">;
    slug: string;
    name: string;
    title: string;
    credentials: string[];
  } | null;
  updatedAt: number;
}

interface QnAApiResponse {
  _id: Id<"qna">;
  slug: string;
  question: string;
  directAnswer: string;
  category: string;
  keywords: string[];
  keyTakeaways: string[];
  safetyNote?: string;
  author: {
    _id: Id<"authors">;
    slug: string;
    name: string;
    title: string;
    credentials: string[];
  } | null;
  updatedAt: number;
}

// ─────────────────────────────────────────────────────────────
// HELPER: Transform drill to API format
// ─────────────────────────────────────────────────────────────

function transformDrill(
  drill: Doc<"drills">,
  author: Doc<"authors"> | null
): DrillApiResponse {
  // Extract coaching cues from steps
  const coachingCues = drill.steps
    .flatMap((s) => s.coachingCues || [])
    .filter(Boolean);

  // Get first step's common mistake/fix if exists
  const firstStepWithMistake = drill.steps.find((s) => s.commonMistake);

  return {
    _id: drill._id,
    slug: drill.slug,
    title: drill.title,
    description: drill.goal,
    sport: drill.sport,
    category: drill.skill,
    ageMin: drill.ageBand.min,
    ageMax: drill.ageBand.max,
    difficulty: drill.difficulty,
    duration: drill.duration,
    reps: drill.reps,
    equipment: drill.equipment,
    tags: drill.tags,
    constraints: drill.constraints,
    steps: drill.steps.map((step) => ({
      order: step.position,
      title: step.title,
      instruction: step.instruction,
      durationSeconds: step.durationSeconds,
      coachingCue: step.coachingCues?.[0],
    })),
    coachingCues,
    commonMistake: firstStepWithMistake?.commonMistake,
    mistakeFix: firstStepWithMistake?.mistakeFix,
    author: author
      ? {
          _id: author._id,
          slug: author.slug,
          name: author.name,
          title: author.tagline,
          credentials: author.credentials,
        }
      : null,
    updatedAt: drill.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────
// INTERNAL QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get drills by IDs with their authors
 * Used by vector search action
 */
export const getDrillsWithAuthors = internalQuery({
  args: { ids: v.array(v.id("drills")) },
  handler: async (ctx, args): Promise<DrillApiResponse[]> => {
    // Get all drills
    const drills = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    const validDrills = drills.filter(Boolean) as Doc<"drills">[];

    // Get unique author IDs
    const authorIds = [...new Set(validDrills.map((d) => d.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    // Transform and return in original order
    return validDrills.map((drill) =>
      transformDrill(drill, authorMap.get(drill.authorId) || null)
    );
  },
});

/**
 * Get QnA entries by IDs with their authors
 * Used by vector search action
 */
export const getQnAsWithAuthors = internalQuery({
  args: { ids: v.array(v.id("qna")) },
  handler: async (ctx, args): Promise<QnAApiResponse[]> => {
    // Get all QnAs
    const qnas = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    const validQnas = qnas.filter(Boolean) as Doc<"qna">[];

    // Get unique author IDs
    const authorIds = [...new Set(validQnas.map((q) => q.authorId))];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!._id, a!])
    );

    // Transform and return
    return validQnas.map((qna) => {
      const author = authorMap.get(qna.authorId);
      return {
        _id: qna._id,
        slug: qna.slug,
        question: qna.question,
        directAnswer: qna.directAnswer,
        category: qna.category,
        keywords: qna.keywords,
        keyTakeaways: qna.keyTakeaways,
        safetyNote: qna.safetyNote,
        author: author
          ? {
              _id: author._id,
              slug: author.slug,
              name: author.name,
              title: author.tagline,
              credentials: author.credentials,
            }
          : null,
        updatedAt: qna.updatedAt,
      };
    });
  },
});
