/**
 * useUnicornStudio - Lazy-loading hook for Unicorn Studio WebGL SDK
 * ==================================================================
 *
 * Features:
 * - Lazy loads SDK (not in main bundle)
 * - Singleton pattern (loads once, shares across components)
 * - Timeout handling (falls back to video if too slow)
 * - SSR-safe (no-op on server)
 *
 * @param projectId - Unicorn Studio project ID
 * @param timeout - Max wait time before fallback (default: 2000ms)
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Unicorn Studio SDK URL
const UNICORN_SDK_URL = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.1/dist/unicornStudio.umd.js";

// Singleton state for SDK loading
let sdkLoadPromise: Promise<void> | null = null;
let sdkLoaded = false;
let sdkFailed = false;

// Global type declaration for Unicorn Studio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
      destroy: () => void;
    };
  }
}

export type UnicornStatus = "idle" | "loading" | "ready" | "failed" | "timeout";

export interface UseUnicornStudioResult {
  status: UnicornStatus;
  containerRef: React.RefObject<HTMLDivElement>;
  retry: () => void;
}

function loadSDK(): Promise<void> {
  // Return existing promise if already loading
  if (sdkLoadPromise) return sdkLoadPromise;

  // Return immediately if already loaded
  if (sdkLoaded) return Promise.resolve();

  // Return failed promise if previously failed
  if (sdkFailed) return Promise.reject(new Error("SDK failed to load"));

  sdkLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded (e.g., from another component)
    if (window.UnicornStudio?.isInitialized) {
      sdkLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = UNICORN_SDK_URL;
    script.async = true;

    script.onload = () => {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
      sdkLoaded = true;
      resolve();
    };

    script.onerror = () => {
      sdkFailed = true;
      reject(new Error("Failed to load Unicorn Studio SDK"));
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

export function useUnicornStudio(
  projectId: string,
  timeout: number = 2000
): UseUnicornStudioResult {
  const [status, setStatus] = useState<UnicornStatus>("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  const initUnicorn = useCallback(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    // Already ready or loading
    if (status === "ready" || status === "loading") return;

    setStatus("loading");

    // Start timeout timer - if this fires, SDK didn't load in time
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.warn("[WolfLoader] Unicorn Studio timeout - using video fallback");
        setStatus("timeout");
      }
    }, timeout);

    loadSDK()
      .then(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (mountedRef.current) {
          setStatus("ready");
        }
      })
      .catch((error) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (mountedRef.current) {
          console.error("[WolfLoader] Unicorn Studio failed:", error);
          setStatus("failed");
        }
      });
  }, [status, timeout]);

  // Auto-init on mount
  useEffect(() => {
    mountedRef.current = true;
    initUnicorn();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initUnicorn]);

  // Retry function for manual recovery
  const retry = useCallback(() => {
    // Reset singleton state to allow retry
    sdkLoadPromise = null;
    sdkFailed = false;
    setStatus("idle");
    // Will re-trigger via useEffect
  }, []);

  return {
    status,
    containerRef,
    retry,
  };
}

export default useUnicornStudio;
