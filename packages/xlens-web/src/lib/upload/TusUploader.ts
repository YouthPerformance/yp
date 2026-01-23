// ═══════════════════════════════════════════════════════════════
// TUS UPLOADER
// Resumable uploads using TUS protocol to Cloudflare Stream
// ═══════════════════════════════════════════════════════════════

import * as tus from 'tus-js-client';
import type { UploadProgress } from '$lib/types';
import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Upload Configuration
// ─────────────────────────────────────────────────────────────────

export interface UploadConfig {
	endpoint: string;
	chunkSize: number;
	retryDelays: number[];
	maxRetries: number;
}

const DEFAULT_CONFIG: UploadConfig = {
	endpoint: '', // Set per-upload
	chunkSize: 5 * 1024 * 1024, // 5MB chunks
	retryDelays: [0, 1000, 3000, 5000],
	maxRetries: 3
};

// ─────────────────────────────────────────────────────────────────
// TUS Uploader Class
// ─────────────────────────────────────────────────────────────────

export class TusUploader {
	private config: UploadConfig;
	private currentUpload: tus.Upload | null = null;

	constructor(config: Partial<UploadConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	/**
	 * Upload video to Cloudflare Stream using TUS
	 */
	async uploadVideo(
		videoData: Uint8Array,
		tusUrl: string,
		onProgress?: (progress: UploadProgress) => void
	): Promise<string> {
		return new Promise((resolve, reject) => {
			const blob = new Blob([videoData.buffer as ArrayBuffer], { type: 'video/mp4' });

			this.currentUpload = new tus.Upload(blob, {
				endpoint: tusUrl,
				chunkSize: this.config.chunkSize,
				retryDelays: this.config.retryDelays,
				metadata: {
					filetype: 'video/mp4',
					name: `jump_${Date.now()}.mp4`
				},
				onProgress: (bytesUploaded, bytesTotal) => {
					if (onProgress) {
						onProgress({
							phase: 'video',
							bytesUploaded,
							bytesTotal,
							percentage: Math.round((bytesUploaded / bytesTotal) * 100)
						});
					}
				},
				onSuccess: () => {
					const uploadUrl = this.currentUpload?.url;
					if (uploadUrl) {
						// Extract stream ID from URL
						const streamId = extractStreamId(uploadUrl);
						resolve(streamId);
					} else {
						reject(new XLensError('UPLOAD_FAILED', 'No upload URL returned'));
					}
				},
				onError: (err) => {
					reject(new XLensError('UPLOAD_FAILED', err.message, true));
				}
			});

			// Start upload
			this.currentUpload.start();
		});
	}

	/**
	 * Abort current upload
	 */
	abort(): void {
		if (this.currentUpload) {
			this.currentUpload.abort();
			this.currentUpload = null;
		}
	}

	/**
	 * Check if upload can be resumed
	 */
	canResume(): boolean {
		return this.currentUpload !== null;
	}

	/**
	 * Resume a paused upload
	 */
	resume(): void {
		if (this.currentUpload) {
			this.currentUpload.start();
		}
	}
}

// ─────────────────────────────────────────────────────────────────
// Simple Fetch Uploader (Fallback)
// ─────────────────────────────────────────────────────────────────

export class SimpleFetchUploader {
	/**
	 * Upload using simple fetch (for smaller files or when TUS not needed)
	 */
	async upload(
		data: Uint8Array,
		url: string,
		contentType: string,
		onProgress?: (progress: UploadProgress) => void
	): Promise<Response> {
		try {
			// Note: fetch doesn't support progress for uploads in all browsers
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': contentType
				},
				body: data.buffer as ArrayBuffer
			});

			if (!response.ok) {
				throw new XLensError('UPLOAD_FAILED', `HTTP ${response.status}: ${response.statusText}`);
			}

			return response;
		} catch (err) {
			if (err instanceof XLensError) throw err;
			throw new XLensError(
				'NETWORK_ERROR',
				err instanceof Error ? err.message : 'Upload failed',
				true
			);
		}
	}
}

// ─────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Extract Cloudflare Stream ID from upload URL
 */
function extractStreamId(url: string): string {
	// Cloudflare Stream URLs typically end with the stream ID
	const parts = url.split('/');
	return parts[parts.length - 1] || url;
}

/**
 * Create TUS uploader instance
 */
export function createTusUploader(config?: Partial<UploadConfig>): TusUploader {
	return new TusUploader(config);
}
