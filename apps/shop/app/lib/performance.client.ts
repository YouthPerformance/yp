/**
 * YP Shop Performance Monitoring
 *
 * Client-side performance tracking for Core Web Vitals
 * Based on what top DTC brands like Gymshark and Allbirds track
 */

/**
 * Core Web Vitals thresholds (Google's recommendations)
 */
export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
} as const;

type MetricName = keyof typeof VITALS_THRESHOLDS;

interface PerformanceMetric {
  name: MetricName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  path: string;
  timestamp: number;
}

/**
 * Rate a metric value against thresholds
 */
function rateMetric(name: MetricName, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = VITALS_THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Report a performance metric
 * Can be extended to send to analytics (GA4, Shopify Analytics, etc.)
 */
function reportMetric(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const emoji =
      metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌";
    console.log(
      `${emoji} [Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating}) - ${metric.path}`,
    );
  }

  // Send to Shopify Analytics or your analytics provider
  // Example: window.Shopify?.analytics?.publish('performance', metric);
}

/**
 * Initialize Core Web Vitals monitoring
 * Call this in your root component
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;

  // Use web-vitals library if available, otherwise use Performance API
  if ("PerformanceObserver" in window) {
    // Observe LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (lastEntry) {
          reportMetric({
            name: "LCP",
            value: lastEntry.startTime,
            rating: rateMetric("LCP", lastEntry.startTime),
            path,
            timestamp: Date.now(),
          });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (_e) {
      // LCP not supported
    }

    // Observe FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(
          (entry: PerformanceEntry & { processingStart?: number; startTime: number }) => {
            if (entry.processingStart) {
              const fid = entry.processingStart - entry.startTime;
              reportMetric({
                name: "FID",
                value: fid,
                rating: rateMetric("FID", fid),
                path,
                timestamp: Date.now(),
              });
            }
          },
        );
      });
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch (_e) {
      // FID not supported
    }

    // Observe CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(
          (entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          },
        );
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // Report CLS on page hide
      window.addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "hidden") {
            reportMetric({
              name: "CLS",
              value: clsValue,
              rating: rateMetric("CLS", clsValue),
              path,
              timestamp: Date.now(),
            });
          }
        },
        { once: true },
      );
    } catch (_e) {
      // CLS not supported
    }
  }

  // Report TTFB from Navigation Timing
  if ("performance" in window && performance.getEntriesByType) {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      reportMetric({
        name: "TTFB",
        value: ttfb,
        rating: rateMetric("TTFB", ttfb),
        path,
        timestamp: Date.now(),
      });

      // Report FCP
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find((e) => e.name === "first-contentful-paint");
      if (fcpEntry) {
        reportMetric({
          name: "FCP",
          value: fcpEntry.startTime,
          rating: rateMetric("FCP", fcpEntry.startTime),
          path,
          timestamp: Date.now(),
        });
      }
    }
  }
}

/**
 * Hook to initialize performance monitoring on mount
 */
export function usePerformanceMonitoring() {
  if (typeof window !== "undefined") {
    // Run on next tick to not block rendering
    setTimeout(initPerformanceMonitoring, 0);
  }
}
