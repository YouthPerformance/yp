// ===================================================================
// WELCOME EMAIL ENDPOINT
// Triggered by BetterAuth onUserCreated hook
// ===================================================================

import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------
// POST: Send Welcome Email
// ---------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, name } = body;

    if (!to) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 });
    }

    const displayName = name || to.split("@")[0];

    // Build welcome email HTML
    const htmlContent = buildWelcomeEmail(displayName);
    const textContent = buildWelcomeText(displayName);

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Send via Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Coach Wolf <wolf@youthperformance.com>",
          to: [to],
          subject: `You're in the Pack, ${displayName}`,
          html: htmlContent,
          text: textContent,
          tags: [{ name: "type", value: "welcome" }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Email] Resend error:", error);
        // Log to console for dev fallback
        logWelcomeToConsole(to, displayName);
        return NextResponse.json({ success: true, fallback: true });
      }

      console.log("[Email] Welcome email sent to:", to);
      return NextResponse.json({ success: true });
    }

    // Development fallback - log to console
    logWelcomeToConsole(to, displayName);
    return NextResponse.json({ success: true, dev: true });
  } catch (error) {
    console.error("[Email] Error sending welcome email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------
// DEV FALLBACK: Log to console
// ---------------------------------------------------------------

function logWelcomeToConsole(to: string, name: string) {
  console.log("═══════════════════════════════════════════════════════");
  console.log("🐺 WOLF PACK WELCOME EMAIL");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`To: ${to}`);
  console.log(`Name: ${name}`);
  console.log(`Subject: You're in the Pack, ${name}`);
  console.log("═══════════════════════════════════════════════════════");
}

// ---------------------------------------------------------------
// BUILD WELCOME EMAIL HTML
// ---------------------------------------------------------------

function buildWelcomeEmail(name: string): string {
  return `
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

          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px 24px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">🐺</div>
              <p style="margin: 0 0 16px; font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #00f6e0;">
                Welcome to the Pack
              </p>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                You're In, ${name}.
              </h1>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <p style="margin: 0 0 24px; font-size: 15px; color: #a3a3a3; line-height: 1.6;">
                Your YP ID is locked in. Your training journey starts now.<br>
                No shortcuts. No excuses. Just work.
              </p>
              <a href="https://academy.youthperformance.com" style="display: inline-block; padding: 14px 32px; background: #00f6e0; color: #0a0a0a; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 100px;">
                START TRAINING
              </a>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 24px;">
                <p style="margin: 0 0 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #737373;">
                  What's Next
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                      <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">1</span>
                      Open the app and explore your dashboard
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                      <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">2</span>
                      Pick your first program
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #d4d4d4;">
                      <span style="display: inline-block; width: 24px; height: 24px; background: #262626; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #00f6e0; margin-right: 12px;">3</span>
                      Complete your first stack and earn XP
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center; background: #0f0f0f; border-top: 1px solid #262626;">
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
`.trim();
}

// ---------------------------------------------------------------
// BUILD WELCOME EMAIL TEXT
// ---------------------------------------------------------------

function buildWelcomeText(name: string): string {
  return `
WELCOME TO THE PACK

You're In, ${name}.

Your YP ID is locked in. Your training journey starts now.
No shortcuts. No excuses. Just work.

START TRAINING: https://academy.youthperformance.com

---

WHAT'S NEXT:
1. Open the app and explore your dashboard
2. Pick your first program
3. Complete your first stack and earn XP

---

Lock In. Level Up.
Youth Performance

Privacy: https://youthperformance.com/privacy
Terms: https://youthperformance.com/terms
Support: support@youthperformance.com
`.trim();
}
