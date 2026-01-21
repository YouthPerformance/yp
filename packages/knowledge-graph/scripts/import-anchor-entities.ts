#!/usr/bin/env npx ts-node
/**
 * Import Anchor Entities v2 - Enterprise Edition
 *
 * Seeds the database with the 13 Foundation Hubs:
 *
 * JAMES SCOTT (Performance Director) - 9 Hubs:
 * 1. Youth Strength Training Safety & Progression
 * 2. Youth Speed & Agility Blueprint
 * 3. The Barefoot Reset Method
 * 4. Jumping & Plyometric Progressions for Youth
 * 5. Youth Injury Prevention & Warm-Up System
 * 6. Training Load & Overuse Prevention
 * 7. Recovery Essentials for Young Athletes
 * 8. Youth Performance Testing & Benchmarks
 * 9. Sports Nutrition for Youth Athletes
 *
 * ADAM HARRINGTON (Skill Director) - 4 Hubs:
 * 10. Youth Basketball Skills Lab
 * 11. Shooting Mechanics Fix System
 * 12. Silent Basketball Training System
 * 13. Girls Basketball Training Blueprint
 *
 * Usage:
 *   export CONVEX_URL="https://your-project.convex.cloud"
 *   npx ts-node scripts/import-anchor-entities.ts
 *   npx ts-node scripts/import-anchor-entities.ts --execute
 *   npx ts-node scripts/import-anchor-entities.ts --hub=strength-training --execute
 */

import {
  ANCHOR_ENTITIES,
  getAllAnchors,
  getAllSpokes,
  getTotalEntityCount,
  AUTHORS,
  type AnchorEntity,
} from "../data/anchor-entities";

// =============================================================================
// CONFIGURATION
// =============================================================================

// Dynamic imports for Convex - only loaded when needed
let client: any = null;

async function initConvex(): Promise<any> {
  const CONVEX_URL = process.env.CONVEX_URL || "";
  if (!CONVEX_URL) {
    console.log("   ⚠️  CONVEX_URL not set - running in dry-run mode");
    return null;
  }

  try {
    // Use require to avoid TypeScript static analysis of missing modules
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ConvexHttpClient } = require("convex/browser");
    client = new ConvexHttpClient(CONVEX_URL);
    return client;
  } catch (error) {
    console.log("   ⚠️  Convex not initialized - running in dry-run mode");
    return null;
  }
}

function getApi() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("../convex/_generated/api").api;
  } catch {
    return null;
  }
}

// =============================================================================
// IMPORT FUNCTIONS
// =============================================================================

/**
 * Create author profiles
 */
async function importAuthors(): Promise<void> {
  console.log("\n👤 Importing Authors...");
  const api = getApi();

  if (!client || !api) {
    console.log("   [DRY RUN] Would create James Scott");
    console.log("   [DRY RUN] Would create Adam Harrington");
    return;
  }

  try {
    await client.mutation(api.mutations.createAuthor, {
      slug: "james",
      name: AUTHORS.james.name,
      credentials: AUTHORS.james.credentials,
      specialty: "Youth Athletic Development & Injury Prevention",
      bio: "Performance Director specializing in youth athletic development, movement foundations, and injury prevention. 15+ years working with young athletes.",
      voiceProfile: {
        tone: AUTHORS.james.tone,
        vocabulary: ["evidence-based", "age-appropriate", "progressive", "foundational"],
        avoid: AUTHORS.james.avoid,
        speechPatterns: [
          "Research shows...",
          "The key is...",
          "What we see in youth athletes...",
        ],
        signaturePhrases: [
          "Build the foundation first",
          "Progress based on competency, not age",
          "Safety is the priority",
        ],
      },
    });
    console.log("   ✅ Created: James Scott");
  } catch (error) {
    console.log("   ⚠️  James Scott already exists or error");
  }

  try {
    await client.mutation(api.mutations.createAuthor, {
      slug: "adam",
      name: AUTHORS.adam.name,
      credentials: AUTHORS.adam.credentials,
      specialty: "Basketball Skill Development",
      bio: "NBA Skills Coach with 20+ years developing basketball players at all levels. Known for systematic approach to shooting mechanics and skill acquisition.",
      voiceProfile: {
        tone: AUTHORS.adam.tone,
        vocabulary: ["release point", "form", "repetition", "mechanics", "muscle memory"],
        avoid: AUTHORS.adam.avoid,
        speechPatterns: [
          "Here's what I tell my NBA guys:",
          "The key is...",
          "Film yourself. Every. Session.",
        ],
        signaturePhrases: [
          "Reps don't lie",
          "Your body remembers what you repeat",
          "Quality over quantity",
        ],
      },
    });
    console.log("   ✅ Created: Adam Harrington");
  } catch (error) {
    console.log("   ⚠️  Adam Harrington already exists or error");
  }
}

