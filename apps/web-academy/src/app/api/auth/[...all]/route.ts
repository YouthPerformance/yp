// ===================================================================
// BETTERAUTH API ROUTE HANDLER
// Handles all /api/auth/* requests
// ===================================================================

import { auth } from "@yp/alpha/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export GET and POST handlers for BetterAuth
export const { GET, POST } = toNextJsHandler(auth);
