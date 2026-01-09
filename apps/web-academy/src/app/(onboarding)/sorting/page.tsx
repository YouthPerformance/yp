// ═══════════════════════════════════════════════════════════
// SORTING GATE
// Routes to voice or legacy sorting based on feature flag
// ═══════════════════════════════════════════════════════════

import { redirect } from "next/navigation";
import { getAuthUserId } from "@/lib/auth-server";
import { isVoiceSortingEnabled } from "@/lib/flags";

export default async function SortingGatePage() {
  const userId = await getAuthUserId();

  // Check feature flag with user-based rollout
  const useVoice = await isVoiceSortingEnabled(userId ?? undefined);

  if (useVoice) {
    redirect("/voice-sorting");
  } else {
    // Fall back to legacy flow (avatar selection)
    redirect("/avatar");
  }
}
