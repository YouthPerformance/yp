// ═══════════════════════════════════════════════════════════════
// KEY STORAGE
// Secure device key storage using IndexedDB
// ═══════════════════════════════════════════════════════════════

import { get, set, del } from 'idb-keyval';
import type { DeviceKey } from '$lib/types';
import { XLensError } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────────────────────────

const KEY_PREFIX = 'xlens_device_key_';

// ─────────────────────────────────────────────────────────────────
// Key Storage Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Generate a new ECDSA P-256 key pair
 */
export async function generateKeyPair(): Promise<DeviceKey> {
	try {
		// Generate key pair using Web Crypto API
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: 'P-256'
			},
			false, // Non-extractable private key
			['sign', 'verify']
		);

		// Export public key for storage/transmission
		const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
		const publicKeyBase64 = bufferToBase64(publicKeyBuffer);

		// Generate key ID from public key hash
		const keyId = await generateKeyId(publicKeyBuffer);

		const deviceKey: DeviceKey = {
			keyId,
			publicKey: publicKeyBase64,
			privateKey: keyPair.privateKey,
			createdAt: Date.now()
		};

		return deviceKey;
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Key generation failed';
		throw new XLensError('KEY_GENERATION_FAILED', message);
	}
}

/**
 * Store a device key
 */
export async function storeKey(userId: string, key: DeviceKey): Promise<void> {
	const storageKey = KEY_PREFIX + userId;

	// We can't store CryptoKey directly, need to store a reference
	// The private key stays in browser memory, we store metadata
	const metadata = {
		keyId: key.keyId,
		publicKey: key.publicKey,
		createdAt: key.createdAt
	};

	await set(storageKey + '_meta', metadata);

	// Store the actual key in a WeakRef-compatible way
	// For now, use session storage approach
	keyCache.set(userId, key);
}

/**
 * Retrieve a device key
 */
export async function retrieveKey(userId: string): Promise<DeviceKey | null> {
	// Check cache first
	const cached = keyCache.get(userId);
	if (cached) {
		return cached;
	}

	// Check if we have metadata (key was generated but page refreshed)
	const storageKey = KEY_PREFIX + userId;
	const metadata = await get<{ keyId: string; publicKey: string; createdAt: number }>(
		storageKey + '_meta'
	);

	if (metadata) {
		// Key existed but private key is lost (page refresh)
		// Need to generate new key
		return null;
	}

	return null;
}

/**
 * Delete a device key
 */
export async function deleteKey(userId: string): Promise<void> {
	const storageKey = KEY_PREFIX + userId;
	await del(storageKey + '_meta');
	keyCache.delete(userId);
}

/**
 * Get or create a device key
 */
export async function getOrCreateKey(userId: string): Promise<DeviceKey> {
	let key = await retrieveKey(userId);

	if (!key) {
		key = await generateKeyPair();
		await storeKey(userId, key);
	}

	return key;
}

// ─────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────

/**
 * In-memory key cache (keys are lost on page refresh)
 */
const keyCache = new Map<string, DeviceKey>();

/**
 * Generate key ID from public key hash
 */
async function generateKeyId(publicKeyBuffer: ArrayBuffer): Promise<string> {
	const hash = await crypto.subtle.digest('SHA-256', publicKeyBuffer);
	const hashArray = new Uint8Array(hash);
	// Take first 8 bytes as hex string
	return Array.from(hashArray.slice(0, 8))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

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
