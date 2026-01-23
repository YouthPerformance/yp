// ═══════════════════════════════════════════════════════════════
// MOTION CAPTURE
// Captures IMU data from DeviceMotion API
// ═══════════════════════════════════════════════════════════════

import type { IMUSample } from '$lib/types';
import { requestMotionPermission } from '$lib/utils/compatibility';

// ─────────────────────────────────────────────────────────────────
// Motion Capture Class
// ─────────────────────────────────────────────────────────────────

export class MotionCapture {
	private samples: IMUSample[] = [];
	private isCapturing = false;
	private boundHandler: (event: DeviceMotionEvent) => void;
	private permissionGranted = false;

	constructor() {
		this.boundHandler = this.handleMotion.bind(this);
	}

	/**
	 * Request motion permission (required on iOS 13+)
	 */
	async requestPermission(): Promise<boolean> {
		this.permissionGranted = await requestMotionPermission();
		return this.permissionGranted;
	}

	/**
	 * Start capturing motion data
	 */
	start(): void {
		if (this.isCapturing) return;

		this.samples = [];
		this.isCapturing = true;

		window.addEventListener('devicemotion', this.boundHandler, true);
	}

	/**
	 * Stop capturing and return samples
	 */
	stop(): IMUSample[] {
		if (!this.isCapturing) return [];

		window.removeEventListener('devicemotion', this.boundHandler, true);
		this.isCapturing = false;

		const result = [...this.samples];
		this.samples = [];
		return result;
	}

	/**
	 * Get current sample count
	 */
	getSampleCount(): number {
		return this.samples.length;
	}

	/**
	 * Check if motion is available
	 */
	isAvailable(): boolean {
		return 'DeviceMotionEvent' in window;
	}

	/**
	 * Handle incoming motion event
	 */
	private handleMotion(event: DeviceMotionEvent): void {
		if (!this.isCapturing) return;

		const sample: IMUSample = {
			timestamp: Date.now(),
			accelerationX: event.accelerationIncludingGravity?.x ?? 0,
			accelerationY: event.accelerationIncludingGravity?.y ?? 0,
			accelerationZ: event.accelerationIncludingGravity?.z ?? 0,
			rotationAlpha: event.rotationRate?.alpha ?? null,
			rotationBeta: event.rotationRate?.beta ?? null,
			rotationGamma: event.rotationRate?.gamma ?? null
		};

		this.samples.push(sample);
	}
}

/**
 * Create motion capture instance
 */
export function createMotionCapture(): MotionCapture {
	return new MotionCapture();
}

/**
 * Serialize samples to JSON for hashing
 */
export function serializeSamples(samples: IMUSample[]): string {
	return JSON.stringify(samples);
}
