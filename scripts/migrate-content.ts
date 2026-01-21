/**
 * Answer Engine Content Migration
 *
 * Seeds content into the existing Convex tables:
 * - authors (E-E-A-T profiles)
 * - drills (from JSON files)
 *
 * Uses the root convex deployment (impressive-lynx-636)
 *
 * Usage:
 *   npx tsx scripts/migrate-content.ts
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const PLAYBOOK_ROOT = path.join(__dirname, "../apps/playbook/src/content");
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ||
  process.env.CONVEX_URL ||
  "https://impressive-lynx-636.convex.cloud";

console.log("📡 Connecting to Convex:", CONVEX_URL);

const client = new ConvexHttpClient(CONVEX_URL);

// Track author slug → Convex ID mapping
const authorIds: Record<string, Id<"authors">> = {};

// ─────────────────────────────────────────────────────────────
// MIGRATION FUNCTIONS
// ─────────────────────────────────────────────────────────────

async function migrateAuthors(): Promise<void> {
  console.log("\n🔄 Seeding authors...");

  // First check if authors already exist
  const existingAuthors = await client.query(api.authors.list, {});
  if (existingAuthors.length > 0) {
    console.log("  ⏭️  Authors already exist");
    for (const author of existingAuthors) {
      authorIds[author.slug] = author._id;
      console.log(`  📝 ${author.name} (${author.slug})`);
    }
    return;
  }

  // Seed individual authors
  try {
    await client.mutation(api.authors.seedJamesScott, {});
    console.log("  ✅ James Scott created");
  } catch (error: any) {
    console.log("  ⏭️  James Scott:", error.message?.includes("already exists") ? "exists" : error.message);
  }

  try {
    await client.mutation(api.authors.seedAdamHarrington, {});
    console.log("  ✅ Adam Harrington created");
  } catch (error: any) {
    console.log("  ⏭️  Adam Harrington:", error.message?.includes("already exists") ? "exists" : error.message);
  }

  // Fetch authors to get their IDs
  const authors = await client.query(api.authors.list, {});
  for (const author of authors) {
    authorIds[author.slug] = author._id;
  }
}

async function migrateDrills(): Promise<void> {
  console.log("\n🔄 Migrating drills...");

  const drillsDir = path.join(PLAYBOOK_ROOT, "drills");

  if (!fs.existsSync(drillsDir)) {
    console.log(`  ⚠️  Drills directory not found: ${drillsDir}`);
    return;
  }

  const files = fs.readdirSync(drillsDir).filter((f) => f.endsWith(".json"));
  console.log(`  📂 Found ${files.length} drill files`);

  // Get default author (James Scott for barefoot drills)
  const defaultAuthorId = authorIds["james-scott"] || Object.values(authorIds)[0];

  if (!defaultAuthorId) {
    console.log("  ⚠️  No authors found, skipping drill migration");
    return;
  }

  for (const file of files) {
    try {
      const content = JSON.parse(
        fs.readFileSync(path.join(drillsDir, file), "utf-8")
      );

      const slug = file.replace(".json", "");

      // Check if drill already exists
      const existing = await client.query(api.drills.getBySlug, { slug });
      if (existing) {
        console.log(`  ⏭️  ${slug} (already exists)`);
        continue;
      }

      // Map to Convex drill schema (matching required fields)
      const drillData = {
        // Core fields
        slug,
        title: content.title || slug.replace(/-/g, " "),
        goal: content.goal || content.description || "Build fundamental skills",

        // Taxonomy
        sport: content.sport || "basketball",
        skill: content.skill || content.category || "fundamentals",

        // Age band (required object with min, max, label)
        ageBand: {
          min: content.ageRange?.min || content.ageMin || 6,
          max: content.ageRange?.max || content.ageMax || 18,
          label: `${content.ageRange?.min || 6}-${content.ageRange?.max || 18}`,
        },

        // Metadata
        difficulty: content.difficulty || "beginner",
        difficultyScore: content.difficultyScore || 3,
        duration: content.duration || "5-10 min",
        constraints: content.constraints || [],
        equipment: content.equipment || [],
        environment: content.environment || ["indoor", "home"],

        // Content
        steps: (content.steps || []).map((step: any, i: number) => ({
          position: i + 1,
          instruction: typeof step === "string" ? step : (step.instruction || step.text || ""),
          coachingCues: step.coachingCues || (step.coachingCue ? [step.coachingCue] : []),
        })),

        // Safety (required fields)
        safetyNotes: content.safetyNotes || [],
        contraindications: content.contraindications || [],
        requiresSupervision: content.requiresSupervision ?? false,
        safetyLevel: "safe_autopublish" as const,

        // Attribution
        authorId: defaultAuthorId,

        // SEO
        tags: content.tags || [],
        keywords: content.keywords || [],
        directAnswer: content.directAnswer || content.description,
        faqItems: content.faqItems || [],
      };

      await client.mutation(api.drills.create, drillData);
      console.log(`  ✅ ${slug}`);
    } catch (error: any) {
      console.error(`  ❌ Failed to migrate ${file}:`, error.message?.substring(0, 200));
    }
  }
}

async function migrateQnA(): Promise<void> {
  console.log("\n🔄 Migrating QnA articles...");

  const qnaDir = path.join(__dirname, "../apps/playbook/src/content/parent-sidelines");

  if (!fs.existsSync(qnaDir)) {
    console.log(`  ⚠️  QnA directory not found: ${qnaDir}`);
    return;
  }

  const files = fs.readdirSync(qnaDir).filter((f) => f.endsWith(".mdx"));
  console.log(`  📂 Found ${files.length} QnA files`);

  // Map author names to IDs
  const authorNameToId: Record<string, Id<"authors">> = {};
  for (const [slug, id] of Object.entries(authorIds)) {
    if (slug === "james-scott") authorNameToId["James Scott"] = id;
    if (slug === "adam-harrington") authorNameToId["Adam Harrington"] = id;
  }

  for (const file of files) {
    try {
      const filePath = path.join(qnaDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content: body } = matter(content);

      const slug = file.replace(".mdx", "");

      // Check if QnA already exists
      const existing = await client.query(api.qna.getBySlug, { slug });
      if (existing) {
        console.log(`  ⏭️  ${slug} (already exists)`);
        continue;
      }

      // Find author ID
      const authorId = authorNameToId[frontmatter.author];
      if (!authorId) {
        console.log(`  ⚠️  Author not found for ${slug}: ${frontmatter.author}`);
        continue;
      }

      // Look up related drill IDs
      const relatedDrillIds: Id<"drills">[] = [];
      for (const drillSlug of (frontmatter.relatedDrills || [])) {
        const drill = await client.query(api.drills.getBySlug, { slug: drillSlug });
        if (drill) {
          relatedDrillIds.push(drill._id);
        }
      }

      // Determine intent from category
      const intentMap: Record<string, string> = {
        "skills-mechanics": "how_to",
        "health-safety": "informational",
        "training-hacks": "how_to",
        "injury-prevention": "informational",
      };

      // Extract sport from relatedPillar
      const sportFromPillar = frontmatter.relatedPillar?.replace(/\//g, "") || undefined;

      const qnaData = {
        question: frontmatter.question,
        slug,
        category: frontmatter.category,
        sport: sportFromPillar === "basketball" || sportFromPillar === "barefoot-training"
          ? sportFromPillar
          : undefined,
        intent: intentMap[frontmatter.category] || "informational",
        directAnswer: frontmatter.directAnswer,
        fullAnswer: body.trim(),
        sources: [
          {
            type: "expert",
            title: `${frontmatter.author}, ${frontmatter.expertTitle}`,
            url: undefined,
            quote: undefined,
          },
        ],
        keyTakeaways: frontmatter.keyTakeaways || [],
        safetyNote: frontmatter.safetyNote,
        disclaimer: undefined,
        authorId,
        relatedDrillIds,
        keywords: frontmatter.keywords || [],
        searchQueries: frontmatter.keywords || [],
      };

      await client.mutation(api.qna.create, qnaData);
      console.log(`  ✅ ${slug}`);
    } catch (error: any) {
      console.error(`  ❌ Failed to migrate ${file}:`, error.message?.substring(0, 200));
    }
  }
}

async function publishQnA(): Promise<void> {
  console.log("\n🔄 Publishing QnA articles...");

  const qnaDir = path.join(__dirname, "../apps/playbook/src/content/parent-sidelines");
  if (!fs.existsSync(qnaDir)) {
    console.log("  ⚠️  No QnA directory found");
    return;
  }

  const files = fs.readdirSync(qnaDir).filter((f) => f.endsWith(".mdx"));
  const slugs = files.map((f) => f.replace(".mdx", ""));

  let published = 0;
  for (const slug of slugs) {
    try {
      const qna = await client.query(api.qna.getBySlug, { slug });
      if (!qna) {
        console.log(`  ⚠️  QnA not found: ${slug}`);
        continue;
      }

      if (qna.status === "published") {
        console.log(`  ⏭️  Already published: ${slug}`);
        continue;
      }

      await client.mutation(api.qna.publish, { id: qna._id });
      console.log(`  ✅ Published: ${slug}`);
      published++;
    } catch (error: any) {
      console.log(`  ⚠️  Could not publish ${slug}: ${error.message?.substring(0, 100)}`);
    }
  }

  console.log(`  📊 Published ${published} QnA articles`);
}

async function publishDrills(): Promise<void> {
  console.log("\n🔄 Publishing drills...");

  const drillsDir = path.join(PLAYBOOK_ROOT, "drills");
  if (!fs.existsSync(drillsDir)) {
    console.log("  ⚠️  No drills directory found");
    return;
  }

  const files = fs.readdirSync(drillsDir).filter((f) => f.endsWith(".json"));
  const slugs = files.map((f) => f.replace(".json", ""));

  let published = 0;
  for (const slug of slugs) {
    try {
      const drill = await client.query(api.drills.getBySlug, { slug });
      if (!drill) {
        console.log(`  ⚠️  Drill not found: ${slug}`);
        continue;
      }

      if (drill.status === "published") {
        console.log(`  ⏭️  Already published: ${slug}`);
        continue;
      }

      await client.mutation(api.drills.publish, { id: drill._id });
      console.log(`  ✅ Published: ${slug}`);
      published++;
    } catch (error: any) {
      console.log(`  ⚠️  Could not publish ${slug}: ${error.message?.substring(0, 100)}`);
    }
  }

  console.log(`  📊 Published ${published} drills`);
}

async function printStats(): Promise<void> {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("📊 Migration Complete!\n");

  try {
    const authors = await client.query(api.authors.list, {});
    const drills = await client.query(api.drills.listPublished, { limit: 1000 });
    const qnas = await client.query(api.qna.listPublished, { limit: 1000 });

    console.log(`  📝 Authors: ${authors.length}`);
    console.log(`  🏃 Published Drills: ${drills.length}`);
    console.log(`  ❓ Published QnA: ${qnas.length}`);
  } catch (error: any) {
    console.error("  ⚠️  Could not fetch stats:", error.message);
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Answer Engine Content Migration");
  console.log("═══════════════════════════════════════════════════════════\n");

  await migrateAuthors();
  await migrateDrills();
  await publishDrills();
  await migrateQnA();
  await publishQnA();
  await printStats();
}

main().catch(console.error);
