/**
 * Publish all safe_autopublish drills using the new answerEngine mutation
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.CONVEX_URL || "https://impressive-lynx-636.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  console.log("📡 Connecting to:", CONVEX_URL);
  
  // Publish all safe_autopublish drills
  const result = await client.mutation(api.answerEngine.publishSafeAutopublish, {});
  console.log(`\n✅ Published ${result.published} of ${result.total} drills`);
  
  // Verify with searchDrills
  const publishedDrills = await client.query(api.answerEngine.searchDrills, { limit: 100 });
  console.log(`📊 Published drills now: ${publishedDrills.length}`);
  
  for (const drill of publishedDrills) {
    console.log(`  - ${drill.slug}: ${drill.title}`);
  }
}

main().catch(console.error);
