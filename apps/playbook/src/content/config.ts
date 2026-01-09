import { defineCollection, z } from "astro:content";

// Authors Collection
const authorsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    initials: z.string().max(2),
    credentials: z.array(z.string()),
    bio: z.string(),
    avatarUrl: z.string().optional(),
    socialLinks: z
      .object({
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        wikipedia: z.string().optional(),
      })
      .optional(),
    voiceProfile: z.object({
      tone: z.string(),
      avoid: z.array(z.string()),
      speechPatterns: z.array(z.string()),
    }),
  }),
});

// Pillars Collection (MDX articles)
const pillarsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(), // reference to authors
    publishedDate: z.date(),
    updatedDate: z.date(),
    readTime: z.string(),
    // AEO Critical Elements
    directAnswer: z.string(),
    keyTakeaways: z.array(z.string()).max(5),
    // Categorization
    category: z.enum(["basketball", "barefoot-training", "speed-agility", "soccer"]),
    subcategory: z.string().optional(),
    // SEO
    keywords: z.array(z.string()),
    canonical: z.string(),
    // Theme
    theme: z.enum(["basketball", "barefoot"]).default("basketball"),
    // Program/product tie-in
    programBadge: z.string().optional(),
  }),
});

// Drills Collection (JSON data objects)
const drillsCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    // Category for UI grouping
    category: z.enum([
      "ball-handling",
      "shooting",
      "footwork",
      "defense",
      "barefoot",
      "balance",
      "strength",
      "pain-relief",
      "silent-training",
    ]),
    // Cluster for AEO content grouping
    cluster: z
      .enum([
        "silent-training",
        "home-training",
        "shooting-mechanics",
        "pain-relief",
        "foot-structure",
        "injury-rehab",
      ])
      .optional(),
    sport: z.enum(["basketball", "barefoot", "all-sports"]),
    author: z.string(),
    // Age targeting
    ageMin: z.number().min(5).max(18),
    ageMax: z.number().min(5).max(18),
    // Metadata
    duration: z.string(), // "3 min"
    reps: z.string(), // "10 reps x 5 sec holds"
    difficulty: z.enum(["beginner", "intermediate", "advanced", "scalable"]),
    // Tags for filtering (AEO keywords)
    tags: z.array(z.string()), // ['silent', 'apartment', 'no-hoop', 'at-home']
    // Content
    description: z.string(),
    coachNote: z.string().optional(), // "Adam's Take:" or "James's Take:"
    steps: z.array(
      z.object({
        title: z.string().optional(),
        instruction: z.string(),
        durationSeconds: z.number().optional(),
        videoUrl: z.string().optional(),
      }),
    ),
    coachingCues: z.array(z.string()),
    commonMistake: z.string().optional(),
    mistakeFix: z.string().optional(),
    // Media
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    // Related content
    relatedDrills: z.array(z.string()).optional(),
  }),
});

// Parent Sidelines (Q&A pages - AEO Traffic Magnets)
// Note: slug comes automatically from the filename in Astro content collections
const parentSidelinesCollection = defineCollection({
  type: "content",
  schema: z.object({
    question: z.string(),
    category: z.enum([
      "basketball",
      "barefoot",
      "general",
      "safety",
      "training-hacks",
      "injury-prevention",
      "skills-mechanics",
      "health-safety",
    ]),
    author: z.string(),
    expertTitle: z.string().optional(), // "NBA Skills Coach"
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    // AEO Critical Elements
    directAnswer: z.string(), // First 100 words - the Featured Snippet target
    keyTakeaways: z.array(z.string()).optional(), // Bullet points for scanners
    safetyNote: z.string().optional(), // Medical disclaimer when needed
    // Linking
    relatedPillar: z.string(), // URL to parent pillar
    relatedDrillSlug: z.string().optional(), // Primary drill recommendation
    relatedDrills: z.array(z.string()).optional(), // Additional drills
    // SEO
    keywords: z.array(z.string()),
    // CTA
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
  }),
});

export const collections = {
  authors: authorsCollection,
  pillars: pillarsCollection,
  drills: drillsCollection,
  "parent-sidelines": parentSidelinesCollection,
};
