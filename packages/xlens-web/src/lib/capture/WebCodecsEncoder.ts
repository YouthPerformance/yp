// ═══════════════════════════════════════════════════════════════
// WEBCODECS ENCODER
// Hardware-accelerated H.264 encoding using WebCodecs API
// ═══════════════════════════════════════════════════════════════

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Encoder Configuration
// ─────────────────────────────────────────────────────────────────

export interface EncoderConfig {
	width: number;
	height: number;
	bitrate: number; // bits per second
	framerate: number;
	keyFrameInterval: number; // frames between keyframes
}

const DEFAULT_CONFIG: EncoderConfig = {
	width: 1280,
	height: 720,
	bitrate: 4_000_000, // 4 Mbps
	framerate: 60,
	keyFrameInterval: 60 // 1 keyframe per second at 60fps
};

// ─────────────────────────────────────────────────────────────────
// WebCodecs Encoder Class
// ─────────────────────────────────────────────────────────────────

export class WebCodecsEncoder {
	private config: EncoderConfig;
	private encoder: VideoEncoder | null = null;
	private muxer: Muxer<ArrayBufferTarget> | null = null;
	private frameCount = 0;
	private startTime = 0;
	private isEncoding = false;

	constructor(config: Partial<EncoderConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	/**
	 * Check if WebCodecs is supported
	 */
	static isSupported(): boolean {
		return 'VideoEncoder' in window && 'VideoFrame' in window;
	}

	/**
	 * Initialize the encoder
	 */
	async initialize(): Promise<void> {
		if (!WebCodecsEncoder.isSupported()) {
			throw new XLensError('UNSUPPORTED_BROWSER', 'WebCodecs not supported');
		}

		// Create MP4 muxer
		this.muxer = new Muxer({
			target: new ArrayBufferTarget(),
			video: {
				codec: 'avc',
				width: this.config.width,
				height: this.config.height
			},
			fastStart: 'in-memory'
		});

		// Create video encoder
		this.encoder = new VideoEncoder({
			output: (chunk, meta) => {
				if (this.muxer) {
					// iOS Safari may not provide full metadata - provide fallback
					const safeMeta = meta ?? undefined;
					try {
						this.muxer.addVideoChunk(chunk, safeMeta);
					} catch (err) {
						// If meta causes issues, try without it (less optimal but works)
						console.warn('Muxer chunk error, retrying without meta:', err);
						this.muxer.addVideoChunk(chunk);
					}
				}
			},
			error: (err) => {
				console.error('Encoder error:', err);
				throw new XLensError('ENCODING_FAILED', err.message);
			}
		});

		// Configure encoder
		this.encoder.configure({
			codec: 'avc1.42E01F', // H.264 Baseline Level 3.1
			width: this.config.width,
			height: this.config.height,
			bitrate: this.config.bitrate,
			framerate: this.config.framerate,
			hardwareAcceleration: 'prefer-hardware',
			avc: { format: 'avc' }
		});

		this.frameCount = 0;
		this.isEncoding = true;
	}

	/**
	 * Encode a video frame
	 */
	encodeFrame(frame: VideoFrame): void {
		if (!this.encoder || !this.isEncoding) return;

		if (this.frameCount === 0) {
			this.startTime = performance.now();
		}

		const isKeyFrame = this.frameCount % this.config.keyFrameInterval === 0;

		this.encoder.encode(frame, { keyFrame: isKeyFrame });
		this.frameCount++;

		// Close the frame to release memory
		frame.close();
	}

	/**
	 * Finalize encoding and return MP4 data
	 */
	async finalize(): Promise<Uint8Array> {
		if (!this.encoder || !this.muxer) {
			throw new XLensError('ENCODING_FAILED', 'Encoder not initialized');
		}

		this.isEncoding = false;

		// Flush remaining frames
		await this.encoder.flush();

		// Finalize muxer
		this.muxer.finalize();

		// Get output
		const target = this.muxer.target as ArrayBufferTarget;
		const buffer = target.buffer;

		// Cleanup
		this.encoder.close();
		this.encoder = null;
		this.muxer = null;

		return new Uint8Array(buffer);
	}

	/**
	 * Get encoding statistics
	 */
	getStats(): { frameCount: number; elapsedMs: number; actualFps: number } {
		const elapsedMs = performance.now() - this.startTime;
		const actualFps = this.frameCount / (elapsedMs / 1000);

		return {
			frameCount: this.frameCount,
			elapsedMs,
			actualFps
		};
	}

	/**
	 * Abort encoding
	 */
	abort(): void {
		if (this.encoder) {
			this.encoder.close();
			this.encoder = null;
		}
		this.muxer = null;
		this.isEncoding = false;
	}
}

/**
 * Create encoder instance
 */
export function createWebCodecsEncoder(config?: Partial<EncoderConfig>): WebCodecsEncoder {
	return new WebCodecsEncoder(config);
}