/**
 * Import a hub as a guide
 */
async function importHub(hub: AnchorEntity): Promise<void> {
  console.log(`\n📁 Importing Hub: ${hub.title}`);
  const api = getApi();

  if (!client || !api) {
    console.log(`   [DRY RUN] Would create guide: ${hub.slug}`);
    console.log(`   [DRY RUN] Would create ${hub.spokes.length} spokes`);
    return;
  }

  try {
    // Create the main hub guide
    await client.mutation(api.mutations.createGuide, {
      slug: hub.slug,
      title: hub.title,
      sport: hub.category === "skill" ? "basketball" : "general",
      skill: hub.slug,
      content: `# ${hub.title}\n\n${hub.directAnswer}\n\n## Overview\n\n${hub.overview}`,
      excerpt: hub.directAnswer,
      author: hub.author,
      tags: [...hub.secondaryKeywords.slice(0, 5), hub.category],
      safetyLevel: hub.riskLevel === "low" ? "safe_autopublish" : "requires_human_review",
    });
    console.log(`   ✅ Hub guide created: ${hub.slug}`);
  } catch (error) {
    console.log(`   ⚠️  Hub guide error: ${hub.slug}`);
  }

  // Create Q&A entries from the directAnswer
  try {
    // Create a "What is X?" Q&A
    await client.mutation(api.mutations.createQnA, {
      question: `What is ${hub.title.toLowerCase()}?`,
      answer: hub.directAnswer,
      category: hub.category,
      tags: [hub.slug, ...hub.secondaryKeywords.slice(0, 3)],
      author: hub.author,
      safetyLevel: "safe_autopublish",
    });
    console.log(`   ✅ Q&A created: What is ${hub.slug}?`);
  } catch (error) {
    console.log(`   ⚠️  Q&A error for ${hub.slug}`);
  }
}

/**
 * Import spokes under a hub
 */
