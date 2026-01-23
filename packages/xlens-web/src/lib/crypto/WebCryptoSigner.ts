// ═══════════════════════════════════════════════════════════════
// WEB CRYPTO SIGNER
// ECDSA P-256 signing using Web Crypto API
// ═══════════════════════════════════════════════════════════════

import type { DeviceKey } from '$lib/types';
import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Signing Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Sign data with ECDSA P-256 (ES256)
 */
export async function signData(key: DeviceKey, data: Uint8Array): Promise<string> {
	try {
		const signature = await crypto.subtle.sign(
			{
				name: 'ECDSA',
				hash: { name: 'SHA-256' }
			},
			key.privateKey,
			data.buffer as ArrayBuffer
		);

		return bufferToBase64(signature);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Signing failed';
		throw new XLensError('SIGNING_FAILED', message);
	}
}

/**
 * Sign a string payload
 */
export async function signPayload(key: DeviceKey, payload: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(payload);
	return signData(key, data);
}

// ─────────────────────────────────────────────────────────────────
// Hashing Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Compute SHA-256 hash of data
 */
export async function sha256(data: Uint8Array): Promise<string> {
	const hash = await crypto.subtle.digest('SHA-256', data.buffer as ArrayBuffer);
	return bufferToHex(hash);
}

/**
 * Compute SHA-256 hash of string
 */
export async function sha256String(str: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	return sha256(data);
}

// ─────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Convert ArrayBuffer to Base64
 */
function bufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
