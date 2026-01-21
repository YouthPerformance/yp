// ═══════════════════════════════════════════════════════════
// DRILL DATA INDEX
// Export all drill data and utilities
// ═══════════════════════════════════════════════════════════

export * from "./types";
export * from "./sample-drills";

// Re-export specific items for convenience
export {
  SPORTS,
  CATEGORIES,
  AGE_GROUPS,
  CONSTRAINTS,
  DRILL_AUTHORS,
  sportDisplayName,
  categoryDisplayName,
  ageGroupDisplayName,
  constraintDisplayName,
  generateDrillSlug,
  generateMatrixPageSlug,
  generateMetaTitle,
  generateMetaDescription,
  generateH1,
  generateIntro,
} from "./types";
