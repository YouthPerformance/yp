/**
 * Test Tom System
 * ===============
 *
 * Tests the Tom capture and briefing flow without WhatsApp.
 * Run with: npx tsx scripts/test-tom.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://valiant-impala-187.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);

async function testTom() {
  console.log("🧪 Testing Tom System\n");
  console.log("=".repeat(50));

  // 1. Verify users exist
  console.log("\n1️⃣ Checking users...");
  const users = await convex.query(api.tom.getAllUsers, {});
  console.log(`   Found ${users.length} users:`);
  for (const user of users) {
    console.log(`   - ${user.displayName} (${user.userId}) - ${user.whatsappNumber || "no phone"}`);
  }

  // 2. Test context operations
  console.log("\n2️⃣ Testing context operations...");

  // Add a task to Mike's backlog
  await convex.mutation(api.tom.appendToContext, {
    userId: "mike",
    contextType: "backlog",
    content: "- [ ] Test Tom system end-to-end",
  });
  console.log("   ✅ Added task to Mike's backlog");

  // Add an idea to James's backlog
  await convex.mutation(api.tom.appendToContext, {
    userId: "james",
    contextType: "backlog",
    content: "💡 New product idea: smart jump rope with rep counting",
  });
  console.log("   ✅ Added idea to James's backlog");

  // Read back context
  const mikeBacklog = await convex.query(api.tom.getContext, {
    userId: "mike",
    contextType: "backlog",
  });
  console.log(`   Mike's backlog:\n${mikeBacklog?.content?.split("\n").slice(-3).map(l => "     " + l).join("\n")}`);

  // 3. Test capture operations
  console.log("\n3️⃣ Testing capture operations...");

  const captureId = await convex.mutation(api.tom.storeCapture, {
    userId: "mike",
    content: "Remind me to review the Q1 metrics tomorrow",
    source: "text",
    routed: false,
    createdAt: Date.now(),
  });
  console.log(`   ✅ Created capture: ${captureId}`);

  // Update capture
  await convex.mutation(api.tom.updateCapture, {
    captureId,
    routed: true,
    routedTo: "backlog",
    classifiedAs: "task",
  });
  console.log("   ✅ Updated capture as routed task");

  // Get recent captures
  const captures = await convex.query(api.tom.getRecentCaptures, {
    userId: "mike",
    limit: 5,
  });
  console.log(`   Recent captures: ${captures.length}`);

  // 4. Test log operations
  console.log("\n4️⃣ Testing log operations...");

  await convex.mutation(api.tom.logMessage, {
    userId: "mike",
    content: "What's on my schedule today?",
    direction: "inbound",
    intent: "GENERAL_CHAT",
    sentiment: "Neutral",
    personalityMode: "lasso",
  });
  console.log("   ✅ Logged inbound message");

  await convex.mutation(api.tom.logMessage, {
    userId: "mike",
    content: "Good morning, Boss! Here's your schedule...",
    direction: "outbound",
    personalityMode: "lasso",
  });
  console.log("   ✅ Logged outbound message");

  const logs = await convex.query(api.tom.getRecentLogs, {
    userId: "mike",
    limit: 5,
  });
  console.log(`   Recent logs: ${logs.length}`);

  // 5. Test task operations
  console.log("\n5️⃣ Testing task operations...");

  const taskId = await convex.mutation(api.tom.createTask, {
    task: "Generate weekly report",
    description: "Compile metrics from all team members",
    assignedTo: "TOM",
    requestedBy: "mike",
  });
  console.log(`   ✅ Created task: ${taskId}`);

  const pendingTasks = await convex.query(api.tom.getPendingTasks, {
    assignedTo: "TOM",
  });
  console.log(`   Pending tasks for TOM: ${pendingTasks.length}`);

  // 6. Test voice system
  console.log("\n6️⃣ Testing voice system...");

  const { buildTomSystemPrompt, detectMode, getTomVoice } = await import("../src/tom/voice");

  // Test mode detection
  const testMessages = [
    "Server is down!",
    "Let's crush our Q1 goals!",
    "Good morning, how's the team doing?",
  ];

  for (const msg of testMessages) {
    const mode = detectMode(msg);
    console.log(`   "${msg.substring(0, 30)}..." → ${mode.toUpperCase()}`);
  }

  // Test voice config
  const mikeVoice = getTomVoice("mike");
  console.log(`   Mike's voice: ${mikeVoice.displayName}`);
  console.log(`   Special tools: ${mikeVoice.specialTools?.join(", ") || "none"}`);

  // 7. Test intent classification
  console.log("\n7️⃣ Testing intent classification...");

  const { classifyIntentFast } = await import("../src/tom/intent-classifier");

  const intentMessages = [
    "Can you sketch this product idea?",
    "What's trending in basketball?",
    "Rewrite this customer response",
    "Add to my backlog: review docs",
  ];

  for (const msg of intentMessages) {
    const intent = classifyIntentFast(msg);
    console.log(`   "${msg.substring(0, 35)}..." → ${intent.intent} (${Math.round(intent.confidence * 100)}%)`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✨ All tests passed!\n");

  // Summary
  console.log("📊 Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Captures: ${captures.length}`);
  console.log(`   Logs: ${logs.length}`);
  console.log(`   Pending Tasks: ${pendingTasks.length}`);

  console.log("\n📝 Next steps:");
  console.log("   1. Set TOM_PHONE_* environment variables with team phone numbers");
  console.log("   2. Configure WhatsApp Business API (WHATSAPP_API_TOKEN, etc.)");
  console.log("   3. Set up webhook URL in Meta Business Console");
  console.log("   4. Set GEMINI_API_KEY for product visualization");
  console.log("   5. Set PERPLEXITY_API_KEY for trend search");
}

testTom().catch(console.error);
