// ═══════════════════════════════════════════════════════════════
// BROWSER COMPATIBILITY CHECKER
// Detects browser capabilities for xLENS capture
// ═══════════════════════════════════════════════════════════════

import type { CompatibilityResult, DeviceInfo } from '$lib/types';

/**
 * Check if the current browser supports all required features
 */
export async function checkCompatibility(): Promise<CompatibilityResult> {
	const warnings: string[] = [];
	const errors: string[] = [];

	// Check WebCodecs support
	const hasWebCodecs = 'VideoEncoder' in window && 'VideoFrame' in window;
	if (!hasWebCodecs) {
		warnings.push('WebCodecs not available - using MediaRecorder fallback');
	}

	// Check MediaRecorder as fallback
	const hasMediaRecorder = 'MediaRecorder' in window;
	if (!hasMediaRecorder && !hasWebCodecs) {
		errors.push('Neither WebCodecs nor MediaRecorder available');
	}

	// Check DeviceMotion
	const hasDeviceMotion = 'DeviceMotionEvent' in window;
	if (!hasDeviceMotion) {
		warnings.push('DeviceMotion not available - sensor data will be empty');
	}

	// Check camera access (enumerate devices)
	let hasCamera = false;
	let hasMicrophone = false;
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		hasCamera = devices.some((d) => d.kind === 'videoinput');
		hasMicrophone = devices.some((d) => d.kind === 'audioinput');
		if (!hasCamera) {
			errors.push('No camera detected');
		}
	} catch {
		errors.push('Cannot enumerate media devices');
	}

	const isCompatible = errors.length === 0 && (hasWebCodecs || hasMediaRecorder);

	return {
		isCompatible,
		hasWebCodecs,
		hasMediaRecorder,
		hasDeviceMotion,
		hasCamera,
		hasMicrophone,
		warnings,
		errors
	};
}

/**
 * Get device information for proof payload
 */
export function getDeviceInfo(): DeviceInfo {
	const ua = navigator.userAgent;

	// Parse browser name and version
	let browserName = 'Unknown';
	let browserVersion = '0';

	if (ua.includes('Firefox/')) {
		browserName = 'Firefox';
		browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] ?? '0';
	} else if (ua.includes('Edg/')) {
		browserName = 'Edge';
		browserVersion = ua.match(/Edg\/(\d+)/)?.[1] ?? '0';
	} else if (ua.includes('Chrome/')) {
		browserName = 'Chrome';
		browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] ?? '0';
	} else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
		browserName = 'Safari';
		browserVersion = ua.match(/Version\/(\d+)/)?.[1] ?? '0';
	}

	return {
		userAgent: ua,
		platform: navigator.platform,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		devicePixelRatio: window.devicePixelRatio,
		supportsWebCodecs: 'VideoEncoder' in window,
		supportsDeviceMotion: 'DeviceMotionEvent' in window,
		browserName,
		browserVersion
	};
}

/**
 * Request DeviceMotion permission (iOS 13+ requires explicit request)
 */
export async function requestMotionPermission(): Promise<boolean> {
	// Check if permission API exists (iOS 13+)
	if (
		typeof DeviceMotionEvent !== 'undefined' &&
		// @ts-expect-error - iOS specific API
		typeof DeviceMotionEvent.requestPermission === 'function'
	) {
		try {
			// @ts-expect-error - iOS specific API
			const permission = await DeviceMotionEvent.requestPermission();
			return permission === 'granted';
		} catch {
			return false;
		}
	}

	// Non-iOS or older iOS - permission not required
	return true;
}

/**
 * Check if running on iOS Safari
 */
export function isIOSSafari(): boolean {
	const ua = navigator.userAgent;
	return /iPad|iPhone|iPod/.test(ua) && !ua.includes('CriOS') && !ua.includes('FxiOS');
}

/**
 * Check if running in WeChat browser
 */
export function isWeChatBrowser(): boolean {
	return /MicroMessenger/i.test(navigator.userAgent);
}
