// ═══════════════════════════════════════════════════════════
// VIRAL WAITLIST SYSTEM
// NeoBall pre-launch waitlist with referral mechanics
// Robinhood/Monzo-style viral loop
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const SPOTS_PER_REFERRAL = 10;
const REFERRAL_CODE_LENGTH = 8;
const SOURCE = "neoball-waitlist";

// Position tier thresholds for hooper copy
const POSITION_TIERS = {
  STARTER: 10, // #1-10
  SIXTH_MAN: 50, // #11-50
  ROTATION: 100, // #51-100
  ROSTER: 500, // #101-500
  // #501+ = "In the Gym"
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 to avoid confusion
  let code = "";
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function calculateEffectivePosition(basePosition: number, referralCount: number): number {
  const effectivePosition = basePosition - referralCount * SPOTS_PER_REFERRAL;
  return Math.max(1, effectivePosition); // Can't go below 1
}

function getPositionTier(position: number): {
  tier: string;
  label: string;
  emoji: string;
} {
  if (position <= POSITION_TIERS.STARTER) {
    return { tier: "starter", label: "Starter", emoji: "🏆" };
  }
  if (position <= POSITION_TIERS.SIXTH_MAN) {
    return { tier: "sixth_man", label: "Sixth Man", emoji: "🔥" };
  }
  if (position <= POSITION_TIERS.ROTATION) {
    return { tier: "rotation", label: "Rotation Player", emoji: "💪" };
  }
  if (position <= POSITION_TIERS.ROSTER) {
    return { tier: "roster", label: "On the Roster", emoji: "📋" };
  }
  return { tier: "gym", label: "In the Gym", emoji: "🏀" };
}

function anonymizeEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

// ─────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Join the waitlist
 * - If email exists, return existing entry with position
 * - If new, create entry with referral code
 * - If referrer code provided, credit the referrer
 */
export const joinWaitlist = mutation({
  args: {
    email: v.string(),
    size: v.union(v.literal("6"), v.literal("7")),
    referrerCode: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Return existing position (status lookup)
      const effectivePosition = calculateEffectivePosition(
        existing.basePosition,
        existing.referralCount,
      );
      const tier = getPositionTier(effectivePosition);

      return {
        success: true,
        isExisting: true,
        entryId: existing._id,
        email: existing.email,
        size: existing.size,
        referralCode: existing.referralCode,
        basePosition: existing.basePosition,
        effectivePosition,
        referralCount: existing.referralCount,
        tier,
      };
    }

    // Get next base position
    const latestEntry = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_base_position")
      .order("desc")
      .first();

    const basePosition = latestEntry ? latestEntry.basePosition + 1 : 1;

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", referralCode))
      .first();

    // Keep generating until unique
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await ctx.db
        .query("waitlistEntries")
        .withIndex("by_referral_code", (q) => q.eq("referralCode", referralCode))
        .first();
    }

    // Validate referrer code if provided
    let referredBy: string | undefined;
    if (args.referrerCode) {
      const referrer = await ctx.db
        .query("waitlistEntries")
        .withIndex("by_referral_code", (q) =>
          q.eq("referralCode", args.referrerCode!.toUpperCase()),
        )
        .first();

      if (referrer) {
        referredBy = referrer.referralCode;

        // Credit the referrer
        await ctx.db.patch(referrer._id, {
          referralCount: referrer.referralCount + 1,
        });
      }
    }

    // Create new entry
    const entryId = await ctx.db.insert("waitlistEntries", {
      email,
      size: args.size,
      referralCode,
      referredBy,
      referralCount: 0,
      basePosition,
      source: SOURCE,
      joinedAt: Date.now(),
      metadata: args.metadata,
    });

    const effectivePosition = calculateEffectivePosition(basePosition, 0);
    const tier = getPositionTier(effectivePosition);

    // Schedule confirmation email (internal action)
    await ctx.scheduler.runAfter(0, internal.waitlist.sendConfirmationEmail, {
      entryId,
      email,
      referralCode,
      effectivePosition,
    });

    return {
      success: true,
      isExisting: false,
      entryId,
      email,
      size: args.size,
      referralCode,
      basePosition,
      effectivePosition,
      referralCount: 0,
      tier,
      referredBy,
    };
  },
});

/**
 * Internal mutation to mark confirmation email as sent
 */
export const markConfirmationSent = internalMutation({
  args: {
    entryId: v.id("waitlistEntries"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.entryId, {
      confirmationSentAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────

/**
 * Get waitlist position by email
 */
export const getPosition = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const entry = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!entry) {
      return null;
    }

    const effectivePosition = calculateEffectivePosition(entry.basePosition, entry.referralCount);
    const tier = getPositionTier(effectivePosition);

    return {
      entryId: entry._id,
      email: entry.email,
      size: entry.size,
      referralCode: entry.referralCode,
      basePosition: entry.basePosition,
      effectivePosition,
      referralCount: entry.referralCount,
      tier,
      joinedAt: entry.joinedAt,
    };
  },
});

/**
 * Get waitlist position by referral code
 */
export const getPositionByCode = query({
  args: {
    referralCode: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", args.referralCode.toUpperCase()))
      .first();

    if (!entry) {
      return null;
    }

    const effectivePosition = calculateEffectivePosition(entry.basePosition, entry.referralCount);
    const tier = getPositionTier(effectivePosition);

    return {
      entryId: entry._id,
      email: anonymizeEmail(entry.email),
      size: entry.size,
      referralCode: entry.referralCode,
      effectivePosition,
      referralCount: entry.referralCount,
      tier,
    };
  },
});

/**
 * Get leaderboard (top referrers)
 */
export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    // Get all entries sorted by referral count
    const entries = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_referral_count")
      .order("desc")
      .take(100); // Get top 100 to filter

    // Filter to those with at least 1 referral
    const topReferrers = entries.filter((e) => e.referralCount > 0).slice(0, limit);

    // Basketball position labels for top 5
    const positions = ["PG", "SG", "SF", "PF", "C"];

    return topReferrers.map((entry, index) => {
      const effectivePosition = calculateEffectivePosition(entry.basePosition, entry.referralCount);
      const tier = getPositionTier(effectivePosition);

      return {
        rank: index + 1,
        position: positions[index] ?? null, // Basketball position for top 5
        anonymizedEmail: anonymizeEmail(entry.email),
        referralCount: entry.referralCount,
        effectivePosition,
        tier,
      };
    });
  },
});

