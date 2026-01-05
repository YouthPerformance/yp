/**
 * YP Shop Analytics - PostHog Implementation
 *
 * Comprehensive event tracking for fast-growing DTC startup
 * Covers: Ecommerce funnel, User behavior, Performance, Growth metrics
 *
 * PostHog Key: phc_lcgYo2g4YNIqVcK1d75227vPTROVvlbVBaj9rBxnfvJ
 */

import posthog from 'posthog-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const POSTHOG_KEY = 'phc_lcgYo2g4YNIqVcK1d75227vPTROVvlbVBaj9rBxnfvJ';
const POSTHOG_HOST = 'https://us.i.posthog.com'; // or eu.i.posthog.com for EU

/**
 * PostHog configuration optimized for ecommerce
 */
const POSTHOG_CONFIG = {
  api_host: POSTHOG_HOST,
  // Capture performance data
  capture_performance: true,
  // Enable session recording for UX insights
  enable_recording_console_log: true,
  // Respect Do Not Track
  respect_dnt: true,
  // Mask sensitive data in recordings
  mask_all_text: false,
  mask_all_element_attributes: false,
  // Autocapture settings
  autocapture: {
    dom_event_allowlist: ['click', 'submit', 'change'],
    element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
    css_selector_allowlist: ['[data-ph-capture]'],
  },
  // Session recording config
  session_recording: {
    maskAllInputs: false,
    maskInputOptions: {
      password: true,
      email: false,
    },
  },
  // Persist across sessions
  persistence: 'localStorage+cookie',
  // Bootstrap with feature flags
  bootstrap: {
    featureFlags: {},
  },
  // Disable in development (optional)
  loaded: (posthog: any) => {
    if (process.env.NODE_ENV === 'development') {
      // Enable debug mode in dev
      posthog.debug();
    }
  },
};

// ============================================================================
// EVENT TAXONOMY - The Single Source of Truth
// ============================================================================

/**
 * Event names following PostHog best practices:
 * - snake_case for consistency
 * - Verb + noun pattern
 * - Grouped by funnel stage
 */
export const ANALYTICS_EVENTS = {
  // ─────────────────────────────────────────────────────────────────────────
  // ACQUISITION - How users find us
  // ─────────────────────────────────────────────────────────────────────────
  PAGE_VIEWED: 'page_viewed',
  LANDING_PAGE_VIEWED: 'landing_page_viewed',
  UTM_CAPTURED: 'utm_captured',

  // ─────────────────────────────────────────────────────────────────────────
  // ENGAGEMENT - Product discovery
  // ─────────────────────────────────────────────────────────────────────────
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_LIST_VIEWED: 'product_list_viewed',
  COLLECTION_VIEWED: 'collection_viewed',
  PRODUCT_CLICKED: 'product_clicked',
  PRODUCT_SEARCHED: 'product_searched',
  VARIANT_SELECTED: 'variant_selected',

  // ─────────────────────────────────────────────────────────────────────────
  // CONVERSION - Cart & Checkout
  // ─────────────────────────────────────────────────────────────────────────
  CART_VIEWED: 'cart_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
  CART_QUANTITY_UPDATED: 'cart_quantity_updated',
  DISCOUNT_CODE_APPLIED: 'discount_code_applied',
  DISCOUNT_CODE_REMOVED: 'discount_code_removed',
  CHECKOUT_STARTED: 'checkout_started',

  // ─────────────────────────────────────────────────────────────────────────
  // REVENUE - Purchase completed (sent from webhook ideally)
  // ─────────────────────────────────────────────────────────────────────────
  ORDER_COMPLETED: 'order_completed',

  // ─────────────────────────────────────────────────────────────────────────
  // NAVIGATION - User journey
  // ─────────────────────────────────────────────────────────────────────────
  NAV_CLICKED: 'nav_clicked',
  CTA_CLICKED: 'cta_clicked',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',

  // ─────────────────────────────────────────────────────────────────────────
  // ERRORS - Track issues
  // ─────────────────────────────────────────────────────────────────────────
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
  CART_ERROR: 'cart_error',

  // ─────────────────────────────────────────────────────────────────────────
  // PERFORMANCE - Core Web Vitals
  // ─────────────────────────────────────────────────────────────────────────
  WEB_VITALS_CAPTURED: 'web_vitals_captured',
} as const;

// ============================================================================
// USER PROPERTIES - Identify and segment users
// ============================================================================

export interface UserProperties {
  // Identity
  email?: string;
  name?: string;

