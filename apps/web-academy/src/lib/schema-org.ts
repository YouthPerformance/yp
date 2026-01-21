/**
 * Schema.org Structured Data Generator
 *
 * Generates JSON-LD structured data for Answer Engine content.
 * Optimized for AI citation systems (Perplexity, ChatGPT, etc.)
 *
 * Schema types used:
 * - HowTo: For drills (step-by-step instructions)
 * - FAQPage: For QnA articles
 * - Person: For author E-E-A-T signals
 * - Organization: For YouthPerformance branding
 */

const SITE_URL = "https://academy.youthperformance.com";
const ORG_NAME = "YouthPerformance Academy";
const ORG_LOGO = `${SITE_URL}/logo.png`;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Author {
  name: string;
  title: string;
  credentials: string[];
  slug?: string;
}

interface DrillStep {
  order: number;
  title?: string;
  instruction: string;
  duration?: string;
  durationSeconds?: number;
}

interface Drill {
  slug: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  ageMin: number;
  ageMax: number;
  difficulty: string;
  duration: string;
  equipment: string[];
  steps: DrillStep[];
  author: Author | null;
  updatedAt: number;
}

interface QnAArticle {
  slug: string;
  question: string;
  directAnswer: string;
  category: string;
  keyTakeaways: string[];
  safetyNote?: string;
  author: Author | null;
  updatedAt: number;
}

// ─────────────────────────────────────────────────────────────
// ORGANIZATION SCHEMA
// ─────────────────────────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    sameAs: [
      "https://instagram.com/youthperformance",
      "https://twitter.com/youthperformance",
    ],
    description:
      "Elite athletic training for youth athletes. Evidence-based drills, injury prevention, and performance optimization.",
  };
}

// ─────────────────────────────────────────────────────────────
// PERSON (AUTHOR) SCHEMA
// ─────────────────────────────────────────────────────────────

export function generatePersonSchema(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.title,
    url: author.slug ? `${SITE_URL}/experts/${author.slug}` : undefined,
    knowsAbout: author.credentials,
    worksFor: {
      "@type": "Organization",
      name: ORG_NAME,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// HOWTO SCHEMA (DRILLS)
// ─────────────────────────────────────────────────────────────

export function generateHowToSchema(drill: Drill) {
  // Parse duration string like "5-10 min" to ISO 8601 duration
  const totalTime = parseDurationToISO(drill.duration);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: drill.title,
    description: drill.description,
    url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}`,
    image: `${SITE_URL}/og/drills/${drill.slug}.png`,
    totalTime,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: drill.equipment.map((item) => ({
      "@type": "HowToSupply",
      name: item,
    })),
    tool: [],
    step: drill.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title || `Step ${index + 1}`,
      text: step.instruction,
      url: `${SITE_URL}/drills/${drill.sport}/${drill.category}/${drill.slug}#step-${index + 1}`,
    })),
    author: drill.author ? generatePersonSchema(drill.author) : undefined,
    publisher: generateOrganizationSchema(),
    dateModified: new Date(drill.updatedAt).toISOString(),
    // Additional metadata for AI systems
    audience: {
      "@type": "Audience",
      audienceType: `Youth athletes ages ${drill.ageMin}-${drill.ageMax}`,
    },
    educationalLevel: mapDifficultyToLevel(drill.difficulty),
    about: {
      "@type": "Thing",
      name: drill.sport,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// FAQPAGE SCHEMA (QNA ARTICLES)
// ─────────────────────────────────────────────────────────────

export function generateFAQPageSchema(article: QnAArticle) {
  // Build the full answer including key takeaways
  const fullAnswer = [
    article.directAnswer,
    "",
    "Key Takeaways:",
    ...article.keyTakeaways.map((t, i) => `${i + 1}. ${t}`),
    article.safetyNote ? `\nSafety Note: ${article.safetyNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: article.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: fullAnswer,
          author: article.author
            ? generatePersonSchema(article.author)
            : undefined,
          dateModified: new Date(article.updatedAt).toISOString(),
        },
      },
    ],
    url: `${SITE_URL}/guides/${article.slug}`,
    author: article.author ? generatePersonSchema(article.author) : undefined,
    publisher: generateOrganizationSchema(),
    dateModified: new Date(article.updatedAt).toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// ARTICLE SCHEMA (ALTERNATIVE FOR QNA)
// ─────────────────────────────────────────────────────────────

export function generateArticleSchema(article: QnAArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.question,
    description: article.directAnswer,
    url: `${SITE_URL}/guides/${article.slug}`,
    image: `${SITE_URL}/og/guides/${article.slug}.png`,
    author: article.author ? generatePersonSchema(article.author) : undefined,
    publisher: generateOrganizationSchema(),
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.keyTakeaways.join(", "),
  };
}

// ─────────────────────────────────────────────────────────────
// COMBINED SCHEMA FOR SEARCH RESULTS
// ─────────────────────────────────────────────────────────────

export function generateSearchResultSchema(
  results: Array<{ type: "drill" | "article"; data: Drill | QnAArticle }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: results.map((result, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item:
        result.type === "drill"
          ? generateHowToSchema(result.data as Drill)
          : generateFAQPageSchema(result.data as QnAArticle),
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function parseDurationToISO(duration: string): string {
  // Parse strings like "5-10 min", "15 min", "5 minutes"
  const match = duration.match(/(\d+)(?:-(\d+))?\s*(min|minutes|sec|seconds)?/i);
  if (!match) return "PT10M"; // Default 10 minutes

  const minValue = parseInt(match[1], 10);
  const maxValue = match[2] ? parseInt(match[2], 10) : minValue;
  const avgMinutes = Math.round((minValue + maxValue) / 2);

  const unit = match[3]?.toLowerCase();
  if (unit?.startsWith("sec")) {
    return `PT${avgMinutes}S`;
  }
  return `PT${avgMinutes}M`;
}

function mapDifficultyToLevel(difficulty: string): string {
  const mapping: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    elite: "Expert",
  };
  return mapping[difficulty.toLowerCase()] || "Beginner";
}

// ─────────────────────────────────────────────────────────────
// JSON-LD SCRIPT TAG GENERATOR
// ─────────────────────────────────────────────────────────────

export function generateJsonLdScript(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
