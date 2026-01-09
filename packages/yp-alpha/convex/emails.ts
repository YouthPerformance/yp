// ═══════════════════════════════════════════════════════════
// RESEND EMAIL SERVICE
// YP Wolf Pack Protocol - Email Lane Strategy
// ═══════════════════════════════════════════════════════════

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const RESEND_API_URL = "https://api.resend.com/emails";

// Email Lanes (From addresses)
const EMAIL_LANES = {
  security: {
    from: "YP Security <security@youthperformance.com>",
    replyTo: "support@youthperformance.com",
  },
  hq: {
    from: "YP HQ <hq@youthperformance.com>",
    replyTo: "support@youthperformance.com",
  },
  coach: {
    from: "Coach Wolf <wolf@youthperformance.com>",
    replyTo: "support@youthperformance.com",
  },
  pack: {
    from: "The Pack <pack@youthperformance.com>",
    replyTo: "support@youthperformance.com",
  },
} as const;

type EmailLane = keyof typeof EMAIL_LANES;

// ─────────────────────────────────────────────────────────────
// RESEND API HELPER
// ─────────────────────────────────────────────────────────────

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  lane?: EmailLane;
  tags?: Array<{ name: string; value: string }>;
}

async function sendEmail(params: SendEmailParams): Promise<{ id: string } | { error: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[EMAIL] RESEND_API_KEY not configured");
    return { error: "Email service not configured" };
  }

  const lane = EMAIL_LANES[params.lane || "hq"];

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: lane.from,
        reply_to: lane.replyTo,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
        tags: params.tags,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      console.error("[EMAIL] Resend error:", data);
      return { error: data.message || "Failed to send email" };
    }

    console.log(`[EMAIL] Sent to ${params.to}: ${params.subject}`);
    return { id: data.id || "" };
  } catch (error) {
    console.error("[EMAIL] Network error:", error);
    return { error: "Failed to connect to email service" };
  }
}

// ═══════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// GOLDEN TICKET EMAIL (Order Receipt + Claim Link)
// ─────────────────────────────────────────────────────────────

interface GoldenTicketEmailData {
  customerName?: string;
  productName: string;
  productSlug: string;
  claimUrl: string;
  orderNumber: string;
  expiresIn: string; // "72 hours"
}

function goldenTicketTemplate(data: GoldenTicketEmailData): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Training Pack is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: linear-gradient(180deg, #171717 0%, #0f0f0f 100%); border: 1px solid #262626; border-radius: 24px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <!-- YP Logo -->
              <div style="width: 56px; height: 56px; margin: 0 auto 24px; background: #171717; border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <img src="https://youthperformance.com/logo-cyan.png" alt="YP" width="32" height="32" style="display: block;">
              </div>
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #00f6e0;">
                Golden Ticket
              </p>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Your Training Pack<br>is Ready
              </h1>
            </td>
          </tr>

          <!-- Product Card -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #1a1a1a; border: 1px solid #333; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #737373;">
                      Order #${data.orderNumber}
                    </p>
                    <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #00f6e0;">
                      ${data.productName}
                    </h2>
                    <p style="margin: 0; font-size: 14px; color: #a3a3a3; line-height: 1.5;">
                      Forward this email to your athlete.<br>
                      They tap the button below to activate.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.claimUrl}" style="display: inline-block; padding: 16px 40px; background: #00f6e0; color: #0a0a0a; font-size: 14px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 100px; box-shadow: 0 14px 35px rgba(0, 246, 224, 0.3);">
                      ACTIVATE TRAINING
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry Warning -->
          <tr>
            <td style="padding: 8px 40px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #f59e0b; font-family: monospace;">
                Link expires in ${data.expiresIn}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: #262626;"></div>
            </td>
          </tr>

          <!-- How It Works -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #737373;">
                How It Works
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                    <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">1</span>
                    Forward this email to your athlete
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                    <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">2</span>
                    They tap "Activate Training" on their phone
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                    <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">3</span>
                    Create YP ID (one-tap, no password)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                    <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">4</span>
                    Training unlocked. Let's go.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center; background: #0f0f0f;">
              <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #ffffff;">
                Lock In. Level Up.
              </p>
              <p style="margin: 0; font-size: 12px; color: #525252;">
                Youth Performance
              </p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #404040;">
                <a href="https://youthperformance.com/privacy" style="color: #525252; text-decoration: none;">Privacy</a>
                &nbsp;&middot;&nbsp;
                <a href="https://youthperformance.com/terms" style="color: #525252; text-decoration: none;">Terms</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:support@youthperformance.com" style="color: #525252; text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const text = `
GOLDEN TICKET - Your Training Pack is Ready
============================================

Order #${data.orderNumber}
${data.productName}

Forward this email to your athlete. They tap the link below to activate.

ACTIVATE TRAINING:
${data.claimUrl}

Link expires in ${data.expiresIn}

---

HOW IT WORKS:
1. Forward this email to your athlete
2. They tap "Activate Training" on their phone
3. Create YP ID (one-tap, no password)
4. Training unlocked. Let's go.

---

