/**
 * Inngest API Route
 * =================
 *
 * Serves all Inngest workflows for the web-academy app.
 * Inngest will call this endpoint to execute workflow steps.
 */

import { serve } from "inngest/next";
import { inngest, allWorkflows } from "@yp/alpha/workflows";

// Create the Inngest serve handler with all workflows
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: allWorkflows,
});
