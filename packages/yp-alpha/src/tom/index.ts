/**
 * Tom Chief of Staff System
 * =========================
 *
 * AI-powered Chief of Staff for YP internal team.
 * Jarvis/Robbins/Lasso personality triad.
 *
 * @example
 * ```ts
 * import { buildTomSystemPrompt, getTomVoice } from "@yp/alpha/tom";
 *
 * const voice = getTomVoice("mike");
 * const prompt = buildTomSystemPrompt("mike", "Server is down!");
 * ```
 */

// Types
export * from "./types";

// Voice System
export {
  buildTomSystemPrompt,
  detectMode,
  getTomVoice,
  getAllTomVoices,
  tomVoices,
  EXAMPLE_OUTPUTS,
} from "./voice";

// WhatsApp
export {
  sendWhatsAppMessage,
  sendWhatsAppImage,
  formatBriefingForWhatsApp,
  formatTaskConfirmation,
  formatIdeaConfirmation,
  formatNoteConfirmation,
  verifyWebhookSignature,
} from "./whatsapp";

// Intent Classifier
export {
  classifyIntentFast,
  classifyIntentSmart,
  routeTomRequest,
  TomIntentSchema,
} from "./intent-classifier";
