// ============================================================================
// YOUTHPERFORMANCE KNOWLEDGE GRAPH SCHEMA
// Built backwards from: #1 youth {sport} drills + answer engines + scale
// The Wikipedia of Youth Sports - AI Era Infrastructure
// ============================================================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================================================
// REUSABLE VALIDATORS
// ============================================================================

const reviewStatus = v.union(
  v.literal("draft"),
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("published"),
  v.literal("archived")
);

const safetyLevel = v.union(
  v.literal("safe_autopublish"), // Can publish without human review
  v.literal("requires_human_review"), // Must be reviewed by James/Adam
  v.literal("blocked") // Cannot publish - needs expert intervention
);

const contentConfidence = v.object({
  score: v.number(), // 0-1 confidence in accuracy
  safetyScore: v.number(), // 0-1 safety assessment
  uniquenessScore: v.number(), // 0-1 how unique vs existing content
  flags: v.array(v.string()), // ["medical_adjacent", "age_sensitive", etc.]
});

const ageBand = v.object({
  min: v.number(),
  max: v.number(),
  label: v.string(), // "8-10", "11-13"
});

// ============================================================================
// SCHEMA DEFINITION
// ============================================================================

export default defineSchema({
  // ==========================================================================
  // CORE ENTITIES (The Knowledge Graph)
  // ==========================================================================

  /**
   * AUTHORS / REVIEWERS
   * Named authorities for E-E-A-T. These are the humans AI will cite.
   */
  authors: defineTable({
    // Identity
    name: v.string(),
    slug: v.string(),
    initials: v.string(),

    // Credentials (E-E-A-T)
    tagline: v.string(), // "NBA Skills Development Coach"
    credentials: v.array(v.string()), // Verifiable qualifications
    bio: v.string(),
    yearsExperience: v.optional(v.number()),

    // Media
    avatarUrl: v.optional(v.string()), // Cloudflare R2

    // Social proof
    socialLinks: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        twitter: v.optional(v.string()),
        youtube: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        wikipedia: v.optional(v.string()),
      })
    ),

    // Voice profile (for AI content generation in their style)
    voiceProfile: v.object({
      tone: v.string(), // "Direct, confident, uses analogies"
      vocabulary: v.array(v.string()), // Signature terms they use
      avoid: v.array(v.string()), // What they never say
      speechPatterns: v.array(v.string()), // How they structure explanations
      signaturePhrases: v.array(v.string()), // "The game is won in the feet"
    }),

    // Domain ownership
    domains: v.array(v.string()), // ["barefoot", "biomechanics"]
    sports: v.array(v.string()), // ["basketball", "all-sports"]

    // Approval authority
    canApprove: v.array(v.string()), // Content types they can approve
    canPublishWithoutReview: v.boolean(), // Senior authority flag

    // Review history (for trust scoring)
    reviewCount: v.number(),
    approvalRate: v.number(),

    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_domain", ["domains"])
    .index("by_active", ["isActive"]),

  /**
   * ENTITIES (Terminology Knowledge Graph)
   * Moves, muscles, equipment, terms, ages, positions, leagues
   * This is how you avoid "thin content" - every entity is defined once
   */
  entities: defineTable({
    type: v.string(), // "muscle", "equipment", "term", "age_band", "position"
    name: v.string(),
    slug: v.string(),

    // Definition
    definition: v.string(),
    shortDefinition: v.string(), // For tooltips/cards

    // Relationships
    parentEntityId: v.optional(v.id("entities")), // Hierarchy
    relatedEntityIds: v.array(v.id("entities")),

    // Context
    sports: v.array(v.string()),

    // Media
    imageUrl: v.optional(v.string()),
    iconUrl: v.optional(v.string()),

    // SEO
    keywords: v.array(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_type_sport", ["type", "sports"]),

  /**
   * DRILLS
   * The atomic content unit. Structured first, markdown second.
   */
  drills: defineTable({
    // Identity
    title: v.string(),
    slug: v.string(),

    // === STRUCTURED CLASSIFICATION (for programmatic SEO) ===
    sport: v.string(), // "basketball", "soccer", "football"
    skill: v.string(), // "shooting", "dribbling", "footwork"
    subSkill: v.optional(v.string()), // "form", "range", "off-hand"

    // Age targeting
    ageBand: ageBand,

    // Constraints (the programmatic SEO gold)
    constraints: v.array(v.string()), // ["apartment", "no-hoop", "solo", "quiet"]
    equipment: v.array(v.string()), // ["basketball", "none", "chair"]
    environment: v.array(v.string()), // ["indoor", "outdoor", "gym", "home"]

    // Difficulty & progression
    difficulty: v.string(), // "beginner", "intermediate", "advanced"
    difficultyScore: v.number(), // 1-10 for sorting
    prerequisiteDrillIds: v.array(v.id("drills")),
    progressionDrillIds: v.array(v.id("drills")), // What comes next
    regressionDrillIds: v.array(v.id("drills")), // Easier versions

    // === STRUCTURED CONTENT (for HowTo schema) ===
    goal: v.string(), // What this drill achieves
    duration: v.string(), // "5-10 min"
    reps: v.optional(v.string()), // "3 sets x 10"

    steps: v.array(
      v.object({
        position: v.number(),
        title: v.optional(v.string()),
        instruction: v.string(),
        durationSeconds: v.optional(v.number()),

        // Coaching cues (the expert knowledge)
        coachingCues: v.array(v.string()),
        visualCue: v.optional(v.string()), // What to look for
        feelCue: v.optional(v.string()), // What it should feel like

        // Error correction
        commonMistake: v.optional(v.string()),
        mistakeFix: v.optional(v.string()),

        // Media
        imageUrl: v.optional(v.string()),
        videoTimestamp: v.optional(v.number()),
      })
    ),

    // Coach's perspective
    coachNote: v.optional(v.string()), // "Adam's Take: ..."
    whyItWorks: v.optional(v.string()), // Science/reasoning

    // === SAFETY (Critical for youth content) ===
    safetyNotes: v.array(v.string()),
    contraindications: v.array(v.string()), // When NOT to do this
    ageWarnings: v.optional(
      v.object({
        tooYoung: v.optional(v.string()),
        growthPlate: v.optional(v.string()),
      })
    ),
    requiresSupervision: v.boolean(),

    // === MEDIA (Cloudflare) ===
    primaryVideoUrl: v.optional(v.string()), // Cloudflare Stream
    primaryVideoId: v.optional(v.string()), // Stream ID for embed
    thumbnailUrl: v.optional(v.string()), // R2
    heroImageUrl: v.optional(v.string()),

    // === RELATIONSHIPS ===
    authorId: v.id("authors"),
    reviewerId: v.optional(v.id("authors")),
    relatedDrillIds: v.array(v.id("drills")),
    relatedEntityIds: v.array(v.id("entities")), // Muscles, equipment, terms
    protocolIds: v.array(v.id("protocols")), // Part of which protocols

    // === SEO ===
    tags: v.array(v.string()),
    keywords: v.array(v.string()),
    targetKeyword: v.optional(v.string()), // Primary SEO target
    metaDescription: v.optional(v.string()),

    // === ANSWER ENGINE ===
    directAnswer: v.optional(v.string()), // 50-word answer for snippets
    faqItems: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      })
    ),

    // === AI / RETRIEVAL ===
    embedding: v.optional(v.array(v.float64())), // 1536 dims

    // === APPROVAL & PUBLISHING ===
    status: reviewStatus,
    safetyLevel: safetyLevel,
    confidence: v.optional(contentConfidence),

    // Approval trail
    approvedBy: v.optional(v.id("authors")),
    approvedAt: v.optional(v.number()),
    approvalNotes: v.optional(v.string()),

    // Publishing
    publishedAt: v.optional(v.number()),
    lastReviewedAt: v.optional(v.number()),

    // === UNIQUENESS (anti-thin-content) ===
    uniquenessHash: v.optional(v.string()), // Hash of key content for dedup
    isCanonical: v.boolean(), // Is this THE version?
    variantOfDrillId: v.optional(v.id("drills")), // If this is a variation

    // === ANALYTICS ===
    viewCount: v.number(),
    completionRate: v.optional(v.number()),
    avgTimeOnPage: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sport", ["sport"])
    .index("by_skill", ["skill"])
    .index("by_sport_skill", ["sport", "skill"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_safety", ["safetyLevel"])
    .index("by_canonical", ["isCanonical"])
    .searchIndex("search_drills", {
      searchField: "title",
      filterFields: ["sport", "skill", "status"],
    })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["sport", "skill", "status"],
    }),

  /**
   * PROTOCOLS
   * Multi-phase programs (R3 Method, Bulletproof Ankles, Sever's Protocol)
   * These require STRICT human review
   */
  protocols: defineTable({
    title: v.string(),
    slug: v.string(),

    // Classification
    type: v.string(), // "rehab", "prevention", "performance", "progression"
    sport: v.string(),
    targetCondition: v.optional(v.string()), // For rehab: "severs_disease"

    // Overview
    description: v.string(),
    goal: v.string(),
    expectedDuration: v.string(), // "6 weeks"
    expectedOutcomes: v.array(v.string()),

    // Who is this for
    targetAudience: v.object({
      ageBand: ageBand,
      fitnessLevel: v.string(),
      prerequisites: v.array(v.string()),
    }),

    // Phases (the structured program)
    phases: v.array(
      v.object({
        order: v.number(),
        name: v.string(), // "Release", "Restore", "Re-Engineer"
        duration: v.string(),
        description: v.string(),
        frequency: v.string(), // "3x per week"

        // Drills in this phase
        drillIds: v.array(v.id("drills")),

        // Progression criteria
        progressionCriteria: v.array(v.string()),
        doNotProgress: v.array(v.string()), // Red flags
      })
    ),

    // === SAFETY (Highest scrutiny) ===
    safetyWarning: v.string(),
    medicalDisclaimer: v.string(),
    contraindications: v.array(v.string()),
    whenToStop: v.array(v.string()),
    whenToSeeDoctor: v.array(v.string()),

    // === E-E-A-T ===
    authorId: v.id("authors"),
    reviewerId: v.optional(v.id("authors")), // REQUIRED for protocols
    medicalReviewerId: v.optional(v.id("authors")),

    // Citations
    studyIds: v.array(v.id("studies")),

    // === AI / Retrieval ===
    embedding: v.optional(v.array(v.float64())),

    // === Approval (Strict) ===
    status: reviewStatus,
    safetyLevel: safetyLevel,

    approvedBy: v.optional(v.id("authors")),
    approvedAt: v.optional(v.number()),
    lastReviewedAt: v.optional(v.number()),
    reviewNotes: v.optional(v.string()),

    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_sport", ["sport"])
    .index("by_status", ["status"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  /**
   * GUIDES (Pillar Content)
   * Long-form SEO hub pages
   */
  guides: defineTable({
    title: v.string(),
    slug: v.string(),

    // Classification
    category: v.string(), // "basketball", "barefoot-training"
    subcategory: v.optional(v.string()),
    sport: v.string(),
    guideType: v.string(), // "pillar", "hub", "ultimate-guide"

    // Content
    description: v.string(),
    content: v.string(), // MDX content

    // === ANSWER ENGINE OPTIMIZATION ===
    directAnswer: v.string(), // 100-word snippet target
    keyTakeaways: v.array(v.string()), // 5 bullet points

    // Table of contents (structured)
    toc: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        level: v.number(),
      })
    ),

    // FAQ (for FAQPage schema)
    faqItems: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
      })
    ),

    // === RELATIONSHIPS (Topic Cluster) ===
    authorId: v.id("authors"),
    drillIds: v.array(v.id("drills")),
    protocolIds: v.array(v.id("protocols")),
    childGuideIds: v.array(v.id("guides")), // Hub -> spokes
    parentGuideId: v.optional(v.id("guides")),
    relatedGuideIds: v.array(v.id("guides")),

    // === SEO ===
    keywords: v.array(v.string()),
    targetKeyword: v.string(),
    canonical: v.optional(v.string()),
    readTime: v.string(),

    // Internal linking
    internalLinks: v.array(
      v.object({
        anchorText: v.string(),
        targetSlug: v.string(),
        targetType: v.string(), // "drill", "guide", "protocol"
      })
    ),

    // === AI ===
    embedding: v.optional(v.array(v.float64())),

    // === Publishing ===
    status: reviewStatus,
    safetyLevel: safetyLevel,

    publishedAt: v.optional(v.number()),
    lastReviewedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_sport", ["sport"])
    .index("by_status", ["status"])
    .index("by_parent", ["parentGuideId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  /**
   * Q&A (Parent Sidelines)
   * Direct answer content for featured snippets
   * Each has "grounded sources" + review status
   */
  qna: defineTable({
    question: v.string(),
    slug: v.string(),

    // Classification
    category: v.string(),
    sport: v.optional(v.string()),
    intent: v.string(), // "informational", "safety", "how-to"

    // === THE ANSWER (Grounded) ===
    directAnswer: v.string(), // First 100 words - snippet target
    fullAnswer: v.string(), // Complete MDX content

    // Grounded sources (what makes us trustworthy)
    sources: v.array(
      v.object({
        type: v.string(), // "study", "expert", "guideline"
        title: v.string(),
        url: v.optional(v.string()),
        quote: v.optional(v.string()),
      })
    ),

    keyTakeaways: v.array(v.string()),

    // Safety (if applicable)
    safetyNote: v.optional(v.string()),
    disclaimer: v.optional(v.string()),

    // === RELATIONSHIPS ===
    authorId: v.id("authors"),
    reviewerId: v.optional(v.id("authors")),
    relatedGuideId: v.optional(v.id("guides")),
    relatedDrillIds: v.array(v.id("drills")),
    relatedQnaIds: v.array(v.id("qna")),

    // === SEO ===
    keywords: v.array(v.string()),
    searchQueries: v.array(v.string()), // Actual queries this answers

    // === AI ===
    embedding: v.optional(v.array(v.float64())),

    // === Confidence & Approval ===
    status: reviewStatus,
    safetyLevel: safetyLevel,
    confidence: v.optional(contentConfidence),

    approvedBy: v.optional(v.id("authors")),
    approvedAt: v.optional(v.number()),

    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_safety", ["safetyLevel"])
    .searchIndex("search_qna", {
      searchField: "question",
      filterFields: ["category", "status"],
    })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  /**
   * STUDIES (Citations for E-E-A-T)
   */
  studies: defineTable({
    title: v.string(),
    authors: v.array(v.string()),
    journal: v.string(),
    year: v.number(),

    // Identifiers
    doi: v.optional(v.string()),
    pubmedId: v.optional(v.string()),
    url: v.optional(v.string()),

    // Key findings (for citations)
    abstract: v.optional(v.string()),
    keyFindings: v.array(v.string()),
    relevantQuotes: v.array(
      v.object({
        quote: v.string(),
        context: v.optional(v.string()),
      })
    ),

    // Classification
    topics: v.array(v.string()),
    studyType: v.string(), // "RCT", "meta-analysis", "cohort"
    evidenceLevel: v.string(), // "high", "moderate", "low"

    createdAt: v.number(),
  })
    .index("by_year", ["year"])
    .index("by_topic", ["topics"]),

  // ==========================================================================
  // AGENTIC CMS PIPELINE
  // ==========================================================================

  /**
   * CONTENT_QUEUE
   * The programmatic SEO + agentic content pipeline
   */
  contentQueue: defineTable({
    // === SOURCE ===
    keyword: v.string(),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    source: v.string(), // "ahrefs", "manual", "gap_analysis", "user_search"

    // === TARGET ===
    targetEntityType: v.string(), // "drill", "guide", "qna", "protocol"
    sport: v.string(),
    skill: v.optional(v.string()),

    // === PIPELINE STATUS ===
    stage: v.string(), // "queued", "planning", "researching", "drafting", "review", "approved", "published", "rejected"
    priority: v.number(), // 1-10

    // === AGENT OUTPUTS ===

    // 1. Content Planner Agent
    planningOutput: v.optional(
      v.object({
        contentType: v.string(),
        headOrTail: v.string(), // "head" (SSG) or "tail" (SSR)
        uniquenessAssessment: v.string(),
        recommendedAuthor: v.string(),
        competitorAnalysis: v.array(
          v.object({
            url: v.string(),
            strengths: v.array(v.string()),
            gaps: v.array(v.string()),
          })
        ),
        completedAt: v.number(),
      })
    ),

    // 2. Research Agent
    researchOutput: v.optional(
      v.object({
        relatedQuestions: v.array(v.string()),
        suggestedStudies: v.array(v.string()),
        expertQuotes: v.array(v.string()),
        safetyConsiderations: v.array(v.string()),
        completedAt: v.number(),
      })
    ),

    // 3. Draft Generator Agent
    draftOutput: v.optional(
      v.object({
        generatedContent: v.any(), // The structured entity
        model: v.string(), // "claude-3-opus"
        promptVersion: v.string(),
        generatedAt: v.number(),
      })
    ),

    // 4. Evidence + Safety Agent
    safetyOutput: v.optional(
      v.object({
        safetyLevel: safetyLevel,
        flags: v.array(v.string()),
        requiredDisclaimers: v.array(v.string()),
        requiresExpertReview: v.boolean(),
        reviewerDomain: v.optional(v.string()), // "james" or "adam"
        completedAt: v.number(),
      })
    ),

    // 5. SEO Packager Agent
    seoOutput: v.optional(
      v.object({
        title: v.string(),
        metaDescription: v.string(),
        targetKeyword: v.string(),
        secondaryKeywords: v.array(v.string()),
        internalLinks: v.array(
          v.object({
            anchorText: v.string(),
            targetSlug: v.string(),
          })
        ),
        schemaType: v.string(), // "HowTo", "FAQPage", "Article"
        completedAt: v.number(),
      })
    ),

    // === HUMAN REVIEW ===
    review: v.optional(
      v.object({
        reviewerId: v.id("authors"),
        status: v.string(), // "pending", "approved", "changes_requested", "rejected"
        feedback: v.optional(v.string()),
        changesRequested: v.optional(v.array(v.string())),
        reviewedAt: v.number(),
      })
    ),

    // === PUBLISHING ===
    publishedEntityId: v.optional(v.string()),
    publishedEntityType: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    publishedUrl: v.optional(v.string()),

    // === METADATA ===
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_stage", ["stage"])
    .index("by_priority", ["priority"])
    .index("by_stage_priority", ["stage", "priority"])
    .index("by_sport", ["sport"])
    .index("by_target_type", ["targetEntityType"]),

  /**
   * APPROVAL_PATTERNS
   * Templates that James/Adam have approved - agents can replicate without re-review
   */
  approvalPatterns: defineTable({
    name: v.string(), // "basketball_drill_beginner"

    // What this pattern covers
    entityType: v.string(),
    sport: v.string(),
    category: v.optional(v.string()),
    ageBand: v.optional(ageBand),

    // The approved structure
    requiredFields: v.array(v.string()),
    requiredSafetyNotes: v.array(v.string()),
    requiredDisclaimers: v.array(v.string()),

    // UX pattern (mobile layout)
    uxPattern: v.object({
      componentOrder: v.array(v.string()), // ["safety", "video", "steps", "tips"]
      mobileLayout: v.string(), // Reference to Figma/component
    }),

    // Voice constraints
    voiceConstraints: v.object({
      authorId: v.id("authors"),
      requiredPhrases: v.array(v.string()),
      forbiddenPhrases: v.array(v.string()),
    }),

    // Approval
    approvedBy: v.id("authors"),
    approvedAt: v.number(),

    // Usage tracking
    timesUsed: v.number(),
    lastUsedAt: v.optional(v.number()),

    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_entity_type", ["entityType"])
    .index("by_sport", ["sport"])
    .index("by_active", ["isActive"]),

  /**
   * CAMPAIGNS
   * Marketing/content campaigns
   */
  campaigns: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),

    // Targeting
    sport: v.optional(v.string()),
    theme: v.string(),

    // Content
    rawInput: v.optional(v.string()), // Original brief
    generatedContent: v.optional(v.any()),

    // Status
    status: v.string(), // "draft", "ready", "published", "failed"
    authorType: v.string(), // "adam", "james", "team-yp"

    // Publishing
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_author", ["authorType"]),

  // ==========================================================================
  // PROGRAMMATIC SEO
  // ==========================================================================

  /**
   * GENERATED_PAGES
   * The Drill Matrix output: [Sport] x [Skill] x [Age] x [Constraint]
   * Only created when passing uniqueness threshold
   */
  generatedPages: defineTable({
    // === THE MATRIX ===
    sport: v.string(),
    skill: v.string(),
    ageBand: v.string(), // "7-9", "10-12"
    constraint: v.optional(v.string()), // "apartment", "no-equipment"
    painPoint: v.optional(v.string()), // "weak-hand", "no-confidence"

    // === GENERATED CONTENT ===
    title: v.string(),
    slug: v.string(),
    h1: v.string(),
    metaDescription: v.string(),
    intro: v.string(), // Opening paragraph

    // Aggregated from drills
    drillIds: v.array(v.id("drills")),
    authorId: v.id("authors"),

    // === SEO ===
    targetKeyword: v.string(),
    secondaryKeywords: v.array(v.string()),

    // Internal links to related matrix pages
    relatedPageIds: v.array(v.id("generatedPages")),

    // === UNIQUENESS CHECK ===
    uniquenessScore: v.number(), // Must be > threshold to publish
    uniquenessHash: v.string(),

    // === RENDERING STRATEGY ===
    renderStrategy: v.string(), // "ssg" (head) or "ssr" (tail)

    // === AI ===
    embedding: v.optional(v.array(v.float64())),

    // === STATUS ===
    status: reviewStatus,
    publishedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_matrix", ["sport", "skill", "ageBand"])
    .index("by_full_matrix", ["sport", "skill", "ageBand", "constraint"])
    .index("by_status", ["status"])
    .index("by_render", ["renderStrategy"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  // ==========================================================================
  // MEDIA (Cloudflare)
  // ==========================================================================

  media: defineTable({
    filename: v.string(),
    type: v.string(), // "image", "video", "thumbnail"

    // Cloudflare storage
    provider: v.string(), // "cloudflare_r2", "cloudflare_stream"
    storageKey: v.string(), // R2 key or Stream UID
    url: v.string(), // Public URL

    // Metadata
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    duration: v.optional(v.number()), // Video duration

    // AI-generated metadata (Gemini)
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    transcript: v.optional(v.string()), // Video transcript
    generatedBy: v.optional(v.string()), // "gemini-2.5-pro"

    // Usage tracking
    usedInEntities: v.array(
      v.object({
        entityType: v.string(),
        entityId: v.string(),
        field: v.string(),
      })
    ),

    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_storage_key", ["storageKey"]),

  // ==========================================================================
  // ANALYTICS & AI TRAINING
  // ==========================================================================

  /**
   * SEARCH_LOGS
   * Track internal searches - feeds back into content gaps
   */
  searchLogs: defineTable({
    query: v.string(),
    resultsCount: v.number(),
    clickedEntityId: v.optional(v.string()),
    clickedEntityType: v.optional(v.string()),
    source: v.string(), // "site_search", "answer_api"
    sessionId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_query", ["query"]),

  /**
   * AI_RETRIEVALS
   * Track when answer engines query us - proof of "source of truth"
   */
  aiRetrievals: defineTable({
    query: v.string(),
    source: v.optional(v.string()), // "perplexity", "chatgpt", "unknown"
    userAgent: v.optional(v.string()),
    resultsReturned: v.number(),
    citedEntityIds: v.array(v.string()),
    citedEntityTypes: v.array(v.string()),
    responseTime: v.number(), // ms
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_source", ["source"]),

  /**
   * QUALITY_FEEDBACK
   * User feedback loop for continuous improvement
   */
  qualityFeedback: defineTable({
    entityType: v.string(),
    entityId: v.string(),
    feedbackType: v.string(), // "helpful", "confusing", "incorrect", "unsafe"
    comment: v.optional(v.string()),
    source: v.string(), // "widget", "email", "support"
    sessionId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_type", ["feedbackType"])
    .index("by_timestamp", ["timestamp"]),
});
