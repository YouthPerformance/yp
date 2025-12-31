// ═══════════════════════════════════════════════════════════
// HAPTICS HOOK
// Cross-platform haptic feedback
// iOS: Native haptic engine
// Android: Vibration fallback
// Web: Navigator.vibrate()
// ═══════════════════════════════════════════════════════════

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import type { HapticIntensity } from '@/types/ticker';

type HapticPattern =
  | 'impact_light'
  | 'impact_medium'
  | 'impact_heavy'
  | 'success_pattern'
  | 'rank_up_pattern'
  | 'selection';

// iOS haptic patterns (Capacitor/Cordova/React Native)
const IOS_PATTERNS: Record<HapticPattern, string> = {
  impact_light: 'impactLight',
  impact_medium: 'impactMedium',
  impact_heavy: 'impactHeavy',
  success_pattern: 'notificationSuccess',
  rank_up_pattern: 'notificationSuccess', // iOS doesn't have complex patterns
  selection: 'selectionChanged',
};

// Android vibration durations (ms)
const ANDROID_PATTERNS: Record<HapticPattern, number | number[]> = {
  impact_light: 30,
  impact_medium: 50,
  impact_heavy: 80,
  success_pattern: [0, 50, 50, 100],
  rank_up_pattern: [0, 80, 100, 50, 100, 150],
  selection: 10,
};

// Web fallback (Navigator.vibrate)
const WEB_PATTERNS: Record<HapticPattern, number | number[]> = {
  impact_light: 30,
  impact_medium: 50,
  impact_heavy: 80,
  success_pattern: [50, 50, 100],
  rank_up_pattern: [80, 100, 50, 100, 150],
  selection: 10,
};

// Detect platform
function detectPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  return 'web';
}

// Check if haptics are supported
function isHapticsSupported(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for Navigator.vibrate (web/android)
  if ('vibrate' in navigator) return true;

  // Check for iOS haptic (would be exposed via native bridge)
  if ((window as any).Capacitor?.Plugins?.Haptics) return true;

  return false;
}

export function useHaptics() {
  const { theme } = useTheme();
  const [platform] = useState(() => detectPlatform());
  const [isSupported] = useState(() => isHapticsSupported());
  const [isEnabled, setIsEnabled] = useState(true);

  // Trigger haptic feedback
  const trigger = useCallback(
    (pattern: HapticPattern, intensity?: HapticIntensity) => {
      // Check if haptics are disabled
      if (!theme.features.haptics || !isEnabled || !isSupported) {
        return;
      }

      try {
        switch (platform) {
          case 'ios':
            triggerIOSHaptic(pattern, intensity);
            break;
          case 'android':
            triggerAndroidHaptic(pattern);
            break;
          case 'web':
            triggerWebHaptic(pattern);
            break;
        }
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    },
    [theme.features.haptics, isEnabled, isSupported, platform]
  );

  // iOS haptic trigger
  const triggerIOSHaptic = (pattern: HapticPattern, intensity?: HapticIntensity) => {
    const hapticType = IOS_PATTERNS[pattern];

    // Try Capacitor Haptics plugin
    if ((window as any).Capacitor?.Plugins?.Haptics) {
      const Haptics = (window as any).Capacitor.Plugins.Haptics;

      switch (hapticType) {
        case 'impactLight':
          Haptics.impact({ style: 'light' });
          break;
        case 'impactMedium':
          Haptics.impact({ style: 'medium' });
          break;
        case 'impactHeavy':
          Haptics.impact({ style: 'heavy' });
          break;
        case 'notificationSuccess':
          Haptics.notification({ type: 'success' });
          break;
        case 'selectionChanged':
          Haptics.selectionStart();
          Haptics.selectionChanged();
          Haptics.selectionEnd();
          break;
      }
      return;
    }

    // Fallback to web vibration
    triggerWebHaptic(pattern);
  };

  // Android haptic trigger (vibration)
  const triggerAndroidHaptic = (pattern: HapticPattern) => {
    const vibrationPattern = ANDROID_PATTERNS[pattern];

    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPattern);
    }
  };

  // Web haptic trigger
  const triggerWebHaptic = (pattern: HapticPattern) => {
    const vibrationPattern = WEB_PATTERNS[pattern];

    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPattern);
    }
  };

  // Enable/disable haptics
  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
  }, []);

  return {
    trigger,
    isSupported,
    isEnabled,
    setEnabled: setHapticsEnabled,
    platform,
  };
}
