// ═══════════════════════════════════════════════════════════
// SOUND HOOK
// Gym Foley audio playback with fallbacks
// Direction: Mechanical/Physical, NOT Digital/Arcade
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptics } from "./useHaptics";

interface SoundOptions {
  volume?: number;
  pitch?: number;
  loop?: boolean;
}

interface AudioCache {
  [key: string]: AudioBuffer;
}

// Sound asset paths
const SOUND_PATHS: Record<string, string> = {
  // Roll sounds (loopable)
  "chain_wind.mp3": "/sounds/chain_wind.mp3",
  "ratchet_soft.mp3": "/sounds/ratchet_soft.mp3",

  // Impact sounds
  "plate_drop_heavy.mp3": "/sounds/plate_drop_heavy.mp3",
  "plate_drop_medium.mp3": "/sounds/plate_drop_medium.mp3",
  "locker_latch.mp3": "/sounds/locker_latch.mp3",
  "soft_click.mp3": "/sounds/soft_click.mp3",

  // Special
  "wolf_howl_distant.mp3": "/sounds/wolf_howl_distant.mp3",
};

export function useSound() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const audioContextRef = useRef<AudioContext | null>(null);
  const cacheRef = useRef<AudioCache>({});
  const [isEnabled, setIsEnabled] = useState(true);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Resume on user interaction (for autoplay policies)
    const handleInteraction = () => {
      initAudio();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Load sound into cache
  const loadSound = useCallback(async (soundName: string): Promise<AudioBuffer | null> => {
    if (cacheRef.current[soundName]) {
      return cacheRef.current[soundName];
    }

    const path = SOUND_PATHS[soundName];
    if (!path) {
      console.warn(`Sound not found: ${soundName}`);
      return null;
    }

    if (!audioContextRef.current) {
      return null;
    }

    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      cacheRef.current[soundName] = audioBuffer;
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load sound: ${soundName}`, error);
      return null;
    }
  }, []);

  // Play sound
  const play = useCallback(
    async (soundName: string, options: SoundOptions = {}) => {
      // Check if sounds are disabled (parent mode or user preference)
      if (!theme.features.sounds || !isEnabled) {
        // Fallback to haptic boost
        if (options.volume && options.volume > 0.5) {
          haptics.trigger("impact_medium", "heavy");
        }
        return;
      }

      const buffer = await loadSound(soundName);
      if (!buffer || !audioContextRef.current) {
        // Fallback to haptic
        haptics.trigger("impact_light", "medium");
        return;
      }

      try {
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();

        source.buffer = buffer;
        source.loop = options.loop || false;

        // Apply pitch shift
        if (options.pitch && options.pitch !== 1) {
          source.playbackRate.value = options.pitch;
        }

        // Apply volume
        gainNode.gain.value = options.volume ?? 1;

        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        source.start(0);

        return {
          stop: () => source.stop(),
          source,
        };
      } catch (error) {
        console.warn(`Failed to play sound: ${soundName}`, error);
        // Fallback to haptic
        haptics.trigger("impact_light", "medium");
      }
    },
    [theme.features.sounds, isEnabled, loadSound, haptics],
  );

  // Stop all sounds
  const stopAll = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Enable/disable sounds
  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
  }, []);

  // Preload common sounds
  const preload = useCallback(async () => {
    const commonSounds = ["plate_drop_medium.mp3", "locker_latch.mp3", "soft_click.mp3"];

    await Promise.all(commonSounds.map(loadSound));
  }, [loadSound]);

  return {
    play,
    stopAll,
    preload,
    isEnabled,
    setEnabled,
  };
}
