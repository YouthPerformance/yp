// ===================================================================
// EMAIL OTP SENDING ENDPOINT
// Fire-and-forget OTP email delivery via Resend
// ===================================================================

import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------
// POST: Send OTP Email
// ---------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, otp, type } = body;

    if (!to || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build email content
    const htmlContent = buildOTPEmail(otp, type);

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
          from: process.env.EMAIL_FROM || "Wolf Pack <noreply@youthperformance.com>",
          to: [to],
          subject: subject || "Your Wolf Pack Code",
          html: htmlContent,
          text: `Your Wolf Pack code is: ${otp}. This code expires in 10 minutes.`,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Email] Resend error:", error);
        // Fall back to console logging for development
        console.log("═══════════════════════════════════════════════════════");
        console.log("🐺 WOLF PACK OTP CODE (Resend failed - dev fallback)");
        console.log("═══════════════════════════════════════════════════════");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Type: ${type}`);
        console.log(`OTP: ${otp}`);
        console.log("═══════════════════════════════════════════════════════");
        // Still return success so auth flow continues
        return NextResponse.json({ success: true });
      }

      console.log("[Email] OTP sent successfully to:", to);
    } else {
      // Development fallback - log to console
      console.log("═══════════════════════════════════════════════════════");
      console.log("🐺 WOLF PACK OTP CODE");
      console.log("═══════════════════════════════════════════════════════");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Type: ${type}`);
      console.log(`OTP: ${otp}`);
      console.log("═══════════════════════════════════════════════════════");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Email] Error sending OTP:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------
// BUILD OTP EMAIL HTML
// ---------------------------------------------------------------

function buildOTPEmail(otp: string, type: string): string {
  const action =
    type === "sign-in"
      ? "sign in to"
      : type === "email-verification"
        ? "verify your email for"
        : "reset your password for";

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
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 420px; background-color: #141414; border-radius: 16px; border: 1px solid #262626;">
          <tr>
            <td style="padding: 40px 32px; text-align: center;">
              <!-- Logo -->
              <div style="font-size: 48px; margin-bottom: 16px;">🐺</div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.05em;">
                WOLF PACK ACADEMY
              </h1>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 32px 0;">
                Your code to ${action} Wolf Pack Academy
              </p>

              <!-- OTP Code -->
              <div style="background-color: #1c1c1c; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #00F6E0;">
                <p style="color: #00F6E0; font-size: 36px; font-weight: 700; letter-spacing: 0.3em; margin: 0; font-family: 'Monaco', 'Menlo', monospace;">
                  ${otp}
                </p>
              </div>

              <p style="color: #71717a; font-size: 13px; margin: 0;">
                This code expires in <strong style="color: #a1a1aa;">10 minutes</strong>
              </p>
              <p style="color: #52525b; font-size: 12px; margin: 16px 0 0 0;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center; border-top: 1px solid #262626;">
              <p style="color: #52525b; font-size: 11px; margin: 24px 0 0 0;">
                Youth Performance, Inc.<br>
                Elite training for every kid, everywhere.
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
