/**
 * Seed Tom Users
 * ==============
 *
 * Seeds the tom_users table with the four team members.
 * Run with: npx tsx scripts/seed-tom-users.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL not set");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

interface TomUser {
  userId: "mike" | "james" | "adam" | "annie";
  email: string;
  displayName: string;
  voiceProfileId: string;
  whatsappNumber?: string;
  preferences: {
    briefingTime: string;
    briefingTimezone: string;
    deliveryMethod: "email" | "whatsapp";
  };
}

const TEAM_MEMBERS: TomUser[] = [
  {
    userId: "mike",
    email: "mike@youthperformance.com",
    displayName: "Mike Di",
    voiceProfileId: "MIKE_COS",
    whatsappNumber: process.env.TOM_PHONE_MIKE,
    preferences: {
      briefingTime: "06:00",
      briefingTimezone: "America/New_York",
      deliveryMethod: "whatsapp",
    },
  },
  {
    userId: "james",
    email: "james@youthperformance.com",
    displayName: "James Scott",
    voiceProfileId: "JAMES_COS",
    whatsappNumber: process.env.TOM_PHONE_JAMES,
    preferences: {
      briefingTime: "06:00",
      briefingTimezone: "America/New_York",
      deliveryMethod: "whatsapp",
    },
  },
  {
    userId: "adam",
    email: "adam@youthperformance.com",
    displayName: "Adam Harrington",
    voiceProfileId: "ADAM_COS",
    whatsappNumber: process.env.TOM_PHONE_ADAM,
    preferences: {
      briefingTime: "06:00",
      briefingTimezone: "America/New_York",
      deliveryMethod: "whatsapp",
    },
  },
  {
    userId: "annie",
    email: "annie@youthperformance.com",
    displayName: "Annie",
    voiceProfileId: "ANNIE_COS",
    whatsappNumber: process.env.TOM_PHONE_ANNIE,
    preferences: {
      briefingTime: "06:00",
      briefingTimezone: "America/New_York",
      deliveryMethod: "whatsapp",
    },
  },
];

async function seedUsers() {
  console.log("Seeding Tom users...\n");

  for (const user of TEAM_MEMBERS) {
    try {
      const id = await convex.mutation(api.tom.upsertUser, user);
      console.log(`✅ ${user.displayName} (${user.userId}): ${id}`);
      if (!user.whatsappNumber) {
        console.log(`   ⚠️  No WhatsApp number set (TOM_PHONE_${user.userId.toUpperCase()})`);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${user.userId}:`, error);
    }
  }

  console.log("\n✨ Done!");
}

seedUsers().catch(console.error);
