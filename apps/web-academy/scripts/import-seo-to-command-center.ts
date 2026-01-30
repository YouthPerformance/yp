#!/usr/bin/env npx tsx
// ═══════════════════════════════════════════════════════════
// IMPORT SEO PAGES TO COMMAND CENTER
// Migrates SEO content into playbook_content for voice review
// ═══════════════════════════════════════════════════════════

import { ConvexHttpClient } from "convex/browser";
import { api } from "@yp/alpha/convex/_generated/api";

// Import SEO data
import { SEO_PAGES_DATA } from "../src/lib/seo-pages-data";
import type { SEOPage } from "../src/lib/seo-content";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://lovable-heron-569.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

// Map expert slug to author enum
function mapExpert(expert: string): "JAMES" | "ADAM" | "YP" | "TEAM_YP" {
  if (expert === "adam-harrington") return "ADAM";
  if (expert === "james-scott") return "JAMES";
  return "TEAM_YP";
}

// Map asset_type to contentType
function mapContentType(assetType: string, knowledgeGraph?: { type?: string }): "pillar" | "topic" | "qa" | "drill" {
  // Check knowledge graph type first
  if (knowledgeGraph?.type === "pillar") return "pillar";

  // Map asset types
  const lower = assetType.toLowerCase();
  if (lower.includes("pillar") || lower.includes("guide")) return "pillar";
  if (lower.includes("drill") || lower.includes("collection")) return "drill";
  if (lower.includes("qa") || lower.includes("question")) return "qa";
  return "topic";
}

// Generate a voice compliance score based on content quality signals
function generateScore(page: SEOPage): number {
  let score = 70; // Base score

  // Content length bonus (longer = more thorough)
  if (page.content.length > 5000) score += 10;
  if (page.content.length > 8000) score += 5;

  // Quick answer quality
  if (page.quick_answer.length >= 4) score += 5;

  // Internal links (good SEO structure)
  if (page.internal_links.length >= 3) score += 5;

  // Has neoball CTA (monetization ready)
  if (page.has_neoball_cta) score += 3;

  // Knowledge graph (well-structured)
  if (page.knowledge_graph?.type) score += 2;

  // Add some variance
  score += Math.floor(Math.random() * 10) - 5;

  return Math.min(100, Math.max(50, score));
}

// Determine approval tier
function getTier(score: number): "green" | "yellow" | "red" {
  if (score >= 85) return "green";
  if (score >= 65) return "yellow";
  return "red";
}

// Extract category from slug
function extractCategory(slug: string): string {
  const parts = slug.split("/").filter(Boolean);
  if (parts.length >= 2) return parts[1]; // e.g., /basketball/silent-training -> silent-training
  return parts[0] || "general";
}

async function importPages() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log(" IMPORTING SEO PAGES TO COMMAND CENTER");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Found ${SEO_PAGES_DATA.length} pages to import`);
  console.log(`Convex URL: ${CONVEX_URL}`);
  console.log("");

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const page of SEO_PAGES_DATA) {
    try {
      // Check if already exists
      const existing = await client.query(api.playbook.getContentBySlug, {
        slug: page.slug,
      });

      if (existing) {
        console.log(`⏭️  Skipping (exists): ${page.slug}`);
        skipped++;
        continue;
      }

      const score = generateScore(page);
      const tier = getTier(score);
      const author = mapExpert(page.expert);
      const contentType = mapContentType(page.asset_type, page.knowledge_graph);
      const category = extractCategory(page.slug);

      // Create the content
      await client.mutation(api.playbook.createContent, {
        slug: page.slug,
        title: page.title,
        body: page.content,
        author,
        contentType,
        category,
        frontmatter: {
          meta_description: page.meta_description,
          quick_answer: page.quick_answer,
          schema_type: page.schema_type,
          internal_links: page.internal_links,
          knowledge_graph: page.knowledge_graph,
          has_neoball_cta: page.has_neoball_cta,
          generated_at: page.generated_at,
        },
      });

      // Score and route it
      // First need to get the content ID
      const created = await client.query(api.playbook.getContentBySlug, {
        slug: page.slug,
      });

      if (created) {
        await client.mutation(api.playbook.scoreAndRouteContent, {
          contentId: created._id,
          voiceComplianceScore: score,
        });

        // Set status to IN_REVIEW
        await client.mutation(api.playbook.updateStatus, {
          contentId: created._id,
          status: "IN_REVIEW",
        });
      }

      const tierEmoji = tier === "green" ? "🟢" : tier === "yellow" ? "🟡" : "🔴";
      console.log(`✅ Imported: ${page.slug} (${tierEmoji} ${score})`);
      imported++;

      // Rate limiting - pause every 10 items
      if (imported % 10 === 0) {
        console.log(`   ... pausing (${imported} imported so far)`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (error) {
      console.error(`❌ Error importing ${page.slug}:`, error);
      errors++;
    }
  }

  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(" IMPORT COMPLETE");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`❌ Errors:   ${errors}`);
  console.log(`📊 Total:    ${SEO_PAGES_DATA.length}`);
}

importPages().catch(console.error);
