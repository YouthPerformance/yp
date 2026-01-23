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
	WebProofPayload
} from '$lib/types';
import { XLensError } from '$lib/types';
import { CameraManager } from '$lib/capture/CameraManager.svelte';
import { MotionCapture, serializeSamples } from '$lib/capture/MotionCapture';
import { WebCodecsEncoder } from '$lib/capture/WebCodecsEncoder';
import { MediaRecorderFallback } from '$lib/capture/MediaRecorderFallback';
import { getOrCreateKey } from '$lib/crypto/KeyStorage';
import { generateProof } from '$lib/crypto/ProofGenerator';
import { sha256, sha256String } from '$lib/crypto/WebCryptoSigner';
import { TusUploader, SimpleFetchUploader } from '$lib/upload/TusUploader';
import { checkCompatibility, getDeviceInfo } from '$lib/utils/compatibility';

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
	private fetchUploader: SimpleFetchUploader;

	// Capture state
	private useWebCodecs = false;
	private captureStartTime = 0;
	private captureInterval: ReturnType<typeof setInterval> | null = null;
	private frameReader: ReadableStreamDefaultReader<VideoFrame> | null = null;

	constructor(config: XLensWebConfig) {
		this.config = config;
		this.convexUrl = config.convexUrl;
		this.userId = config.userId;

		// Initialize components
		this.camera = new CameraManager({ frameRate: 60 });
		this.motion = new MotionCapture();
		this.tusUploader = new TusUploader();
		this.fetchUploader = new SimpleFetchUploader();
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
			// Get or create device key
			const deviceKey = await getOrCreateKey(this.userId);

			// Create session via Convex
			const response = await this.callConvex('sessions:create', {
				userId: this.userId,
				deviceKeyId: deviceKey.keyId,
				publicKey: deviceKey.publicKey,
				platform: 'web'
			});

			const session: Session = {
				id: response.sessionId,
				nonce: response.nonce,
				nonceDisplay: response.nonceDisplay,
				expiresAt: new Date(response.expiresAt),
				deviceKeyId: deviceKey.keyId
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
			// Get device key
			const deviceKey = await getOrCreateKey(this.userId);

			// Generate proof
			const proof = await generateProof(this.session, capture, deviceKey);

			// Get upload URL from Convex
			const uploadAuth = await this.callConvex('uploads:getDirectUploadUrl', {
				sessionId: this.session.id
			});

			// Upload video using TUS
			const streamId = await this.tusUploader.uploadVideo(
				capture.videoData,
				uploadAuth.tusUrl,
				(progress) => {
					this.uploadProgress = progress;
					this.config.onProgress?.(progress);
				}
			);

			// Upload sensor data
			const sensorJson = serializeSamples(capture.sensorData);
			await this.fetchUploader.upload(
				new TextEncoder().encode(sensorJson),
				uploadAuth.sensorUploadUrl,
				'application/json'
			);

			// Submit to Convex
			const result = await this.callConvex('jumps:submit', {
				sessionId: this.session.id,
				userId: this.userId,
				videoStreamId: streamId,
				proof: proof
			});

			this.setState('submitted');

			return {
				jumpId: result.jumpId,
				status: result.status,
				verificationTier: result.verificationTier,
				message: result.message
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
		const result = await this.callConvex('jumps:get', { jumpId });

		const jumpResult: JumpResult = {
			jumpId: result._id,
			userId: result.userId,
			status: result.status,
			verificationTier: result.verificationTier,
			height: result.heightInches
				? {
						inches: result.heightInches,
						centimeters: result.heightInches * 2.54
					}
				: undefined,
			videoUrl: result.videoUrl,
			thumbnailUrl: result.thumbnailUrl,
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

	private async callConvex(functionPath: string, args: Record<string, unknown>): Promise<any> {
		// Simple HTTP API call to Convex
		// In production, use the Convex client library
		const response = await fetch(`${this.convexUrl}/api/mutation/${functionPath}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ args })
		});

		if (!response.ok) {
			throw new XLensError('NETWORK_ERROR', `Convex call failed: ${response.statusText}`);
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