/**
 * Get total waitlist count
 */
export const getTotalCount = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlistEntries").collect();
    return entries.length;
  },
});

/**
 * Get recent signups count (last N hours)
 */
export const getRecentSignups = query({
  args: {
    hours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const hours = args.hours ?? 1;
    const cutoff = Date.now() - hours * 60 * 60 * 1000;

    const entries = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_joined")
      .filter((q) => q.gte(q.field("joinedAt"), cutoff))
      .collect();

    return entries.length;
  },
});

/**
 * Get waitlist stats for homepage display
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allEntries = await ctx.db.query("waitlistEntries").collect();
    const totalCount = allEntries.length;

    // Recent signups (last hour)
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const recentSignups = allEntries.filter((e) => e.joinedAt >= hourAgo).length;

    // Top referrer count
    const topReferrer = allEntries.reduce(
      (max, e) => (e.referralCount > max ? e.referralCount : max),
      0,
    );

    return {
      totalCount,
      recentSignups,
      topReferrerCount: topReferrer,
    };
  },
});

// ─────────────────────────────────────────────────────────────
// INTERNAL ACTIONS (Email)
// ─────────────────────────────────────────────────────────────

import { internalAction } from "./_generated/server";

/**
 * Send confirmation email with referral link
 */
export const sendConfirmationEmail = internalAction({
  args: {
    entryId: v.id("waitlistEntries"),
    email: v.string(),
    referralCode: v.string(),
    effectivePosition: v.number(),
  },
  handler: async (ctx, args) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("[Waitlist] RESEND_API_KEY not configured");
      return;
    }

    const tier = getPositionTier(args.effectivePosition);
    const referralLink = `https://neoball.com/w/${args.referralCode}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="color: #00f6e0; font-size: 32px; margin: 0; letter-spacing: 4px;">NEOBALL</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">

              <!-- Success Message -->
              <h2 style="color: #39ff14; font-size: 28px; text-align: center; margin: 0 0 10px 0; letter-spacing: 2px;">
                NOTHING BUT NET 🏀
              </h2>
              <p style="color: #ffffff; text-align: center; font-size: 16px; margin: 0 0 30px 0;">
                You're on the waitlist.
              </p>

              <!-- Position Display -->
              <div style="background: rgba(0,246,224,0.1); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
                <p style="color: #00f6e0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">
                  Your Position
                </p>
                <p style="color: #ffffff; font-size: 48px; font-weight: bold; margin: 0;">
                  #${args.effectivePosition}
                </p>
                <p style="color: #888888; font-size: 14px; margin: 8px 0 0 0;">
                  ${tier.emoji} ${tier.label}
                </p>
              </div>

              <!-- Referral Section -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px;">
                <h3 style="color: #ff1493; font-size: 18px; text-align: center; margin: 0 0 10px 0; letter-spacing: 1px;">
                  PASS THE ROCK
                </h3>
                <p style="color: #888888; font-size: 14px; text-align: center; margin: 0 0 20px 0;">
                  Each friend you refer = +10 spots up the list
                </p>

                <!-- Referral Link Box -->
                <div style="background: #0a0a0a; border: 1px solid #00f6e0; border-radius: 8px; padding: 16px; text-align: center;">
                  <a href="${referralLink}" style="color: #00f6e0; font-family: monospace; font-size: 14px; text-decoration: none; word-break: break-all;">
                    ${referralLink}
                  </a>
                </div>

                <p style="color: #888888; font-size: 12px; text-align: center; margin: 16px 0 0 0;">
                  Share this link with your squad
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding-top: 30px;">
              <p style="color: #666666; font-size: 12px; margin: 0;">
                You're receiving this because you joined the NeoBall waitlist.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0;">
                © ${new Date().getFullYear()} YouthPerformance. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NeoBall <neoball@youthperformance.com>",
          to: args.email,
          subject: `You're #${args.effectivePosition} on the NeoBall waitlist 🏀`,
          html: emailHtml,
          tags: [
            { name: "type", value: "waitlist-confirmation" },
            { name: "source", value: "neoball" },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Waitlist] Email send failed:", error);
        return;
      }

      // Mark as sent
      await ctx.runMutation(internal.waitlist.markConfirmationSent, {
        entryId: args.entryId,
      });

      console.log("[Waitlist] Confirmation email sent to:", args.email);
    } catch (error) {
      console.error("[Waitlist] Email error:", error);
    }
  },
});
