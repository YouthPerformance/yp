/**
 * Analytics utility for YP Conversion Engine
 * Tracks key funnel events for optimization
 */

// Event names - keep consistent across app
export const EVENTS = {
  // Onboarding
  ONBOARDING_START: "onboarding_start",
  ONBOARDING_STEP: "onboarding_step",
  ONBOARDING_COMPLETE: "onboarding_complete",
  ONBOARDING_SKIP: "onboarding_skip",

  // Quiz
  QUIZ_START: "quiz_start",
  QUIZ_ANSWER: "quiz_answer",
  QUIZ_COMPLETE: "quiz_complete",

  // Email capture
  EMAIL_SUBMITTED: "email_submitted",
  EMAIL_SKIPPED: "email_skipped",

  // Lead magnet
  LEAD_MAGNET_VIEW: "lead_magnet_view",
  LEAD_MAGNET_SCROLL: "lead_magnet_scroll",
  LEAD_MAGNET_CTA_CLICK: "lead_magnet_cta_click",

  // Checkout
  CHECKOUT_START: "checkout_start",
  CHECKOUT_COMPLETE: "checkout_complete",
  CHECKOUT_ABANDONED: "checkout_abandoned",

  // Stack Runner
  STACK_RUN_START: "stack_run_start",
  STACK_RUN_COMPLETE: "stack_run_complete",
  STACK_RUN_EXIT: "stack_run_exit",

  // Lessons
  LESSON_START: "lesson_start",
  LESSON_PROGRESS: "lesson_progress",
  LESSON_COMPLETE: "lesson_complete",

  // Program
  PROGRAM_VIEW: "program_view",
  WEEK_UNLOCK: "week_unlock",

  // Upgrade
  UPGRADE_VIEW: "upgrade_view",
  UPGRADE_CTA_CLICK: "upgrade_cta_click",

  // General
  PAGE_VIEW: "page_view",
  CTA_CLICK: "cta_click",
  ERROR: "error",
};

// Get stored user properties
function getUserProperties() {
  try {
    const onboarding = JSON.parse(localStorage.getItem("yp_onboarding") || "{}");
    const userId = localStorage.getItem("yp_user_id");

    return {
      user_id: userId,
      role: onboarding.role,
      age_group: onboarding.age,
      sport: onboarding.sport,
      space: onboarding.space,
      pain: onboarding.pain,
      athlete_identity: localStorage.getItem("yp_athlete_identity"),
    };
  } catch {
    return {};
  }
}

// Get UTM parameters from URL or storage
function getUtmParams() {
  try {
    const stored = JSON.parse(localStorage.getItem("yp_utm") || "{}");
    return stored;
  } catch {
    return {};
  }
}

// Store UTM parameters from URL
export function captureUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };

  // Only store if we have at least one UTM param
  const hasUtm = Object.values(utm).some((v) => v);
  if (hasUtm) {
    localStorage.setItem("yp_utm", JSON.stringify(utm));
  }

  return utm;
}

// Generate or get user ID
export function getUserId() {
  let userId = localStorage.getItem("yp_user_id");
  if (!userId) {
    userId = `yp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("yp_user_id", userId);
  }
  return userId;
}

/**
 * Track an analytics event
 * @param {string} eventName - Event name from EVENTS constant
 * @param {object} properties - Event-specific properties
 */
export function track(eventName, properties = {}) {
  const userId = getUserId();
  const userProps = getUserProperties();
  const utmParams = getUtmParams();

  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer,
    ...userProps,
    ...utmParams,
    ...properties,
  };

  // Log in development
  if (import.meta.env.DEV) {
    console.log("[Analytics]", eventName, event);
  }

  // Send to analytics backends
  // Google Analytics 4
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, {
      ...properties,
      user_id: userId,
    });
  }

  // PostHog
  if (typeof posthog !== "undefined") {
    posthog.capture(eventName, event);
  }

  // Mixpanel
  if (typeof mixpanel !== "undefined") {
    mixpanel.track(eventName, event);
  }

  // Custom backend (Convex)
  // Will be implemented when Convex is set up
  // sendToConvex(event)

  return event;
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 */
export function trackPageView(pageName) {
  track(EVENTS.PAGE_VIEW, { page: pageName });
}

/**
 * Identify user with email
 * @param {string} email - User email
 * @param {object} traits - Additional user traits
 */
export function identify(email, traits = {}) {
  const userId = getUserId();

  if (import.meta.env.DEV) {
    console.log("[Analytics] Identify", email, traits);
  }

  // Google Analytics
  if (typeof gtag !== "undefined") {
    gtag("set", "user_properties", {
      email: email,
      ...traits,
    });
  }

  // PostHog
  if (typeof posthog !== "undefined") {
    posthog.identify(userId, { email, ...traits });
  }

  // Mixpanel
  if (typeof mixpanel !== "undefined") {
    mixpanel.identify(userId);
    mixpanel.people.set({ $email: email, ...traits });
  }

  // Store locally
  localStorage.setItem("yp_email", email);
}

/**
 * Track scroll depth
 * @param {number} percent - Scroll depth percentage
 * @param {string} page - Page name
 */
export function trackScroll(percent, page) {
  // Only track at 25%, 50%, 75%, 100%
  const milestones = [25, 50, 75, 100];
  const milestone = milestones.find((m) => percent >= m && percent < m + 10);

  if (milestone) {
    const key = `yp_scroll_${page}_${milestone}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "true");
      track(EVENTS.LEAD_MAGNET_SCROLL, {
        page,
        scroll_depth: milestone,
      });
    }
  }
}

/**
 * Track time on page
 * Call this when leaving a page
 * @param {string} page - Page name
 * @param {number} startTime - Time when page was loaded
 */
export function trackTimeOnPage(page, startTime) {
  const duration = Math.round((Date.now() - startTime) / 1000);
  track("time_on_page", { page, duration_seconds: duration });
}

// Export default tracker
export default {
  track,
  trackPageView,
  identify,
  trackScroll,
  trackTimeOnPage,
  captureUtmParams,
  getUserId,
  EVENTS,
};
