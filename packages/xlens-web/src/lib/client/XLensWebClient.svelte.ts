// ═══════════════════════════════════════════════════════════════
// XLENS WEB CLIENT
// Main orchestrator for verified jump capture
// Uses Svelte 5 Runes for reactive state management
// ═══════════════════════════════════════════════════════════════

import type {
	CaptureState,
	Session,
	CaptureResult,
	XLensWebConfig,
	UploadProgress,
	SubmissionResult,
	JumpResult,
	UserCalibration
} from '$lib/types';
import { XLensError } from '$lib/types';
import { CameraManager } from '$lib/capture/CameraManager.svelte';
import { MotionCapture, serializeSamples } from '$lib/capture/MotionCapture';
import { WebCodecsEncoder } from '$lib/capture/WebCodecsEncoder';
import { MediaRecorderFallback } from '$lib/capture/MediaRecorderFallback';
import { sha256, sha256String } from '$lib/crypto/WebCryptoSigner';
import { TusUploader } from '$lib/upload/TusUploader';
import { checkCompatibility } from '$lib/utils/compatibility';

// ─────────────────────────────────────────────────────────────────
// Client Class
// ─────────────────────────────────────────────────────────────────

export class XLensWebClient {
	// Reactive state using Svelte 5 Runes
	state = $state<CaptureState>('idle');
	session = $state<Session | null>(null);
	lastJump = $state<JumpResult | null>(null);
	error = $state<XLensError | null>(null);
	uploadProgress = $state<UploadProgress | null>(null);
	recordingDuration = $state(0);
	calibration = $state<UserCalibration | null>(null);

	// Configuration
	private config: XLensWebConfig;
	private convexUrl: string;
	private userId: string;

	// Internal components
	private camera: CameraManager;
	private motion: MotionCapture;
	private encoder: WebCodecsEncoder | null = null;
	private fallbackRecorder: MediaRecorderFallback | null = null;
	private tusUploader: TusUploader;

	// Capture state
	private useWebCodecs = false;
	private captureStartTime = 0;
	private captureInterval: ReturnType<typeof setInterval> | null = null;
	private frameReader: ReadableStreamDefaultReader<VideoFrame> | null = null;

	constructor(config: XLensWebConfig) {
		this.config = config;
		// Convert .convex.cloud URL to .convex.site for HTTP endpoints
		this.convexUrl = config.convexUrl.replace('.convex.cloud', '.convex.site');
		// Auto-generate anonymous ID if not provided
		this.userId = config.userId || this.generateAnonId();

		// Initialize components
		this.camera = new CameraManager({ frameRate: 60 });
		this.motion = new MotionCapture();
		this.tusUploader = new TusUploader();

		// Load calibration from sessionStorage if available
		this.loadCalibration();
	}

	/**
	 * Load calibration data from sessionStorage
	 */
	private loadCalibration(): void {
		if (typeof sessionStorage === 'undefined') return;

		try {
			const stored = sessionStorage.getItem('xlens_calibration');
			if (stored) {
				this.calibration = JSON.parse(stored);
				console.log('[xLENS] Loaded calibration:', this.calibration);
			}
		} catch (e) {
			console.warn('[xLENS] Failed to load calibration:', e);
		}
	}

