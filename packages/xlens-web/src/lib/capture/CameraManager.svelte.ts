// ═══════════════════════════════════════════════════════════════
// CAMERA MANAGER
// Handles camera access and video stream management
// Uses Svelte 5 Runes for reactive state
// ═══════════════════════════════════════════════════════════════

import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Camera Configuration
// ─────────────────────────────────────────────────────────────────

export interface CameraConfig {
	facingMode: 'user' | 'environment';
	width: number;
	height: number;
	frameRate: number;
}

const DEFAULT_CONFIG: CameraConfig = {
	facingMode: 'user', // Front camera for self-recording
	width: 1280,
	height: 720,
	frameRate: 60
};

// ─────────────────────────────────────────────────────────────────
// Camera Manager Class
// ─────────────────────────────────────────────────────────────────

export class CameraManager {
	// Svelte 5 Runes for reactive state
	stream = $state<MediaStream | null>(null);
	isActive = $state(false);
	error = $state<string | null>(null);
	actualFrameRate = $state(0);

	private config: CameraConfig;
	private videoTrack: MediaStreamTrack | null = null;

	constructor(config: Partial<CameraConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	/**
	 * Start the camera and return the media stream
	 */
	async start(): Promise<MediaStream> {
		try {
			this.error = null;

			const constraints: MediaStreamConstraints = {
				video: {
					facingMode: this.config.facingMode,
					width: { ideal: this.config.width },
					height: { ideal: this.config.height },
					frameRate: { ideal: this.config.frameRate }
				},
				audio: false
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			this.stream = stream;
			this.isActive = true;

			// Get actual settings from track
			this.videoTrack = stream.getVideoTracks()[0];
			const settings = this.videoTrack.getSettings();
			this.actualFrameRate = settings.frameRate ?? this.config.frameRate;

			return stream;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Camera access failed';
			this.error = message;

			if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
				throw new XLensError('CAMERA_PERMISSION_DENIED', 'Camera permission was denied', true);
			}

			throw new XLensError('CAPTURE_FAILED', message, false);
		}
	}

	/**
	 * Stop the camera and release resources
	 */
	stop(): void {
		if (this.stream) {
			this.stream.getTracks().forEach((track) => track.stop());
			this.stream = null;
		}
		this.videoTrack = null;
		this.isActive = false;
	}

	/**
	 * Switch between front and back camera
	 */
	async switchCamera(): Promise<MediaStream> {
		this.config.facingMode = this.config.facingMode === 'user' ? 'environment' : 'user';
		this.stop();
		return this.start();
	}

	/**
	 * Get current video track settings
	 */
	getSettings(): MediaTrackSettings | null {
		return this.videoTrack?.getSettings() ?? null;
	}

	/**
	 * Get video dimensions
	 */
	getDimensions(): { width: number; height: number } {
		const settings = this.getSettings();
		return {
			width: settings?.width ?? this.config.width,
			height: settings?.height ?? this.config.height
		};
	}
}

/**
 * Create a camera manager instance
 */
export function createCameraManager(config?: Partial<CameraConfig>): CameraManager {
	return new CameraManager(config);
}
