// ═══════════════════════════════════════════════════════════
// useCastSession Hook
// Detect and manage AirPlay/Chromecast casting sessions
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useState } from "react";

export type CastState = "disconnected" | "connecting" | "connected";
export type CastType = "airplay" | "chromecast" | "miracast" | "unknown";

export interface CastSessionState {
  /** Whether casting is available on this device */
  isAvailable: boolean;
  /** Current cast connection state */
  state: CastState;
  /** Type of cast connection */
  type: CastType | null;
  /** Name of the connected device (if available) */
  deviceName: string | null;
  /** Whether this device is the remote controller (phone) */
  isController: boolean;
  /** Whether this device is the display receiver (TV) */
  isReceiver: boolean;
}

export interface CastSessionReturn {
  /** Current cast session state */
  session: CastSessionState;
  /** Start casting (opens device picker) */
  startCasting: () => Promise<void>;
  /** Stop casting */
  stopCasting: () => void;
  /** Send a command to the receiver */
  sendCommand: (command: CastCommand) => void;
}

export interface CastCommand {
  type: "play" | "pause" | "seek" | "skip" | "audio";
  payload?: unknown;
}

/**
 * Hook for managing cast sessions (AirPlay, Chromecast)
 *
 * Uses the Presentation API for web-based casting.
 * Falls back to native AirPlay on Safari/iOS.
 *
 * @example
 * ```tsx
 * const { session, startCasting, stopCasting, sendCommand } = useCastSession();
 *
 * if (session.isAvailable) {
 *   return <button onClick={startCasting}>Cast to TV</button>;
 * }
 *
 * if (session.isController && session.state === 'connected') {
 *   return <RemoteUI onCommand={sendCommand} />;
 * }
 * ```
 */
export function useCastSession(): CastSessionReturn {
  const [session, setSession] = useState<CastSessionState>({
    isAvailable: false,
    state: "disconnected",
    type: null,
    deviceName: null,
    isController: false,
    isReceiver: false,
  });

  // Check for cast availability
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check Presentation API (Chrome, Edge)
    const hasPresentationAPI = "presentation" in navigator;

    // Check AirPlay (Safari)
    const hasAirPlay =
      "WebKitPlaybackTargetAvailabilityEvent" in window ||
      // @ts-expect-error - Safari-specific
      window.WebKitPlaybackTargetAvailabilityEvent !== undefined;

    // Check Chromecast (Chrome)
    // @ts-expect-error - Chrome-specific
    const hasChromecast = !!window.chrome?.cast;

    const isAvailable = hasPresentationAPI || hasAirPlay || hasChromecast;

    setSession((prev) => ({
      ...prev,
      isAvailable,
    }));

    // Check if we're the receiver
    if (hasPresentationAPI) {
      // @ts-expect-error - Presentation API types incomplete
      const receiver = navigator.presentation?.receiver;
      if (receiver) {
        setSession((prev) => ({
          ...prev,
          isReceiver: true,
          state: "connected",
        }));
      }
    }
  }, []);

  // Listen for AirPlay availability changes (Safari)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAirPlayAvailability = (event: Event) => {
      // @ts-expect-error - Safari-specific event
      const available = event.availability === "available";
      setSession((prev) => ({
        ...prev,
        isAvailable: available,
        type: available ? "airplay" : prev.type,
      }));
    };

    // Find video elements and listen for AirPlay
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      video.addEventListener("webkitplaybacktargetavailabilitychanged", handleAirPlayAvailability);
    });

    return () => {
      videos.forEach((video) => {
        video.removeEventListener(
          "webkitplaybacktargetavailabilitychanged",
          handleAirPlayAvailability,
        );
      });
    };
  }, []);

  const startCasting = useCallback(async () => {
    if (!session.isAvailable) return;

    setSession((prev) => ({ ...prev, state: "connecting" }));

    try {
      // Try Presentation API first
      if ("presentation" in navigator) {
        // @ts-expect-error - Presentation API types incomplete
        const request = new PresentationRequest([window.location.href]);
        const connection = await request.start();

        connection.onconnect = () => {
          setSession((prev) => ({
            ...prev,
            state: "connected",
            type: "chromecast",
            isController: true,
            deviceName: "External Display",
          }));
        };

        connection.onterminate = () => {
          setSession((prev) => ({
            ...prev,
            state: "disconnected",
            isController: false,
            deviceName: null,
          }));
        };

        return;
      }

      // Fallback to AirPlay (Safari)
      const video = document.querySelector("video");
      if (video) {
        // @ts-expect-error - Safari-specific
        if (video.webkitShowPlaybackTargetPicker) {
          // @ts-expect-error - Safari-specific
          video.webkitShowPlaybackTargetPicker();
          setSession((prev) => ({
            ...prev,
            type: "airplay",
            isController: true,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to start casting:", error);
      setSession((prev) => ({ ...prev, state: "disconnected" }));
    }
  }, [session.isAvailable]);

  const stopCasting = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      state: "disconnected",
      isController: false,
      isReceiver: false,
      deviceName: null,
    }));

    // Close presentation connection if exists
    // This would require storing the connection reference
  }, []);

  const sendCommand = useCallback((command: CastCommand) => {
    // In a full implementation, this would use:
    // - Presentation API message channel
    // - WebSocket for custom sync
    // - Chromecast SDK for Chromecast
    console.log("Cast command:", command);

    // For now, dispatch a custom event that the receiver can listen to
    window.dispatchEvent(new CustomEvent("cast-command", { detail: command }));
  }, []);

  return {
    session,
    startCasting,
    stopCasting,
    sendCommand,
  };
}

/**
 * Hook to receive cast commands (for TV/receiver side)
 */
export function useCastReceiver(onCommand: (command: CastCommand) => void) {
  useEffect(() => {
    const handleCommand = (event: CustomEvent<CastCommand>) => {
      onCommand(event.detail);
    };

    window.addEventListener("cast-command", handleCommand as EventListener);

    return () => {
      window.removeEventListener("cast-command", handleCommand as EventListener);
    };
  }, [onCommand]);
}