	/**
	 * Set calibration data manually
	 */
	setCalibration(calibration: UserCalibration): void {
		this.calibration = calibration;
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem('xlens_calibration', JSON.stringify(calibration));
		}
	}

	/**
	 * Get current calibration
	 */
	getCalibration(): UserCalibration | null {
		return this.calibration;
	}

	/**
	 * Generate anonymous user ID (persisted in localStorage)
	 */
	private generateAnonId(): string {
		const storageKey = 'xlens_anon_id';
		let anonId = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;

		if (!anonId) {
			anonId = `anon_${crypto.randomUUID()}`;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(storageKey, anonId);
			}
		}

		return anonId;
	}

	// ─────────────────────────────────────────────────────────────
	// Public API
	// ─────────────────────────────────────────────────────────────

	/**
	 * Check browser compatibility
	 */
	async checkCompatibility(): Promise<boolean> {
		this.setState('checking_compatibility');

		try {
			const result = await checkCompatibility();

			if (!result.isCompatible) {
				this.setError(
					new XLensError('UNSUPPORTED_BROWSER', result.errors.join(', '))
				);
				this.setState('unsupported');
				return false;
			}

			this.useWebCodecs = result.hasWebCodecs;
			this.setState('idle');
			return true;
		} catch (err) {
			this.handleError(err, 'Compatibility check failed');
			return false;
		}
	}

	/**
	 * Request camera and motion permissions
	 */
	async requestPermissions(): Promise<boolean> {
		this.setState('requesting_permissions');

		try {
			// Request camera
			await this.camera.start();

			// Request motion (iOS requires explicit request)
			if (this.motion.isAvailable()) {
				await this.motion.requestPermission();
			}

			this.setState('idle');
			return true;
		} catch (err) {
			this.handleError(err, 'Permission request failed');
			return false;
		}
	}

	/**
	 * Create a new capture session
	 */
	async createSession(): Promise<Session> {
		this.setState('preparing_session');

		try {
			// Create session via HTTP endpoint (demo mode)
			const response = await this.callXLensHttp('/xlens/session', {
				deviceId: this.userId
			});

			const session: Session = {
				id: response.sessionId,
				nonce: response.nonce,
				nonceDisplay: response.nonceDisplay,
				expiresAt: new Date(response.expiresAt),
				deviceKeyId: 'web-demo'
			};

			this.session = session;
			this.setState('session_ready');
			return session;
		} catch (err) {
			this.handleError(err, 'Session creation failed');
			throw err;
		}
	}

	/**
	 * Start capturing video and sensor data
	 */
	async startCapture(): Promise<void> {
		if (this.state !== 'session_ready' || !this.session) {
			throw new XLensError('CAPTURE_FAILED', 'No active session');
		}

		// Check if session expired
		if (new Date() > this.session.expiresAt) {
			throw new XLensError('SESSION_EXPIRED', 'Session has expired');
		}

		this.setState('capturing');
		this.captureStartTime = Date.now();
		this.recordingDuration = 0;

		try {
			// Ensure camera is started
			if (!this.camera.isActive) {
				await this.camera.start();
			}

			// Start motion capture
			if (this.motion.isAvailable()) {
				this.motion.start();
			}

			// Initialize encoder
			if (this.useWebCodecs) {
				const dims = this.camera.getDimensions();
				this.encoder = new WebCodecsEncoder({
					width: dims.width,
					height: dims.height,
					framerate: this.camera.actualFrameRate
				});
				await this.encoder.initialize();
				this.startFrameCapture();
			} else {
				// Use MediaRecorder fallback
				this.fallbackRecorder = new MediaRecorderFallback();
				this.fallbackRecorder.initialize(this.camera.stream!);
				this.fallbackRecorder.start();
			}

			// Start duration timer
			this.captureInterval = setInterval(() => {
				this.recordingDuration = Date.now() - this.captureStartTime;
			}, 100);
		} catch (err) {
			this.handleError(err, 'Capture start failed');
			throw err;
		}
	}

	/**
	 * Stop capture and process results
	 */
	async stopCapture(): Promise<CaptureResult> {
		if (this.state !== 'capturing') {
			throw new XLensError('CAPTURE_FAILED', 'Not capturing');
		}

		this.setState('processing');

		// Stop duration timer
		if (this.captureInterval) {
			clearInterval(this.captureInterval);
			this.captureInterval = null;
		}

		try {
			// Stop frame capture
			this.stopFrameCapture();

			// Get video data
			let videoData: Uint8Array;
			let fps: number;

			if (this.useWebCodecs && this.encoder) {
				videoData = await this.encoder.finalize();
				fps = this.encoder.getStats().actualFps;
			} else if (this.fallbackRecorder) {
				videoData = await this.fallbackRecorder.stop();
				fps = 30; // MediaRecorder typically caps at 30fps
			} else {
				throw new XLensError('CAPTURE_FAILED', 'No encoder available');
			}

			// Get sensor data
			const sensorData = this.motion.stop();

			// Compute hashes
			const videoHash = await sha256(videoData);
			const sensorJson = serializeSamples(sensorData);
			const sensorHash = await sha256String(sensorJson);

			const result: CaptureResult = {
				videoData,
				sensorData,
				startedAtMs: this.captureStartTime,
				endedAtMs: Date.now(),
				fps,
				frameCount: videoData.length, // Approximate
				videoHash,
				sensorHash
			};

			return result;
		} catch (err) {
			this.handleError(err, 'Capture processing failed');
			throw err;
		}
	}

	/**
	 * Submit jump for verification
	 */
	async submitJump(capture: CaptureResult): Promise<SubmissionResult> {
		if (!this.session) {
			throw new XLensError('CAPTURE_FAILED', 'No active session');
		}

		this.setState('uploading');

		try {
			// Step 1: Get upload URL from Convex
			const uploadAuth = await this.callXLensHttp('/xlens/upload', {
				sessionId: this.session.id
			});

			// Step 2: Upload video to Convex Storage
			const videoBlob = new Blob([capture.videoData.buffer as ArrayBuffer], { type: 'video/mp4' });
			const uploadResponse = await fetch(uploadAuth.uploadUrl, {
				method: 'POST',
				body: videoBlob
			});

			if (!uploadResponse.ok) {
				throw new XLensError('UPLOAD_FAILED', 'Video upload failed');
			}

			const { storageId } = await uploadResponse.json();

			// Update progress
			this.uploadProgress = {
				phase: 'video',
				bytesUploaded: capture.videoData.length,
				bytesTotal: capture.videoData.length,
				percentage: 100
			};

			// Step 3: Submit jump for analysis (with calibration if available)
			const result = await this.callXLensHttp('/xlens/submit', {
				sessionId: this.session.id,
				storageId,
				deviceId: this.userId,
				durationMs: capture.endedAtMs - capture.startedAtMs,
				fps: capture.fps,
				userHeightInches: this.calibration?.heightInches
			});

			this.setState('submitted');

			return {
				jumpId: result.jumpId,
				status: result.status,
				verificationTier: 'bronze',
				message: result.message || 'Jump submitted for analysis'
			};
		} catch (err) {
			this.handleError(err, 'Submission failed');
			throw err;
		}
	}

	/**
	 * Get jump result by ID
	 */
	async getJumpResult(jumpId: string): Promise<JumpResult> {
		const result = await this.callXLensHttp('/xlens/result', { jumpId });

		const jumpResult: JumpResult = {
			jumpId: result.jumpId,
			userId: this.userId,
			status: result.status,
			verificationTier: result.verificationTier,
			height: result.heightInches
				? {
						inches: result.heightInches,
						centimeters: result.heightCm || result.heightInches * 2.54
					}
				: undefined,
			videoUrl: result.videoUrl,
			thumbnailUrl: undefined,
			processedAt: result.processedAt ? new Date(result.processedAt) : undefined,
			flags: result.flags
		};

		this.lastJump = jumpResult;
		if (result.status === 'complete') {
			this.setState('complete');
		}

		return jumpResult;
	}

	/**
	 * Cancel current operation
	 */
	cancel(): void {
		// Stop capture components
		this.stopFrameCapture();
		this.motion.stop();
		this.tusUploader.abort();

		if (this.encoder) {
			this.encoder.abort();
			this.encoder = null;
		}

		if (this.fallbackRecorder) {
			this.fallbackRecorder.abort();
			this.fallbackRecorder = null;
		}

		if (this.captureInterval) {
			clearInterval(this.captureInterval);
			this.captureInterval = null;
		}

		this.setState('idle');
	}

	/**
	 * Reset client state
	 */
	reset(): void {
		this.cancel();
		this.camera.stop();
		this.session = null;
		this.lastJump = null;
		this.error = null;
		this.uploadProgress = null;
		this.recordingDuration = 0;
		this.setState('idle');
	}

	/**
	 * Get camera stream for preview
	 */
	getStream(): MediaStream | null {
		return this.camera.stream;
	}

	/**
	 * Get remaining session time in seconds
	 */
	getSessionTimeRemaining(): number {
		if (!this.session) return 0;
		const remaining = (this.session.expiresAt.getTime() - Date.now()) / 1000;
		return Math.max(0, remaining);
	}

	// ─────────────────────────────────────────────────────────────
	// Private Methods
	// ─────────────────────────────────────────────────────────────

	private setState(state: CaptureState): void {
		this.state = state;
		this.config.onStateChange?.(state);
	}

	private setError(error: XLensError): void {
		this.error = error;
		this.setState('error');
		this.config.onError?.(error);
	}

	private handleError(err: unknown, context: string): void {
		const xlensError =
			err instanceof XLensError
				? err
				: new XLensError(
						'UNKNOWN_ERROR',
						err instanceof Error ? `${context}: ${err.message}` : context
					);
		this.setError(xlensError);
	}

	private startFrameCapture(): void {
		if (!this.camera.stream || !this.encoder) return;

		const track = this.camera.stream.getVideoTracks()[0];

		if ('MediaStreamTrackProcessor' in window) {
			const processor = new MediaStreamTrackProcessor({ track });
			this.frameReader = processor.readable.getReader();

			const readFrames = async () => {
				while (this.state === 'capturing' && this.frameReader && this.encoder) {
					const { value: frame, done } = await this.frameReader.read();
					if (done) break;
					this.encoder.encodeFrame(frame);
				}
			};

			readFrames().catch(console.error);
		}
	}

	private stopFrameCapture(): void {
		if (this.frameReader) {
			this.frameReader.cancel();
			this.frameReader = null;
		}
	}

	/**
	 * Call xLENS HTTP endpoint
	 */
	private async callXLensHttp(path: string, body: Record<string, unknown>): Promise<any> {
		const response = await fetch(`${this.convexUrl}${path}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new XLensError('NETWORK_ERROR', `xLENS API call failed: ${errorText}`);
		}

		return response.json();
	}
}

// ─────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────

/**
 * Create xLENS Web client
 */
export function createXLensWebClient(config: XLensWebConfig): XLensWebClient {
	return new XLensWebClient(config);
}
