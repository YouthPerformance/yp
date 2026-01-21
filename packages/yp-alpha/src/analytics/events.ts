/**
 * Essential Analytics Events
 *
 * Only track what matters for conversions.
 * Let PostHog autocapture handle everything else.
 */

// ============================================
// WAITLIST FUNNEL (neoball-lp)
// ============================================
export const WAITLIST_EVENTS = {
  /** User opened the waitlist signup modal */
  MODAL_OPENED: "waitlist_modal_opened",
  /** User successfully signed up for waitlist */
  SIGNUP_COMPLETED: "waitlist_signup_completed",
  /** User shared their referral link */
  REFERRAL_SHARED: "waitlist_referral_shared",
  /** User clicked referral link */
  REFERRAL_CLICKED: "waitlist_referral_clicked",
} as const;

// ============================================
// SHOP FUNNEL (shop)
// ============================================
export const SHOP_EVENTS = {
  /** User viewed a product detail page */
  PRODUCT_VIEWED: "product_viewed",
  /** User added item to cart */
  ADD_TO_CART: "add_to_cart",
  /** User started checkout flow */
  CHECKOUT_STARTED: "checkout_started",
  /** User completed purchase */
  PURCHASE: "purchase",
} as const;

// ============================================
// ACADEMY FUNNEL (web-academy)
// ============================================
export const ACADEMY_EVENTS = {
  /** User started onboarding flow */
  ONBOARDING_STARTED: "onboarding_started",
  /** User completed onboarding */
  ONBOARDING_COMPLETED: "onboarding_completed",
  /** User started a training module */
  MODULE_STARTED: "module_started",
  /** User completed a training module */
  MODULE_COMPLETED: "module_completed",
  /** User completed a daily stack */
  STACK_COMPLETED: "stack_completed",
} as const;

// ============================================
// CROSS-APP EVENTS
// ============================================
export const COMMON_EVENTS = {
  /** User signed up / created account */
  SIGNUP: "signup",
  /** User logged in */
  LOGIN: "login",
  /** User identified (for cross-device tracking) */
  IDENTIFY: "identify",
} as const;

// All events combined for type safety
export const YP_EVENTS = {
  ...WAITLIST_EVENTS,
  ...SHOP_EVENTS,
  ...ACADEMY_EVENTS,
  ...COMMON_EVENTS,
} as const;

export type YPEvent = (typeof YP_EVENTS)[keyof typeof YP_EVENTS];
