// ===================================================================
// CONVEX APP CONFIGURATION
// BetterAuth component registration for auth infrastructure
// ===================================================================

import betterAuth from "@convex-dev/better-auth/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

// Register BetterAuth component
// This creates the auth tables: users, sessions, accounts, verifications
app.use(betterAuth);

export default app;