  // Acquisition
  first_visit_date?: string;
  first_referrer?: string;
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;

  // Engagement
  total_page_views?: number;
  total_products_viewed?: number;
  total_cart_adds?: number;

  // Revenue (lifetime)
  total_orders?: number;
  total_revenue?: number;
  average_order_value?: number;
  last_order_date?: string;

  // Segmentation
  customer_tier?: 'prospect' | 'first_time' | 'repeat' | 'vip';
  preferred_category?: string;
}

// ============================================================================
// ECOMMERCE EVENT PROPERTIES
// ============================================================================

export interface ProductProperties {
  product_id: string;
  product_name: string;
  product_handle: string;
  price: number;
  currency: string;
  variant_id?: string;
  variant_title?: string;
  category?: string;
  brand?: string;
  quantity?: number;
  position?: number; // Position in list
  list_name?: string; // e.g., "Featured Products", "Search Results"
}

export interface CartProperties {
  cart_id?: string;
  cart_total: number;
  cart_quantity: number;
  currency: string;
  discount_code?: string;
  discount_amount?: number;
  products: ProductProperties[];
}

export interface CheckoutProperties extends CartProperties {
  checkout_url: string;
}

export interface OrderProperties extends CartProperties {
  order_id: string;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// ============================================================================
// ANALYTICS CLASS
// ============================================================================

class Analytics {
  private initialized = false;
  private queue: Array<() => void> = [];

  /**
   * Initialize PostHog - call once in root component
   */
  init() {
    if (typeof window === 'undefined') return;
    if (this.initialized) return;

    try {
      posthog.init(POSTHOG_KEY, POSTHOG_CONFIG);
      this.initialized = true;

      // Process queued events
      this.queue.forEach((fn) => fn());
      this.queue = [];

      // Capture UTM parameters
      this.captureUTM();

      console.log('[Analytics] PostHog initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize PostHog:', error);
    }
  }