async function importSpokes(hub: AnchorEntity): Promise<void> {
  const api = getApi();
  if (!client || !api) {
    return;
  }

  for (const spoke of hub.spokes) {
    try {
      if (spoke.pageType === "drill" || spoke.pageType === "progression") {
        await client.mutation(api.mutations.createDrill, {
          slug: spoke.slug,
          name: spoke.title,
          sport: hub.category === "skill" ? "basketball" : "general",
          skill: hub.slug,
          difficulty: "beginner",
          ageRange: { min: 8, max: 18 },
          purpose: `Part of the ${hub.title} system`,
          athleticBenefit: `Improves ${spoke.primaryKeyword}`,
          equipment: [],
          duration: "10-15 minutes",
          steps: ["Step 1: Warm up", "Step 2: Practice", "Step 3: Review"],
          coachingCues: [],
          commonMistakes: [],
          author: hub.author,
          safetyLevel: spoke.riskLevel === "low" ? "safe_autopublish" : "requires_human_review",
        });
        console.log(`   ✅ Drill created: ${spoke.slug}`);
      } else if (spoke.pageType === "faq") {
        await client.mutation(api.mutations.createQnA, {
          question: spoke.title.endsWith("?") ? spoke.title : `${spoke.title}?`,
          answer: `[Content for ${spoke.primaryKeyword}]`,
          category: hub.category,
          tags: [hub.slug, spoke.primaryKeyword],
          author: hub.author,
          safetyLevel: "safe_autopublish",
        });
        console.log(`   ✅ Q&A created: ${spoke.slug}`);
      } else if (spoke.pageType === "checklist" || spoke.pageType === "plan") {
        await client.mutation(api.mutations.createGuide, {
          slug: spoke.slug,
          title: spoke.title,
          sport: hub.category === "skill" ? "basketball" : "general",
          skill: hub.slug,
          content: `# ${spoke.title}\n\n[Content for ${spoke.primaryKeyword}]`,
          excerpt: `Guide to ${spoke.primaryKeyword}`,
          author: hub.author,
          tags: [hub.slug, spoke.primaryKeyword],
          safetyLevel: "safe_autopublish",
        });
        console.log(`   ✅ Guide created: ${spoke.slug}`);
      } else if (spoke.pageType === "test") {
        await client.mutation(api.mutations.createGuide, {
          slug: spoke.slug,
          title: spoke.title,
          sport: "general",
          skill: "testing",
          content: `# ${spoke.title}\n\n[Test protocol for ${spoke.primaryKeyword}]`,
          excerpt: `How to test ${spoke.primaryKeyword}`,
          author: hub.author,
          tags: ["testing", spoke.primaryKeyword],
          safetyLevel: "safe_autopublish",
        });
        console.log(`   ✅ Test guide created: ${spoke.slug}`);
      } else if (spoke.pageType === "injury_guide") {
        await client.mutation(api.mutations.createGuide, {
          slug: spoke.slug,
          title: spoke.title,
          sport: "general",
          skill: "injury-prevention",
          content: `# ${spoke.title}\n\n**Disclaimer:** This is educational content only. Consult a healthcare provider for diagnosis and treatment.\n\n[Content for ${spoke.primaryKeyword}]`,
          excerpt: `Educational guide about ${spoke.primaryKeyword}`,
          author: hub.author,
          tags: ["injury-guide", spoke.primaryKeyword],
          safetyLevel: "requires_human_review",
        });
        console.log(`   ✅ Injury guide created: ${spoke.slug}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Spoke error: ${spoke.slug}`);
    }
  }
}

// =============================================================================
// REPORTING
// =============================================================================

function printImportPlan(): void {
  const hubs = getAllAnchors();
  const counts = getTotalEntityCount();

  console.log("\n" + "═".repeat(70));
  console.log("📋 Import Plan - Enterprise Edition");
  console.log("═".repeat(70));

  console.log("\n👤 Authors to Create:");
  console.log(`   • ${AUTHORS.james.name} (${AUTHORS.james.role})`);
  console.log(`   • ${AUTHORS.adam.name} (${AUTHORS.adam.role})`);

  console.log("\n📁 Hubs to Create (13 Foundation Hubs):");

  // James's hubs
  console.log("\n   JAMES SCOTT (Performance Director):");
  const jamesHubs = hubs.filter((h) => h.author === "james");
  for (const hub of jamesHubs) {
    console.log(`   ${hub.riskLevel === "medium" ? "⚠️" : "✅"} ${hub.title}`);
    console.log(`      └─ ${hub.spokes.length} spokes | ${hub.primaryKeyword}`);
  }

  // Adam's hubs
  console.log("\n   ADAM HARRINGTON (Skill Director):");
  const adamHubs = hubs.filter((h) => h.author === "adam");
  for (const hub of adamHubs) {
    console.log(`   ✅ ${hub.title}`);
    console.log(`      └─ ${hub.spokes.length} spokes | ${hub.primaryKeyword}`);
  }

  // Editorial hubs
  const editorialHubs = hubs.filter((h) => h.author === "editorial");
  if (editorialHubs.length > 0) {
    console.log("\n   EDITORIAL (with James review):");
    for (const hub of editorialHubs) {
      console.log(`   ✅ ${hub.title}`);
      console.log(`      └─ ${hub.spokes.length} spokes | ${hub.primaryKeyword}`);
    }
  }

  console.log("\n" + "═".repeat(70));
  console.log("📊 Summary:");
  console.log(`   Hubs: ${counts.anchors}`);
  console.log(`   Spokes: ${counts.spokes}`);
  console.log(`   Total Entities: ${counts.total}`);
  console.log("═".repeat(70));
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("🏛️  Anchor Entity Import v2 - Enterprise Edition");
  console.log("═".repeat(70));

  const args = process.argv.slice(2);
  const dryRun = !args.includes("--execute");
  const hubArg = args.find((a) => a.startsWith("--hub="));
  const hubFilter = hubArg?.split("=")[1];

  // Show plan
  printImportPlan();

  if (dryRun) {
    console.log("\n⚠️  DRY RUN MODE - no data will be written");
    console.log("   Use --execute to import entities");
    console.log("   Use --hub=slug to import a specific hub");
    console.log("\nExamples:");
    console.log("   npx ts-node scripts/import-anchor-entities.ts --execute");
    console.log("   npx ts-node scripts/import-anchor-entities.ts --hub=strength-training --execute");
    return;
  }

  // Initialize Convex when executing
  client = await initConvex();

  if (!client) {
    console.log("\n❌ Could not connect to Convex. Please ensure:");
    console.log("   1. CONVEX_URL is set: export CONVEX_URL=\"https://your-project.convex.cloud\"");
    console.log("   2. Convex is deployed: cd packages/knowledge-graph && npx convex deploy");
    return;
  }

  // Filter hubs if specified
  let hubs = getAllAnchors();
  if (hubFilter) {
    hubs = hubs.filter((h) => h.slug === hubFilter);
    if (hubs.length === 0) {
      console.log(`\n❌ Hub not found: ${hubFilter}`);
      return;
    }
    console.log(`\n🔍 Importing single hub: ${hubFilter}`);
  }

  // Import authors first
  await importAuthors();

  // Import each hub
  for (const hub of hubs) {
    await importHub(hub);
    await importSpokes(hub);
  }

  console.log("\n" + "═".repeat(70));
  console.log("✅ Import Complete!");
  console.log("═".repeat(70));

  console.log("\n📊 Next Steps:");
  console.log("   1. Generate entity matrix: npx ts-node scripts/generate-entity-matrix.ts --execute");
  console.log("   2. Run content pipeline: npx ts-node scripts/content-pipeline.ts --stage=queued");
  console.log("   3. Monitor AI citations: npx ts-node scripts/monitor-ai-citations.ts");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
