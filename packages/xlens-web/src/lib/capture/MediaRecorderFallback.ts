// ═══════════════════════════════════════════════════════════════
// MEDIARECORDER FALLBACK
// Fallback video recording for browsers without WebCodecs
// ═══════════════════════════════════════════════════════════════

import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// MediaRecorder Fallback Class
// ─────────────────────────────────────────────────────────────────

export interface RecorderConfig {
	mimeType: string;
	videoBitsPerSecond: number;
}

const DEFAULT_CONFIG: RecorderConfig = {
	mimeType: 'video/webm;codecs=vp9',
	videoBitsPerSecond: 4_000_000
};

export class MediaRecorderFallback {
	private recorder: MediaRecorder | null = null;
	private chunks: Blob[] = [];
	private config: RecorderConfig;
	private startTime = 0;

	constructor(config: Partial<RecorderConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	/**
	 * Check if MediaRecorder is supported
	 */
	static isSupported(): boolean {
		return 'MediaRecorder' in window;
	}

	/**
	 * Get best available MIME type
	 */
	static getBestMimeType(): string {
		const candidates = [
			'video/webm;codecs=vp9',
			'video/webm;codecs=vp8',
			'video/webm',
			'video/mp4'
		];

		for (const type of candidates) {
			if (MediaRecorder.isTypeSupported(type)) {
				return type;
			}
		}

		return 'video/webm';
	}

	/**
	 * Initialize recorder with a stream
	 */
	initialize(stream: MediaStream): void {
		if (!MediaRecorderFallback.isSupported()) {
			throw new XLensError('UNSUPPORTED_BROWSER', 'MediaRecorder not supported');
		}

		const mimeType = MediaRecorderFallback.getBestMimeType();

		this.recorder = new MediaRecorder(stream, {
			mimeType,
			videoBitsPerSecond: this.config.videoBitsPerSecond
		});

		this.chunks = [];

		this.recorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				this.chunks.push(event.data);
			}
		};

		this.recorder.onerror = (event) => {
			console.error('MediaRecorder error:', event);
			throw new XLensError('CAPTURE_FAILED', 'Recording failed');
		};
	}

	/**
	 * Start recording
	 */
	start(): void {
		if (!this.recorder) {
			throw new XLensError('CAPTURE_FAILED', 'Recorder not initialized');
		}

		this.startTime = performance.now();
		this.chunks = [];
		this.recorder.start(100); // Collect data every 100ms
	}

	/**
	 * Stop recording and return video data
	 */
	async stop(): Promise<Uint8Array> {
		return new Promise((resolve, reject) => {
			if (!this.recorder) {
				reject(new XLensError('CAPTURE_FAILED', 'Recorder not initialized'));
				return;
			}

			this.recorder.onstop = async () => {
				try {
					const blob = new Blob(this.chunks, { type: this.recorder?.mimeType });
					const buffer = await blob.arrayBuffer();
					resolve(new Uint8Array(buffer));
				} catch (err) {
					reject(new XLensError('ENCODING_FAILED', 'Failed to process recording'));
				}
			};

			this.recorder.stop();
		});
	}

	/**
	 * Get elapsed recording time
	 */
	getElapsedMs(): number {
		return performance.now() - this.startTime;
	}

	/**
	 * Abort recording
	 */
	abort(): void {
		if (this.recorder && this.recorder.state !== 'inactive') {
			this.recorder.stop();
		}
		this.recorder = null;
		this.chunks = [];
	}
}

/**
 * Create fallback recorder instance
 */
export function createMediaRecorderFallback(config?: Partial<RecorderConfig>): MediaRecorderFallback {
	return new MediaRecorderFallback(config);
}