Lock In. Level Up.
Youth Performance

Privacy: https://youthperformance.com/privacy
Terms: https://youthperformance.com/terms
Support: support@youthperformance.com
`;

  return { html, text };
}

// ═══════════════════════════════════════════════════════════
// EMAIL ACTIONS (Callable from mutations/other actions)
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Send Golden Ticket Email
// ─────────────────────────────────────────────────────────────

export const sendGoldenTicketEmail = internalAction({
  args: {
    to: v.string(),
    customerName: v.optional(v.string()),
    productName: v.string(),
    productSlug: v.string(),
    claimToken: v.string(),
    orderNumber: v.string(),
  },
  handler: async (_ctx, args) => {
    const claimUrl = `https://youthperformance.com/claim/${args.claimToken}`;

    const { html, text } = goldenTicketTemplate({
      customerName: args.customerName,
      productName: args.productName,
      productSlug: args.productSlug,
      claimUrl,
      orderNumber: args.orderNumber,
      expiresIn: "72 hours",
    });

    const result = await sendEmail({
      to: args.to,
      subject: `Your ${args.productName} is Ready to Activate`,
      html,
      text,
      lane: "hq",
      tags: [
        { name: "type", value: "golden-ticket" },
        { name: "product", value: args.productSlug },
        { name: "order", value: args.orderNumber },
      ],
    });

    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Send OTP Code Email (for auth)
// ─────────────────────────────────────────────────────────────

export const sendOTPEmail = internalAction({
  args: {
    to: v.string(),
    code: v.string(),
  },
  handler: async (_ctx, args) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 400px; background: #171717; border: 1px solid #262626; border-radius: 16px;">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <p style="margin: 0 0 24px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #00f6e0;">
                YP Security
              </p>
              <h1 style="margin: 0 0 24px; font-size: 48px; font-weight: 700; font-family: monospace; letter-spacing: 0.2em; color: #ffffff;">
                ${args.code}
              </h1>
              <p style="margin: 0 0 8px; font-size: 14px; color: #a3a3a3;">
                Enter this code to lock in.
              </p>
              <p style="margin: 0; font-size: 12px; color: #525252;">
                Expires in 10 minutes. Don't share this code.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const text = `Your YP Access Code: ${args.code}\n\nEnter this code to lock in. Expires in 10 minutes.\n\nDon't share this code.`;

    const result = await sendEmail({
      to: args.to,
      subject: `Your YP Access Code: ${args.code}`,
      html,
      text,
      lane: "security",
      tags: [{ name: "type", value: "otp" }],
    });

    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Send Welcome Email (after YP ID creation)
// ─────────────────────────────────────────────────────────────

export const sendWelcomeEmail = internalAction({
  args: {
    to: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: linear-gradient(180deg, #171717 0%, #0f0f0f 100%); border: 1px solid #262626; border-radius: 24px;">
          <tr>
            <td style="padding: 48px 40px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #00f6e0;">
                Welcome to the Pack
              </p>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff;">
                You're In, ${args.name}.
              </h1>
              <p style="margin: 0 0 32px; font-size: 15px; color: #a3a3a3; line-height: 1.6;">
                Your YP ID is locked in. Your training journey starts now.<br>
                No shortcuts. No excuses. Just work.
              </p>
              <a href="https://academy.youthperformance.com" style="display: inline-block; padding: 14px 32px; background: #00f6e0; color: #0a0a0a; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 100px;">
                START TRAINING
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; text-align: center; background: #0f0f0f; border-top: 1px solid #262626;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #ffffff;">
                Lock In. Level Up.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const text = `Welcome to the Pack, ${args.name}!\n\nYour YP ID is locked in. Your training journey starts now.\n\nNo shortcuts. No excuses. Just work.\n\nSTART TRAINING: https://academy.youthperformance.com\n\nLock In. Level Up.\nYouth Performance`;

    const result = await sendEmail({
      to: args.to,
      subject: `You're in the Pack, ${args.name}`,
      html,
      text,
      lane: "coach",
      tags: [{ name: "type", value: "welcome" }],
    });

    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// Test Email Action (for development)
// ─────────────────────────────────────────────────────────────

export const sendTestEmail = action({
  args: {
    to: v.string(),
    template: v.union(v.literal("golden-ticket"), v.literal("otp"), v.literal("welcome")),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx, args): Promise<any> => {
    if (args.template === "golden-ticket") {
      return await ctx.runAction(internal.emails.sendGoldenTicketEmail, {
        to: args.to,
        customerName: "Test Parent",
        productName: "Speed Pack",
        productSlug: "speed-pack",
        claimToken: "TEST123ABC",
        orderNumber: "YP-1001",
      });
    }

    if (args.template === "otp") {
      return await ctx.runAction(internal.emails.sendOTPEmail, {
        to: args.to,
        code: "420871",
      });
    }

    if (args.template === "welcome") {
      return await ctx.runAction(internal.emails.sendWelcomeEmail, {
        to: args.to,
        name: "Jake",
      });
    }
  },
});

// Import internal reference
import { internal } from "./_generated/api";
