#!/usr/bin/env npx tsx
/**
 * Seed YPSEO Convex database with gaps from machine-sprint output
 * Run: cd tools/ypseo && npx tsx scripts/seed-gaps.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs/promises";
import path from "path";

const CONVEX_URL = "https://wandering-wren-102.convex.cloud";

async function main() {
  console.log("🐺 YPSEO Gap Seeder\n");

  // Load gaps from machine-sprint output
  const gapsPath = path.join(__dirname, "../../machine-sprint/output/gaps/gaps.json");

  let gapsData;
  try {
    const content = await fs.readFile(gapsPath, "utf-8");
    gapsData = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to read gaps file: ${gapsPath}`);
    console.error("   Run 'pnpm machine:mine' first to generate gaps");
    process.exit(1);
  }

  console.log(`📊 Found ${gapsData.total_gaps} gaps from ${gapsData.generated_at}`);
  console.log(`   Clusters: ${Object.keys(gapsData.by_cluster).join(", ")}\n`);

  // Connect to Convex
  const client = new ConvexHttpClient(CONVEX_URL);

  // Import gaps
  console.log("📤 Importing gaps to Convex...");

  const result = await client.mutation(api.seoGaps.bulkImportGaps, {
    gaps: gapsData.gaps,
  });

  console.log(`\n✅ Import complete!`);
  console.log(`   Created: ${result.created}`);
  console.log(`   Updated: ${result.updated}`);
  console.log(`   Total: ${result.total}`);

  // Log the action
  await client.mutation(api.agentFs.logAction, {
    agentId: "seed-script",
    action: "gaps_seeded",
    domain: "seo",
    message: `Seeded ${result.total} gaps from machine-sprint`,
    data: {
      created: result.created,
      updated: result.updated,
      source: gapsPath,
      generatedAt: gapsData.generated_at,
    },
    level: "info",
  });

  console.log("\n📊 View in dashboard:");
  console.log("   https://dashboard.convex.dev/t/longevitymike/ypseo/wandering-wren-102/data");
}

main().catch(console.error);
