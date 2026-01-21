// ═══════════════════════════════════════════════════════════
// CONVEX CRON JOBS
// Scheduled background tasks
// ═══════════════════════════════════════════════════════════

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ─────────────────────────────────────────────────────────────
// WOLF CONTRACT CRONS
// ─────────────────────────────────────────────────────────────

/**
 * Check for expired contracts - Daily at 00:00 UTC
 * Marks contracts past their 42-day window as "failed"
 */
crons.daily(
  "check-expired-contracts",
  { hourUTC: 0, minuteUTC: 0 },
  internal.contracts.checkExpiredContracts
);

/**
 * Expire stale reservations - Every 5 minutes
 * Cleans up reservations that passed the 15-min window
 */
crons.interval(
  "expire-reservations",
  { minutes: 5 },
  internal.contracts.expireReservations
);

/**
 * Send weekly progress emails - Sunday at 14:00 UTC (10am ET)
 * Parents receive contract status updates
 */
crons.weekly(
  "send-weekly-progress-emails",
  { dayOfWeek: "sunday", hourUTC: 14, minuteUTC: 0 },
  internal.contracts.sendWeeklyProgressEmails
);

export default crons;