  /**
   * Queue events if PostHog not ready
   */
  private withPostHog(fn: () => void) {
    if (this.initialized) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  /**
   * Capture UTM parameters from URL
   */
  private captureUTM() {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
      referrer: document.referrer,
    };

    // Only capture if we have UTM params
    if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
      this.track(ANALYTICS_EVENTS.UTM_CAPTURED, utm);

      // Set as user properties for first-touch attribution
      this.setUserProperties({
        first_utm_source: utm.utm_source || undefined,
        first_utm_medium: utm.utm_medium || undefined,
        first_utm_campaign: utm.utm_campaign || undefined,
        first_referrer: utm.referrer || undefined,
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CORE TRACKING METHODS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, any>) {
    this.withPostHog(() => {
      posthog.capture(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_path: window.location.pathname,
      });
    });
  }

  /**
   * Track page view
   */
  pageView(pageName?: string, properties?: Record<string, any>) {
    this.withPostHog(() => {
      posthog.capture('$pageview', {
        page_name: pageName,
        ...properties,
      });
    });
  }

  /**
   * Identify user (call after login/signup)
   */
  identify(userId: string, properties?: UserProperties) {
    this.withPostHog(() => {
      posthog.identify(userId, properties);
    });
  }

  /**
   * Set user properties without identifying
   */
  setUserProperties(properties: Partial<UserProperties>) {
    this.withPostHog(() => {
      posthog.people.set(properties);
    });
  }

  /**
   * Increment a user property
   */
  incrementUserProperty(property: string, value = 1) {
    this.withPostHog(() => {
      posthog.people.set_once({ [property]: 0 }); // Initialize if not set
      posthog.people.increment(property, value);
    });
  }

  /**
   * Reset user (call on logout)
   */
  reset() {
    this.withPostHog(() => {
      posthog.reset();
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ECOMMERCE TRACKING METHODS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Track product viewed
   */
  productViewed(product: ProductProperties) {
    this.track(ANALYTICS_EVENTS.PRODUCT_VIEWED, {
      $set_once: { first_product_viewed: product.product_name },
      ...product,
    });
    this.incrementUserProperty('total_products_viewed');
  }

  /**
   * Track product list viewed (collection, search results, etc.)
   */
  productListViewed(listName: string, products: ProductProperties[]) {
    this.track(ANALYTICS_EVENTS.PRODUCT_LIST_VIEWED, {
      list_name: listName,
      product_count: products.length,
      products: products.map((p, i) => ({ ...p, position: i + 1 })),
    });
  }

  /**
   * Track collection viewed
   */
  collectionViewed(collectionHandle: string, collectionTitle: string, productCount: number) {
    this.track(ANALYTICS_EVENTS.COLLECTION_VIEWED, {
      collection_handle: collectionHandle,
      collection_title: collectionTitle,
      product_count: productCount,
    });
  }

  /**
   * Track product clicked in a list
   */
  productClicked(product: ProductProperties, listName: string, position: number) {
    this.track(ANALYTICS_EVENTS.PRODUCT_CLICKED, {
      ...product,
      list_name: listName,
      position,
    });
  }

  /**
   * Track variant selection
   */
  variantSelected(product: ProductProperties) {
    this.track(ANALYTICS_EVENTS.VARIANT_SELECTED, product);
  }

  /**
   * Track add to cart
   */
  productAddedToCart(product: ProductProperties, cartTotal: number) {
    this.track(ANALYTICS_EVENTS.PRODUCT_ADDED_TO_CART, {
      ...product,
      cart_total: cartTotal,
    });
    this.incrementUserProperty('total_cart_adds');
  }

  /**
   * Track remove from cart
   */
  productRemovedFromCart(product: ProductProperties, cartTotal: number) {
    this.track(ANALYTICS_EVENTS.PRODUCT_REMOVED_FROM_CART, {
      ...product,
      cart_total: cartTotal,
    });
  }

  /**
   * Track quantity update
   */
  cartQuantityUpdated(product: ProductProperties, oldQuantity: number, newQuantity: number) {
    this.track(ANALYTICS_EVENTS.CART_QUANTITY_UPDATED, {
      ...product,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      quantity_change: newQuantity - oldQuantity,
    });
  }

  /**
   * Track cart viewed
   */
  cartViewed(cart: CartProperties) {
    this.track(ANALYTICS_EVENTS.CART_VIEWED, cart);
  }

  /**
   * Track discount code applied
   */
  discountCodeApplied(code: string, discountAmount: number, cartTotal: number) {
    this.track(ANALYTICS_EVENTS.DISCOUNT_CODE_APPLIED, {
      discount_code: code,
      discount_amount: discountAmount,
      cart_total: cartTotal,
    });
  }

  /**
   * Track checkout started
   */
  checkoutStarted(checkout: CheckoutProperties) {
    this.track(ANALYTICS_EVENTS.CHECKOUT_STARTED, checkout);
  }

  /**
   * Track order completed (ideally called from webhook)
   */
  orderCompleted(order: OrderProperties) {
    this.track(ANALYTICS_EVENTS.ORDER_COMPLETED, {
      ...order,
      // Revenue tracking for PostHog
      $revenue: order.total,
    });

    // Update user properties
    this.incrementUserProperty('total_orders');
    this.incrementUserProperty('total_revenue', order.total);
    this.setUserProperties({
      last_order_date: new Date().toISOString(),
      average_order_value: order.total, // This will be averaged in PostHog
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ERROR TRACKING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Track errors
   */
  trackError(errorType: string, message: string, context?: Record<string, any>) {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_type: errorType,
      error_message: message,
      ...context,
    });
  }

  /**
   * Track cart errors
   */
  cartError(action: string, message: string, productId?: string) {
    this.track(ANALYTICS_EVENTS.CART_ERROR, {
      cart_action: action,
      error_message: message,
      product_id: productId,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PERFORMANCE TRACKING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    inp?: number;
  }) {
    this.track(ANALYTICS_EVENTS.WEB_VITALS_CAPTURED, {
      ...metrics,
      // Add ratings
      lcp_rating: metrics.lcp ? (metrics.lcp < 2500 ? 'good' : metrics.lcp < 4000 ? 'needs-improvement' : 'poor') : undefined,
      fcp_rating: metrics.fcp ? (metrics.fcp < 1800 ? 'good' : metrics.fcp < 3000 ? 'needs-improvement' : 'poor') : undefined,
      cls_rating: metrics.cls ? (metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'needs-improvement' : 'poor') : undefined,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE FLAGS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Check if feature flag is enabled
   */
  isFeatureEnabled(flagKey: string): boolean {
    if (!this.initialized) return false;
    return posthog.isFeatureEnabled(flagKey) ?? false;
  }

  /**
   * Get feature flag value
   */
  getFeatureFlag(flagKey: string): string | boolean | undefined {
    if (!this.initialized) return undefined;
    return posthog.getFeatureFlag(flagKey);
  }

  /**
   * Reload feature flags
   */
  reloadFeatureFlags() {
    this.withPostHog(() => {
      posthog.reloadFeatureFlags();
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export PostHog directly for advanced usage
export { posthog };
