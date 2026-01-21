/**
 * Generate Embeddings for Answer Engine Content
 *
 * Creates vector embeddings for drills using OpenAI text-embedding-3-small.
 * Embeddings enable semantic search in the Answer Engine API.
 *
 * Usage:
 *   npx tsx scripts/generate-embeddings.ts
 *
 * Requires:
 *   OPENAI_API_KEY environment variable
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  process.env.CONVEX_URL ||
  "https://impressive-lynx-636.convex.cloud";

console.log("📡 Connecting to Convex:", CONVEX_URL);

const client = new ConvexHttpClient(CONVEX_URL);

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Answer Engine: Generate Embeddings");
  console.log("═══════════════════════════════════════════════════════════\n");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  let totalProcessed = 0;
  let totalFailed = 0;

  // Backfill drill embeddings
  console.log("🔄 Backfilling drill embeddings...\n");
  try {
    const drillResult = await client.action(api.embeddings.backfillDrillEmbeddings, {});
    console.log(`\n  ✅ Drills Processed: ${drillResult.processed}`);
    console.log(`  ❌ Drills Failed: ${drillResult.failed}`);
    totalProcessed += drillResult.processed;
    totalFailed += drillResult.failed;
  } catch (error: any) {
    console.error("❌ Drill backfill failed:", error.message);
  }

  // Backfill QnA embeddings
  console.log("\n🔄 Backfilling QnA embeddings...\n");
  try {
    const qnaResult = await client.action(api.embeddings.backfillQnAEmbeddings, {});
    console.log(`\n  ✅ QnA Processed: ${qnaResult.processed}`);
    console.log(`  ❌ QnA Failed: ${qnaResult.failed}`);
    totalProcessed += qnaResult.processed;
    totalFailed += qnaResult.failed;
  } catch (error: any) {
    console.error("❌ QnA backfill failed:", error.message);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("📊 Embedding Generation Complete!\n");
  console.log(`  ✅ Total Processed: ${totalProcessed}`);
  console.log(`  ❌ Total Failed: ${totalFailed}`);
}

main().catch(console.error);
