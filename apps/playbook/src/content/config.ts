import { defineCollection, z, reference } from 'astro:content';

// Authors Collection
const authorsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    initials: z.string().max(2),
    credentials: z.array(z.string()),
    bio: z.string(),
    avatarUrl: z.string().optional(),
    socialLinks: z.object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      wikipedia: z.string().optional(),
    }).optional(),
    voiceProfile: z.object({
      tone: z.string(),
      avoid: z.array(z.string()),
      speechPatterns: z.array(z.string()),
    }),
  }),
});

// Pillars Collection (MDX articles)
const pillarsCollection = defineCollection({
  type: 'content',
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
    category: z.enum(['basketball', 'barefoot-training', 'speed-agility', 'soccer']),
    subcategory: z.string().optional(),
    // SEO
    keywords: z.array(z.string()),
    canonical: z.string(),
    // Theme
    theme: z.enum(['basketball', 'barefoot']).default('basketball'),
    // Program/product tie-in
    programBadge: z.string().optional(),
  }),
});

// Drills Collection (JSON data objects)
const drillsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['ball-handling', 'shooting', 'footwork', 'defense', 'barefoot', 'balance', 'strength']),
    sport: z.enum(['basketball', 'barefoot', 'all-sports']),
    author: z.string(),
    // Age targeting
    ageMin: z.number().min(5).max(18),
    ageMax: z.number().min(5).max(18),
    // Metadata
    duration: z.string(), // "3 min"
    reps: z.string(), // "10 reps x 5 sec holds"
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'scalable']),
    // Tags for filtering
    tags: z.array(z.string()), // ['silent', 'apartment', 'no-hoop', 'at-home']
    // Content
    description: z.string(),
    steps: z.array(z.object({
      instruction: z.string(),
    })),
    coachingCues: z.array(z.string()),
    commonMistake: z.string().optional(),
    mistakeFix: z.string().optional(),
    // Media
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
  }),
});

// Parent Sidelines (Q&A pages)
const parentSidelinesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    slug: z.string(),
    category: z.enum(['basketball', 'barefoot', 'general', 'safety']),
    author: z.string(),
    publishedDate: z.date(),
    updatedDate: z.date(),
    // AEO
    directAnswer: z.string(), // 2-3 sentence definitive answer
    // Linking
    relatedPillar: z.string(), // URL to parent pillar
    relatedDrills: z.array(z.string()).optional(),
    // SEO
    keywords: z.array(z.string()),
  }),
});

export const collections = {
  authors: authorsCollection,
  pillars: pillarsCollection,
  drills: drillsCollection,
  'parent-sidelines': parentSidelinesCollection,
};
