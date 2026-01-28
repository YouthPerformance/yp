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

// ─────────────────────────────────────────────────────────────
// TOM CHIEF OF STAFF CRONS
// Morning briefings and knowledge sync
// ─────────────────────────────────────────────────────────────

/**
 * Tom morning briefing for Mike - 6am ET (11:00 UTC)
 */
crons.daily(
  "tom-morning-briefing-mike",
  { hourUTC: 11, minuteUTC: 0 },
  internal.tom.scheduleBriefing,
  { userId: "mike", briefingType: "morning" }
);

/**
 * Tom morning briefing for James - 6am ET (11:00 UTC)
 */
crons.daily(
  "tom-morning-briefing-james",
  { hourUTC: 11, minuteUTC: 0 },
  internal.tom.scheduleBriefing,
  { userId: "james", briefingType: "morning" }
);

/**
 * Tom morning briefing for Adam - 6am ET (11:00 UTC)
 */
crons.daily(
  "tom-morning-briefing-adam",
  { hourUTC: 11, minuteUTC: 0 },
  internal.tom.scheduleBriefing,
  { userId: "adam", briefingType: "morning" }
);

/**
 * Tom morning briefing for Annie - 6am ET (11:00 UTC)
 */
crons.daily(
  "tom-morning-briefing-annie",
  { hourUTC: 11, minuteUTC: 0 },
  internal.tom.scheduleBriefing,
  { userId: "annie", briefingType: "morning" }
);

/**
 * Tom daily knowledge sync - 4am ET (9:00 UTC)
 * Syncs Google Drive documents for all users
 */
crons.daily(
  "tom-knowledge-sync",
  { hourUTC: 9, minuteUTC: 0 },
  internal.tom.scheduleKnowledgeSync
);

export default crons;
