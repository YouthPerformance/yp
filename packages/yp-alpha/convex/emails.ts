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
              <a href="https://app.youthperformance.com" style="display: inline-block; padding: 14px 32px; background: #00f6e0; color: #0a0a0a; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 100px;">
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

    const text = `Welcome to the Pack, ${args.name}!\n\nYour YP ID is locked in. Your training journey starts now.\n\nNo shortcuts. No excuses. Just work.\n\nSTART TRAINING: https://app.youthperformance.com\n\nLock In. Level Up.\nYouth Performance`;

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
// Send Bulletproof Ankles PDF (Lead Magnet)
// ─────────────────────────────────────────────────────────────

export const sendBulletproofAnklesPDF = internalAction({
  args: {
    to: v.string(),
  },
  handler: async (_ctx, args) => {
    const pdfUrl = "https://youthperformance.com/pdf/bulletproof-ankles-guide.pdf";
    const playbookUrl = "https://app.youthperformance.com/playbook/bulletproof-ankles";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Eyebrow -->
          <tr>
            <td style="padding: 0 0 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #00f6e0;">
                LOCK IN. LEVEL UP.
              </p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding: 0 0 16px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Your Bulletproof Ankles Guide
              </h1>
            </td>
          </tr>

          <!-- Subhead -->
          <tr>
            <td style="padding: 0 0 32px; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #888888; line-height: 1.6;">
                The same protocol used by elite prospects.<br>No fluff. Just results.
              </p>
            </td>
          </tr>

          <!-- PDF Download Button -->
          <tr>
            <td style="padding: 0 0 24px; text-align: center;">
              <a href="${pdfUrl}" style="display: inline-block; background: #00f6e0; color: #000; font-weight: 700; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; letter-spacing: 0.05em;">
                DOWNLOAD PDF →
              </a>
            </td>
          </tr>

          <!-- Playbook Access Card -->
          <tr>
            <td style="padding: 32px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #111; border: 1px solid #222; border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #ffffff;">
                      🎮 Unlock Interactive Training
                    </h2>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #888; line-height: 1.6;">
                      Go deeper with our Playbook Stack Cards. Swipe through drills, test your knowledge, earn XP.
                    </p>
                    <a href="${playbookUrl}" style="font-size: 14px; font-weight: 600; color: #00f6e0; text-decoration: none;">
                      Start the Module →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 0 0; text-align: center; border-top: 1px solid #222;">
              <p style="margin: 24px 0 0; font-size: 12px; color: #444;">
                YouthPerformance — Elite training for every kid, everywhere.
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

    const text = `LOCK IN. LEVEL UP.

Your Bulletproof Ankles Guide

The same protocol used by elite prospects. No fluff. Just results.

DOWNLOAD PDF: ${pdfUrl}

---

UNLOCK INTERACTIVE TRAINING:
Go deeper with our Playbook Stack Cards. Swipe through drills, test your knowledge, earn XP.
Start the Module: ${playbookUrl}

---

YouthPerformance — Elite training for every kid, everywhere.`;

    const result = await sendEmail({
      to: args.to,
      subject: "🔒 Your Bulletproof Ankles Guide",
      html,
      text,
      lane: "coach",
      tags: [
        { name: "type", value: "lead-magnet" },
        { name: "content", value: "bulletproof-ankles-pdf" },
      ],
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

// ═══════════════════════════════════════════════════════════
// WOLF CONTRACT EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Contract Signed - Sent to parent after athlete signs
// ─────────────────────────────────────────────────────────────

function contractSignedTemplate(
  athleteName: string,
  expiresAt: number
): { html: string; text: string } {
  const expiryDate = new Date(expiresAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 28px; margin: 0; color: #00E5FF; letter-spacing: 2px;">WOLF CONTRACT SIGNED</h1>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <p style="margin: 0 0 16px; color: #888;">Hey there,</p>
      <p style="margin: 0 0 16px; font-size: 18px;"><strong style="color: #00E5FF;">${athleteName}</strong> just signed the Wolf Contract.</p>
      <p style="margin: 0 0 16px; color: #888;">The challenge:</p>
      <ul style="margin: 0 0 16px; padding-left: 20px; color: #ccc;">
        <li style="margin-bottom: 8px;"><strong>30 training levels</strong></li>
        <li style="margin-bottom: 8px;"><strong>42 days</strong> to complete</li>
        <li><strong>$88 NeoBall credit</strong> on completion</li>
      </ul>
      <p style="margin: 0; color: #888;">Contract expires: <strong style="color: #fff;">${expiryDate}</strong></p>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; color: #00E5FF;">YOUR ROLE</h3>
      <p style="margin: 0; color: #888;">Check in weekly. Ask about their training. The Pack respects parents who hold athletes accountable.</p>
    </div>

    <p style="text-align: center; color: #666; font-size: 12px;">
      Youth Performance · Building springs, not pistons.
    </p>
  </div>
</body>
</html>
`;

  const text = `
WOLF CONTRACT SIGNED

${athleteName} just signed the Wolf Contract.

The challenge:
- 30 training levels
- 42 days to complete
- $88 NeoBall credit on completion

Contract expires: ${expiryDate}

YOUR ROLE
Check in weekly. Ask about their training. The Pack respects parents who hold athletes accountable.

---
Youth Performance · Building springs, not pistons.
`;

  return { html, text };
}

export const sendContractSignedEmail = internalAction({
  args: {
    to: v.string(),
    athleteName: v.string(),
    expiresAt: v.number(),
  },
  handler: async (_ctx, args) => {
    const { html, text } = contractSignedTemplate(args.athleteName, args.expiresAt);
    return sendEmail({
      to: args.to,
      subject: `🐺 ${args.athleteName} joined the Wolf Pack`,
      html,
      text,
      lane: "pack",
      tags: [
        { name: "type", value: "contract-signed" },
        { name: "athlete", value: args.athleteName },
      ],
    });
  },
});

// ─────────────────────────────────────────────────────────────
// Weekly Progress - Sent to parent every Sunday
// ─────────────────────────────────────────────────────────────

function weeklyProgressTemplate(
  athleteName: string,
  levelsCompleted: number,
  levelsRequired: number,
  daysRemaining: number,
  isOnTrack: boolean
): { html: string; text: string } {
  const progressPercent = Math.round((levelsCompleted / levelsRequired) * 100);
  const statusColor = isOnTrack ? "#4CAF50" : "#FF9800";
  const statusText = isOnTrack ? "ON TRACK" : "NEEDS TO CATCH UP";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 28px; margin: 0; color: #00E5FF; letter-spacing: 2px;">WEEKLY UPDATE</h1>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; background: ${statusColor}20; color: ${statusColor};">${statusText}</span>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 48px; font-weight: bold; color: #00E5FF;">${levelsCompleted}</div>
        <div style="color: #888;">of ${levelsRequired} levels completed</div>
      </div>

      <div style="background: #333; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
        <div style="background: #00E5FF; height: 100%; width: ${progressPercent}%;"></div>
      </div>

      <p style="margin: 0; text-align: center; color: #888;">
        <strong style="color: #fff;">${daysRemaining} days</strong> remaining
      </p>
    </div>

    ${!isOnTrack ? `
    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #FF9800;">
      <h3 style="margin: 0 0 12px; color: #FF9800;">💬 CONVERSATION STARTER</h3>
      <p style="margin: 0; color: #ccc;">"Hey, I noticed you're a bit behind on your Wolf Contract. What's getting in the way? Let's figure it out together."</p>
    </div>
    ` : `
    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #4CAF50;">
      <h3 style="margin: 0 0 12px; color: #4CAF50;">🔥 KEEP THE MOMENTUM</h3>
      <p style="margin: 0; color: #ccc;">${athleteName} is crushing it. A quick "proud of you" goes a long way.</p>
    </div>
    `}

    <p style="text-align: center; color: #666; font-size: 12px;">
      Youth Performance · Building springs, not pistons.
    </p>
  </div>
</body>
</html>
`;

  const text = `
WEEKLY UPDATE - ${athleteName}

Status: ${statusText}

${levelsCompleted} of ${levelsRequired} levels completed (${progressPercent}%)
${daysRemaining} days remaining

${!isOnTrack
    ? `CONVERSATION STARTER
"Hey, I noticed you're a bit behind on your Wolf Contract. What's getting in the way? Let's figure it out together."`
    : `KEEP THE MOMENTUM
${athleteName} is crushing it. A quick "proud of you" goes a long way.`
  }

---
Youth Performance · Building springs, not pistons.
`;

  return { html, text };
}

export const sendWeeklyProgressEmail = internalAction({
  args: {
    to: v.string(),
    athleteName: v.string(),
    levelsCompleted: v.number(),
    levelsRequired: v.number(),
    daysRemaining: v.number(),
    isOnTrack: v.boolean(),
  },
  handler: async (_ctx, args) => {
    const { html, text } = weeklyProgressTemplate(
      args.athleteName,
      args.levelsCompleted,
      args.levelsRequired,
      args.daysRemaining,
      args.isOnTrack
    );
    return sendEmail({
      to: args.to,
      subject: `📊 ${args.athleteName}'s Weekly Contract Update: ${args.levelsCompleted}/${args.levelsRequired}`,
      html,
      text,
      lane: "pack",
      tags: [
        { name: "type", value: "weekly-progress" },
        { name: "athlete", value: args.athleteName },
      ],
    });
  },
});

// ─────────────────────────────────────────────────────────────
// Contract Complete - Sent to parent with credit code
// ─────────────────────────────────────────────────────────────

function contractCompleteTemplate(
  athleteName: string,
  creditCode: string,
  creditExpiresAt: number
): { html: string; text: string } {
  const expiryDate = new Date(creditExpiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
      <h1 style="font-size: 28px; margin: 0; color: #FFD700; letter-spacing: 2px;">CONTRACT COMPLETE</h1>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <p style="margin: 0 0 16px; font-size: 18px; text-align: center;">
        <strong style="color: #00E5FF;">${athleteName}</strong> did it.
      </p>
      <p style="margin: 0; color: #888; text-align: center;">
        30 levels. No shortcuts. They earned their credit.
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #00E5FF20 0%, #FFD70020 100%); border: 2px solid #00E5FF; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px; color: #888; font-size: 12px;">$88 NEOBALL CREDIT CODE</p>
      <div style="font-family: monospace; font-size: 28px; letter-spacing: 4px; color: #00E5FF; margin-bottom: 8px;">
        ${creditCode}
      </div>
      <p style="margin: 0; color: #666; font-size: 12px;">
        Valid until ${expiryDate}
      </p>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; color: #00E5FF;">HOW TO REDEEM</h3>
      <ol style="margin: 0; padding-left: 20px; color: #ccc;">
        <li style="margin-bottom: 8px;">Visit neoball.io/shop</li>
        <li style="margin-bottom: 8px;">Add items to cart</li>
        <li>Enter code at checkout</li>
      </ol>
    </div>

    <p style="text-align: center; color: #666; font-size: 12px;">
      Youth Performance · Building springs, not pistons.
    </p>
  </div>
</body>
</html>
`;

  const text = `
🏆 CONTRACT COMPLETE

${athleteName} did it.

30 levels. No shortcuts. They earned their credit.

$88 NEOBALL CREDIT CODE
${creditCode}
Valid until ${expiryDate}

HOW TO REDEEM
1. Visit neoball.io/shop
2. Add items to cart
3. Enter code at checkout

---
Youth Performance · Building springs, not pistons.
`;

  return { html, text };
}

export const sendContractCompleteEmail = internalAction({
  args: {
    to: v.string(),
    athleteName: v.string(),
    creditCode: v.string(),
    creditExpiresAt: v.number(),
  },
  handler: async (_ctx, args) => {
    const { html, text } = contractCompleteTemplate(
      args.athleteName,
      args.creditCode,
      args.creditExpiresAt
    );
    return sendEmail({
      to: args.to,
      subject: `🏆 ${args.athleteName} completed the Wolf Contract!`,
      html,
      text,
      lane: "pack",
      tags: [
        { name: "type", value: "contract-complete" },
        { name: "athlete", value: args.athleteName },
      ],
    });
  },
});

// ─────────────────────────────────────────────────────────────
// Contract Failed - Sent to parent when contract expires
// ─────────────────────────────────────────────────────────────

function contractFailedTemplate(
  athleteName: string,
  levelsCompleted: number,
  levelsRequired: number
): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 28px; margin: 0; color: #888; letter-spacing: 2px;">CONTRACT EXPIRED</h1>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <p style="margin: 0 0 16px; color: #888;">
        ${athleteName}'s Wolf Contract has expired.
      </p>
      <p style="margin: 0 0 16px;">
        <strong style="color: #fff;">${levelsCompleted}</strong> of <strong>${levelsRequired}</strong> levels completed.
      </p>
      <p style="margin: 0; color: #888;">
        The $88 credit wasn't earned. But every level they completed still counts — the training is theirs forever.
      </p>
    </div>

    <div style="background: #1a1a1a; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px; color: #00E5FF;">WHAT NOW?</h3>
      <p style="margin: 0; color: #ccc;">
        The Pack is still here. ${athleteName} can continue training anytime — they just won't earn the credit this round.
      </p>
    </div>

    <p style="text-align: center; color: #666; font-size: 12px;">
      Youth Performance · Building springs, not pistons.
    </p>
  </div>
</body>
</html>
`;

  const text = `
CONTRACT EXPIRED

${athleteName}'s Wolf Contract has expired.

${levelsCompleted} of ${levelsRequired} levels completed.

The $88 credit wasn't earned. But every level they completed still counts — the training is theirs forever.

WHAT NOW?
The Pack is still here. ${athleteName} can continue training anytime — they just won't earn the credit this round.

---
Youth Performance · Building springs, not pistons.
`;

  return { html, text };
}

export const sendContractFailedEmail = internalAction({
  args: {
    to: v.string(),
    athleteName: v.string(),
    levelsCompleted: v.number(),
    levelsRequired: v.number(),
  },
  handler: async (_ctx, args) => {
    const { html, text } = contractFailedTemplate(
      args.athleteName,
      args.levelsCompleted,
      args.levelsRequired
    );
    return sendEmail({
      to: args.to,
      subject: `Wolf Contract expired - ${args.athleteName}`,
      html,
      text,
      lane: "pack",
      tags: [
        { name: "type", value: "contract-failed" },
        { name: "athlete", value: args.athleteName },
      ],
    });
  },
});
